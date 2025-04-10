import { bcrypAdapter } from "../../config/bcrypt.adapter";
import { UserModel } from "../../data/mongo/models/user.models";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.errors";

export class AuthService {
  // DI
  constructor() {}

  public async registerUser(registerUSerDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUSerDto.email });

    if (existUser) throw CustomError.badRequest("Email already exist");

    try {
      const user = new UserModel(registerUSerDto);

      user.password = bcrypAdapter.hash(registerUSerDto.password);

      await user.save();
      // JWT para mantener autentificación del usuario

      // email de confirmacion

      const { password, ...userEntity } = UserEntity.fromObject(user);

      return { user: userEntity, token: "ABC" };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await UserModel.findOne({ email: loginUserDto.email });

    if (!user) throw CustomError.badRequest("Email not exist");

    const isMatching = bcrypAdapter.compare(
      loginUserDto.password,
      user.password
    );

    if (!isMatching) throw CustomError.badRequest("Password is not valid");

    const { ...userEntity } = UserEntity.fromObject(user);
    return { user: userEntity, token: "ABC" };
  }
}

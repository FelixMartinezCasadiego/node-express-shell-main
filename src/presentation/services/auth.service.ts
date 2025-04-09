import { UserModel } from "../../data/mongo/models/user.models";
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

      await user.save();

      // encriptar contraseña

      // JWT para mantener autentificación del usuario

      // email de confirmacion

      const { password, ...userEntity } = UserEntity.fromObject(user);

      return { user: userEntity, token: "ABC" };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}

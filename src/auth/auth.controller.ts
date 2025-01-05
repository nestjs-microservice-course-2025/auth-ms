import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';

@Controller()
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @MessagePattern('auth.register.user')
  async registerUser(@Payload() registerUserDto: RegisterUserDto) {
    return this.AuthService.registerUser(registerUserDto);
  }

  @MessagePattern('auth.login.user')
  async loginUser(@Payload() loginUserDto: LoginUserDto) {
    return this.AuthService.loginUser(loginUserDto);
  }

  @MessagePattern('auth.verify.token')
  async verifyToken(@Payload() token: string) {
    return this.AuthService.verifyToken(token);
  }
}

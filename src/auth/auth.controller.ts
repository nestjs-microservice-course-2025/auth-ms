import { MessagePattern } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';

@Controller()
export class AuthController {
  constructor() {}

  @MessagePattern('auth.register.user')
  async registerUser() {
    return 'register user desde auth ms';
  }

  @MessagePattern('auth.login.user')
  async loginUser() {
    return 'login user desde auth ms';
  }

  @MessagePattern('auth.verify.token')
  async verifyToken() {
    return 'verify token desde auth ms';
  }
}

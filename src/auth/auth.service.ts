import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { LoginUserDto, RegisterUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { envs } from 'src/config';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly jwtService: JwtService) {
    super();
  }
  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to MongoDB database');
  }

  async signJWT(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, { secret: envs.jwtSecret });
      const { sub, iat, exp, ...user } = payload;
      return { user, token: await this.signJWT(user) };
    } catch (error) {
      throw new RpcException({
        message: 'Token is invalid',
        status: HttpStatus.UNAUTHORIZED,
      });
    }
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, name, password } = registerUserDto;
    try {
      let user = await this.user.findUnique({
        where: { email },
      });
      if (user) {
        throw new RpcException({
          message: 'User already exists',
          status: HttpStatus.CONFLICT,
        });
      }
      user = await this.user.create({
        data: {
          email,
          name,
          password: bcrypt.hashSync(password, 10),
        },
      });
      const { password: __, ...rest } = user;
      return { user: rest, token: await this.signJWT(rest) };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      } else {
        throw new RpcException(error);
      }
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    try {
      let user = await this.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new RpcException({
          message: 'User or password incorrect',
          status: HttpStatus.BAD_REQUEST,
        });
      }
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        throw new RpcException({
          message: 'User or password incorrect',
          status: HttpStatus.BAD_REQUEST,
        });
      }
      const { password: __, ...rest } = user;
      return { user: rest, token: await this.signJWT(rest) };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      } else {
        throw new RpcException(error);
      }
    }
  }
}

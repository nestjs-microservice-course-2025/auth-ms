import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    JwtModule.register({
      secret: envs.jwtSecret,
      global: true,
      signOptions: { expiresIn: '2h' },
    }),
  ],
})
export class AuthModule {}

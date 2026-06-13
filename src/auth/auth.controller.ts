import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private jwt: JwtService,
  ) {}

  @Post('register')
  register(@Body() body: { email: string; name: string; password: string }) {
    return this.auth.register(body.email, body.name, body.password);
  }
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.auth.login(body.email, body.password);
  }
  @Post('refresh')
  refresh(@Body() body: { refresh_token: string }) {
    try {
      const payload = this.jwt.verify(body.refresh_token, {
        secret: process.env.JWT_REFRESH_SECRET as string,
      }) 
      return this.auth.refreshToken(payload.sub, payload.email);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service.js';

@Injectable()
export class LocalStartgy extends PassportStrategy(Strategy) {
  constructor(private auth: AuthService) {
    super({ usernameField: 'email' } as object);
  }

  async validate(email: string, password: string) {
    const user = await this.auth.validate(email, password);
    if (!user)
      throw new UnauthorizedException(
        'un authrized , re check the passowrd or the email',
      );

    return user;
  }
}

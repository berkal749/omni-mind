import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';
import { FoundException } from '../customExceptions/found.exception.js';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(email: string, name: string, password: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });

    if (user) {
      throw new FoundException('the account laredy exisist');
    }

    const hashed = await bcrypt.hash(password, 10);
    const user2 = await this.prisma.user.create({
      data: { email, name, password: hashed },
    });

    return this.signToken(user2.id, user2.email, user2.role);
  }

  async bruhlogin(email: string, name: string, password: string) {
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('maknch ');
    }
    const hashed = await bcrypt.hash(password, 10);

    user = await this.prisma.user.create({
      data: { email, name, password: hashed },
    });

    return this.signToken(user.id, user.email, user.role);
  }

  async validate(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) throw new NotFoundException('email not found');

    const confirm = await bcrypt.compare(password, user.password);
    if (!confirm) throw new UnauthorizedException('retry');

    return user;
  }

  async login(email: string, password: string) {
    const validate = await this.validate(email, password);

    return this.signToken(validate.id, validate.email, validate.role);
  }

  private async signToken(userId: string, email: string, role: string) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwt.signAsync({ sub: userId, email, role }, { expiresIn: '15m' }),
      this.jwt.signAsync(
        { sub: userId, email, role },
        { expiresIn: '30d', secret: process.env.JWT_REFRESH_SECRET },
      ),
    ]);

    return { access_token, refresh_token };
  }

  async refreshToken(userId: string, email: string, role: string) {
    return this.signToken(userId, email, role);
  }
}

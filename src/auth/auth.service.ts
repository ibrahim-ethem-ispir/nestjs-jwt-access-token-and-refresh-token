import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'access_token_secret',
          expiresIn: 60 * 15,
        },
      ),

      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'refresh_token_secret',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async signup(dto: AuthDto): Promise<Tokens> {
    const hashPassword = await this.hashData(dto.password);
    const newUser = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        hash: hashPassword,
      },
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);
    return tokens;
  }
  signin() {}
  logout() {}
  refreshTokens() {}
}

import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common/decorators';

@Injectable()
export class refreshTokenStratefy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'refresh_token_secret',
      passReqToCallback: true
    });
  }
  validate(req: Request,payload: any) {
    const refreshToken = req.get("authorization").replace("Bearer ", "").trim()
    return {
        ...payload,
        refreshToken
    }
  }
}

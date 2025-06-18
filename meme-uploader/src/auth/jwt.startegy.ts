import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('🚫 Missing JWT_SECRET env var! Can’t spin up JwtStrategy.');
    }

    super({
      jwtFromRequest:  ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:     secret,       // here it’s now guaranteed to be string
    });
  }

  async validate(payload: any) {
    // whatever you want to attach to req.user
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
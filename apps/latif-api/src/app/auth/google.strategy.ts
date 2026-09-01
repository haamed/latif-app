import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { GoogleProfile } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        'http://localhost:3333/api/auth/google/callback',
      scope: ['email', 'profile'],
      passReqToCallback: false,
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (err: unknown, user?: GoogleProfile) => void,
  ) {
    const email = profile.emails?.[0]?.value;
    const picture = profile.photos?.[0]?.value;
    const user: GoogleProfile = {
      email,
      name: profile.displayName,
      googleId: profile.id,
      picture,
    };
    done(null, user);
  }
}

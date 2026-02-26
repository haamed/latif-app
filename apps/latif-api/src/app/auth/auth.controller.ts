import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService, GoogleProfile } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Passport handles redirect
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: Request & { user?: GoogleProfile },
    @Res() res: Response,
  ) {
    const profile = req.user as GoogleProfile;
    const { accessToken } = await this.authService.googleLogin(profile);

    const successRedirect =
      process.env.GOOGLE_SUCCESS_REDIRECT ||
      'http://localhost:4200/auth/callback';
    const redirectUrl = new URL(successRedirect);
    redirectUrl.searchParams.set('token', accessToken);
    const state =
      typeof req.query.state === 'string' ? req.query.state : undefined;
    if (state) {
      redirectUrl.searchParams.set('returnUrl', state);
    }

    return res.redirect(redirectUrl.toString());
  }
}

import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

export type GoogleProfile = {
  email: string;
  name?: string;
  googleId: string;
  picture?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.sanitizeUser(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const match = await bcrypt.compare(loginDto.password, user.password);
    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = this.signToken(user);
    return { accessToken, user: this.sanitizeUser(user) };
  }

  async register(registerDto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const hashed = await bcrypt.hash(registerDto.password, 10);
    const user = await this.prisma.user.create({
      data: { ...registerDto, password: hashed, provider: 'local' },
    });
    const accessToken = this.signToken(user);
    return { accessToken, user: this.sanitizeUser(user) };
  }

  async googleLogin(profile: GoogleProfile) {
    if (!profile.email) {
      throw new UnauthorizedException('Google account has no email');
    }

    const user = await this.prisma.user.upsert({
      where: { email: profile.email },
      update: {
        name: profile.name ?? undefined,
        googleId: profile.googleId,
        picture: profile.picture ?? undefined,
        provider: 'google',
      },
      create: {
        email: profile.email,
        name: profile.name,
        googleId: profile.googleId,
        picture: profile.picture,
        provider: 'google',
      },
    });

    const accessToken = this.signToken(user);
    return { accessToken, user: this.sanitizeUser(user) };
  }

  private sanitizeUser(user: { password?: string; googleId?: string }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, googleId, ...rest } = user;
    return rest;
  }

  private signToken(user: { id: number; email: string }) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}

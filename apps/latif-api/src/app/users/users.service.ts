import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashed = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.prisma.user.create({
      data: { ...createUserDto, password: hashed },
    });
    return this.sanitizeUser(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((u) => this.sanitizeUser(u));
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? this.sanitizeUser(user) : null;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const data = { ...updateUserDto } as UpdateUserDto & { password?: string };
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });
    return this.sanitizeUser(user);
  }

  async remove(id: number) {
    const user = await this.prisma.user.delete({
      where: { id },
    });
    return this.sanitizeUser(user);
  }

  private sanitizeUser<T extends { password?: string }>(user: T) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    // TODO validate password
    return rest;
  }
}

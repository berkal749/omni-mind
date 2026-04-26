import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(user: CreateUserDto) {
    const userCheck = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!userCheck) {
      throw new ConflictException(`User with  ${user} laredy exsist`);
    }
    return this.prisma.user.create({
      data: {
        ...user,
      },
    });
  }

  async getAllUsers() {
    const user =  await this.prisma.user.findMany();

    if (!user) {
      throw new NotFoundException(`nothing`);
    }
    return user;
  }

  async getUsers(user: CreateUserDto) {
    const userCheck = await this.prisma.user.findFirst({
      where: {
        email: user.email,
        name: user.name,
      },
    });
    if (!userCheck) {
      throw new NotFoundException(`nothing`);
    }
    return userCheck;
  }

  async updateUser(user: UpdateUserDto) {
    const userCheck =  await this.prisma.user.findFirst({
      where: {
        email: user.email,
        name: user.name,
      },
    });
    if (!userCheck) {
      throw new NotFoundException(`nothing`);
    }

    return this.prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        ...user,
      },
    });
  }

  async deleteUser(user: UpdateUserDto) {
    const userCheck =  await this.prisma.user.findFirst({
      where: {
        email: user.email,
        name: user.name,
      },
    });
    if (!userCheck) {
      throw new NotFoundException(`nothing`);
    }

    return this.prisma.user.delete({
      where: {
        email: user.email,
      },
    });
  }
}

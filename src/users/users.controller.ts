import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { UserService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Controller('users')
export class UsersController {
  constructor(private user: UserService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createUser(@Body() user: CreateUserDto) {
    return await this.user.createUser(user);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getUser() {
    return this.user.getAllUsers();
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  putUser(@Body() user: UpdateUserDto) {
    return this.user.updateUser(user);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  deleteUser(@Body() user: CreateUserDto) {
    return this.user.deleteUser(user);
  }
}

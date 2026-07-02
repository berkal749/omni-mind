import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { UserService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { SystemRoles } from '../auth/roles/system-role.decorator.js';
import { SystemRolesGuard } from '../auth/roles/system-role.guard.js';
@Controller('users')
export class UsersController {
  constructor(private user: UserService) {}

  @Post()
  @SystemRoles('ADMIN')
  @UseGuards(AuthGuard('jwt'))
  async createUser(@Body() user: CreateUserDto) {
    return await this.user.createUser(user);
  }

  @Get()
  @SystemRoles('ADMIN')
  @UseGuards(AuthGuard('jwt'), SystemRolesGuard)
  getUser() {
    return this.user.getAllUsers();
  }

  @Put()
  @SystemRoles('ADMIN' , 'SUPER_ADMIN')
  @UseGuards(AuthGuard('jwt'), SystemRolesGuard)
  putUser(@Body() user: UpdateUserDto) {
    return this.user.updateUser(user);
  }

  @Delete()
  @SystemRoles('ADMIN' , 'SUPER_ADMIN')
  @UseGuards(AuthGuard('jwt'), SystemRolesGuard)
  deleteUser(@Body() user: CreateUserDto) {
    return this.user.deleteUser(user);
  }
}

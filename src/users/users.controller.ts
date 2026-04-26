import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private user: UserService){}
  @Post()
  async createUser(@Body() user:CreateUserDto  ) {

    return  await this.user.createUser(user);
  }

  @Get()
  getUser() {
    return this.user.getAllUsers();
  }

  @Put()
  putUser(@Body() user:UpdateUserDto  ) {
    return this.user.updateUser(user);
  }

  @Delete()
  deleteUser(@Body() user:CreateUserDto) {
    return this.user.deleteUser(user);
  }

}

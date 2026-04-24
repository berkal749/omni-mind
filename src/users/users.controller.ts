import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Post()
  createUser() {}

  @Get()
  getUser() {}

  @Put()
  putUser() {}

  @Delete()
  deleteUser() {}

}

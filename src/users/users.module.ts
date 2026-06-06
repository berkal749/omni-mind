import { Module } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UserService } from './users.service.js';

@Module({
  controllers: [UsersController],
  providers: [UserService],
})
export class UsersModule {}

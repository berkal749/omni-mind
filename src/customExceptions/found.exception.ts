import { HttpException } from '@nestjs/common';

export class FoundException extends HttpException {
  constructor(message: string = 'found') {
    super(message, 450);
  }
}

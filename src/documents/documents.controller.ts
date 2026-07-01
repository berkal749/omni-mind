import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { DocumentsService } from './documents.service.js';

import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { SystemRole } from '@prisma/client';
import { SystemRoles } from '../auth/roles/system-role.decorator.js';
import { WorkSpaceRoles } from '../auth/roles/workSpace-roles.decorator.js';

@Controller('documents')
@SystemRoles('SUPER_ADMIN', 'ADMIN', 'USER')
@WorkSpaceRoles('OWNER', 'EDITOR') // Specify the roles that can access this controller
@UseGuards(AuthGuard('jwt'))
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (file.mimetype !== 'application/pdf') {
          return callback(
            new BadRequestException('Only PDF files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
      },
    }),
  )
  @Get()
  @SystemRoles('SUPER_ADMIN', 'ADMIN', 'USER')
  @WorkSpaceRoles('OWNER', 'EDITOR')
  findAll() {
    // return this.documentsService.findAll();
  }

  //   @Get(':id')
  // @SystemRoles('SUPER_ADMIN', 'ADMIN', 'USER')
  // @WorkSpaceRoles('OWNER' ,'EDITOR')
  //   findOne(@Param('id') id: string) {
  //     return this.documentsService.findOne(+id);
  //   }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateDocumentDto: UpdateDocumentDto,
  // ) {
  //   return this.documentsService.update(+id, updateDocumentDto);
  // }

  @Delete(':workspaceId')
  @SystemRoles('SUPER_ADMIN', 'ADMIN', 'USER')
  @WorkSpaceRoles('OWNER', 'EDITOR')
  remove(
    @Param('workspaceId') workspaceId: string,
    @Body('name') name: string,
  ) {
    return this.documentsService.remove(workspaceId, name);
  }
}

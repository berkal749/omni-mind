import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WorkspacesService } from './workspaces.service.js';
import { CreateWorkspaceDto } from './dto/create-workspace.dto.js';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto.js';
import { SystemRole, WorkspaceRole } from '@prisma/client';

import { AuthRequest as R } from '../auth/types/auth-req.js';
import { SystemRoles } from '../auth/roles/system-role.decorator.js';
import { WorkSpaceRoles } from '../auth/roles/workSpace-roles.decorator.js';

@Controller('workspaces')
@UseGuards(AuthGuard('jwt'))
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  @SystemRoles('USER')
  create(@Body() dto: CreateWorkspaceDto, @Request() req: R) {
    return this.workspacesService.create(dto, req.user.id);
  }

  @Get()
  @SystemRoles('USER')
  findAll(@Request() req: R) {
    return this.workspacesService.findAllForUser(req.user.id);
  }

  @Get(':id')
  @SystemRoles('USER')
  findOne(@Param('id') id: string, @Request() req: R) {
    return this.workspacesService.findOne(id, req.user.id);
  }

  @Put(':id')
  @SystemRoles('ADMIN')
  @WorkSpaceRoles('OWNER')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateWorkspaceDto,
    @Request() req: R,
  ) {
    return this.workspacesService.update(id, dto, req.user.id);
  }
  
  @Delete(':id')
  @SystemRoles('SUPER_ADMIN' , 'ADMIN')
  @WorkSpaceRoles('OWNER' )
  remove(@Param('id') id: string, @Request() req: R) {
    return this.workspacesService.remove(id, req.user.id);
  }

  @Post(':id/members')
  @WorkSpaceRoles('OWNER' ,'EDITOR')
  addMember(
    @Param('id') workspaceId: string,
    @Body() body: { userId: string; role?: WorkspaceRole },
  ) {
    return this.workspacesService.addMember(
      workspaceId,
      body.userId,
      body.role,
    );
  }

  @Delete(':id/members/:userId')
  @WorkSpaceRoles('OWNER')
  removeMember(
    @Param('id') workspaceId: string,
    @Param('userId') userId: string,
  ) {
    return this.workspacesService.removeMember(workspaceId, userId);
  }
}

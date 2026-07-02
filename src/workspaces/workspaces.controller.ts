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
import { SystemRole, User, WorkspaceRole } from '@prisma/client';

import { AuthRequest as R } from '../auth/types/auth-req.js';
import { SystemRoles } from '../auth/roles/system-role.decorator.js';
import { WorkSpaceRoles } from '../auth/roles/workSpace-roles.decorator.js';
import { SystemRolesGuard } from '../auth/roles/system-role.guard.js';

@Controller('workspaces')

export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  @SystemRoles('USER', 'ADMIN', 'SUPER_ADMIN')
  @UseGuards(AuthGuard('jwt'), SystemRolesGuard)
  create(@Body() dto: CreateWorkspaceDto) {
    return this.workspacesService.create(dto);
  }

  @Get('workspace_user')
  @SystemRoles('USER', 'ADMIN', 'SUPER_ADMIN')
  @UseGuards(AuthGuard('jwt'), SystemRolesGuard)
  findAllWorkSpaceUser(@Body() body: User, ) {
    return this.workspacesService.findAllForUser(body.id);
  }
  @Get('all')
  @SystemRoles( 'ADMIN')
  @UseGuards(AuthGuard('jwt'),SystemRolesGuard)
  findAllWorkSpace( ) {
    return this.workspacesService.findAllWorkSpace();
  }


  @Get(':id')
  @SystemRoles('USER', 'ADMIN', 'SUPER_ADMIN')
  @UseGuards(AuthGuard('jwt'), SystemRolesGuard)
  findOne(@Param('id') id: string, @Request() req: R) {
    return this.workspacesService.findOne(id, req.user.id);
  }

  @Put(':id')
  @SystemRoles('ADMIN')
  @WorkSpaceRoles('OWNER')
  @UseGuards(AuthGuard('jwt'), SystemRolesGuard)
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
  @UseGuards(AuthGuard('jwt'), SystemRolesGuard)
  remove(@Param('id') id: string, @Request() req: R) {
    return this.workspacesService.remove(id, req.user.id);
  }

  @Post(':workspaceId/members')
  @WorkSpaceRoles('OWNER' ,'EDITOR')
  @UseGuards(AuthGuard('jwt'), SystemRolesGuard)
  addMember(
    @Param('workspaceId') workspaceId: string,
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
  @UseGuards(AuthGuard('jwt'), SystemRolesGuard)
  removeMember(
    @Param('id') workspaceId: string,
    @Param('userId') userId: string,
  ) {
    return this.workspacesService.removeMember(workspaceId, userId);
  }
}

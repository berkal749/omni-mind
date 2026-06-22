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
import { Roles } from '../auth/roles/role.decorator.js';
import { AuthRequest as R } from '../auth/types/auth-req.js';

@Controller('workspaces')
@UseGuards(AuthGuard('jwt'))
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  create(@Body() dto: CreateWorkspaceDto, @Request() req: R) {
    return this.workspacesService.create(dto, req.user.id);
  }

  @Get()
  findAll(@Request() req: R) {
    return this.workspacesService.findAllForUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: R) {
    return this.workspacesService.findOne(id, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateWorkspaceDto,
    @Request() req: R,
  ) {
    return this.workspacesService.update(id, dto, req.user.id);
  }
  @Roles(WorkspaceRole.OWNER, SystemRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: R) {
    return this.workspacesService.remove(id, req.user.id);
  }

  @Post(':id/members')
  @Roles(WorkspaceRole.OWNER, WorkspaceRole.EDITOR, SystemRole.ADMIN)
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
  @Roles(WorkspaceRole.OWNER, SystemRole.ADMIN)
  removeMember(
    @Param('id') workspaceId: string,
    @Param('userId') userId: string,
  ) {
    return this.workspacesService.removeMember(workspaceId, userId);
  }
}

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateWorkspaceDto } from './dto/create-workspace.dto.js';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto.js';
import { WorkspaceRole } from '@prisma/client';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  // Create a workspace and make the creator its OWNER
  async create(dto: CreateWorkspaceDto) {
    return this.prisma.workspace.create({
      data: {
        name: dto.name,
      },
      include: { members: true },
    });
  }

  // Get all workspaces a user belongs to
  async findAllForUser(userId: string) {
    return this.prisma.workspace.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: { members: true },
    });
  }


  async findAllWorkSpace() {
    const workspace = await this.prisma.workspace.findMany();

    if (!workspace) throw new NotFoundException('Workspace empty');
    return workspace;
  }

  // Get one workspace, only if user is a member
  async findOne(id: string, userId: string) {
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        id,
        members: { some: { userId } },
      },
      include: { members: true, documents: true },
    });

    if (!workspace) throw new NotFoundException('Workspace not found');
    return workspace;
  }

  // Update workspace name (only owner/editor should call this — enforce in controller via guard)
  async update(id: string, dto: UpdateWorkspaceDto, userId: string) {
    await this.findOne(id, userId); // ensures membership + existence

    return this.prisma.workspace.update({
      where: { id },
      data: { ...dto },
    });
  }

  // Delete workspace (only owner should call this — enforce in controller)
  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.workspace.delete({
      where: { id },
    });
  }

  // Add a member to a workspace
  async addMember(
    workspaceId: string,
    newUserId: string,
    role: WorkspaceRole = WorkspaceRole.VIEWER,
  ) {
    const existing = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: { workspaceId:workspaceId, userId: newUserId },
      },
    });

    if (existing) throw new ConflictException('User already a member');

    return this.prisma.workspaceMember.create({
      data: { workspaceId, userId: newUserId, role },
    });
  }

  // Remove a member from a workspace
  async removeMember(workspaceId: string, targetUserId: string) {
    const member = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: { workspaceId, userId: targetUserId },
      },
    });

    if (!member) throw new NotFoundException('Member not found');

    return this.prisma.workspaceMember.delete({
      where: {
        workspaceId_userId: { workspaceId, userId: targetUserId },
      },
    });
  }
}

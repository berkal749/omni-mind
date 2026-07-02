// src/auth/roles/workspace-role.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { WORKSPACE_ROLES_KEY } from './workSpace-roles.decorator.js'
import { WorkspaceRole } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service.js'


@Injectable()
export class WorkspaceRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<WorkspaceRole[]>(WORKSPACE_ROLES_KEY, context.getHandler())
    if (!requiredRoles) return true

    const req = context.switchToHttp().getRequest()
    const userId = req.user.id
    const workspaceId = req.params.id

    const member = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    })

    if (!member || !requiredRoles.includes(member.role)) {
      throw new ForbiddenException('Insufficient workspace permissions')
    }
    return true
  }
}
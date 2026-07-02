// src/auth/roles/system-role.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { SYSTEM_ROLES_KEY } from './system-role.decorator.js'
import { SystemRole } from '@prisma/client'

@Injectable()
export class SystemRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<SystemRole[]>(SYSTEM_ROLES_KEY, context.getHandler())
    if (!requiredRoles) return true

    const { user } = context.switchToHttp().getRequest()
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Insufficient system permissions')
    }
    return true
  }
}
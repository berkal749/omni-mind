// src/auth/types/auth-request.ts
import { Request } from 'express';

export interface AuthRequest extends Request {
  user: { id: string; email: string; role: string };
}

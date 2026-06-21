import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { createParamDecorator } from '@nestjs/common';

export interface UserPayload {
  id: number;
  email: string;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserPayload;
  },
);
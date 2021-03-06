import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user != null && user.role == 'super-admin') {
      return true;
    } else {
      throw new HttpException(
        { success: false, error: 'unauthorized' },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}

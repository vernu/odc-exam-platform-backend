import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user != null && user.role == 'admin') {
      return true;
    } else {
      throw new HttpException(
        { success: false, error: 'unauthorized' },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}

import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class CanViewAllOrganizations implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user && user.role == 'super-admin') {
      return true;
    }

    throw new HttpException(
      { success: false, error: 'unauthorized' },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

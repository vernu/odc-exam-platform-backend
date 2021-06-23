import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class CanUpdateUser implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (
      user != null &&
      (user.role == 'super-admin' || user._id == request.params.userId)
    ) {
      return true;
    }

    throw new HttpException(
      { success: false, error: 'unauthorized' },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

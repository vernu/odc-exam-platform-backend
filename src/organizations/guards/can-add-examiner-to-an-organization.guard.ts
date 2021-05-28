import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { OrganizationsService } from '../organizations.service';

@Injectable()
export class CanAddExaminerToAnOrganization implements CanActivate {
  constructor(private organizationsService: OrganizationsService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user != null) {
      if (user.role == 'super-admin') {
        return true;
      } else {
        //check if the user is the organization's admin
        const organization = await this.organizationsService.findAnOrganization(
          { _id: request.params.organizationId },
        );

        if (organization.admin._id == request.user._id.toString()) {
          return true;
        }
      }
    }

    throw new HttpException(
      { success: false, error: 'unauthorized' },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

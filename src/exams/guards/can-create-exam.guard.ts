import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { OrganizationsService } from '../../organizations/organizations.service';

@Injectable()
export class CanCreateOrganization implements CanActivate {
  constructor(private organizationsService: OrganizationsService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user != null) {
      if (user.role == 'super-admin') {
        return true;
      } else {
        //check if the user is the organization's admin or examiner
        const organization = await this.organizationsService.findOrganizationById(
          request.body.organizationId,
        );

        if (organization.admin._id == request.user._id.toString()) {
          return true;
        }
        var isExaminer = false;
        organization.examiners.map((examiner) => {
          if (examiner._id == request.user._id.toString()) {
            isExaminer = true;
            return;
          }
        });
        if (isExaminer) return true;
      }
    }

    throw new HttpException(
      { success: false, error: 'unauthorized' },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

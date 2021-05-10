import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import {
  Organization,
  OrganizationSchema,
} from './schemas/organization.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeatureAsync([
      {
        name: Organization.name,
        useFactory: () => {
          const schema = OrganizationSchema;
          schema.plugin(require('mongoose-slug-updater'));
          return schema;
        },
      },
    ]),
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [MongooseModule, OrganizationsService],
})
export class OrganizationsModule {}

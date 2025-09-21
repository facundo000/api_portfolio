import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinksModule } from './links/links.module';
import { ProjectsLinksModule } from './projects_links/projects_links.module';
import { ProjectsIconsModule } from './projects_icons/projects_icons.module';
import { TypesIconsModule } from './types_icons/types_icons.module';
import { IconsModule } from './icons/icons.module';
import { TypesLinksModule } from './types_links/types_links.module';
import { ProjectsModule } from './projects/projects.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UsersModule } from './user/users/users.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.BD_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.BD_NAME,
      username: process.env.BD_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true
    }),

    LinksModule,

    ProjectsLinksModule,

    ProjectsIconsModule,

    TypesIconsModule,

    IconsModule,

    TypesLinksModule,

    ProjectsModule,

    CloudinaryModule,

    UsersModule

  ],
})
export class AppModule {}

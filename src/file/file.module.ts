import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

enum UploadTypesEnum {
  ANY = 'jpg|jpeg|png|gif|pdf|docx|doc|xlsx|xls|zip|vnd.rar',
  IMAGES = 'jpg|jpeg|png|gif',
  DOCS = 'pdf|docx|doc|xlsx|xls',
  COMPRESSED = 'zip|vnd.rar',
}

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          limits: {
            fileSize: configService.get<number>('MULTER.MAX_SIZE'),
          },

          // Check the mimetypes to allow for upload
          fileFilter: (req: any, file: any, cb: any) => {
            if (file.mimetype.match(`/(${UploadTypesEnum.ANY})$`)) {
              // Allow storage of file
              cb(null, true);
            } else {
              // Reject file
              cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
            }
          },

          // Storage properties
          storage: diskStorage({
            // Destination storage path details
            destination: (req: any, file: any, cb: any) => {
              const uploadPath = configService.get<string>('MULTER.DESTINATION');
              // Create folder if doesnt exist
              if (!existsSync(uploadPath)) {
                mkdirSync(uploadPath);
              }
              cb(null, uploadPath);
            },
            // File modification details
            filename: (req: any, file: any, cb: any) => {
              // Calling the callback passing the random name generated with
              // the original extension name
              cb(null, `${uuid()}${extname(file.originalname)}`);
            },
          }),
        }
      },
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([File]),
  ],
  controllers: [FileController],
  providers: [FileService]
})
export class FileModule { }

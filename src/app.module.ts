import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './file/file.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './constant/configuration';

@Module({
  imports: [
    // Set Constant Configuration as Process Env.
    ConfigModule.forRoot({
      load: [configuration]
    }),

    // Using Env Through Constant Configuration.
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get<any>('DATABASE.CLIENT'),
          host: configService.get<string>('DATABASE.HOST'),
          port: configService.get<number>('DATABASE.PORT'),
          database: configService.get<string>('DATABASE.DB_NAME'),
          username: configService.get<string>('DATABASE.USER'),
          password: configService.get<string>('DATABASE.PASS'),
          entities: ['dist/**/*.entity.{ts,js}'],
          migrations: ['dist/migrations/*.{ts,js}'],
          migrationsTableName: 'typeorm_migrations',
          logger: 'file',
          synchronize: configService.get<string>('ENVIRONMENT') === 'LOCAL' ? true : false,
        }
      },
      inject: [ConfigService]
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads')
    }),
    FileModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream, readFileSync } from 'fs';
import { join } from 'path';
import { DataSource, In, Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { File as FileEntity } from './entities/file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private datasource: DataSource,
  ) { }

  async getFiles(ids: string[]): Promise<FileEntity[]> {
    const fileIds = ids.map((it) => {
      return it;
    });

    const files = await this.fileRepository.find({
      where: {
        id: In(fileIds)
      }
    });

    return files;
  }

  async createFile(body: CreateFileDto, fileMeta: FileEntity): Promise<FileEntity> {
    try {
      const { name, type } = body;
      let fileData
      await this.datasource.transaction(async (trx) => {
        const file = new FileEntity();
        file.name = name;
        file.type = type;
        file.path = fileMeta.path;
        file.additionalData = fileMeta;
        trx.insert(FileEntity, file)
        return fileData = file
      });
      return fileData;
    } catch (error) {
      console.log("Error Create File Data: ", error)
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `Error Service Create File Data!`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }

  }

  async getFile(id: string): Promise<FileEntity> {
    return this.fileRepository.findOneBy({ id });
  }

  async deleteFile(id: string): Promise<void> {
    await this.fileRepository.delete(id);
  }

  async imageBuffer(id: string) {
    const fileData = await this.getFile(id);
    return readFileSync(join(process.cwd(), fileData.path));
  }

  async imageStream(id: string) {
    const fileData = await this.getFile(id);
    return {
      additionalData: fileData.additionalData,
      read: createReadStream(join(process.cwd(), fileData.path))
    }
  }

  async fileBuffer(id: string) {
    const fileData = await this.getFile(id);
    return readFileSync(join(process.cwd(), fileData.path));
  }

  async fileStream(id: string) {
    const fileData = await this.getFile(id);
    return createReadStream(join(process.cwd(), fileData.path));
  }
}

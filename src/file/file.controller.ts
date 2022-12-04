import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UploadedFiles, UseInterceptors, Res, StreamableFile, ParseUUIDPipe } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CreateFileDto } from './dto/create-file.dto';
import { File as FileEntity } from './entities/file.entity';
import { FileService } from './file.service';
import { Response } from 'express';

@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
  ) { }

  @Get('/get-one/:id')
  private async getFile(
    @Param('id') id: string
  ): Promise<FileEntity> {
    return await this.fileService.getFile(id);
  }

  @Get('/get-many')
  private async getFiles(
    @Body('ids') ids: string[]
  ): Promise<FileEntity[]> {
    return await this.fileService.getFiles(ids);
  }

  @Post('/create/single')
  @UseInterceptors(FileInterceptor('file'))
  private async createFile(@Body() createFileDto: CreateFileDto, @UploadedFile() file): Promise<FileEntity> {
    return await this.fileService.createFile(createFileDto, file)
  }

  @Post('/create/many')
  @UseInterceptors(FilesInterceptor('files[]', 10))
  private async createManyFile(@UploadedFiles() files) {
    // return await this.fileService.createFile(files)
  }

  @Delete('/delete/:id')
  private async deleteFile(
    @Param('id') id: string
  ): Promise<void> {
    await await this.fileService.deleteFile(id)
  }

  @Get('/download/buffer/:id')
  private async buffer(@Res() response: Response, @Param('id', ParseUUIDPipe) id: string) {
    const file = this.fileService.imageBuffer(id);
    response.send(file);
  }

  @Get('/download/stream/:id')
  private async stream(@Res() response: Response, @Param('id', ParseUUIDPipe) id: string) {
    const file = await this.fileService.imageStream(id);

    response.contentType(file.additionalData.mimetype);
    // response.contentType('application/vnd.rar');
    file.read.pipe(response);
  }

  @Get('/download/streamable/:id')
  private async streamable(@Res({ passthrough: true }) response: Response, @Param('id', ParseUUIDPipe) id: string) {
    const file = this.fileService.fileStream(id);
    // or
    // const file = this.fileService.fileBuffer();
    return new StreamableFile(await file); // 👈 supports Buffer and Stream
  }
}

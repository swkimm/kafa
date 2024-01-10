import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthenticatedRequest } from '@/common/class/authenticated-request.interface'
import { Public } from '@/common/decorator/guard.decorator'
import { businessExceptionBinder } from '@/common/exception/business-exception.binder'
import { IMAGE_OPTIONS } from '@/storage/option/image-option'
import { BoardService } from './board.service'
import { CreatePostDTO } from './dto/create-post.dto'
import { BoardImageDTO } from './dto/post-image.dto'
import type { BasicPost, DetailPost } from './dto/post.dto'

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Public()
  @Get('posts/counts')
  async getTotalPostCounts(): Promise<{ counts: number }> {
    try {
      return await this.boardService.getTotalPostCounts()
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Public()
  @Get('posts/:postId')
  async getPost(
    @Param('postId', ParseIntPipe) postId: number
  ): Promise<DetailPost> {
    try {
      return await this.boardService.getPost(postId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Public()
  @Get('posts')
  async getPosts(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ): Promise<BasicPost[]> {
    try {
      return await this.boardService.getPosts(page, limit)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Post('posts/images')
  @UseInterceptors(FileInterceptor('image', IMAGE_OPTIONS))
  async uploadBoardImage(
    @UploadedFile() image: Express.Multer.File
  ): Promise<{ default: string }> {
    try {
      return await this.boardService.uploadPostImage(image)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Delete('posts/images')
  async deletePostImage(@Body() boardImageDTO: BoardImageDTO) {
    try {
      return await this.boardService.deletePostImage(boardImageDTO.url)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Post('posts')
  async createPost(
    @Body() postDTO: CreatePostDTO,
    @Req() req: AuthenticatedRequest
  ) {
    try {
      return await this.boardService.createPost(req.user.id, postDTO)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }
}

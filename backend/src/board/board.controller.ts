import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthenticatedRequest } from '@/common/class/authenticated-request.interface'
import { Public } from '@/common/decorator/guard.decorator'
import { businessExceptionBinder } from '@/common/exception/business-exception.binder'
import { FILE_OPTIONS } from '@/storage/option/file-option'
import { IMAGE_OPTIONS } from '@/storage/option/image-option'
import type { Attachment, Comment, Post as PostType } from '@prisma/client'
import { AttachmentService } from './attachment.service'
import { BoardService } from './board.service'
import { CommentService } from './comment.service'
import type { CommentDTO } from './dto/comment.dto'
import { CreateCommentDTO } from './dto/create-comment.dto'
import { CreatePostDTO } from './dto/create-post.dto'
import { BoardImageDTO } from './dto/post-image.dto'
import type { BasicPost, DetailPost } from './dto/post.dto'

@Controller('boards')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    private readonly commentService: CommentService,
    private readonly attachmentService: AttachmentService
  ) {}

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
  @Get('posts/:postId/comments')
  async getPostComments(
    @Param('postId', ParseIntPipe) postId: number
  ): Promise<CommentDTO[]> {
    try {
      return await this.commentService.getComments(postId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Public()
  @Get('posts/:postId/attachments')
  async getPostAttachments(
    @Param('postId', ParseIntPipe) postId: number
  ): Promise<Attachment[]> {
    try {
      return await this.attachmentService.getPostAttachments(postId)
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

  @Post('posts/:postId/attachment')
  @UseInterceptors(FileInterceptor('file', FILE_OPTIONS))
  async createPostAttachments(
    @UploadedFile() file: Express.Multer.File,
    @Param('postId', ParseIntPipe) postId: number,
    @Req() req: AuthenticatedRequest
  ): Promise<Attachment> {
    if (!file) {
      throw new BadRequestException('Invalid file format or size')
    }

    try {
      return await this.attachmentService.uploadPostAttachment(
        postId,
        req.user.id,
        file
      )
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Post('posts/:postId/comments')
  async postComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() commentDTO: CreateCommentDTO,
    @Req() req: AuthenticatedRequest
  ): Promise<Comment> {
    try {
      return await this.commentService.postComment(
        req.user.id,
        postId,
        commentDTO
      )
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

  @Put('posts/:postId')
  async updatePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Req() req: AuthenticatedRequest,
    @Body() postDTO: CreatePostDTO
  ): Promise<PostType> {
    try {
      return await this.boardService.updatePost(req.user.id, postId, postDTO)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Delete('posts/:postId')
  async deletePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Req() req: AuthenticatedRequest
  ): Promise<PostType> {
    try {
      return await this.boardService.deletePost(postId, req.user.id)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Delete('comments/:commentId')
  async deleteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Req() req: AuthenticatedRequest
  ): Promise<Comment> {
    try {
      return await this.commentService.deleteComment(req.user.id, commentId)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }

  @Post('posts')
  async createPost(
    @Body() postDTO: CreatePostDTO,
    @Req() req: AuthenticatedRequest
  ): Promise<PostType> {
    try {
      return await this.boardService.createPost(req.user.id, postDTO)
    } catch (error) {
      businessExceptionBinder(error)
    }
  }
}

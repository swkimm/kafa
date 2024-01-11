import { Inject, Injectable } from '@nestjs/common'
import { AccountService } from '@/account/account.service.interface'
import {
  BusinessException,
  EntityNotExistException,
  ForbiddenAccessException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { FileStorageService } from '@/storage/interface/file-storage.service.interface'
import { Role, type Attachment, Prisma } from '@prisma/client'
import { BoardService } from './board.service'

@Injectable()
export class AttachmentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly boardService: BoardService,
    @Inject('FileStorageService')
    private readonly fileService: FileStorageService,
    @Inject('AccountService') private readonly accountService: AccountService
  ) {}

  async getPostAttachments(postId: number): Promise<Attachment[]> {
    try {
      await this.boardService.getPost(postId)

      return await this.prismaService.attachment.findMany({
        where: {
          postId
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async deletePostAttachment(
    postId: number,
    accountId: number,
    attachmentId: number
  ): Promise<Attachment> {
    try {
      await this.checkAttachmentAccess(accountId, postId)

      const attachment = await this.prismaService.attachment.findUniqueOrThrow({
        where: {
          id: attachmentId
        }
      })

      if (attachment.postId !== postId) {
        throw new ForbiddenAccessException(
          '다른 글의 첨부파일은 삭제할 수 없습니다'
        )
      }

      await this.fileService.deleteObject(attachment.fileUrl)

      return await this.prismaService.attachment.delete({
        where: {
          id: attachmentId
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('파일이 존재하지 않습니다')
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async uploadPostAttachment(
    postId: number,
    accountId: number,
    file: Express.Multer.File
  ): Promise<Attachment> {
    try {
      await this.checkAttachmentAccess(accountId, postId)

      file.originalname = decodeURIComponent(file.originalname)

      const { url } = await this.fileService.uploadObject(
        file,
        `posts/${postId}/files`
      )

      return await this.prismaService.attachment.create({
        data: {
          postId,
          fileUrl: url,
          name: file.originalname ?? '첨부파일'
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  private async checkAttachmentAccess(
    accountId: number,
    postId: number
  ): Promise<void> {
    const account = await this.accountService.getAccountProfile(accountId)

    if (account.role === Role.Admin) {
      return
    }

    const post = await this.boardService.getPost(postId)

    if (post.Account.id !== accountId) {
      throw new ForbiddenAccessException(
        '다른 사람이 쓴 글은 수정할 수 없습니다'
      )
    }
  }
}

import { Inject, Injectable } from '@nestjs/common'
import { AccountService } from '@/account/account.service.interface'
import { AccountCredentialService } from '@/account/interface/account-credential.service.interface'
import {
  BusinessException,
  EntityNotExistException,
  ForbiddenAccessException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { PrismaService } from '@/prisma/prisma.service'
import {
  type Comment,
  Prisma,
  Role,
  type AccountCredential
} from '@prisma/client'
import type { CommentDTO } from './dto/comment.dto'
import type { CreateCommentDTO } from './dto/create-comment.dto'

@Injectable()
export class CommentService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('AccountService') private readonly accountService: AccountService,
    @Inject('AccountCredentialService')
    private readonly accountCredentialService: AccountCredentialService<AccountCredential>
  ) {}

  async getComments(postId: number): Promise<CommentDTO[]> {
    try {
      return await this.prismaService.comment.findMany({
        where: {
          postId
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          Account: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new EntityNotExistException('게시글이 존재하지 않습니다')
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async postComment(
    accountId: number,
    postId: number,
    commentDTO: CreateCommentDTO
  ): Promise<Comment> {
    try {
      await this.checkPostCommentRole(accountId)

      return await this.prismaService.comment.create({
        data: {
          accountId,
          postId,
          ...commentDTO
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new EntityNotExistException('게시글이 존재하지 않습니다')
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async deleteComment(accountId: number, commentId: number): Promise<Comment> {
    try {
      await this.checkDeleteComment(accountId, commentId)

      return await this.prismaService.comment.delete({
        where: {
          id: commentId
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
        throw new EntityNotExistException('댓글이 존재하지 않습니다')
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  private async checkPostCommentRole(accountId: number): Promise<void> {
    const account = await this.accountService.getAccountProfile(accountId)

    if (account.role === Role.Admin || account.role === Role.Manager) {
      const credential =
        await this.accountCredentialService.checkCredential(accountId)

      if (!credential) {
        throw new ForbiddenAccessException('본인인증 후 이용 가능합니다')
      }
    }
  }

  private async checkDeleteComment(
    accountId: number,
    commentId: number
  ): Promise<void> {
    const account = await this.accountService.getAccountProfile(accountId)

    if (account.role === Role.Admin) {
      return
    }

    const comment = await this.prismaService.comment.findUniqueOrThrow({
      where: {
        id: commentId
      }
    })

    if (comment.accountId !== accountId) {
      throw new ForbiddenAccessException(
        '다른 사람이 쓴 댓글은 삭제할 수 없습니다'
      )
    }
  }
}

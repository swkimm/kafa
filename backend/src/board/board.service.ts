import { Inject, Injectable } from '@nestjs/common'
import { AccountService } from '@/account/account.service.interface'
import { AccountCredentialService } from '@/account/interface/account-credential.service.interface'
import {
  BusinessException,
  EntityNotExistException,
  ForbiddenAccessException,
  UnexpectedException
} from '@/common/exception/business.exception'
import { calculateOffset } from '@/common/pagination/calculate-offset'
import { PrismaService } from '@/prisma/prisma.service'
import { ImageStorageService } from '@/storage/interface/image-storage.service.interface'
import {
  type AccountCredential,
  type Post,
  PostType,
  Role,
  Prisma
} from '@prisma/client'
import type { CreatePostDTO } from './dto/create-post.dto'
import type { BasicPost, DetailPost } from './dto/post.dto'

@Injectable()
export class BoardService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('ImageStorageService')
    private readonly imageStorageService: ImageStorageService,
    @Inject('AccountCredentialService')
    private readonly accountCredentialService: AccountCredentialService<AccountCredential>,
    @Inject('AccountService')
    private readonly accountService: AccountService
  ) {}

  async getPost(postId: number): Promise<DetailPost> {
    try {
      return await this.prismaService.post.findUniqueOrThrow({
        where: {
          id: postId
        },
        include: {
          Account: {
            select: {
              id: true,
              name: true,
              profileImgUrl: true
            }
          }
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('게시물이 존재하지 않습니다')
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async getPosts(page: number, limit = 10): Promise<BasicPost[]> {
    try {
      return await this.prismaService.post.findMany({
        take: limit,
        skip: calculateOffset(page, limit),
        orderBy: {
          id: 'desc'
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          type: true,
          Account: {
            select: {
              id: true,
              name: true,
              profileImgUrl: true
            }
          }
        }
      })
    } catch (error) {
      throw new UnexpectedException(error, error.stack)
    }
  }

  async getTotalPostCounts(): Promise<{ counts: number }> {
    try {
      const counts = await this.prismaService.post.count()
      return { counts }
    } catch (error) {
      throw new UnexpectedException(error, error.stack)
    }
  }

  async createPost(accountId: number, postDTO: CreatePostDTO): Promise<Post> {
    try {
      await this.checkNoticePostRole(accountId, postDTO)

      return await this.prismaService.post.create({
        data: {
          accountId,
          ...postDTO
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async uploadPostImage(image: Express.Multer.File): Promise<{
    default: string
  }> {
    try {
      const { url } = await this.imageStorageService.uploadObject(
        image,
        `board/images`
      )

      return {
        default: url
      }
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async deletePostImage(url: string) {
    try {
      return await this.imageStorageService.deleteObject(url)
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  async deletePost(postId: number, accountId: number): Promise<Post> {
    try {
      await this.checkPostDeleteRole(postId, accountId)

      return await this.prismaService.post.delete({
        where: {
          id: postId
        }
      })
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error
      }
      throw new UnexpectedException(error, error.stack)
    }
  }

  private async checkNoticePostRole(
    accountId: number,
    postDTO: CreatePostDTO
  ): Promise<void> {
    const credential =
      await this.accountCredentialService.checkCredential(accountId)

    if (!credential) {
      throw new ForbiddenAccessException('본인인증 후 게시글 작성이 가능합니다')
    }

    if (postDTO.type === PostType.Notice) {
      const { role } = await this.accountService.getAccountRole(accountId)

      if (role !== Role.Admin) {
        throw new ForbiddenAccessException(
          '공지사항은 관리자만 작성할 수 있습니다'
        )
      }
    }
  }

  private async checkPostDeleteRole(
    accountId: number,
    postId: number
  ): Promise<void> {
    const { role } = await this.accountService.getAccountRole(accountId)

    if (role === Role.Admin) {
      return
    }

    const post = await this.getPost(postId)

    if (post.Account.id !== accountId) {
      throw new ForbiddenAccessException('타인의 게시물을 삭제할 수 없습니다')
    }
  }
}

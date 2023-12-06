import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UnexpectedException } from '@/common/exception/business.exception'
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3'
import mime from 'mime-types'
import { v4 as uuidv4 } from 'uuid'
import type { ImageStorageService } from '../interface/image-storage.service.interface'

@Injectable()
export class ImageStorageServiceImpl implements ImageStorageService {
  private readonly s3: S3Client

  constructor(private readonly configService: ConfigService) {
    if (
      this.configService.get('NODE_ENV') === 'production' ||
      this.configService.get('NODE_ENV') === 'staging'
    ) {
      this.s3 = new S3Client()
    } else {
      this.s3 = new S3Client({
        region: this.configService.get('AWS_CDN_BUCKET_REGION'),
        endpoint: this.configService.get('AWS_CDN_BUCKET_URL'),
        forcePathStyle: true,
        credentials: {
          accessKeyId: this.configService.get('AWS_CDN_ACCESS_KEY') || '',
          secretAccessKey: this.configService.get('AWS_CDN_SECRET_KEY') || ''
        }
      })
    }
  }

  async uploadObject(
    file: Express.Multer.File,
    folder: string
  ): Promise<{ url: string }> {
    const key = `${folder}/${this.generateUniqueImageName()}`
    const fileType = this.extractContentType(file.originalname)

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.configService.get('AWS_CDN_BUCKET_NAME'),
          Key: key,
          Body: file.buffer,
          ContentType: fileType
        })
      )

      if (
        this.configService.get('NODE_ENV') === 'production' ||
        this.configService.get('NODE_ENV') === 'staging'
      ) {
        return {
          url: `https://${this.configService.get('CDN_SERVER_DOMAIN')}/${key}`
        }
      } else {
        return {
          url: `${this.configService.get(
            'AWS_CDN_BUCKET_URL'
          )}/${this.configService.get('AWS_CDN_BUCKET_NAME')}/${key}`
        }
      }
    } catch (error) {
      throw new UnexpectedException(error)
    }
  }

  async deleteObject(originUrl: string): Promise<{ result: string }> {
    try {
      const originKey = this.extractImagePathFromUrl(originUrl)

      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.configService.get('AWS_CDN_ORIGIN_BUCKET_NAME'),
          Key: originKey
        })
      )

      return { result: 'ok' }
    } catch (error) {
      throw new UnexpectedException(error)
    }
  }

  private extractImagePathFromUrl(url: string): string | null {
    const regex =
      /https?:\/\/[^/]+\/((?:[^/]+\/)+[^/]+\.(jpg|jpeg|png|heif|heic|webp))/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  private generateUniqueImageName(): string {
    const uniqueId = uuidv4()

    return uniqueId
  }

  private extractContentType(fileName: string): string {
    return fileName
      ? mime.lookup(fileName) || 'application/octet-stream'
      : 'application/octet-stream'
  }
}

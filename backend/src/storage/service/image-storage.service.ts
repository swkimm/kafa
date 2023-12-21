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

/**
 * Object Storage의 이미지를 관리하는 서비스 인터페이스 [ImageStorageService]의 구현체.
 * Ojbect Storage로 AWS의 S3 버킷을 사용한다.
 */
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
    const fileType = this.extractContentType(file)

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
      throw new UnexpectedException(error, error.stack)
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
      throw new UnexpectedException(error, error.stack)
    }
  }

  /**
   * HTTP URI로 부터 파일의 디렉토리를 추출하여 리턴합니다.
   *
   *
   * @param {string} url
   * @returns {string | null} 추출한 디렉토리 경로
   */
  private extractImagePathFromUrl(url: string): string | null {
    const regex =
      this.configService.get('NODE_ENV') === 'staging' ||
      this.configService.get('NODE_ENV') === 'production'
        ? /https?:\/\/[^/]+\/(.+)/
        : /https?:\/\/127\.0\.0\.1:9000\/kafa-cdn-bucket\/(.+)/

    const match = url.match(regex)
    return match ? match[1] : null
  }

  /**
   * 랜덤한 uuid를 생성하여 리턴합니다.
   *
   * @returns {string}
   */
  private generateUniqueImageName(): string {
    const uniqueId = uuidv4()

    return uniqueId
  }

  /**
   * 파일이름으로 부터 MimeType을 추출하여 리턴합니다.
   * @param {Express.Multer.File} file -
   * @returns {string} 추출한 MimeType
   */
  private extractContentType(file: Express.Multer.File): string {
    if (file.mimetype) {
      return file.mimetype.toString()
    }

    return file.originalname
      ? mime.lookup(file.originalname) || 'application/octet-stream'
      : 'application/octet-stream'
  }
}

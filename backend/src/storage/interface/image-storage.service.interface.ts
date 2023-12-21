import type { StorageService } from './storage.service.interface'

/**
 * Object Storage의 이미지를 관리하는 서비스 인터페이스
 * @extends {StorageService} Object Storage 기본 인터페이스
 */
export interface ImageStorageService extends StorageService {}

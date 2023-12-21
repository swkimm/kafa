import type { ProfileService } from './profile.service.interface'

/**
 * 스폰서의 프로필 이미지를 관리하는 서비스 인터페이스
 * @extends {ProfileService} 이미지를 관리하는 기본 인터페이스
 */
export interface SponserProfileService extends ProfileService {}

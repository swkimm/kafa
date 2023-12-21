/**
 * 프로필 이미지를 관리하는 서비스 인터페이스
 */
export interface ProfileService {
  /**
   * 프로필 이미지를 등록 또는 업데이트하고 프로필 이미지가 저장된 url을 반환합니다.
   *
   * @param {Express.Multer.File} image - 이미지 파일
   * @param {identifier} identifier - 프로필 이미지를 등록할 엔티티의 식별자
   * @returns {string} 프로필 이미지가 저장된 url
   * @throws {EntityNotExistException} 전달한 식별자에 해당되는 엔티티가 존재하지 않는 경우 발생
   */
  upsertProfile(
    image: Express.Multer.File,
    identifier: number | string
  ): Promise<string>
}

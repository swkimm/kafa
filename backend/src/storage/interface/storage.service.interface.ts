/**
 * Object Storage를 관리하는 서비스 인터페이스
 */
export interface StorageService {
  /**
   * 파일을 지정한 디렉토리에 저장하고 저장된 전체 URI를 반환합니다.
   *
   * @param {Express.Multer.File} file - 저장할 파일
   * @param {string} dir - 파일을 저장할 디렉토리
   * @returns {Promise<{url: string}>} 파일이 저장된 URI
   */
  uploadObject(file: Express.Multer.File, dir: string): Promise<{ url: string }>

  /**
   * 해당 URI에 있는 파일을 삭제하고 삭제 결과를 반환합니다.
   *
   * @param {string} uri - 삭제할 파일이 위치한 URI
   * @returns {Promise<{result: string}>} 파일 삭제 결과
   */
  deleteObject(uri: string): Promise<{ result: string }>
}

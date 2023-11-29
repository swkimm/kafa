export interface StorageService {
  uploadObject(file: Express.Multer.File, dir: string): Promise<{ url: string }>
  deleteObject(uri: string): Promise<{ result: string }>
}

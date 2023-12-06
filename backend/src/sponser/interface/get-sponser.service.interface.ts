import type { Sponser } from '@prisma/client'

export interface GetSponserService<T extends Sponser> {
  getSponser(sponserId: number): Promise<T>
  getSponsers(page: number, limit?: number): Promise<T[]>
}

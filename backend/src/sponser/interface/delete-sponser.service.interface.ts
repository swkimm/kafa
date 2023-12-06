import type { Sponser } from '@prisma/client'

export interface DeleteSponserService<T extends Sponser> {
  deleteSponser(sponserId: number): Promise<T>
}

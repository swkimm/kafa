import type { Sponser } from '@prisma/client'

export interface CreateSponserService<T extends Sponser> {
  createSponser(sponserDTO: Partial<T>): Promise<T>
}

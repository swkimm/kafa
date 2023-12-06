import type { Sponser } from '@prisma/client'

export interface UpdateSponserService<T extends Sponser> {
  updateSponser(sponserId: number, sponserDTO: Partial<T>): Promise<T>
}

import type { Sponser } from '@prisma/client'

export abstract class SponserService<T extends Sponser> {
  abstract getSponser(sponserId: number): Promise<T>
  abstract getSponsers(page: number, limit?: number): Promise<T[]>
  abstract createSponser(sponserDTO: Partial<T>): Promise<T>
  abstract updateSponser(sponserId: number, sponserDTO: Partial<T>): Promise<T>
  abstract deleteSponser(sponserId: number): Promise<T>
}

export interface KittenStatsEntity {
  id: string;
  kittenId: string;
  wins: number;
  losses: number;
  draws: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface KittenStatsRepository {
  createForKitten(kittenId: string): Promise<KittenStatsEntity>;
}

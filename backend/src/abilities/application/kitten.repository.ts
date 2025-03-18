export interface KittenRepository {
  findById(id: string): Promise<{ id: string, userId: string } | null>;
  isKittenOwnedByUser(kittenId: string, userId: string): Promise<boolean>;
}

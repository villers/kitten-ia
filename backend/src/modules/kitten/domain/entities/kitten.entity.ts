export interface KittenEntity {
  id: string;
  name: string;
  level: number;
  experience: number;
  strength: number;
  agility: number;
  constitution: number;
  intelligence: number;
  skillPoints: number;
  avatarUrl?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

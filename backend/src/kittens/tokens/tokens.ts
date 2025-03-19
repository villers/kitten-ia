export const KittenTokens = {
  KittenRepository: Symbol('KittenRepository'),
} as const;

// For backward compatibility
export const KITTEN_REPOSITORY = KittenTokens.KittenRepository;

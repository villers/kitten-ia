import { describe, it, expect } from 'vitest';

describe('Example test suite', () => {
  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2);
  });
  
  it('should work with async/await', async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });
});

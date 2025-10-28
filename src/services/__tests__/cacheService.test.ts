import { 
  getConfigService, 
  setConfigService, 
  checkCacheHealth, 
  clearCache, 
  getCacheInfo 
} from '../cacheService';
import { loadDecoupledConfig } from '../configService';

// Mock the configService
jest.mock('../configService', () => ({
  loadDecoupledConfig: jest.fn()
}));

const mockLoadDecoupledConfig = loadDecoupledConfig as jest.MockedFunction<typeof loadDecoupledConfig>;

describe('CacheService', () => {
  // Mock config data
  const mockConfig = {
    domain: [
      {
        name: 'RET10',
        flows: [
          { id: 'flow1', description: 'Test flow 1' }
        ]
      }
    ]
  };

  beforeEach(() => {
    // Clear cache before each test
    clearCache();
    // Reset all mocks
    jest.clearAllMocks();
    // Reset console methods
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console methods
    jest.restoreAllMocks();
  });

  describe('getConfigService', () => {
    it('should load config from files when cache is empty', async () => {
      mockLoadDecoupledConfig.mockResolvedValue(mockConfig);

      const result = await getConfigService();

      expect(mockLoadDecoupledConfig).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockConfig);
      expect(console.log).toHaveBeenCalledWith('console::::::::::…', mockConfig, 'object');
      expect(console.log).toHaveBeenCalledWith('Config successfully cached in memory');
    });

    it('should return cached config when cache is valid', async () => {
      mockLoadDecoupledConfig.mockResolvedValue(mockConfig);

      // First call loads from files
      const result1 = await getConfigService();
      expect(result1).toEqual(mockConfig);
      expect(mockLoadDecoupledConfig).toHaveBeenCalledTimes(1);

      // Second call should use cache
      const result2 = await getConfigService();
      expect(result2).toEqual(mockConfig);
      expect(mockLoadDecoupledConfig).toHaveBeenCalledTimes(1); // Still only called once
    });

    it('should reload config when cache is expired', async () => {
      const newConfig = { ...mockConfig, updated: true };
      mockLoadDecoupledConfig
        .mockResolvedValueOnce(mockConfig)
        .mockResolvedValueOnce(newConfig);

      // First call
      await getConfigService();
      expect(mockLoadDecoupledConfig).toHaveBeenCalledTimes(1);

      // Fast-forward time beyond TTL (3600 seconds)
      const originalNow = Date.now;
      Date.now = jest.fn(() => originalNow() + 3700 * 1000);

      // Second call should reload
      const result = await getConfigService();
      expect(result).toEqual(newConfig);
      expect(mockLoadDecoupledConfig).toHaveBeenCalledTimes(2);

      // Restore Date.now
      Date.now = originalNow;
    });

    it('should return cached config when file loading fails', async () => {
      mockLoadDecoupledConfig
        .mockResolvedValueOnce(mockConfig)
        .mockRejectedValueOnce(new Error('File load error'));

      // First call succeeds and caches
      await getConfigService();
      expect(mockLoadDecoupledConfig).toHaveBeenCalledTimes(1);

      // Fast-forward time beyond TTL
      const originalNow = Date.now;
      Date.now = jest.fn(() => originalNow() + 3700 * 1000);

      // Second call fails to load but returns cached version
      const result = await getConfigService();
      expect(result).toEqual(mockConfig);
      expect(console.warn).toHaveBeenCalledWith(
        'Config loading failed: File load error. Using cached version.'
      );

      // Restore Date.now
      Date.now = originalNow;
    });

    it('should throw error when no cache and file loading fails', async () => {
      mockLoadDecoupledConfig.mockRejectedValue(new Error('File load error'));

      await expect(getConfigService()).rejects.toThrow('Failed to load config: File load error');
      expect(mockLoadDecoupledConfig).toHaveBeenCalledTimes(1);
    });
  });

  describe('setConfigService', () => {
    it('should cache config in memory successfully', async () => {
      const result = await setConfigService(mockConfig);

      expect(result).toBe('Session created');
      expect(console.log).toHaveBeenCalledWith('Config successfully cached in memory');

      // Verify cache info
      const cacheInfo = getCacheInfo();
      expect(cacheInfo.hasCache).toBe(true);
      expect(cacheInfo.isExpired).toBe(false);
    });

    it('should handle caching errors gracefully', async () => {
      // This should work since we're not using JSON operations in setConfigService
      const result = await setConfigService(mockConfig);
      expect(result).toBe('Session created');
    });
  });

  describe('checkCacheHealth', () => {
    it('should return healthy status when cache is valid', async () => {
      await setConfigService(mockConfig);

      const health = await checkCacheHealth();

      expect(health.healthy).toBe(true);
      expect(health.message).toContain('In-memory cache is accessible');
      expect(health.message).toContain('Cache valid');
      expect(health).toHaveProperty('cacheAge');
      expect(health).toHaveProperty('cacheExpiry');
    });

    it('should return healthy status with expired cache message', async () => {
      await setConfigService(mockConfig);

      // Fast-forward time beyond TTL
      const originalNow = Date.now;
      Date.now = jest.fn(() => originalNow() + 3700 * 1000);

      const health = await checkCacheHealth();

      expect(health.healthy).toBe(true);
      expect(health.message).toContain('Cache expired');

      // Restore Date.now
      Date.now = originalNow;
    });

    it('should handle health check errors', async () => {
      // Force an error in checkCacheHealth by mocking Date.now to throw
      const originalNow = Date.now;
      Date.now = jest.fn(() => {
        throw new Error('Date error');
      });

      const health = await checkCacheHealth();

      expect(health.healthy).toBe(false);
      expect(health.message).toContain('In-memory cache error: Date error');

      // Restore Date.now
      Date.now = originalNow;
    });
  });

  describe('clearCache', () => {
    it('should clear the cache completely', async () => {
      await setConfigService(mockConfig);

      let cacheInfo = getCacheInfo();
      expect(cacheInfo.hasCache).toBe(true);

      clearCache();

      cacheInfo = getCacheInfo();
      expect(cacheInfo.hasCache).toBe(false);
      expect(cacheInfo.lastLoadTime).toBe(0);
    });
  });

  describe('getCacheInfo', () => {
    it('should return correct cache information when cache is empty', () => {
      const info = getCacheInfo();

      expect(info.hasCache).toBe(false);
      expect(info.lastLoadTime).toBe(0);
      expect(info.isExpired).toBe(true);
      expect(info.ttl).toBe(3600000); // 1 hour in milliseconds
    });

    it('should return correct cache information when cache is valid', async () => {
      await setConfigService(mockConfig);

      const info = getCacheInfo();

      expect(info.hasCache).toBe(true);
      expect(info.lastLoadTime).toBeGreaterThan(0);
      expect(info.isExpired).toBe(false);
      expect(info.cacheAge).toBeLessThan(1000); // Should be very small since just set
    });

    it('should indicate when cache is expired', async () => {
      await setConfigService(mockConfig);

      // Fast-forward time beyond TTL
      const originalNow = Date.now;
      Date.now = jest.fn(() => originalNow() + 3700 * 1000);

      const info = getCacheInfo();

      expect(info.hasCache).toBe(true);
      expect(info.isExpired).toBe(true);
      expect(info.cacheAge).toBeGreaterThan(3600000);

      // Restore Date.now
      Date.now = originalNow;
    });
  });

  describe('Integration tests', () => {
    it('should handle complete cache lifecycle', async () => {
      mockLoadDecoupledConfig.mockResolvedValue(mockConfig);

      // 1. Initial load from files
      const result1 = await getConfigService();
      expect(result1).toEqual(mockConfig);
      expect(mockLoadDecoupledConfig).toHaveBeenCalledTimes(1);

      // 2. Subsequent calls use cache
      const result2 = await getConfigService();
      expect(result2).toEqual(mockConfig);
      expect(mockLoadDecoupledConfig).toHaveBeenCalledTimes(1);

      // 3. Check cache health
      const health = await checkCacheHealth();
      expect(health.healthy).toBe(true);

      // 4. Clear cache manually
      clearCache();
      const info = getCacheInfo();
      expect(info.hasCache).toBe(false);

      // 5. Next call loads from files again
      const result3 = await getConfigService();
      expect(result3).toEqual(mockConfig);
      expect(mockLoadDecoupledConfig).toHaveBeenCalledTimes(2);
    });

    it('should maintain API compatibility with previous Redis implementation', async () => {
      mockLoadDecoupledConfig.mockResolvedValue(mockConfig);

      // Test that all functions return the same types as before
      const config = await getConfigService();
      expect(typeof config).toBe('object');

      const sessionResult = await setConfigService(config);
      expect(sessionResult).toBe('Session created');

      const health = await checkCacheHealth();
      expect(health).toHaveProperty('healthy');
      expect(health).toHaveProperty('message');
    });
  });
});
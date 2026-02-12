import path from "path";
import { loadDecoupledConfig } from "./configService";

const SESSION_EXPIRY = 3600; // 1 hour
const configPath = "../config/index.yaml";

// In-memory cache variables
let configCache: any = null;
let lastLoadTime: number = 0;
const CACHE_TTL = SESSION_EXPIRY * 1000; // Convert to milliseconds

export const getConfigService = async () => {
	try {
		const now = Date.now();

		// Check if cache is empty or expired
		if (!configCache || now - lastLoadTime > CACHE_TTL) {
			// Use the existing loadDecoupledConfig function
			const config = await loadDecoupledConfig();
			await setConfigService(config);
			return config;
		} else {
			return configCache;
		}
	} catch (error: any) {
		// If loading fails, try to return cached version if available
		if (configCache) {
			console.warn(
				`Config loading failed: ${error.message}. Using cached version.`,
			);
			return configCache;
		}

		// If no cache available, throw error
		throw new Error(`Failed to load config: ${error.message}`);
	}
};

export const setConfigService = async (config: any) => {
	try {
		configCache = config;
		lastLoadTime = Date.now();
		console.log("Config successfully cached in memory");
		return "Session created";
	} catch (error: any) {
		console.warn(`Failed to cache config in memory: ${error.message}`);
		throw new Error(`${error.message}`);
	}
};

export const checkCacheHealth = async () => {
	try {
		const now = Date.now();
		const isCacheValid = configCache && now - lastLoadTime <= CACHE_TTL;

		return {
			healthy: true,
			message: `In-memory cache is accessible. Cache ${
				isCacheValid ? "valid" : "expired"
			}.`,
			cacheAge: now - lastLoadTime,
			cacheExpiry: CACHE_TTL,
		};
	} catch (error: any) {
		return {
			healthy: false,
			message: `In-memory cache error: ${error.message}`,
		};
	}
};

// Additional utility functions for testing and monitoring
export const clearCache = () => {
	configCache = null;
	lastLoadTime = 0;
};

export const getCacheInfo = () => {
	const now = Date.now();
	return {
		hasCache: !!configCache,
		lastLoadTime,
		cacheAge: now - lastLoadTime,
		isExpired: now - lastLoadTime > CACHE_TTL,
		ttl: CACHE_TTL,
	};
};

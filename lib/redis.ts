import { Redis } from "ioredis";
import { Redis as UpstashRedis } from "@upstash/redis";

// Environment variable for Redis connection mode
const REDIS_MODE = process.env.REDIS_MODE || "local";

// Redis client configuration (local or serverless)
const localRedisUrl = process.env.REDIS_URL || "redis://localhost:6379";

interface RedisWrapper {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl?: number): Promise<any>;
  del(key: string): Promise<any>;
  isConnected: () => boolean;
}

// Create a wrapper for Redis client that abstracts away the differences
// between ioredis and Upstash Redis
class IoRedisWrapper implements RedisWrapper {
  private client: Redis;
  private connected: boolean = false;

  constructor(url: string) {
    this.client = new Redis(url, {
      maxRetriesPerRequest: 3, // Lower retry count to fail faster
      retryStrategy: (times) => {
        if (times > 3) return null; // Stop retrying after 3 attempts
        return Math.min(times * 50, 1000); // Exponential backoff
      },
      enableOfflineQueue: false, // Don't queue commands when disconnected
    });

    this.client.on("connect", () => {
      this.connected = true;
      console.log("Connected to Redis server");
    });

    this.client.on("error", (error) => {
      this.connected = false;
      console.error("Redis connection error:", error.message);
    });
  }

  async get(key: string): Promise<string | null> {
    if (!this.connected) return null;
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error("Redis get error:", error);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<any> {
    if (!this.connected) return null;
    try {
      if (ttl) {
        return await this.client.set(key, value, "EX", ttl);
      } else {
        return await this.client.set(key, value);
      }
    } catch (error) {
      console.error("Redis set error:", error);
      return null;
    }
  }

  async del(key: string): Promise<any> {
    if (!this.connected) return 0;
    try {
      return await this.client.del(key);
    } catch (error) {
      console.error("Redis del error:", error);
      return 0;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}

class UpstashRedisWrapper implements RedisWrapper {
  private client: UpstashRedis;

  constructor(url: string, token: string) {
    this.client = new UpstashRedis({
      url,
      token,
    });
  }

  async get(key: string): Promise<string | null> {
    try {
      return (await this.client.get(key)) as string | null;
    } catch (error) {
      console.error("Upstash Redis get error:", error);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<any> {
    try {
      // Upstash Redis uses a different API for setting with expiration
      if (ttl) {
        return await this.client.set(key, value, { ex: ttl });
      } else {
        return await this.client.set(key, value);
      }
    } catch (error) {
      console.error("Upstash Redis set error:", error);
      return null;
    }
  }

  async del(key: string): Promise<any> {
    try {
      return await this.client.del(key);
    } catch (error) {
      console.error("Upstash Redis del error:", error);
      return 0;
    }
  }

  isConnected(): boolean {
    // Upstash uses REST API, so there's no persistent connection to check
    return true;
  }
}

// Initialize the appropriate Redis client wrapper based on environment
let redisClient: RedisWrapper;

if (REDIS_MODE === "serverless") {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn(
      "Upstash Redis credentials not found. Redis caching will be disabled."
    );
    // Create a dummy client that doesn't do anything
    redisClient = {
      get: async () => null,
      set: async () => null,
      del: async () => 0,
      isConnected: () => false,
    };
  } else {
    console.log("Using Upstash Redis in serverless mode");
    redisClient = new UpstashRedisWrapper(url, token);
  }
} else {
  console.log("Using local Redis server");
  redisClient = new IoRedisWrapper(localRedisUrl);
}

// Cache expiration time (in seconds)
export const CACHE_TTL = 3600; // 1 hour

/**
 * Helper function for caching search results with fallback mechanism
 */
export const searchCache = {
  /**
   * Generates a cache key for a search query
   */
  generateKey: (query: string): string => {
    return `search:${query.toLowerCase().trim()}`;
  },

  /**
   * Gets cached search results if available
   */
  get: async <T>(query: string): Promise<T | null> => {
    const cacheKey = searchCache.generateKey(query);
    try {
      const cachedData = await redisClient.get(cacheKey);
      
      if (!cachedData) return null;
      
      // Handle potential JSON parsing errors by safely checking the data type
      try {
        // Check if the data is already an object (happens with some Redis clients)
        if (typeof cachedData === 'object') {
          return cachedData as unknown as T;
        }
        
        // Otherwise parse it as JSON
        return JSON.parse(cachedData) as T;
      } catch (parseError) {
        console.error("Error parsing cached JSON:", parseError);
        return null;
      }
    } catch (error) {
      console.error("Error retrieving from cache:", error);
      return null;
    }
  },

  /**
   * Stores search results in cache
   */
  set: async <T>(query: string, data: T): Promise<void> => {
    const cacheKey = searchCache.generateKey(query);
    try {
      await redisClient.set(cacheKey, JSON.stringify(data), CACHE_TTL);
    } catch (error) {
      console.error("Error storing in cache:", error);
    }
  },

  /**
   * Invalidates a cached search result
   */
  invalidate: async (query: string): Promise<void> => {
    const cacheKey = searchCache.generateKey(query);
    try {
      await redisClient.del(cacheKey);
    } catch (error) {
      console.error("Error invalidating cache:", error);
    }
  },
};

export default redisClient;

import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redisClient: Redis | undefined;
};

function getRedisClient() {
  if (!globalForRedis.redisClient) {
    globalForRedis.redisClient = new Redis(
      process.env.REDIS_URL ?? "redis://localhost:6379",
      {
        maxRetriesPerRequest: null,
      },
    );

    globalForRedis.redisClient.on("error", (err) => {
      console.error("[Redis] Connection error:", err);
    });
  }

  return globalForRedis.redisClient;
}

export function getRedis() {
  return getRedisClient();
}

export async function cacheAside<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  try {
    const cached = await getRedis().get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch {
    // Redis unavailable — fall through to fetcher
  }

  const data = await fetcher();

  try {
    await getRedis().setex(key, ttlSeconds, JSON.stringify(data));
  } catch {
    // Redis unavailable — data still returned from fetcher
  }

  return data;
}

export async function bustCache(pattern: string): Promise<number> {
  let deleted = 0;
  try {
    const keys = await getRedis().keys(pattern);
    if (keys.length > 0) {
      deleted = await getRedis().del(...keys);
    }
  } catch {
    // Redis unavailable
  }
  return deleted;
}

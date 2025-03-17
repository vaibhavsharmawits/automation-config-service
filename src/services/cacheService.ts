import { RedisService } from "ondc-automation-cache-lib";

const SESSION_EXPIRY = 3600; // 1 hour

export const getConfigService = async () => {
  try {
    // Fetch session data from Redis
    // const sessionData = await redisClient.get(sessionId);
    const sessionData = await RedisService.getKey("config");
    // if (!sessionData) {
    //   throw new Error("Session not found");
    // }
    // Return the session data if found
    return JSON.parse(sessionData || "{}");
  } catch (error: any) {
    // Return a 500 error in case of any issues
    throw new Error(`${error.message}`);
  }
};

export const setConfigService = async (config: any) => {
  try {
    await RedisService.setKey("config", JSON.stringify(config));
    console.log("session created");
    return "Session created";
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
};

import { RedisService } from "ondc-automation-cache-lib";
import path from "path";
import { loadYAMLWithRefs } from "./configService";

const SESSION_EXPIRY = 3600; // 1 hour
const configPath = "../config/index.yaml";

export const getConfigService = async () => {
  try {
    // Fetch session data from Redis
    // const sessionData = await redisClient.get(sessionId);
    let sessionData = await RedisService.getKey("config");
    if (!sessionData) {
      const config = await loadYAMLWithRefs(path.join(__dirname, configPath));
      await setConfigService(config);
      // .then(async (config: any) => {
      //   console.log("setting session data", sessionData);
      //   await setConfigService(config);
      //   return config
      // })
      // .catch(console.error);

      console.log("console::::::::::…", config, typeof config);
      return config;
    } else {
      return JSON.parse(sessionData || "{}");
    }
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

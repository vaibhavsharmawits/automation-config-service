import express from "express";
import cors from "cors";
import { RedisService } from "ondc-automation-cache-lib";
import * as path from "path";

import routes from "./routes";
import { loadYAMLWithRefs } from "./services/configService";
import { setConfigService } from "./services/cacheService";

const configPath = "./config/index.yaml";

RedisService.useDb(4);

const app = express();

app.use(cors());
app.use(express.json());

loadYAMLWithRefs(path.join(__dirname, configPath))
  .then(async (config: any) => {
    
    console.log(config);
    await setConfigService(config);
  })
  .catch(console.error);

app.use(routes);

export default app;

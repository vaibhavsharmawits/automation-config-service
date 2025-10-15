import express from "express";
import cors from "cors";
import { RedisService } from "ondc-automation-cache-lib";
import * as path from "path";

import routes from "./routes";
import { loadYAMLWithRefs } from "./services/configService";
import { setConfigService,getConfigService,deleteConfigService } from "./services/cacheService";

const configPath = "./config/index.yaml";

RedisService.useDb(parseInt(process.env.REDIS_DB as string) || 4);

const app = express();

app.use(cors());
app.use(express.json());

deleteConfigService().then(()=> getConfigService().then((config)=>{
   console.log("config loaded from yamls")
})).catch(console.error)

app.use(routes);

export default app;

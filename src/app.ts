import express from "express";
import cors from "cors";
import * as path from "path";

import routes from "./routes";
import { loadYAMLWithRefs } from "./services/configService";
import { getConfigService } from "./services/cacheService";

const configPath = "./config/index.yaml";

const app = express();

app.use(cors());
app.use(express.json());

getConfigService()
	.then((config) => {
		console.log("config loaded from yamls");
	})
	.catch(console.error);

app.use(routes);

export default app;

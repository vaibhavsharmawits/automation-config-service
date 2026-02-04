import { Request, Response } from "express";
import { getConfigService } from "../services/cacheService";
import { filterDomainData, getFileFromRefrence, getMockConfig } from "../utils";
import { convertToFlowConfig } from "@ondc/automation-mock-runner";
export const getFlow = async (req: Request, res: Response) => {
	try {
		const query = req.query;
		const config = await getConfigService();
		const filePath = filterDomainData(
			config,
			query.domain as string,
			query.version as string,
			query.usecase as string,
			"flows",
		);
		let data = await getFileFromRefrence(filePath);
		data = convertPlaygroundFlowConfig(data);
		console.log(JSON.stringify(data));
		const filteredFlow = data.flows?.filter(
			(flow: any) => flow.id === query.flowId,
		);

		if (filteredFlow?.length) {
			res.send({ data: filteredFlow[0] });
			return;
		} else {
			res.send({ data: null, message: "No flow found with the given flowId" });
			return;
		}
	} catch (e) {
		console.log("Error while fetching flow", e);
		res.status(400).send({ error: true, message: "Error while fetching flow" });
	}
};

export const getScenarioFormData = async (_req: Request, res: Response) => {
	const config = await getConfigService();

	res.send(config.usecases);
};

export const getPlaygroundFlowConfig = async (req: Request, res: Response) => {
	try {
		const { domain, version, usecase, flowId } = req.query;

		// ---- Validation ----
		if (!domain || !version || !usecase || !flowId) {
			return res.status(400).send({
				error: true,
				message: "domain, version, usecase and flowId are required",
			});
		}

		// ---- Load main config ----
		const config = await getConfigService();

		// ---- Resolve flows directory ----
		const flowsDirPath = filterDomainData(
			config,
			domain as string,
			version as string,
			usecase as string,
			"flows",
		);

		if (!flowsDirPath?.filePath || !flowsDirPath?.domainName) {
			return res.status(404).send({
				error: true,
				message: "Flows configuration not found",
			});
		}

		// ---- Build relative flow path ----
		let baseFlowsPath = flowsDirPath.filePath.replace(/\/?index\.yaml$/, "");
		baseFlowsPath = baseFlowsPath.replace(/^\.\//, "");

		const flowFilePath = `${baseFlowsPath}/${flowId}.yaml`;

		// ---- Load flow config ----
		const flowData = await getMockConfig({
			domainName: flowsDirPath.domainName,
			filePath: flowFilePath,
		});

		if (!flowData) {
			return res.status(404).send({
				data: null,
				message: "No flow found with the given flowId",
			});
		}

		// ---- Success ----
		return res.send(flowData);
	} catch (e) {
		console.error("Error while fetching playground flow config", e);

		return res.status(400).send({
			error: true,
			message: "Error while fetching playground flow config",
		});
	}
};

export function convertPlaygroundFlowConfig(data: any) {
	let index = 0;
	for (const flow of data.flows) {
		if (flow.type && flow.type === "playground") {
			const actualFlowConfig = convertToFlowConfig(flow.config);
			actualFlowConfig.tags = flow.tags;
			actualFlowConfig.description = flow.description;
			actualFlowConfig.id = flow.id;
			data.flows[index] = actualFlowConfig;
		}
		index++;
	}
	return data;
}

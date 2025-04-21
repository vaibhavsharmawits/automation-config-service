import { Request, Response } from "express";
import { getConfigService } from "../services/cacheService";
import { filterDomainData, getFileFromRefrence } from "../utils";

export const getFlow = async (req: Request, res: Response) => {
  try {
    const query = req.query;
    const config = await getConfigService();
    const filePath = filterDomainData(
      config,
      query.domain as string,
      query.version as string,
      query.usecase as string,
      "flows"
    );
    const data = await getFileFromRefrence(filePath);

    const filteredFlow = data.flows?.filter(
      (flow: any) => flow.id === query.flowId
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

import { Request, Response } from "express";
import { getConfigService } from "../services/cacheService";
import { filterDomainData, getFileFromRefrence, filterByTags } from "../utils";

export const getFlows = async (req: Request, res: Response) => {
  try {
    const query = req.query;
    console.log("query", query);
    const config = await getConfigService();

    const filePath = filterDomainData(
      config,
      query.domain as string,
      query.version as string,
      query.usecase as string,
      "flows"
    );
    const data: any = await getFileFromRefrence(filePath);

    const optionsParam = req.query?.options as string;

    const optionsArray = Array.isArray(optionsParam)
      ? optionsParam // multiple ?options=apple&options=banana
      : optionsParam?.split(",");

    console.log("req.query?.options", optionsArray);
    const filteredData = filterByTags(data.flows, optionsArray);

    res.send({ data: { flows: filteredData } });
  } catch (e) {
    console.log("Error while fetching flows", e);
    res
      .status(400)
      .send({ error: true, message: "Error while fetching flows" });
  }
};

export const getScenarioFormData = async (_req: Request, res: Response) => {
  const config = await getConfigService();

  res.send(config.usecases);
};

export const getReportingStatus = async (req: Request, res: Response) => {
  const query = req.query;
  const config = await getConfigService();
  const reporting = filterDomainData(
    config,
    query.domain as string,
    query.version as string,
    "",
    "reporting"
  );

  res.send({ data: reporting || true });
};

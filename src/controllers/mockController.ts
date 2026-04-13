import { Request, Response } from "express";
import { convertToFlowConfig } from "@ondc/automation-mock-runner";
import { fetchSpec, fetchAvailableBuilds } from "../services/dbService";

export function convertPlaygroundFlow(flow: any) {
    const converted = convertToFlowConfig(flow.config);
    converted.tags = flow.tags;
    converted.description = flow.description;
    converted.id = flow.flowId;
    return converted;
}

function handleDbError(e: any, label: string, res: Response) {
    if (e.response?.status === 404) {
        return res.status(404).send({ error: true, message: "Spec not found" });
    }
    if (e.message === "AUTOMATION_DB_BASE_URL is not configured") {
        return res.status(500).send({ error: true, message: e.message });
    }
    console.error(label, e);
    return res.status(500).send({ error: true, message: label });
}

export const getFlow = async (req: Request, res: Response) => {
    try {
        const { domain, version, usecase, flowId } = req.query as Record<
            string,
            string
        >;
        const data = await fetchSpec(domain, version, {
            include: "flows",
            usecase,
            flowId,
        });
        const raw = data.flows?.[0];
        if (!raw) {
            return res.send({
                data: null,
                message: "No flow found with the given flowId",
            });
        }
        const flow = convertPlaygroundFlow(raw);
        return res.send({ data: flow });
    } catch (e: any) {
        return handleDbError(e, "Error while fetching flow", res);
    }
};

export const getScenarioFormData = async (_req: Request, res: Response) => {
    try {
        const data = await fetchAvailableBuilds();
        return res.send(data);
    } catch (e: any) {
        return handleDbError(e, "Error while fetching scenario data", res);
    }
};

export const getPlaygroundFlowConfig = async (req: Request, res: Response) => {
    try {
        const { domain, version, usecase, flowId } = req.query as Record<
            string,
            string
        >;
        const data = await fetchSpec(domain, version, {
            include: "flows",
            usecase,
            flowId,
        });
        const raw = data.flows?.[0];
        if (!raw) {
            return res.status(404).send({
                data: null,
                message: "No flow found with the given flowId",
            });
        }
        const flow = raw.config;
        return res.send(flow);
    } catch (e: any) {
        return handleDbError(
            e,
            "Error while fetching playground flow config",
            res,
        );
    }
};

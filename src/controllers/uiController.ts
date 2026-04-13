import { Request, Response } from "express";
import { fetchSpec, fetchAvailableBuilds } from "../services/dbService";
import { convertPlaygroundFlow } from "./mockController";

export const getFlows = async (req: Request, res: Response) => {
    try {
        const { domain, version, usecase, options } = req.query as Record<
            string,
            string
        >;
        const params: Record<string, string | undefined> = {
            include: "flows",
            usecase,
        };
        if (options) params.tag = options;
        const data = await fetchSpec(domain, version, params);
        const flows = (data.flows ?? []).map(convertPlaygroundFlow);
        res.send({ data: { flows } });
    } catch (e: any) {
        if (e.response?.status === 404) {
            return res
                .status(404)
                .send({ error: true, message: "Spec not found" });
        }
        if (e.message === "AUTOMATION_DB_BASE_URL is not configured") {
            return res.status(500).send({ error: true, message: e.message });
        }
        console.error("Error while fetching flows", e);
        res.status(500).send({
            error: true,
            message: "Error while fetching flows",
        });
    }
};

export const getScenarioFormData = async (_req: Request, res: Response) => {
    try {
        const data = await fetchAvailableBuilds();
        res.send({ domain: data });
    } catch (e: any) {
        if (e.message === "AUTOMATION_DB_BASE_URL is not configured") {
            return res.status(500).send({ error: true, message: e.message });
        }
        console.error("Error while fetching scenario data", e);
        res.status(500).send({
            error: true,
            message: "Error while fetching scenario data",
        });
    }
};

export const getReportingStatus = async (req: Request, res: Response) => {
    try {
        const { domain, version } = req.query as {
            domain: string;
            version: string;
        };
        const data = await fetchSpec(domain, version, { include: "meta" });
        res.send({ data: data.meta?.reporting ?? true });
    } catch (e: any) {
        if (e.response?.status === 404) {
            return res
                .status(404)
                .send({ error: true, message: "Spec not found" });
        }
        if (e.message === "AUTOMATION_DB_BASE_URL is not configured") {
            return res.status(500).send({ error: true, message: e.message });
        }
        console.error("Error while fetching reporting status", e);
        res.status(500).send({
            error: true,
            message: "Error while fetching reporting status",
        });
    }
};

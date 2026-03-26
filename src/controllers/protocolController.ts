import { Request, Response } from "express";
import axios from "axios";

export const getSpec = async (req: Request, res: Response) => {
    try {
        const { domain, version } = req.params;
        const automationDbBaseUrl = process.env.AUTOMATION_DB_BASE_URL;
        const apiKey = process.env.AUTOMATION_DB_API_KEY;

        if (!automationDbBaseUrl) {
            return res.status(500).send({
                error: true,
                message: "AUTOMATION_DB_BASE_URL is not configured",
            });
        }

        const url = `${automationDbBaseUrl}/protocol-specs/specs/${domain}/${version}`;

        const response = await axios.get(url, {
            params: req.query,
            headers: {
                "x-api-key": apiKey,
            },
        });

        res.status(response.status).send(response.data);
    } catch (e) {
        console.log("Error while fetching spec", e);
        res.status(400).send({
            error: true,
            message: "Error while fetching spec",
        });
    }
};

export const getAvailableBuilds = async (req: Request, res: Response) => {
    try {
        const automationDbBaseUrl = process.env.AUTOMATION_DB_BASE_URL;
        const apiKey = process.env.AUTOMATION_DB_API_KEY;

        if (!automationDbBaseUrl) {
            return res.status(500).send({
                error: true,
                message: "AUTOMATION_DB_BASE_URL is not configured",
            });
        }

        const url = `${automationDbBaseUrl}/protocol-specs/builds`;

        const response = await axios.get(url, {
            params: req.query,
            headers: {
                "x-api-key": apiKey,
            },
        });

        res.status(response.status).send(response.data);
    } catch (e) {
        console.log("Error while fetching available builds", e);
        res.status(400).send({
            error: true,
            message: "Error while fetching available builds",
        });
    }
};

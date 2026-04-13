import axios from "axios";

function getDbConfig(): { baseUrl: string; headers: Record<string, string> } {
    const baseUrl = process.env.AUTOMATION_DB_BASE_URL;
    if (!baseUrl) {
        throw new Error("AUTOMATION_DB_BASE_URL is not configured");
    }
    const headers: Record<string, string> = {};
    const apiKey = process.env.AUTOMATION_DB_API_KEY;
    if (apiKey) headers["x-api-key"] = apiKey;
    return { baseUrl, headers };
}

export async function fetchSpec(
    domain: string,
    version: string,
    params?: object,
): Promise<any> {
    const { baseUrl, headers } = getDbConfig();
    const url = `${baseUrl}/protocol-specs/specs/${encodeURIComponent(domain)}/${encodeURIComponent(version)}`;
    console.log(`Fetching spec from ${url} with params:`, params);
    const response = await axios.get(url, { params, headers });
    return response.data;
}

export async function fetchAvailableBuilds(params?: object): Promise<any> {
    const { baseUrl, headers } = getDbConfig();
    const url = `${baseUrl}/protocol-specs/builds`;
    const response = await axios.get(url, { params, headers });
    return response.data;
}

import * as path from "path";
import { loadYAMLWithRefs } from "../services/configService";

export function filterDomainData(
  data: any,
  domainName: string,
  versionId: string,
  usecaseName: string,
  property: string
) {
  if (!data || !data.domain) return null;

  for (const domain of data.domain) {
    if (domain.name === domainName) {
      for (const version of domain.versions) {
        if (version.id === versionId) {
          if (property === "supportedActions" || property === "reporting") {
            return version[property];
          }
          for (const usecase of version.usecase) {
            if (usecase.name === usecaseName) {
              return usecase[property] || null;
            }
          }
        }
      }
    }
  }

  return null;
}

export const getFileFromRefrence = async (filePath: string) => {
  try {
    const config = await loadYAMLWithRefs(
      path.join(__dirname, "../config", filePath)
    );
    return config;
  } catch (e) {
    console.error("error while fetching file", e);
    throw new Error("Error while fetching file");
  }
};

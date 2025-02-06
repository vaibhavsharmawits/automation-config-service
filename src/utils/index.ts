import * as path from "path";
import { loadYAMLWithRefs } from "../services/configService";

export function filterDomainData(
  data: any,
  domainName: any,
  versionId: any,
  usecaseName: any,
  property: any
) {
  if (!data || !data.domain) return null;

  for (const domain of data.domain) {
    if (domain.name === domainName) {
      for (const version of domain.versions) {
        if (version.id === versionId) {
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

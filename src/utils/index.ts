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
          console.log("gettting here?");
          if (
            property === "supportedActions" ||
            property === "reporting" ||
            property === "devPortalFlows"
          ) {
            console.log("wokring??????", version, property);
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
    console.log("filePath", filePath);
    const config = await loadYAMLWithRefs(
      path.join(__dirname, "../config", filePath)
    );
    return config;
  } catch (e) {
    console.error("error while fetching file", e);
    throw new Error("Error while fetching file");
  }
};

type Item = {
  tags?: string[];
};

export const filterByTags = (
  items: Item[],
  options?: string[] | null
): Item[] => {
  if (!options || options.length === 0) {
    return items;
  }

  if(options.length === 1 && options[0] === "WORKBENCH") {
    return items.filter(item => !('tags' in item));
  }

  return items.filter(
    (item) =>
      Array.isArray(item.tags) &&
      options.every((option) => item.tags!.includes(option))
  );
};

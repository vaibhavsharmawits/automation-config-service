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
          if (
            property === "supportedActions" ||
            property === "reporting" ||
            property === "devPortalFlows"
          ) {
            return version[property];
          }
          for (const usecase of version.usecase) {
            if (usecase.name === usecaseName) {
              // Return both the property value and domain name for path resolution
              return {
                filePath: usecase[property],
                domainName: domain.name
              };
            }
          }
        }
      }
    }
  }

  return null;
}

export const getFileFromRefrence = async (filePathData: any) => {
  try {
    // Handle both old string format and new object format
    let filePath: string;
    let domainName: string | null = null;

    if (typeof filePathData === 'string') {
      filePath = filePathData;
    } else if (filePathData && typeof filePathData === 'object') {
      filePath = filePathData.filePath;
      domainName = filePathData.domainName;
    } else {
      throw new Error("Invalid file path data");
    }

    console.log("filePath", filePath, "domainName", domainName);

    // Resolve the full path
    let fullPath: string;

    if (domainName) {
      // New decoupled structure: path is relative to domain folder
      const domainFolder = domainName.replace('ONDC:', '');
      fullPath = path.join(__dirname, "../config", domainFolder, filePath);
    } else {
      // Old structure or absolute path
      fullPath = path.join(__dirname, "../config", filePath);
    }

    const config = await loadYAMLWithRefs(fullPath);
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

  // if(options.length === 1 && options[0] === "WORKBENCH") {
  //   return items.filter(item => !('tags' in item));
  // }

  return items.filter(
    (item) =>
      Array.isArray(item.tags) &&
      options.every((option) => item.tags!.includes(option))
  );
};

export const getMockConfig = async (input: {
  domainName: string;
  filePath: string;
}) => {
  try {
    const { domainName, filePath } = input;

    if (!domainName || !filePath) {
      throw new Error("domainName and filePath are required");
    }

    // Remove ONDC: prefix → folder name
    const domainFolder = domainName.replace(/^ONDC:/, "");

    // Normalize path (removes ./ automatically)
    const normalizedPath = filePath.replace(/^\.\//, "");

    const fullPath = path.join(
      __dirname,
      "../config",
      domainFolder,
      normalizedPath
    );

    console.log("Resolved mock config path:", fullPath);

    return await loadYAMLWithRefs(fullPath);
  } catch (e) {
    console.error("Error while fetching mock config", e);
    throw new Error("Error while fetching mock config");
  }
};
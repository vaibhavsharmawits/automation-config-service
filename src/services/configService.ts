import * as fs from "fs";
import * as yaml from "js-yaml";
import * as path from "path";

const configPath = "./../config/index.yaml";
const $RefParser = require("json-schema-ref-parser");

export async function loadYAMLWithRefs(filePath: string) {
  const doc = yaml.load(fs.readFileSync(filePath, "utf8"));
  return await $RefParser.dereference(doc);
}

export async function loadDecoupledConfig() {
  const configDir = path.join(__dirname, "../config");
  const mergedConfig: any = { domain: [], usecases: { domain: [] } };
  
  try {
    // Read all subdirectories in the config folder
    const entries = fs.readdirSync(configDir, { withFileTypes: true });
    const domainDirs = entries.filter(entry => entry.isDirectory());
    
    for (const dir of domainDirs) {
      try{
      const domainIndexPath = path.join(configDir, dir.name, "index.yaml");
      
      // Check if domain-specific index.yaml exists
      if (fs.existsSync(domainIndexPath)) {
        // Load the domain-specific config
        const domainConfig = await loadYAMLWithRefs(domainIndexPath);
        
        // Add to merged config
        mergedConfig.domain.push(domainConfig);
        
        // Build usecases structure
        const domainUsecases = {
          key: domainConfig.name,
          version: domainConfig.versions.map((v: any) => ({
            key: v.id,
            usecase: v.usecase ? v.usecase.map((u: any) => u.name) : []
          }))
        };
        mergedConfig.usecases.domain.push(domainUsecases);
      }
      }
      catch(err){
        console.error ("config loading failed for a domain ",err)
      }
    }
    
    // // If there's still a main index.yaml, load it for backward compatibility
    // const mainIndexPath = path.join(configDir, "index.yaml");
    // if (fs.existsSync(mainIndexPath)) {
    //   const mainConfig = await loadYAMLWithRefs(mainIndexPath);
      
    //   // Check if main config has the old structure and merge if needed
    //   if (mainConfig.domain && Array.isArray(mainConfig.domain)) {
    //     // Filter out domains that are already loaded from domain-specific files
    //     const loadedDomains = new Set(mergedConfig.domain.map((d: any) => d.name));
    //     const additionalDomains = mainConfig.domain.filter((d: any) => !loadedDomains.has(d.name));
        
    //     mergedConfig.domain.push(...additionalDomains);
        
    //     // Merge usecases too
    //     if (mainConfig.usecases && mainConfig.usecases.domain) {
    //       const additionalUsecases = mainConfig.usecases.domain.filter(
    //         (u: any) => !loadedDomains.has(u.key)
    //       );
    //       mergedConfig.usecases.domain.push(...additionalUsecases);
    //     }
    //   }
    // }
    
    return mergedConfig;
  } catch (error) {
    console.error("Error loading decoupled config:", error);
  }
}

// loadYAMLWithRefs(path.join(__dirname, configPath))
//   .then((resolved) => {
//     console.log(">>>>>", JSON.stringify(resolved, null, 2));
//   })
//   .catch(console.error);

// interface Config {
//   domain: Array<{
//     name: string;
//     flows: {
//       id: string;
//       description: string;
//       sequence: {
//         [key: string]: {
//           key: string;
//           type: string;
//           pair: string | null;
//           unsolicited: boolean;
//           description: string;
//         };
//       }[];
//     }[];
//   }>;
// }

// const loadConfig = (filePath: string): Config => {
//   try {
//     const configPath = path.resolve(__dirname, filePath);
//     const fileContents = fs.readFileSync(configPath, "utf8");
//     const config = yaml.load(fileContents) as Config;
//     return config;
//   } catch (e: any) {
//     console.error(`Failed to load config file: ${e.message}`);
//     throw e;
//   }
// };

// let cachedConfig: Config | null = null;

// const getConfig = (): Config => {
//   // loadYAMLWithRefs;
//   if (!cachedConfig) {
//     cachedConfig = loadConfig(configPath);
//   }
//   return cachedConfig;
// };

// export default getConfig;

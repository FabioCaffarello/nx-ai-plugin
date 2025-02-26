import { Tree, formatFiles } from '@nx/devkit';
import * as yaml from 'js-yaml';
import { AgentGeneratorGeneratorSchema } from './schema';

// Define the interfaces.
interface PluginConfig {
  agentsMappingPath: string;
}

interface AgentData {
  type: string;
  promptTemplate: string;
}

interface AgentMapping {
  agents: Record<string, AgentData>;
}

export async function agentGeneratorGenerator(
  tree: Tree,
  options: AgentGeneratorGeneratorSchema & { configFilePath: string }
) {
  // Ensure the plugin config file exists.
  if (!tree.exists(options.configFilePath)) {
    throw new Error(
      `Plugin config file not found at ${options.configFilePath}. Please run the config generator first.`
    );
  }

  // Read and parse the plugin configuration.
  const pluginConfigContent = tree.read(options.configFilePath, 'utf-8');
  if (!pluginConfigContent) {
    throw new Error(
      `Failed to read plugin config file at ${options.configFilePath}.`
    );
  }
  const pluginConfig = yaml.load(pluginConfigContent) as PluginConfig;

  // Retrieve the agentsMappingPath from the plugin config.
  const mappingFilePath: string = pluginConfig.agentsMappingPath;
  if (!mappingFilePath) {
    throw new Error(
      `agentsMappingPath not defined in plugin config file at ${options.configFilePath}.`
    );
  }

  // Load the existing mapping file if it exists; otherwise, initialize it.
  let mappingObj: AgentMapping = { agents: {} };
  if (tree.exists(mappingFilePath)) {
    const mappingContent = tree.read(mappingFilePath, 'utf-8');
    const parsedMapping = yaml.load(mappingContent);
    mappingObj = (parsedMapping as AgentMapping) || { agents: {} };
  }

  // Ensure the "agents" property exists.
  mappingObj.agents = mappingObj.agents || {};

  // Upsert the agent: use options.agentName as the key.
  mappingObj.agents[options.agentName] = {
    type: options.agentType,
    promptTemplate: options.promptTemplate,
  };

  // Dump the updated mapping object to a YAML string.
  const newYamlContent = yaml.dump(mappingObj);

  // Write the updated content back to the mapping file.
  tree.write(mappingFilePath, newYamlContent);

  await formatFiles(tree);
}

export default agentGeneratorGenerator;

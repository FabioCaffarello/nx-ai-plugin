import { Tree, formatFiles } from '@nx/devkit';
import * as yaml from 'js-yaml';
import { AgentGeneratorGeneratorSchema } from './schema';
import { fileExists, getExistingYaml } from '@nx-ai-plugin-core/os';

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
  if (!fileExists(options.configFilePath, tree)) {
    throw new Error(
      `Plugin config file not found at ${options.configFilePath}. Please run the config generator first.`
    );
  }

  const pluginConfig = getExistingYaml(options.configFilePath, {
    agentsMappingPath: './.agents/mapping.yaml',
  }) as PluginConfig;

  const mappingFilePath: string = pluginConfig.agentsMappingPath;
  if (!mappingFilePath) {
    throw new Error(
      `agentsMappingPath not defined in plugin config file at ${options.configFilePath}.`
    );
  }

  let mappingObj: AgentMapping = { agents: {} };
  if (tree.exists(mappingFilePath)) {
    const mappingContent = tree.read(mappingFilePath, 'utf-8');
    const parsedMapping = yaml.load(mappingContent);
    mappingObj = (parsedMapping as AgentMapping) || { agents: {} };
  }

  mappingObj.agents = mappingObj.agents || {};

  mappingObj.agents[options.agentName] = {
    type: options.agentType,
    promptTemplate: options.promptTemplate,
  };

  const newYamlContent = yaml.dump(mappingObj);

  tree.write(mappingFilePath, newYamlContent);

  await formatFiles(tree);
}

export default agentGeneratorGenerator;

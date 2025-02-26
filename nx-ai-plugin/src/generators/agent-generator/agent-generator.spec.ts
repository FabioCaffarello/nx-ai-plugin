import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import * as yaml from 'js-yaml';
import { agentGeneratorGenerator } from './agent-generator';
import { AgentGeneratorGeneratorSchema } from './schema';

// Define an interface for the agents mapping.
interface AgentMapping {
  agents: Record<string, { type: string; promptTemplate: string }>;
}

describe('agent-generator generator', () => {
  let tree: Tree;
  
  // Set up options for our generator.
  // We include configFilePath which points to the plugin config file.
  const options: AgentGeneratorGeneratorSchema & { configFilePath: string } = {
    agentName: 'testAgent',
    agentType: 'go',
    promptTemplate: 'You are a Go expert. Please review the diff.',
    configFilePath: 'nx-ai-plugin.config.yaml'
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    // Simulate the existence of the plugin config file.
    // This file should contain the agentsMappingPath property.
    const pluginConfig = {
      agentsMappingPath: './.agents/mapping.yaml'
    };
    tree.write(
      options.configFilePath,
      yaml.dump(pluginConfig)
    );
  });

  it('should upsert an agent into the mapping file', async () => {
    // Run the agent generator.
    await agentGeneratorGenerator(tree, options);

    // Check that the mapping file was created.
    const mappingPath = './.agents/mapping.yaml';
    expect(tree.exists(mappingPath)).toBeTruthy();

    // Read and parse the mapping file.
    const mappingContent = tree.read(mappingPath, 'utf-8');
    expect(mappingContent).toBeDefined();
    const mappingObj = yaml.load(mappingContent) as AgentMapping;

    // Verify that the "agents" property exists and contains our new agent.
    expect(mappingObj.agents).toBeDefined();
    expect(mappingObj.agents['testAgent']).toEqual({
      type: 'go',
      promptTemplate: 'You are a Go expert. Please review the diff.'
    });
  });

  it('should update an existing agent without removing other agents', async () => {
    // Pre-populate the mapping file with an existing agent.
    const initialMapping: AgentMapping = {
      agents: {
        existingAgent: {
          type: 'python',
          promptTemplate: 'You are a Python expert.'
        }
      }
    };
    tree.write('./.agents/mapping.yaml', yaml.dump(initialMapping));

    // Run the agent generator to upsert "testAgent".
    await agentGeneratorGenerator(tree, options);

    // Read the updated mapping file.
    const mappingContent = tree.read('./.agents/mapping.yaml', 'utf-8');
    const mappingObj = yaml.load(mappingContent) as AgentMapping;

    // Verify that the existing agent remains.
    expect(mappingObj.agents.existingAgent).toEqual({
      type: 'python',
      promptTemplate: 'You are a Python expert.'
    });
    // And that the new agent is added or updated.
    expect(mappingObj.agents['testAgent']).toEqual({
      type: 'go',
      promptTemplate: 'You are a Go expert. Please review the diff.'
    });
  });
});

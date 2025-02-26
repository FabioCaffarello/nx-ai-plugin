import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import * as yaml from 'js-yaml';
import { agentGeneratorGenerator } from './agent-generator';
import { AgentGeneratorGeneratorSchema } from './schema';

interface AgentMapping {
  agents: Record<string, { type: string; promptTemplate: string }>;
}

describe('agent-generator generator', () => {
  let tree: Tree;

  const options: AgentGeneratorGeneratorSchema & { configFilePath: string } = {
    agentName: 'testAgent',
    agentType: 'go',
    promptTemplate: 'You are a Go expert. Please review the diff.',
    configFilePath: 'nx-ai-plugin.config.yaml',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    const pluginConfig = yaml.dump({
      agentsMappingPath: './.agents/mapping.yaml',
    });
    tree.write(options.configFilePath, pluginConfig);
  });

  it('should upsert an agent into the mapping file', async () => {
    await agentGeneratorGenerator(tree, options);

    const mappingPath = './.agents/mapping.yaml';
    expect(tree.exists(mappingPath)).toBeTruthy();

    const mappingContent = tree.read(mappingPath, 'utf-8');
    expect(mappingContent).toBeDefined();
    const mappingObj = yaml.load(mappingContent) as AgentMapping;

    expect(mappingObj.agents).toBeDefined();
    expect(mappingObj.agents['testAgent']).toEqual({
      type: 'go',
      promptTemplate: 'You are a Go expert. Please review the diff.',
    });
  });

  it('should update an existing agent without removing other agents', async () => {
    const initialMapping: AgentMapping = {
      agents: {
        existingAgent: {
          type: 'python',
          promptTemplate: 'You are a Python expert.',
        },
      },
    };
    tree.write('./.agents/mapping.yaml', yaml.dump(initialMapping));

    await agentGeneratorGenerator(tree, options);

    const mappingContent = tree.read('./.agents/mapping.yaml', 'utf-8');
    const mappingObj = yaml.load(mappingContent) as AgentMapping;

    expect(mappingObj.agents.existingAgent).toEqual({
      type: 'python',
      promptTemplate: 'You are a Python expert.',
    });
    expect(mappingObj.agents['testAgent']).toEqual({
      type: 'go',
      promptTemplate: 'You are a Go expert. Please review the diff.',
    });
  });
});

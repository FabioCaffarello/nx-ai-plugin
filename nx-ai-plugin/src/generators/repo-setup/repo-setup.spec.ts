import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import * as yaml from 'js-yaml';
import { repoSetupGenerator } from './repo-setup';
import { RepoSetupGeneratorSchema } from './schema';

describe('repoSetupGenerator', () => {
  let tree: Tree;
  const options: RepoSetupGeneratorSchema = {
    configFilePath: 'nx-ai-plugin.config.yaml',
    credentialsPath: '~/.config/nx-ai-plugin/my-monorepo',
    templatesPath: './.agents/templates',
    vectorStoreType: 'qdrant',
    vectorStoreHost: 'localhost',
    vectorStorePort: 6333,
    agentsMappingPath: './.agents/mapping.yaml',
    backendUrl: 'http://localhost:5000',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should create a YAML config file with the correct content from the template', async () => {
    await repoSetupGenerator(tree, options);

    // Verify that the config file was created.
    expect(tree.exists(options.configFilePath)).toBeTruthy();

    // Read and parse the generated YAML config file.
    const fileContent = tree.read(options.configFilePath, 'utf-8');
    expect(fileContent).toBeDefined();
    const parsed = yaml.load(fileContent);

    // Expected configuration object.
    const expectedConfig = {
      credentialsPath: options.credentialsPath,
      templatesPath: options.templatesPath,
      vectorStore: {
        type: options.vectorStoreType,
        host: options.vectorStoreHost,
        port: options.vectorStorePort,
      },
      agentsMappingPath: options.agentsMappingPath,
      backendUrl: options.backendUrl,
    };

    expect(parsed).toEqual(expectedConfig);
  });

  it('should create an agents mapping file with default content if it does not exist', async () => {
    await repoSetupGenerator(tree, options);

    // Verify that the agents mapping file was created.
    expect(tree.exists(options.agentsMappingPath)).toBeTruthy();

    // Read and parse the mapping file.
    const mappingContent = tree.read(options.agentsMappingPath, 'utf-8');
    expect(mappingContent).toBeDefined();
    const parsedMapping = yaml.load(mappingContent);

    // Expected default mapping content (an empty agents object).
    const expectedMapping = { agents: {} };

    expect(parsedMapping).toEqual(expectedMapping);
  });
});

import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { 
  agentGeneratorGenerator,
  AgentGeneratorGeneratorSchema,
  repoSetupGenerator, 
  RepoSetupGeneratorSchema, 
  setupCredentialsGenerator, 
  SetupCredentialsGeneratorSchema 
} from '@nx-ai-plugin';

// Define interfaces for parsed YAML data.
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

interface Credentials {
  openApiKey?: string;
}

describe('nx-ai-plugin e2e', () => {
  let tree: Tree;

  describe('Repo Setup Generator', () => {
    const repoSetupOptions: RepoSetupGeneratorSchema = {
      configFilePath: './.agents/nx-ai-plugin.config.yaml',
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
      // Ensure the .agents folder exists.
      tree.write('.agents/.keep', '');
    });

    it('should generate the plugin config file with the correct content and create the mapping file', async () => {
      await repoSetupGenerator(tree, repoSetupOptions);

      // Verify config file exists.
      expect(tree.exists(repoSetupOptions.configFilePath)).toBeTruthy();
      const configContent = tree.read(repoSetupOptions.configFilePath, 'utf-8');
      const config = yaml.load(configContent) as PluginConfig;
      expect(config.agentsMappingPath).toEqual(
        repoSetupOptions.agentsMappingPath
      );

      // Verify that the agents mapping file was created with default content.
      expect(tree.exists(repoSetupOptions.agentsMappingPath)).toBeTruthy();
      const mappingContent = tree.read(
        repoSetupOptions.agentsMappingPath,
        'utf-8'
      );
      const mapping = yaml.load(mappingContent) as AgentMapping;
      expect(mapping).toEqual({ agents: {} });
    });
  });

  describe('Setup Credentials Generator', () => {
    let tempHome: string;
    const credentialsOptions: SetupCredentialsGeneratorSchema = {
      openApiKey: 'dummy-api-key',
    };

    beforeEach(() => {
      tree = createTreeWithEmptyWorkspace();
      // Create a temporary directory to simulate a user's home directory.
      tempHome = fs.mkdtempSync(path.join(os.tmpdir(), 'test-home-'));
      // Override os.homedir() to return the temporary directory.
      jest.spyOn(os, 'homedir').mockReturnValue(tempHome);
    });

    afterEach(() => {
      fs.rmSync(tempHome, { recursive: true, force: true });
      jest.restoreAllMocks();
    });

    it('should create a credentials file in the simulated home directory with the provided API key', async () => {
      await setupCredentialsGenerator(tree, credentialsOptions);
      const configDir = path.join(tempHome, '.config', 'nx-ai-plugin');
      const credFilePath = path.join(configDir, 'credentials.yaml');
      expect(fs.existsSync(credFilePath)).toBeTruthy();
      const fileContent = fs.readFileSync(credFilePath, 'utf8');
      const parsed = yaml.load(fileContent) as Credentials;
      expect(parsed.openApiKey).toEqual('dummy-api-key');
    });
  });

  describe('Agent Generator Generator', () => {
    const repoSetupOptions: RepoSetupGeneratorSchema = {
      configFilePath: './.agents/nx-ai-plugin.config.yaml',
      credentialsPath: '~/.config/nx-ai-plugin/my-monorepo',
      templatesPath: './.agents/templates',
      vectorStoreType: 'qdrant',
      vectorStoreHost: 'localhost',
      vectorStorePort: 6333,
      agentsMappingPath: './.agents/mapping.yaml',
      backendUrl: 'http://localhost:5000',
    };

    // Options for upserting a new agent.
    const agentOptions: AgentGeneratorGeneratorSchema & {
      configFilePath: string;
    } = {
      agentName: 'goAgent',
      agentType: 'go',
      promptTemplate:
        'You are a Go expert. Please review the diff and suggest improvements.',
      configFilePath: repoSetupOptions.configFilePath,
    };

    beforeEach(async () => {
      tree = createTreeWithEmptyWorkspace();
      // Create the .agents folder.
      tree.write('.agents/.keep', '');
      // Run the repo setup generator to create config and mapping files.
      await repoSetupGenerator(tree, repoSetupOptions);
    });

    it('should upsert a new agent in the mapping file using plugin config', async () => {
      await agentGeneratorGenerator(tree, agentOptions);
      // Read the updated mapping file.
      const mappingContent = tree.read(
        repoSetupOptions.agentsMappingPath,
        'utf-8'
      );
      const mapping = yaml.load(mappingContent) as AgentMapping;
      expect(mapping.agents).toHaveProperty('goAgent');
      expect(mapping.agents.goAgent).toEqual({
        type: agentOptions.agentType,
        promptTemplate: agentOptions.promptTemplate,
      });
    });

    it('should update an existing agent without removing other agents', async () => {
      // Pre-populate the mapping file with an existing agent.
      const initialMapping: AgentMapping = {
        agents: {
          existingAgent: {
            type: 'python',
            promptTemplate: 'You are a Python expert.',
          },
        },
      };
      tree.write(repoSetupOptions.agentsMappingPath, yaml.dump(initialMapping));

      // Run the agent generator to upsert "goAgent".
      await agentGeneratorGenerator(tree, agentOptions);

      const mappingContent = tree.read(
        repoSetupOptions.agentsMappingPath,
        'utf-8'
      );
      const mapping = yaml.load(mappingContent) as AgentMapping;

      // Verify that the existing agent remains.
      expect(mapping.agents.existingAgent).toEqual({
        type: 'python',
        promptTemplate: 'You are a Python expert.',
      });
      // Verify that the new agent "goAgent" is added.
      expect(mapping.agents.goAgent).toEqual({
        type: agentOptions.agentType,
        promptTemplate: agentOptions.promptTemplate,
      });
    });
  });
});

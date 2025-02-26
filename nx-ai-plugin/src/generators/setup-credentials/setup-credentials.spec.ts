import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { setupCredentialsGenerator } from './setup-credentials';
import { SetupCredentialsGeneratorSchema } from './schema';

// Define an interface for the expected credentials.
interface Credentials {
  openApiKey: string;
}

describe('setup-credentials generator', () => {
  let tree: Tree;
  let tempHome: string;
  const options: SetupCredentialsGeneratorSchema = {
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
    // Clean up the temporary directory.
    fs.rmSync(tempHome, { recursive: true, force: true });
    jest.restoreAllMocks();
  });

  it('should create a credentials file with correct content', async () => {
    await setupCredentialsGenerator(tree, options);

    // The generator writes the credentials file to ~/.config/nx-ai-plugin/credentials.yaml
    const configDir = path.join(tempHome, '.config', 'nx-ai-plugin');
    const credFilePath = path.join(configDir, 'credentials.yaml');
    expect(fs.existsSync(credFilePath)).toBeTruthy();

    const fileContent = fs.readFileSync(credFilePath, 'utf8');
    const parsed = yaml.load(fileContent) as Credentials;
    expect(parsed.openApiKey).toEqual('dummy-api-key');
  });
});

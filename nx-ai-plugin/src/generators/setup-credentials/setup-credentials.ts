import { Tree, formatFiles } from '@nx/devkit';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { SetupCredentialsGeneratorSchema } from './schema';
import { getExistingYaml } from '@nx-ai-plugin-core/os';

interface Credentials {
  openApiKey?: string;
}

export async function setupCredentialsGenerator(
  tree: Tree,
  options: SetupCredentialsGeneratorSchema
) {
  const homeDir = os.homedir();

  const configDir = path.join(homeDir, '.config', 'nx-ai-plugin');

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const credFilePath = path.join(configDir, 'credentials.yaml');

  const existingCreds: Credentials = getExistingYaml(credFilePath, {});

  if (options.openApiKey) {
    existingCreds.openApiKey = options.openApiKey;
  }

  const yamlStr = yaml.dump(existingCreds);

  fs.writeFileSync(credFilePath, yamlStr, 'utf-8');

  await formatFiles(tree);
}

export default setupCredentialsGenerator;

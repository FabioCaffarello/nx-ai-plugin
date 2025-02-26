import { Tree, formatFiles } from '@nx/devkit';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { SetupCredentialsGeneratorSchema } from './schema';

// Define an interface for the credentials
interface Credentials {
  openApiKey?: string;
}

export async function setupCredentialsGenerator(
  tree: Tree,
  options: SetupCredentialsGeneratorSchema
) {
  const homeDir = os.homedir();

  // Define the configuration directory. For simplicity, we use:
  // ~/.config/nx-ai-plugin
  const configDir = path.join(homeDir, '.config', 'nx-ai-plugin');

  // Ensure that the configuration directory exists.
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  // Define the credentials file path.
  // In this example, we store the file as "credentials.yaml" in the config directory.
  const credFilePath = path.join(configDir, 'credentials.yaml');

  // Load existing credentials if the file exists; otherwise initialize an empty object.
  let existingCreds: Credentials = {};
  if (fs.existsSync(credFilePath)) {
    const fileContent = fs.readFileSync(credFilePath, 'utf-8');
    existingCreds = (yaml.load(fileContent) as Credentials) || {};
  }

  // Update or add the openApiKey if provided.
  if (options.openApiKey) {
    existingCreds.openApiKey = options.openApiKey;
  }

  // Dump the updated credentials to a YAML string.
  const yamlStr = yaml.dump(existingCreds);

  // Write the YAML string to the credentials file.
  fs.writeFileSync(credFilePath, yamlStr, 'utf-8');

  // Optionally, format files in the virtual Tree (if needed for workspace files).
  await formatFiles(tree);
}

export default setupCredentialsGenerator;

import { Tree, generateFiles, formatFiles, joinPathFragments } from '@nx/devkit';
import { RepoSetupGeneratorSchema } from './schema';
import * as yaml from 'js-yaml';
import * as path from 'path';

export async function repoSetupGenerator(
  tree: Tree,
  options: RepoSetupGeneratorSchema
) {
  // Prepare template options; add a 'tmpl' property per Nx convention and the file name.
  const templateOptions = {
    ...options,
    tmpl: '',
    configFileName: path.basename(options.configFilePath)
  };

  // Determine the destination folder for the config file.
  const destination = path.dirname(options.configFilePath);

  // Get the absolute path of the template folder.
  const templateDir = joinPathFragments(__dirname, 'files');

  // Generate the configuration file from the template.
  // The template file should be named "nx-ai-plugin.config.yaml__tmpl__"
  // so that when processed it becomes "nx-ai-plugin.config.yaml" in the destination.
  generateFiles(tree, templateDir, destination, templateOptions);

  // Check if the agentsMappingPath file exists; if not, create it with default content.
  if (!tree.exists(options.agentsMappingPath)) {
    const defaultMapping = { agents: {} };
    const yamlContent = yaml.dump(defaultMapping);
    tree.write(options.agentsMappingPath, yamlContent);
  }

  await formatFiles(tree);
}

export default repoSetupGenerator;

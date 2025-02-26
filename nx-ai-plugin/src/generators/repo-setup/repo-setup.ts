import {
  Tree,
  generateFiles,
  formatFiles,
  joinPathFragments,
} from '@nx/devkit';
import { RepoSetupGeneratorSchema } from './schema';
import * as yaml from 'js-yaml';
import * as path from 'path';
import { fileExists } from '@nx-ai-plugin-core/os';

export async function repoSetupGenerator(
  tree: Tree,
  options: RepoSetupGeneratorSchema
) {
  const templateOptions = {
    ...options,
    tmpl: '',
    configFileName: path.basename(options.configFilePath),
  };

  const destination = path.dirname(options.configFilePath);

  const templateDir = joinPathFragments(__dirname, 'files');

  generateFiles(tree, templateDir, destination, templateOptions);

  if (!fileExists(options.agentsMappingPath, tree)) {
    const defaultMapping = { agents: {} };
    const yamlContent = yaml.dump(defaultMapping);
    tree.write(options.agentsMappingPath, yamlContent);
  }

  await formatFiles(tree);
}

export default repoSetupGenerator;

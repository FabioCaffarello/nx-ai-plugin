import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { Tree } from '@nx/devkit';


export function getExistingYaml(
  credFilePath: string,
  defaultCreds: Record<string, any> = {}
): Record<string, any> {
  if (fs.existsSync(credFilePath)) {
    try {
      const fileContent = fs.readFileSync(credFilePath, 'utf-8');
      return (yaml.load(fileContent) as Record<string, any>) || {};
    } catch (error) {
      console.error('Failed to parse YAML:', error);
      return {};
    }
  }
  return defaultCreds;
}

export function fileExists(filePath: string, tree?: Tree): boolean {
  try {
    if (tree) {
      return tree.exists(filePath);
    }
    return fs.existsSync(filePath);
  } catch (error) {
    console.error('Error checking file existence:', error);
    return false;
  }
}

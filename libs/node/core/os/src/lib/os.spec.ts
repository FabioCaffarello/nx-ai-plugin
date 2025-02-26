import * as fs from 'fs';
import { fileExists , getExistingYaml } from './os';
import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';


// Mock `fs` first
jest.mock('fs');

// Mock `js-yaml` properly
jest.mock('js-yaml', () => ({
  load: jest.fn(() => ({})), // Ensure it returns a valid object
  dump: jest.fn(),
}));

// Import AFTER mocking `js-yaml`
import * as yaml from 'js-yaml';

describe('getExistingCreds', () => {
  const credFilePath = '/path/to/credentials.yaml';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return parsed credentials when file exists', () => {
    const mockCredentials = { openApiKey: 'test-key' };
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('openApiKey: test-key');
    (yaml.load as jest.Mock).mockReturnValue(mockCredentials); // Ensure `yaml.load` is mocked

    const result = getExistingYaml(credFilePath);
    expect(result).toEqual(mockCredentials);
  });

  it('should return default credentials when file does not exist', () => {
    const defaultCreds = { fallbackKey: 'default' };
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const result = getExistingYaml(credFilePath, defaultCreds);
    expect(result).toEqual(defaultCreds);
  });

  it('should return an empty object if file exists but is empty', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('');
    (yaml.load as jest.Mock).mockReturnValue(null); // Ensure `yaml.load` returns null

    const result = getExistingYaml(credFilePath);
    expect(result).toEqual({});
  });

  it('should return an empty object if file content is invalid YAML', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('invalid_yaml: : :');
    (yaml.load as jest.Mock).mockImplementation(() => {
      throw new Error('YAML parse error');
    });

    const result = getExistingYaml(credFilePath);
    expect(result).toEqual({});
  });
});


describe('fileExists', () => {
  let tree: Tree;

  beforeEach(() => {
    jest.resetAllMocks();
    tree = createTreeWithEmptyWorkspace();
  });

  it('should return true if the file exists in the real filesystem', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    expect(fileExists('/path/to/existing-file')).toBe(true);
  });

  it('should return false if the file does not exist in the real filesystem', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    expect(fileExists('/path/to/missing-file')).toBe(false);
  });

  it('should return false if an error occurs while checking the real filesystem', () => {
    (fs.existsSync as jest.Mock).mockImplementation(() => {
      throw new Error('Permission denied');
    });

    expect(fileExists('/path/to/protected-file')).toBe(false);
  });

  it('should return true if the file exists in the virtual Tree', () => {
    tree.write('/virtual/path/existing-file', 'content'); // Create file in the virtual Tree

    expect(fileExists('/virtual/path/existing-file', tree)).toBe(true);
  });

  it('should return false if the file does not exist in the virtual Tree', () => {
    expect(fileExists('/virtual/path/missing-file', tree)).toBe(false);
  });
});
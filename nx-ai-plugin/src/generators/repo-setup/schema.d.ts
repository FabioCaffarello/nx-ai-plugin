export interface RepoSetupGeneratorSchema {
  configFilePath: string;
  credentialsPath: string;
  templatesPath: string;
  vectorStoreType: string;
  vectorStoreHost: string;
  vectorStorePort: number;
  agentsMappingPath: string;
  backendUrl: string;
}

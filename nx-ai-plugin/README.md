# NX AI Plugin

<!-- TODO: -->

## ⚙️ Configuration

Initialize the plugin and generate required configurations using Nx generators:

```bash
npx nx generate nx-ai-plugin:repo-setup
```

This will create the configuration file at `.agents/nx-ai-plugin.config.yaml` with default settings.

Securely set up API credentials:

```bash
npx nx generate nx-ai-plugin:setup-credentials --openApiKey="YOUR_OPENAI_API_KEY"
```

## 🛠 Generators

### **Repo Setup Generator**
Initializes the plugin configuration and sets up the agents mapping file.

```bash
npx nx generate nx-ai-plugin:repo-setup
```

### **Setup Credentials Generator**
Stores API keys securely for authentication.

```bash
npx nx generate nx-ai-plugin:setup-credentials --openApiKey="YOUR_OPENAI_API_KEY"
```

### **Agent Generator**
Adds a new AI agent to the configuration, enabling AI-based automation for your Nx projects.

```bash
npx nx generate nx-ai-plugin:agent-generator \
  --agentName="goAgent" \
  --agentType="go" \
  --promptTemplate="You are a Go expert. Please review the diff and suggest improvements." \
  --configFilePath="./.agents/nx-ai-plugin.config.yaml"
```

## 🏃‍♂️ Executors




## ✅ Running Tests

Run unit tests via [Jest](https://jestjs.io):

```bash
npx nx test nx-ai-plugin
```

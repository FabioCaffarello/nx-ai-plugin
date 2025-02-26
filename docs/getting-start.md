# Getting Started with NX AI Plugin

Welcome to the **NX AI Plugin**! This guide will walk you through the initial setup and configuration to integrate AI-powered agents into your Nx monorepo.

## 📌 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or later)
- **Nx CLI** (`npm install -g nx` or use `npx nx`)
- **Docker** (for running the backend AI service)

## 🚀 Installation

To install the NX AI Plugin in your monorepo, run:

```bash
npm install nx-ai-plugin --save-dev
```

Or if using yarn:

```bash
yarn add nx-ai-plugin --dev
```

After installation, verify the plugin is recognized:

```bash
npx nx list
```

## ⚙️ Configuration

The NX AI Plugin requires a **YAML configuration file** to define key settings. This file is generated using the **Repo Setup Generator** and should be placed in `.agents/nx-ai-plugin.config.yaml`.

### **Example Configuration:**

```yaml
credentialsPath: "~/.config/nx-ai-plugin/{monorepo-name}"
templatesPath: "./.agents/templates"

vectorStore:
  type: "qdrant"
  host: "localhost"
  port: 6333

agentsMappingPath: "./.agents/mapping.yaml"
backendUrl: "http://localhost:5000"
```

To generate this file, run:

```bash
npx nx generate nx-ai-plugin:repo-setup
```

## 🔑 Credentials Setup

The **Setup Credentials Generator** securely stores your API keys for authentication.

**Usage:**
```bash
npx nx generate nx-ai-plugin:setup-credentials --openApiKey="YOUR_OPENAI_API_KEY"
```

This will create a file at `~/.config/nx-ai-plugin/credentials.yaml` with your credentials securely stored.

## ✅ Next Steps

Now that you’ve installed and configured the plugin, explore the following:

- **[Generators](generators.md)** – Learn how to create and manage AI agents.
- **[Executors](executors.md)** – Automate AI-powered tasks within your monorepo.
- **[Usage Examples](usage-examples.md)** – Practical use cases to maximize the plugin’s potential.

For further details, check out the [Full Documentation](index.md).
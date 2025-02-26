# NX AI Plugin

Welcome to **NX AI Plugin** – a powerful tool for integrating AI-powered agents into your **Nx monorepo**. This plugin helps automate code quality, enforce architectural standards, and optimize development workflows by leveraging **AI-driven capabilities** and **context-aware vector-based interactions**.

[![Build Status](https://img.shields.io/github/actions/workflow/status/FabioCaffarello/nx-ai-plugin/ci.yml?branch=main)](https://github.com/FabioCaffarello/nx-ai-plugin/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Overview

The **NX AI Plugin** transforms your Nx monorepo into an **intelligent development environment** by managing specialized AI agents. These agents assist in various tasks such as:

- **Automated code review and suggestions**
- **Refactoring recommendations**
- **Architecture validation**
- **Integration with a vector store for context-based interactions**
- **AI-driven continuous improvement for your projects**

The plugin is structured in the following core components:

1. **Generators** – Automate the setup and management of AI agents.
2. **Executors** – Execute AI-based tasks, like analyzing changes and providing insights.
3. **Backend Python Service** – Handles AI processing and interacts with the vector store.
4. **Vector Store Integration** – Stores contextual project data to enhance AI responses.

---

## 🚀 Getting Started

### **Prerequisites**
Ensure you have the following installed:

- **Node.js** (v20 or later)
- **Nx CLI** (`npm install -g nx` or use `npx nx`)
- **Docker** (for running the backend AI service)

### **Installation**
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

---

## ⚙️ Configuration

The plugin requires a **YAML configuration file** to define key settings. This file is generated using the **Repo Setup Generator** and should be placed in `.agents/nx-ai-plugin.config.yaml`.

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

---

## 🛠️ Generators

### **Repo Setup Generator**
Initializes the plugin configuration and creates the agents mapping file.

**Usage:**
```bash
npx nx generate nx-ai-plugin:repo-setup
```

### **Setup Credentials Generator**
Securely stores API keys (e.g., OpenAI API Key) for authentication.

**Usage:**
```bash
npx nx generate nx-ai-plugin:setup-credentials --openApiKey="YOUR_OPENAI_API_KEY"
```

### **Agent Generator**
Adds a new AI agent to the `agentsMappingPath` configuration file.

**Usage:**
```bash
npx nx generate nx-ai-plugin:agent-generator \
  --agentName="goAgent" \
  --agentType="go" \
  --promptTemplate="You are a Go expert. Please review the diff and suggest improvements." \
  --configFilePath="./.agents/nx-ai-plugin.config.yaml"
```

---

## ⚡ Executors
Executors allow you to run AI-driven tasks within your Nx monorepo. More details will be added as the functionality expands.

---

## 📌 Usage Examples

1. **Set up the repository configuration:**
   ```bash
   npx nx generate nx-ai-plugin:repo-setup
   ```

2. **Securely store your API credentials:**
   ```bash
   npx nx generate nx-ai-plugin:setup-credentials --openApiKey="YOUR_OPENAI_API_KEY"
   ```

3. **Add a new AI agent:**
   ```bash
   npx nx generate nx-ai-plugin:agent-generator --agentName="typescriptAgent" --agentType="ts"
   ```

4. **Run AI-powered analysis (coming soon)**

---

## 💡 Contributing
We welcome contributions! To get started:

For more details, check out the [CONTRIBUTING.md](CONTRIBUTING.md).

---

## ❓ FAQ

**Q: What AI models can I use with this plugin?**
A: Currently, OpenAI models are supported, but we plan to expand compatibility with other providers.

**Q: How does the vector store work?**
A: The plugin integrates with **Qdrant** for storing and retrieving project-related embeddings to enhance AI context awareness.

**Q: Can I add custom AI agents?**
A: Yes! The **Agent Generator** allows you to define custom AI agents tailored to your needs.

---

## 📚 Additional Resources
- [Nx Documentation](https://nx.dev/)

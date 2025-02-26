# NX AI Plugin


Welcome to **NX AI Plugin** – your next-generation solution for automating code quality, enforcing architectural standards, and enhancing developer productivity in your Nx monorepo. With advanced AI-driven capabilities, our plugin empowers you to create, manage, and customize multiple specialized agents that seamlessly integrate into your development workflow.

[![Build Status](https://img.shields.io/github/actions/workflow/status/FabioCaffarello/nx-ai-plugin/ci.yml?branch=main)](https://github.com/FabioCaffarello/nx-ai-plugin/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Overview

The **NX AI Plugin** transforms your Nx monorepo into an intelligent, self-improving ecosystem by combining the power of multiple AI agents with context-aware vector-based prompt interactions. Its core components include:

---

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
  - [Plugin Config File](#plugin-config-file)
  - [Credentials Setup](#credentials-setup)
- [Generators](#generators)
  - [Repo Setup Generator](#repo-setup-generator)
  - [Setup Credentials Generator](#setup-credentials-generator)
  - [Agent Generator](#agent-generator)
- [Executors](#executors)
- [Usage Examples](#usage-examples)
- [CI Integration](#ci-integration)
- [Contributing](#contributing)
- [FAQ](#faq)
- [Additional Resources](#additional-resources)

---

## Configuration
Before you begin, ensure you have the following installed:

- **Node.js** (v20 or later)
- **Nx CLI** (if not installed globally, use `npx nx`)
- **Docker**

### Plugin Config File

The **Repo Setup Generator** creates a centralized YAML configuration file (e.g., `./.agents/nx-ai-plugin.config.yaml`) that defines key settings:

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

To generate or update this file, run:

```bash
npx nx generate nx-ai-plugin:repo-setup
```

### Credentials Setup

The **Setup Credentials Generator** securely stores your OpenAI API key (and other credentials) in your home directory. For example, run:

```bash
npx nx generate nx-ai-plugin:setup-credentials --openApiKey="YOUR_OPENAI_API_KEY"
```

This will create or update a file at `~/.config/nx-ai-plugin/credentials.yaml`.

---

## Generators

### Repo Setup Generator

Initializes the plugin configuration and creates the agents mapping file with default values.

**Usage:**

```bash
npx nx generate nx-ai-plugin:repo-setup
```

### Setup Credentials Generator

Upserts your API keys into a YAML file in your home directory for secure credential management.

**Usage:**

```bash
npx nx generate nx-ai-plugin:setup-credentials --openApiKey="YOUR_OPENAI_API_KEY"
```

### Agent Generator

Upserts a new agent into the agents mapping file. It reads the `agentsMappingPath` from the plugin config and updates it with the provided agent details.

**Usage:**

```bash
npx nx generate nx-ai-plugin:agent-generator --agentName="goAgent" --agentType="go" --promptTemplate="You are a Go expert. Please review the diff and suggest improvements." --configFilePath="./.agents/nx-ai-plugin.config.yaml"
```
# Contributing to NX AI Plugin

Thank you for your interest in contributing to the NX AI Plugin! We welcome contributions from the community and value your ideas, bug reports, and pull requests. By contributing to this project, you help us improve its quality, functionality, and usability for everyone using Nx monorepos.

## Table of Contents

- [Getting Started](#getting-started)
- [Code of Conduct](#code-of-conduct)
- [Reporting Issues](#reporting-issues)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Commit Messages](#commit-messages)
- [Documentation](#documentation)
- [Additional Resources](#additional-resources)

## Getting Started

Before you begin, please ensure you have the following installed:

- **Node.js** (v20 or later)
- **Nx CLI** (if not installed globally, you can use `npx nx`)
- **Python** (3.12 or later)
    - **Poetry** (2.1.1 or later)
- **Docker**

To set up your development environment:

1. **Fork the Repository:**  
   Click the "Fork" button on the GitHub page to create your own copy.

2. **Clone Your Fork Locally:**  
   ```bash
   git clone https://github.com/<your-username>/nx-ai-plugin.git
   cd nx-ai-plugin
   ```

3. **Install Dependencies:**  
    Install the Node dependencies:
    ```bash
    npm install
    ```
    Then, install the Python dependencies using Poetry:
    ```bash
    poetry install --no-root
    ```

4. **Setup Husky**
    Husky is used to manage Git hooks and ensure code quality before commits. To set it up, run:
    ```bash
    npm rum prepare
    ```

5. **Run the Linter**
    ```bash
    npx nx lint <project>
    ```

6. **Run Affected Projects**
    ```bash
    npx nx affected -t <command>
    ```

## Reporting Issues

If you encounter a bug or have a feature request, please check the [issue tracker](https://github.com/FabioCaffarello/nx-ai-plugin/issues) first to see if it has already been reported. If not, open a new issue with a clear description and steps to reproduce the problem.

## Pull Request Guidelines

We appreciate your contributions! To ensure a smooth review process, please follow these guidelines:

- **Fork the Repository and Create a Branch:**  
  Create a branch off of `main` for your feature or bug fix:
  ```bash
  git checkout -b feat/my-new-feature
  ```

- **Write Tests:**  
  Ensure that any new functionality is covered by unit and/or e2e tests. Our tests are run using Nx's testing utilities and Jest.

- **Follow the Coding Standards:**  
  Write clean, readable code that adheres to our TypeScript, ESLint, and Prettier configurations.

- **Update Documentation:**  
  Update the documentation (including this CONTRIBUTING file if necessary) to reflect changes or new features.

- **Submit a Pull Request:**  
  Once your changes are complete and tested, open a pull request (PR) against the `main` branch. Include a clear title and description, referencing any related issues.

## Coding Standards

- **Language:**  
  Use TypeScript for plugin development. Follow the style guidelines enforced by ESLint and Prettier.
- **File Organization:**  
  Maintain a clear directory structure—generators in `src/generators/`, executors in `src/executors/`, etc.
- **Comments and Documentation:**  
  Write clear comments and update documentation when you modify functionality.

## Testing

- **Unit Tests:**  
  Write unit tests for any new functionality using Jest and Nx DevKit's testing utilities.
- **End-to-End (E2E) Tests:**  
  Ensure that your changes integrate correctly in a simulated Nx workspace. Run:
  ```bash
  npx nx e2e nx-ai-plugin-e2e
  ```
- **Continuous Integration:**  
  Our CI pipeline (configured in `.github/workflows/ci.yml` and `nx-main.yml`) runs tests and lint checks on every PR.

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org) standard. Use the following prefixes for your commit messages:

- **feat:** for new features
- **fix:** for bug fixes
- **docs:** for documentation changes
- **style:** for formatting changes (white-space, etc.)
- **refactor:** for code refactoring without feature changes
- **test:** for adding or updating tests
- **chore:** for changes that don't modify src or test files

Example:
```
feat(agent-generator): add support for upserting new agents
```

## Documentation

- **Site Documentation:**  
  Our documentation is hosted on GitHub Pages: [NX AI Plugin Docs](https://fabiocaffarello.github.io/nx-ai-plugin/).
- **Writing Docs:**  
  When you add new features or change functionality, update the corresponding markdown files in the `docs/` directory. We use MkDocs with the Material theme for a modern, responsive documentation site.
- **Generating API Documentation:**  
  We leverage tools like `mkdocstrings` to generate API references from our TypeScript and Python code. Ensure that any public interfaces are well-documented.

## Additional Resources

- [Nx Documentation](https://nx.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Jest Documentation](https://jestjs.io)
- [Conventional Commits](https://www.conventionalcommits.org)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)

## Thank You

Thank you for contributing to NX AI Plugin! Your help makes this project better for everyone, and we appreciate your dedication to high-quality, maintainable code.

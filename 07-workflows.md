# Module 07: Automating builds with Workflows

### Goal

Create a workflow that automatically checks if we should rebuild the native app or publish an update

### Concepts

- Integrating GitHub to your EAS project.
- Learn how to use EAS Workflows and to automate the process of building and updating your app.

### Tasks

1. Create a GitHub repository
2. Set up the GitHub integration for your EAS project.
3. Create a workflow flow using pre-packaged jobs
4. Trigger build automatically when a new tag is pushed.

### Resources

- https://docs.expo.dev/eas/workflows/get-started/
- https://docs.expo.dev/eas/workflows/pre-packaged-jobs/
- https://docs.expo.dev/eas/workflows/syntax/

# Exercises

1. Create a new GitHub repository by accessing https://github.com/new

2. Set you git to use the new repository as a remote by running the following commands:

```bash
git remote remove origin
git remote add origin git@github.com:[owner]/[repo].git
```

3. Configure your project EAS Workflows require a GitHub repository that's linked to your EAS project to run. You can link a GitHub repo to your EAS project with the following steps:

- Create a GitHub repository for your Expo project if you haven't already.
- Navigate to your project's GitHub settings. https://expo.dev/accounts/[username]/projects/[project-slug]/github

4. Create a directory named `.eas/workflows` at the root of your project with a YAML file inside of it. For example: `.eas/workflows/deploy-to-production.yml`.

## See the solution

Ensure that your project is set up with correctly and EAS is able to compute fingerprints by running the following command:

```
npx -y eas-cli@latest fingerprint:generate --platform android --non-interactive --json
```


You can also manually trigger a workflow by running the following command:

```bash
eas workflow:run .eas/workflows/deploy-to-production.yml
```

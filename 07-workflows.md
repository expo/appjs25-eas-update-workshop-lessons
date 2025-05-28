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

2. Set you git to use the new repository as remote by running the following commands:

```bash
git remote remove origin
git remote add origin git@github.com:[owner]/[repo].git
```

3. Link your EAS project to the new GitHub repository by navigating to your project's GitHub settings. https://expo.dev/accounts/[username]/projects/[project-slug]/github

4. With the setup ready, let's create a directory named `.eas/workflows` at the root of our project and copy the `deploy-to-production` YAML file inside from the`files/07`folder.

5. Open the `.eas/workflows/deploy-to-production.yml` and inspect the pre-packaged jobs.

Before triggering the workflow, ensure that your project is set up with correctly and EAS is able to compute fingerprints by running the following command:

```
npx -y eas-cli@latest fingerprint:generate --platform android --non-interactive --json
```

6. Now to trigger the workflow, commit this new file, create a tag named v1 and push changes.

You can also manually trigger a workflow by running the following command:

```bash
eas workflow:run .eas/workflows/deploy-to-production.yml
```

7. Open the [EAS dashboard](https://expo.dev/accounts/[username]/projects/[project-slug]/workflows) and check the status of your workflow.

![workflows](/assets/07/workflows.png)

## See the solution

Switch to the [milestones branch](https://github.com/expo/appjs25-eas-update-workshop-code/commits/milestones/)

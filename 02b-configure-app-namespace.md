# Module 02b: Configure app namespace

### Goal

We previously created a development bundle identifier (iOS) or package (Android) for our app. We'll use Expo Environment Variables to set the bundle identifier and package name based on the environment, so we can install the development build alongside our preview build.

### Concepts

- It's easier to see the changes in the app if we can install the development build alongside the preview build.
- The incremental changes made in development will hot reload in the development build, but not in the preview build.
- Whenever we push out a new update, we can see it work in the preview build, since the development build only loads updates from the Extensions tab.
- We can use Expo Environment Variables to set the bundle identifier and package name based on the environment. Another alternative is `.env`.

### Tasks

- Make an `APP_VARIANT` environment variable.
- Make sure it is resolved properly by running `TODO`
- Convert `app.json` to `app.config.js` so we can use the environment variable for the bundle identifier and package name.

### Resources

- [All your Environment Variable options](https://docs.expo.dev/guides/environment-variables)
- [Environment Variables in EAS](https://docs.expo.dev/eas/environment-variables/)
- [app.config.js](https://docs.expo.dev/workflow/configuration/#dynamic-configuration)

# Exercises

## Create an environment variable in your project

1. Create your environment variables in the command line:

```bash
# dev
npx eas env:create --scope=project --name APP_VARIANT --value development --environment development --visibility=plaintext

# preview
npx eas env:create --scope=project --name APP_VARIANT --value preview --environment preview --visibility=plaintext

# production
npx eas env:create --scope=project --name APP_VARIANT --value production --environment production --visibility=plaintext
```

You can also create them in the [website](https://expo.dev/accounts/[account]/projects/[project]/environment-variables) too.

2 Ensure the environment variable is resolved

```bash
npx eas env:list --environment development

npx eas env:list --environment preview

npx eas env:list --environment production
```

You can also view it in the [environment variables page in the website](https://expo.dev/accounts/[account]/projects/[project]/environment-variables).

![website env vars](/assets/02/website-env-vars.png)

## Dynamically resolve namespace in `app.config.js`

1. Convert your `app.json` to `app.config.js`:

```bash
mv app.json app.config.js
```

2. Update `app.config.js` to export the original `app.json`

```js
module.exports = () => {
  return {
    expo: {
      name: "Art Museum",
      ...
    }
  };
};
```

3. Verify it still gets resolved by running:

```bash
npx expo config --type public
```

4. Update the `app.config.js` to use the environment variable for the bundle identifier and package name:

```diff
module.exports = () => {
+  const appVariant = process.env.APP_VARIANT || "development";

  return {
    expo: {
      name: "Art Museum",
      ios: {
-      bundleIdentifier: "com.expo.appjs25updateworkshopcode.[your-username].development"
+        bundleIdentifier: `com.expo.appjs25updateworkshopcode.[your-username].${appVariant}`,
      },
      android: {
-      package: "com.expo.appjs25updateworkshopcode.[your-username].development"
+        package: `com.expo.appjs25updateworkshopcode.[your-username].${appVariant}`,
      },
      // other configurations...
    },
  };
};
```

5. We want to visually differentiate the dev build from the preview one, so let's change the icon too.

```diff
module.exports = () => {
  const appVariant = process.env.APP_VARIANT || "development";

  return {
    expo: {
      name: "Art Museum",
-      icon: "./assets/images/icon.png",
+      icon:
+        appVariant === "development"
+          ? "./assets/images/icon.png"
+          : "./assets/images/preview-icon.png",
      // other configurations...
    },
  };
};
```

5. When you run your new preview build, it should use the `preview` environment variables automatically

```bash
$ npx eas build --profile preview

✔ Select platform › iOS
Resolved "preview" environment for the build. Learn more: https://docs.expo.dev/eas/environment-variables/#setting-the-environment-for-your-builds
Environment variables with visibility "Plain text" and "Sensitive" loaded from the "preview" environment on EAS: APP_VARIANT.
```

6. In order to load the desired environment variables for updates, you can specify the `environment` flag:

```bash
$ npx eas update --environment preview

Environment variables with visibility "Plain text" and "Sensitive" loaded from the "preview" environment on EAS: APP_VARIANT.
```

Since this is a demo app, you can probably load an update made with the `preview` environment in the `development` build and have the behaviour remain the same, but it's a good practice to specify the environment when you want to load updates.

## See the solution

Switch to the milestones branch on this [commit](https://github.com/expo/appjs25-eas-update-workshop-code/commit/e5f89b398aef5ea44e86326af3924ff142ffafd8)

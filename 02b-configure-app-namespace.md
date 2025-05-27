# Module 02b: Configure app namespace

### Goal

We previously created a development bundle identifier (iOS) or package (Android) for our app. We'll use Expo Environment Variables to set the bundle identifier and package name based on the environment, so we can install the development build alongside our preview build.

### Concepts

- A preview build is a standalone binary for testers - there is no development client and you do not install it from the app stores.
- It's easier to see the changes in the app if we can install the development build alongside the preview build.
- The incremental changes made in development will hot reload in the development build, but not in the preview build.
- Whenever we push out a new update, we can see it work in the preview build, since the development build only loads updates from the Extensions tab.
- We can use Expo Environment Variables to set the bundle identifier and package name based on the environment. Another alternative is `.env`.

### Tasks

- Make an `APP_VARIANT` environment variable.
- Make sure it is resolved properly by running `eas config -e [environment]`.
- Convert `app.json` to `app.config.ts` so we can use the environment variable for the bundle identifier and package name.

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

## Dynamically resolve namespace in `app.config.ts`

1. Create `app.config.ts` to amend the original `app.json`

```js
import { ExpoConfig, ConfigContext } from "@expo/config";

const config = ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Art Museum",
  slug: "appjs25-update-workshop-code",
});

export default config;
```

3. Verify it still gets resolved by running:

```bash
eas config -e development
```

4. Update the `app.config.ts` to use the environment variable for the bundle identifier and package name:

```diff
import { ExpoConfig, ConfigContext } from "@expo/config";

+ const appVariant = process.env.APP_VARIANT || "development";

const config = ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Art Museum",
  slug: "appjs25-update-workshop-code",
+  ios: {
+    ...config.ios,
+    // bundleIdentifier: `com.expo.appjs25updateworkshopcode.[your-username].${appVariant}`,
+  },
+  android: {
+    ...config.android,
+    // package: `com.expo.appjs25updateworkshopcode.[your-username].${appVariant}`,
+  },
});
```

5. Remove the `ios.bundleIdentifier` and `android.package` from your `app.json`:

```diff
{
  "expo": {
    "name": "Art Museum",
    "slug": "appjs25-update-workshop-code",
   "ios": {
-    "bundleIdentifier": "com.expo.appjs25updateworkshopcode.[your-username]",
   },
   "android": {
-    "package": "com.expo.appjs25updateworkshopcode.[your-username]",
   }
    // other configurations...
  }
}
```

6. We want to visually differentiate the dev build from the preview one, so let's change the icon in `app.config.ts`.

```diff
const config = ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Art Museum",
  slug: "appjs25-update-workshop-code",
+  icon:
+    appVariant === "development"
+      ? "./assets/images/icon.png"
+      : "./assets/images/preview-icon.png",
  android: {
    ...config.android,
+    adaptiveIcon: {
+      ...config.android?.adaptiveIcon,
+      backgroundColor: appVariant === "development" ? "#FFFFFF" : "#7bd4d6",
+    },
```

7. Remove the `icon` and `android.adaptiveIcon.backgroundColor` from your `app.json`:

```diff
{
  "expo": {
    "name": "Art Museum",
    "slug": "appjs25-update-workshop-code",
-   "icon": "./assets/images/icon.png",
    "android": {
     "adaptiveIcon": {
-       "backgroundColor": "#FFFFFF"
```

8. The preview and development builds have the same set of deeplinks, and we want to deeplink into the development build when we run `npx expo start` so we'll update the `scheme` to include the `appVariant` in `app.config.ts`:

```diff
const appVariant = process.env.APP_VARIANT || "development";

const config = ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Art Museum",
  slug: "appjs25-update-workshop-code",
  icon:
    appVariant === "development"
      ? "./assets/images/icon.png"
      : "./assets/images/preview-icon.png",
+  scheme: appVariant === "development" ? "myappdev" : "myapp",
```

9. Remove the `scheme` from your `app.json`:

```diff
{
  "expo": {
    "name": "Art Museum",
    "slug": "appjs25-update-workshop-code",
-   "scheme": "myapp",
```

10. Going forward, you'll be running `npx expo start --scheme myappdev` to start the development build

11. When you run your new preview build, it should use the `preview` environment variables automatically

```bash
$ npx eas build --profile preview

✔ Select platform › iOS
Resolved "preview" environment for the build. Learn more: https://docs.expo.dev/eas/environment-variables/#setting-the-environment-for-your-builds
Environment variables with visibility "Plain text" and "Sensitive" loaded from the "preview" environment on EAS: APP_VARIANT.
```

12. In order to load the desired environment variables for updates, you can specify the `environment` flag:

```bash
$ npx eas update --environment preview

Environment variables with visibility "Plain text" and "Sensitive" loaded from the "preview" environment on EAS: APP_VARIANT.
```

Since this is a demo app, you can probably load an update made with the `preview` environment in the `development` build and have the the functionality we care about remain the same, but it's a good practice to specify the environment when you want to load updates.

## See the solution

Switch to the milestones branch on this [commit](https://github.com/expo/appjs25-eas-update-workshop-code/commit/e5f89b398aef5ea44e86326af3924ff142ffafd8)

![phone setup](/assets/02/phone-setup.png)

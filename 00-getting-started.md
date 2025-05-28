# Prerequisites

We assume you have installed all the required packages and tools for the workshop. If you haven't, please refer to the [Getting Started](https://github.com/expo/appjs25-eas-update-workshop-code)

You should now be logged in to your Expo account in `eas` CLI. You can verify this by running:

```bash
eas whoami
```

# Joining the org

We'll be using the `appjs-2025-eas-update-workshop` organization for this workshop. If you haven't already, please provide us with your email so we can add you to the organization.

# Creating your app

In your `app.json`, associate your project with the workshop and namespace the slug:

```diff
{
  "expo": {
+    "owner": "appjs-2025-eas-update-workshop",
-    "slug": "appjs25-update-workshop-code",
+    "slug": "appjs25-update-workshop-code-[your-username]",
  }
}
```

# Choosing your device

We recommend using an Android device or emulator for this workshop, as it provides a more straightforward testing experience with the Background Task API.

If you use an iOS device, you must have the $99/month Apple Developer membership. You can also use an iOS simulator, but the Background Task API will be unavailable (used in 1 of 7 milestones).

# Configuration

Set up your app to use EAS Build and EAS Update

```bash
eas build:configure
eas update:configure
```

# App Namespaces

## iOS

In your `app.json`, add your development bundle identifier to the `ios` section. For example:

```diff
{
  "expo": {
    "ios": {
+      "bundleIdentifier": "com.expo.appjs25updateworkshopcode.[your-username].development"
    }
  }
}
```

## Android

In your `app.json`, add your development package name to the `android` section. For example:

```diff
{
  "expo": {
    "android": {
+      "package": "com.expo.appjs25updateworkshopcode.[your-username].development"
    }
  }
}
```

# Making your development build

> **⏱️ Build taking too long?**  
> If your build is taking too long, you can download the pre-built development client for Android [here](https://expo.dev/accounts/appjs-2025-eas-update-workshop/projects/appjs25-update-workshop-code-quintest113/builds/e966312a-dff4-4e76-8d8f-b33b60bd5cfc)

### iOS

If you are building for the simulator, add this to your `eas.json`:

```diff
{
  "build": {
    "development": {
+      "ios": {
+        "simulator": true
+      },

```

If you are building for a physical device, ensure you have the correct provisioning profile set up in your Apple Developer account. Follow the steps here for a [physical iOS device setup](https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build&platform=ios&device=physical).

Then create your development build:

```bash
eas build -p ios --profile development
```

### Android

```bash
eas build -p android --profile development
```

# Start developing

```bash
npx expo start
```

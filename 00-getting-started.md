# Prerequisites

We assume you have installed all the required packages and tools for the workshop. If you haven't, please refer to the [Getting Started](https://github.com/expo/appjs25-eas-update-workshop-code)

# Joining the org

We'll be using the `appjs-2025-eas-update-workshop` organization for this workshop. If you haven't already, please provide us with your email so we can add you to the organization.

# Creating your app

In your `app.json`, associate your project with the workshop and namespace the slug:

```diff
{
  "expo": {
+    "owner": "appjs-2025-eas-update-workshop",
+    "slug": "appjs25-update-workshop-code-[your-username]"
  }
}
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

Then create your development build:

```bash
eas build -p ios —-profile development
```

### Android

```bash
eas build -p android –profile development
```

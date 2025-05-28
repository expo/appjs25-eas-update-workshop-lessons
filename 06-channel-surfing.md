# Module 06: Channel Surfing

### Goal

Override update configuration at runtime to switch between different update channels (e.g., development, preview, production).

### Concepts

- Learn how control which update to load from the client side in release builds.

### Tasks

- Create a new channel and publish an update
- Dynamically switch between channels using the `Updates` API

### Resources

- https://docs.expo.dev/eas-update/download-updates/#controlling-which-update-to-load-from-the-client-side
- https://docs.expo.dev/eas-update/override/

# Exercises

1. Update your `app.json` to enable `disableAntiBrickingMeasures` in the `updates` configuration. This allows you to override the update request headers at runtime but also disables some safety features that prevent you from accidentally breaking your app with an update.

```json
{
  "expo": {
    "updates": {
      "disableAntiBrickingMeasures": true
    }
  }
}
```

2. For this to take effect you need to create a new build

```bash
$ eas build --profile preview
```

3. While the build is running, let's create a new channel, make a change and publish an update to it:

```bash
$ eas channel:create [channel-name]
```

Update the `Settings` screen title to `Custom Settings` inside the `_layout.tsx` file.

To publish the update to the new channel, run:

```bash
$ eas update --channel [channel-name]
```

## See the solution

Switch to the [milestones branch](https://github.com/expo/appjs25-eas-update-workshop-code/commits/milestones/)

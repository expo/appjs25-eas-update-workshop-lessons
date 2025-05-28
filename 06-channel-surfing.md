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

4. Now, let's implement the code that allow us to switch to the new channel in the app using the `setUpdateURLAndRequestHeadersOverride` API.

In `app/(tabs)/three/tsx` add the following code:

```tsx
import Updates from "expo-updates";
//...
const [branch, setBranchName] = useState("");

const updateURLAndRequestHeaders = useCallback(() => {
  const expoConfigUpdates = getExpoConfigUpdates(currentlyRunning.manifest);
  if (!expoConfigUpdates?.url) {
    alert("Unable to determine updateUrl.");
    return;
  }
  Updates.setUpdateURLAndRequestHeadersOverride({
    updateUrl: expoConfigUpdates.url,
    requestHeaders: {
      "expo-channel-name": branch,
    },
  });

  alert("Close and re-open the app to load the latest version.");
}, [branch, currentlyRunning.manifest]);
//...
    <View className="flex-row align-middle">
      <Text className="flex-1 font-semibold text-3xl px-4 py-2 bg-shade-2">
        Changing Update
      </Text>
    </View>
    <View className="px-4 py-2">
      <View className="items-center dark:bg-black p-4">
        <TextInput
          className="w-full max-w-md border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-800"
          placeholder="Type branch name..."
          placeholderTextColor="#9ca3af"
          onChangeText={setBranchName}
        />
      </View>
      <Button
        onPress={() => updateURLAndRequestHeaders()}
        title={"Update Branch"}
      />
    </View>
```

And in `updateUtils.ts` add `getExpoConfigUpdates` helper function allow us to extract the update URL from the manifest:

```tsx
export const getExpoConfigUpdates = (manifest?: Partial<Manifest>) => {
  if (manifest && "extra" in manifest) {
    return manifest?.extra?.expoClient?.updates;
  }
};
```

5. Now you can publish your changes through a new update, run the app and enter the channel name you created earlier. After that, close and re-open the app to load the latest version from the specified channel.

![channel surfing](/assets/06/channel-surfing.png)

## See the solution

Switch to the [milestones branch](https://github.com/expo/appjs25-eas-update-workshop-code/commits/milestones/)

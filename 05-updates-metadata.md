# Module 05: Leveraging updates metadata for critical updates

### Goal

Use Expo config in the `expo.extra` section to add custom metadata to your update and create a custom logic for critical updates.

### Concepts

- Learn how to use the `expo.extra` section in your app config to store custom metadata.
- Understand how to implement a custom logic for critical updates using a criticalIndex

### Tasks

- Use `availableUpdate` from the `useUpdates` hook to extract information from the update manifest and identify if the update is critical or not.

### Resources

- [Expo config](https://docs.expo.dev/versions/latest/config/app/#extra)

# Exercises

## Display available update message

1. Open your `app.json` file, add your message to the `expo.extra` field

```json
{
  "expo": {
    "extra": {
      "message": "This is an awesome update from the AppJS workshop"
    }
  }
}
```

2. In `updateUtils.ts` replace your `currentlyRunningDescription` function with `updateInfoDescription`, which accepts both the currently running update and the available update.

```ts
export const updateInfoDescription = (
  update: CurrentlyRunningInfo | UpdateInfo,
  lastCheckForUpdateTime?: Date
) => {
  let description =
    ` ID: ${update.updateId}\n` +
    ` Created: ${update.createdAt?.toISOString()}\n`;

  if ("channel" in update) {
    description += ` Channel: ${update.channel}\n`;
  }
  if ("runtimeVersion" in update) {
    description += ` Runtime Version: ${update.runtimeVersion}\n`;
  }

  description +=
    ` Message: ${manifestMessage(update.manifest)}\n` +
    ` Last check: ${lastCheckForUpdateTime?.toISOString()}\n`;

  return description;
};
```

3. In `app/(tabs)/three.tsx`, replace the `currentlyRunningDescription` function call with `updateInfoDescription` and add a new view block to display the available update description.

```ts
{
  Boolean(availableUpdate) && (
    <View className="flex">
      <View className="flex-row">
        <Text className="flex-1 font-semibold text-3xl px-4 py-2 bg-shade-2">
          Available Update
        </Text>
        {isChecking || isDownloading ? (
          <ActivityIndicator
            style={styles.activityIndicator}
            size="large"
            color={colors.tint}
          />
        ) : null}
      </View>
      <View className="px-4 gap-y-2 py-2">
        <Text className="text-l">
          {updateInfoDescription(availableUpdate, lastCheckForUpdateTime)}
        </Text>
      </View>
    </View>
  );
}
```

4. Publish a new update, manually check for it and observe the update message in the app.

![update message](/assets/05/update-message.png)

## Publish a critical update:

Now that we understand how to add metadata to an update, let's implement a simple custom logic for critical updates.

1. Open your `app.json` file, and inside the the `expo.extra` field add `criticalIndex` and set it to `0` along with our message field

```json
{
  "expo": {
    "extra": {
      "criticalIndex": 0,
      "message": ""
    }
  }
}
```

2. Add a `isCriticalUpdate` helper function that checks if the `criticalIndex` from the running update is greater than the `availableUpdate?.manifest?.extra?.criticalIndex`.

```ts
export const isAvailableUpdateCritical = ({
  currentlyRunning,
  availableUpdate,
}: Pick<UseUpdatesReturnType, "currentlyRunning" | "availableUpdate">) => {
  const currentlyRunningExtra = getExpoConfigExtra(currentlyRunning.manifest);
  const criticalIndexCurrent = currentlyRunningExtra?.criticalIndex ?? 0;

  const availableUpdateExtra = getExpoConfigExtra(availableUpdate?.manifest);
  const criticalIndexUpdate = availableUpdateExtra?.criticalIndex ?? 0;

  return criticalIndexUpdate > criticalIndexCurrent;
};

const getExpoConfigExtra = (manifest?: Partial<Manifest>) => {
  if (manifest && "extra" in manifest) {
    return manifest?.extra?.expoClient?.extra;
  }
};
```

3. In `app/(tabs)/three.tsx`, import the `isAvailableUpdateCritical` function and use it to conditionally render a red background color.

```diff
+ const isUpdateCritical = isAvailableUpdateCritical({
+  currentlyRunning,
+  availableUpdate,
+ });
+ const backgroundColor = isUpdateCritical ? "red-600" : "gray-600";
//...
{
  Boolean(availableUpdate) && (
-       <View className="flex">
+       <View className={`flex bg-${backgroundColor}`}>
//...
          <Text className="text-l">
+           Type: {isUpdateCritical ? "Critical Update" : "Update"}
            {updateInfoDescription(availableUpdate, lastCheckForUpdateTime)}
          </Text>
```

4. Add the logic to download the update as soon as we detect that it is critical and run immediately update after downloading it.

```ts
// If update is critical, download it
useEffect(() => {
  if (isUpdateCritical && !isUpdatePending) {
    downloadUpdate();
  }
}, [isUpdateCritical, isUpdatePending]);

// Run the update (after delay) if download completes successfully and it is critical
useEffect(() => {
  if (isUpdatePending && isUpdateCritical) {
    setTimeout(() => reloadAsync(), 2000);
  }
}, [isUpdateCritical, isUpdatePending]);
```

5. Publish a new update with `criticalIndex` set to `1` and check the app. You should see the red background color and the update should be downloaded and the app restarted automatically.

## See the solution

Switch to the [milestones branch](https://github.com/expo/appjs25-eas-update-workshop-code/commits/milestones/)

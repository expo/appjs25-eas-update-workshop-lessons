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

1. In `updateUtils.ts` replace your `currentlyRunningDescription` function with `updateInfoDescription`, which accepts both the currently running update and the available update.

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

2. In `app/(tabs)/three.tsx`, replace the `currentlyRunningDescription` function call with `updateInfoDescription` and add a new view block to display the available update description.

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

3. Open your `app.json` file, add your message to the `expo.extra` field and publish a new update

```json
{
  "expo": {
    "extra": {
      "message": "This is an awesome update from the AppJS workshop"
    }
  }
}
```

## Publish a critical update:

## See the solution

Switch to the [milestones branch](https://github.com/expo/appjs25-eas-update-workshop-code/commits/milestones/)

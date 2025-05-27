# Module 02a: Manually check for updates

### Goal

Create a button in the app that manually checks for updates. If there is an update available, it will prompt the user to download the update, then reload the app to run it.

### Concepts

- Learn about the lifecycle of an update: fetch, download and reload.

### Tasks

- Create a button to manually check for updates in the `Settings` tab.
- If there is an update available, create another button to download the update.
- If the update is downloaded, create a button to reload the app to run the update.

### Resources

- [checkForUpdates](https://docs.expo.dev/versions/latest/sdk/updates/#updatescheckforupdateasync)
- [fetchUpdate](https://docs.expo.dev/versions/latest/sdk/updates/#updatescheckforupdateasync)
- [reloadAsync](https://docs.expo.dev/versions/latest/sdk/updates/#updatescheckforupdateasync)
- [UseUpdatesReturnType](https://docs.expo.dev/versions/latest/sdk/updates/#useupdatesreturntype)

# Exercises

## Check update button

1. From the `files` folder, take `monitorUtils.ts` and copy it to `utils/monitorUtils.ts`.

These are wrapped functions to help you catch errors in development builds, so you can see them in the console. Any errors in production builds will be surfaced in `checkError` and `downloadError` of `useUpdates`.

2. Add a monitor section to your `app/(tabs)/three.tsx` file:

```diff
      <View className="px-4 gap-y-2 py-2">
        <Text className="text-l">
          {currentlyRunningTitle(currentlyRunning)}
          {currentlyRunningDescription(
            currentlyRunning,
            lastCheckForUpdateTime
          )}
        </Text>
      </View>
+      <View className="flex-row align-middle">
+        <Text className="flex-1 font-semibold text-3xl px-4 py-2 bg-shade-2">
+          Monitor
+        </Text>
+      </View>
```

3. Add a button to check for updates:

```diff
+ import { checkForUpdate } from "@/utils/monitorUtils";
import {
  ActivityIndicator,
+  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";
//...
      <View className="flex-row align-middle">
        <Text className="flex-1 font-semibold text-3xl px-4 py-2 bg-shade-2">
          Monitor
        </Text>
      </View>
+      <View className="px-4 gap-y-2 py-2">
+        <Button
+          onPress={() => checkForUpdate()}
+          disabled={isChecking || isDownloading}
+          title={
+            isChecking ? "Checking for update..." : "Manually check for update"
+          }
+        />
+      </View>
```

It doesn't work in the development build yet, but we'll be making a preview build soon that will allow us to test it.

## Download and Reload buttons

Add a button to download the update if it is available, we'll use the `isUpdateAvailable` and `isUpdatePending` flags from the `useUpdates` hook to determine if the update is available and pending:

```diff
  const {
    currentlyRunning,
    isChecking,
    isDownloading,
    lastCheckForUpdateTimeSinceRestart,
+    isUpdateAvailable,
+    isUpdatePending,
  } = useUpdates();

 //...

        <Button
          onPress={() => checkForUpdate()}
          disabled={isChecking || isDownloading}
          title={
            isChecking ? "Checking for update..." : "Manually check for update"
          }
        />
+        {isUpdateAvailable && (
+          <Button
+            onPress={() => downloadUpdate()}
+            disabled={isDownloading}
+            title={"Download update"}
+          />
+        )}
+        {isUpdatePending && (
+          <Button
+            onPress={() => setTimeout(() => reloadAsync(), 2000)}
+            title={"Launch update"}
+          />
+        )}
```

## See the solution

Switch to the [milestones branch](https://github.com/expo/appjs25-eas-update-workshop-code/commits/milestones/)

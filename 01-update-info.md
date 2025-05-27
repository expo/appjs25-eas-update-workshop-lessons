# Module 01: Display Current Update Info

### Goal

Display the currently running update in a new 'Settings' tab in the app. This is a good way to show the user what version of the app they are running, and it can be useful for debugging.

### Concepts

- Native updates are slow, JS updates are fast, so let’s do less of the former and more of the latter by making one development build that will last us a while.
- Learn about the `useUpdates` hook, that obtains information on available updates and on the currently running update.

### Tasks

1. Create a new `Settings` tab in the app.
2. Use the `useUpdates` hook to get the current update information.
3. Display the current update information in the `Settings` tab.

### Resources

- [useUpdates](https://docs.expo.dev/versions/latest/sdk/updates/#useupdates)

# Exercises

## Display really basic update information

1. Add a new `Settings` tab to the app in `app/(tabs)/_layout.tsx`

```js
<Tabs.Screen
  name="three"
  options={{
    title: "Settings",
    tabBarIcon: ({ color }) => (
      <TabBarIcon type="FontAwesome" name="gear" color={color} />
    ),
  }}
/>
```

2. Create a basic view with the `Current Update` header in `app/(tabs)/three/tsx`:

```js
import { StyleSheet, View, Text } from "react-native";

export default function TabThreeScreen() {
  return (
    <View className="flex-1 bg-shade-1">
      <View className="flex-row align-middle">
        <Text className="flex-1 font-semibold text-3xl px-4 py-2 bg-shade-2">
          Current Update
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activityIndicator: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
```

3. Import the `useUpdates` hook from `expo-updates` and use it to get the current update information.

```diff
+ import { useUpdates } from "expo-updates";

//...
export default function TabThreeScreen() {
+  const {
+    currentlyRunning,
+    isChecking,
+    isDownloading,
+    lastCheckForUpdateTimeSinceRestart,
+  } = useUpdates();
```

4. Display the current update information in the `Settings` tab.

```diff
//...
  return (
    <View className="flex-1 bg-shade-1">
      <View className="flex-row align-middle">
        <Text className="flex-1 font-semibold text-3xl px-4 py-2 bg-shade-2">
          Current Update
        </Text>
      </View>
+      <View className="px-4 gap-y-2 py-2">
+        <Text className="text-l">
+          currentlyRunning: {JSON.stringify(currentlyRunning)}
+          {"\n"}
+          isChecking: {isChecking}
+          {"\n"}
+          isDownloading: {isDownloading}
+          {"\n"}
+          lastCheckForUpdateTimeSinceRestart:
+          {lastCheckForUpdateTimeSinceRestart?.toISOString()}
+        </Text>
+      </View>
    </View>
  );
}
```

5. Notice the `currentlyRunning` object is a little confusing - we served a bundle, why aren't we seeing anything?

![currently-running-dev-mode](/assets/01/currently-running-dev.png)

From the [Testing](https://docs.expo.dev/versions/latest/sdk/updates/#testing) documentation:

```
 Note that this only simulates what an update will look like in your app, and most of the Updates API is unavailable when running in a development build.
```

Unfortunately, we can only load updates for a development build from the extensions tab.

## Display development-mode aware information

1. Let's display this information in a more useful way. Make a file called `utils/updateUtils.ts` and add the following snippet:

```ts
import { CurrentlyRunningInfo } from "expo-updates";

const isInDevelopmentMode = (currentlyRunning: CurrentlyRunningInfo) => {
  return __DEV__ && currentlyRunning.updateId === undefined;
};

export const currentlyRunningTitle = (
  currentlyRunning: CurrentlyRunningInfo
) => {
  if (isInDevelopmentMode(currentlyRunning)) {
    return "Type: Dev Mode (usage limited to extension tab)\n";
  }
  return currentlyRunning?.isEmbeddedLaunch
    ? "Type: Embedded Bundle\n"
    : "Type: Update\n";
};
```

2. Replace your original code with the new utility function:

```diff
+ import { currentlyRunningTitle } from "@/utils/updateUtils";
//...
      <View className="px-4 gap-y-2 py-2">
        <Text className="text-l">
-          currentlyRunning: {JSON.stringify(currentlyRunning)}
-          {"\n"}
+          {currentlyRunningTitle(currentlyRunning)}
          isChecking: {isChecking}
          {"\n"}
          isDownloading: {isDownloading}
          {"\n"}
          lastCheckForUpdateTimeSinceRestart:
          {lastCheckForUpdateTimeSinceRestart?.toISOString()}
        </Text>
      </View>
//...
```

3. Let's also display the rest of the `currentlyRunning` object in a more readable format. Add this to the `utils/updateUtils.ts` file:

```ts
export const currentlyRunningDescription = (
  currentlyRunning: CurrentlyRunningInfo,
  lastCheckForUpdateTime?: Date
) => {
  return (
    ` ID: ${currentlyRunning.updateId}\n` +
    ` Created: ${currentlyRunning.createdAt?.toISOString()}\n` +
    ` Channel: ${currentlyRunning.channel}\n` +
    ` Runtime Version: ${currentlyRunning.runtimeVersion}\n` +
    ` Message: ${manifestMessage(currentlyRunning.manifest)}\n` +
    ` Last check: ${lastCheckForUpdateTime?.toISOString()}\n`
  );
};

const manifestMessage = (manifest: any) => {
  return manifest?.extra?.expoClient?.extra?.message ?? "";
};
```

4. Replace your original code with the new utility function:

```diff
import {
+  currentlyRunningDescription,
  currentlyRunningTitle,
} from "@/utils/updateUtils";
//...
      <View className="px-4 gap-y-2 py-2">
        <Text className="text-l">
          {currentlyRunningTitle(currentlyRunning)}
          isChecking: {isChecking}
          {"\n"}
          isDownloading: {isDownloading}
          {"\n"}
-          lastCheckForUpdateTimeSinceRestart:
-          {lastCheckForUpdateTimeSinceRestart?.toISOString()}
+          {currentlyRunningDescription(
+            currentlyRunning,
+            lastCheckForUpdateTimeSinceRestart
+          )}
        </Text>
      </View>
//...
```

## Persist check dates

1. Lets take a closer look at `lastCheckForUpdateTimeSinceRestart`.

From the docs:

```
A Date object representing the last time this client checked for an available update, or undefined if no check has yet occurred since the app started. Does not persist across app reloads or restarts.
```

But consider a case where we just restarted the app, and we want to know when the last check was. `lastCheckForUpdateTimeSinceRestart` will be `undefined` in this case, so we need to persist prior checks ourselves.

From the `files` folder, take `usePersistentDate.ts` and copy it to `utils/usePersistentDate.ts`. This is a custom hook that will persist the date across app reloads and restarts.

2. Call the `usePersistentDate` hook in the `TabThreeScreen` component to get the last check date.

```diff
+import { usePersistentDate } from "@/utils/usePersistentDate";
//...
export default function TabThreeScreen() {
  const {
    currentlyRunning,
    isChecking,
    isDownloading,
    lastCheckForUpdateTimeSinceRestart,
  } = useUpdates();

+  const lastCheckForUpdateTime = usePersistentDate(lastCheckForUpdateTimeSinceRestart);
```

3. Update the `lastCheckForUpdateTimeSinceRestart` to use the `lastCheckForUpdateTime` from the hook.

```diff
          {currentlyRunningDescription(
            currentlyRunning,
-            lastCheckForUpdateTimeSinceRestart
+            lastCheckForUpdateTime
          )}
```

## Display a spinner while checking for updates

1. Let's display a spinner while checking for updates. Import the `ActivityIndicator` from `react-native` and add it to the `Settings` tab.

```diff
- import { StyleSheet, Text, View } from "react-native";
+ import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
+ import colors from "@/constants/colors";

// ...
<View className="flex-row align-middle">
  <Text className="flex-1 font-semibold text-3xl px-4 py-2 bg-shade-2">
    Current Update
  </Text>
+  {/* Add a spinner to indicate checking for updates */}
+  {isChecking || isDownloading ? (
+    <ActivityIndicator
+      style={styles.activityIndicator}
+      size="large"
+      color={colors.tint}
+    />
+  ) : null}
</View>;
// ...
```

2. Now that we have a spinner, remove the basic print outs:

```diff
//...
      <View className="px-4 gap-y-2 py-2">
        <Text className="text-l">
          {currentlyRunningTitle(currentlyRunning)}
-          {"\n"}
-          isChecking: {isChecking}
-          {"\n"}
-          isDownloading: {isDownloading}
-          {"\n"}
          {currentlyRunningDescription(
            currentlyRunning,
            lastCheckForUpdateTime
          )}
        </Text>
      </View>
```

## See the solution

Switch to the [milestones branch](https://github.com/expo/appjs25-eas-update-workshop-code/commits/milestones/)

![settings-tab](/assets/01/milestone.png)

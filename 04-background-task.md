# Module 04: Automatically check with Background Tasks

### Goal

Automatically check for updates at a specified interval with Background Tasks.

### Concepts

- Background Tasks allow you to check for updates and apply them when the user is not actively using the app.
- Most of the time, this is better than the default behaviour of closing and opening the app to apply a new update because it is faster. It also allows you to apply updates without interrupting the user.

### Tasks

- Use the new Background Task API to check for updates at a specified interval.
- Android only: Test the Background Task by simulating a new update and seeing if it is applied when the app is in the background.

### Resources

- [Background Tasks](https://docs.expo.dev/versions/latest/sdk/background-task)
- [Background Tasks with expo-updates](https://docs.expo.dev/eas-update/download-updates/#checking-for-updates-while-the-app-is-backgrounded)

# Exercises

## Setup Background Task

1. Install dependencies:

```bash
npx expo install expo-background-task expo-device expo-task-manager
```

2. Remove the interval checking code from `app/(tabs)/three.tsx`:

```diff
- import { dateDifferenceInMilliSeconds } from "@/utils/dateUtils";
- import { useAppState } from "@/utils/useAppState";
- import { useInterval } from "@/utils/useInterval";

// ...

  const monitorInterval = 1000 * 10; // 10 seconds
-  // Check if needed when app becomes active
-  const appStateHandler = (activating: boolean) => {
-    if (activating) {
-      checkForUpdate();
-    }
-  };
-  const appState = useAppState(appStateHandler);
-  const needsUpdateCheck = () =>
-    dateDifferenceInMilliSeconds(new Date(), lastCheckForUpdateTime) >
-    monitorInterval;
-
-  // This effect runs periodically to see if an update check is needed
-  // The effect interval should be smaller than monitorInterval
-  useInterval(() => {
-    if (appState === "active" && needsUpdateCheck() && !__DEV__) {
-      checkForUpdate();
-    }
-  }, monitorInterval / 4);
```

3. From the `files` folder, take `IntervalChecker.tsx` and copy it to `components/IntervalChecker.tsx`.

4. From the `files` folder, take `backgroundChecker.ts` and copy it to `utils/backgroundChecker.ts`.

5. In `app/(tabs)/three.tsx`, we're going to determine what check to use based on the platform and device type.

```diff
import {
  ActivityIndicator,
  Button,
+  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
+import * as Device from "expo-device";

//...
  const monitorInterval = 1000 * 10; // 10 seconds
+  const isIOSSimulator = Platform.OS === "ios" && !Device.isDevice;
+
+  let checkingType;
+  if (!isIOSSimulator) {
+    checkingType = "Background";
+  } else {
+    checkingType = "Interval Check";
+  }

//...
      <View className="flex-row align-middle">
        <Text className="flex-1 font-semibold text-3xl px-4 py-2 bg-shade-2">
          Monitor
        </Text>
      </View>
      <View className="px-4 gap-y-2 py-2">
+        <Text className="text-l">{`Checking method: ${checkingType}`}</Text>
```

6. In `app/(tabs)/three.tsx`, import the `IntervalChecker` component and use it conditionally based on the platform and device type:

```diff
+ import IntervalChecker from "@/components/IntervalChecker";
//...
        {isUpdatePending && (
          <Button
            onPress={() => setTimeout(() => reloadAsync(), 2000)}
            title={"Launch update"}
          />
        )}
      </View>
+      {isIOSSimulator && (
+        // background tasks is not supported in iOS simulator so we poll instead
+        <IntervalChecker
+          lastCheckForUpdateTime={lastCheckForUpdateTime}
+          monitorInterval={monitorInterval}
+        />
+      )}
    </View>
  );
}
```

7. Register the background task in `app/_layout.tsx`:

```tsx
import "@/utils/backgroundChecker";
```

To ensure the background task is registered when the application starts, import and invoke the `setupBackgroundUpdates` function within the top-level component.

## Test Background Task

Note: Testing on iOS is not possible as background tasks are not supported in the iOS simulator, and the [testing function](https://docs.expo.dev/versions/latest/sdk/background-task/#backgroundtasktriggertaskworkerfortestingasync) exposed by the Background Task API is only available on Debug builds (which expo-updates API doesn't play well with).

1. On Android, you can test the background task by making a new preview build:

```bash
eas build --profile preview --platform android
```

2. Install the APK on your device or emulator and connect it to your computer such that adb can access it. Once connected, you should see your device listed when you run:

```bash
adb devices
```

3. Create a new update by running:

```bash
eas update --branch preview --message "testing background task"
```

4. In a separate terminal window, run:

```bash
adb logcat | grep "Background task starting"
```

Output from this command will confirm the background task ran.

5. Background your app by pressing the home button or switching to another app.

6. Run the following command to determine the job number for the background task:

```bash
adb shell dumpsys jobscheduler | grep -A 40 -m 1 <package-name>
```

You should see a job with the name `expo-background-task` and a job number. In this example, the job number is `275`:

```bash
JOB #u0a453/275: 216a359 <package-name>/androidx.work.impl.background.systemjob.SystemJobService
  u0a453 tag=*job*/<package-name>/androidx.work.impl.background.systemjob.SystemJobService#275
  Source: uid=u0a453 user=0 pkg=<package-name>
  ...
```

7. Run the following command to trigger the background task:

```bash
adb shell cmd jobscheduler run -f <package-name> <JOB_ID>
```

You should see the following output:

```bash
Running job [FORCED]
```

8. Check the logs in the terminal where you ran `adb logcat | grep "Background task starting"` to see if the background task was triggered and if it successfully checked for updates. You should see a log message indicating that the background task started and checked for updates.

9. Foreground the app to see if the update was applied.

## See the solution

Switch to the [milestones branch](https://github.com/expo/appjs25-eas-update-workshop-code/commits/milestones/)

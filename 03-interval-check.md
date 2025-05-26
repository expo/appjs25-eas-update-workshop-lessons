# Module 03: Automatically check based on an interval

### Goal

Automatically check for updates at a specified interval and when the app transitions to an active state.

### Concepts

### Tasks

- Use the React Native AppState change listener on mount (or when our callback changes) and removes it on unmount (or before re-subscribing)

### Resources

- [AppState](https://reactnative.dev/docs/appstate)

# Exercises

### Poll for updates every 10 seconds

1. From the `files` folder, take `useAppState.ts` and copy it to `utils/useAppState.ts`.

   When we poll for updates, we'll use it as a glorified wrapper to get the current app state. We'll make use of the callback functionality later.

2. From the `files` folder, take `useInterval.ts` and copy it to `utils/useInterval.ts`.

   This is a custom hook that allows us to run a callback at a specified interval. We'll use it to poll for updates every 10 seconds.

3. In `utils/dateUtils.ts`, add `dateDifferenceInMilliSeconds` to calculate the difference between two dates in milliseconds:

   ```ts
   export const dateDifferenceInMilliSeconds = (
     date1: Date | undefined,
     date2: Date | undefined
   ) => dateToTimeInMilliSeconds(date1) - dateToTimeInMilliSeconds(date2);
   ```

4. In `app/(tabs)/settings.tsx`, import the `useAppState` and `useInterval` hooks and setup the polling:

```diff
+import { dateDifferenceInMilliSeconds } from "@/utils/dateUtils";
+import { useAppState } from "@/utils/useAppState";
+import { useInterval } from "@/utils/useInterval";

// ...
  const lastCheckForUpdateTime = usePersistentDate(
    lastCheckForUpdateTimeSinceRestart,
  );
+
+  const monitorInterval = 1000 * 10; // 10 seconds
+  const appState = useAppState(undefined);
+  const needsUpdateCheck = () =>
+    dateDifferenceInMilliSeconds(new Date(), lastCheckForUpdateTime) >
+    monitorInterval;
+
+  // This effect runs periodically to see if an update check is needed
+  // The effect interval should be smaller than monitorInterval
+  useInterval(() => {
+    if (appState === "active" && needsUpdateCheck() && !__DEV__) {
+      checkForUpdate();
+    }
+  }, monitorInterval / 4);
```

### Check for updates when the app becomes active

1. Update the `useAppState` hook to accept a callback that will be called when the app state changes to "active":

```diff
  const monitorInterval = 1000 * 10; // 10 seconds
+  // Check if needed when app becomes active
+  const appStateHandler = (activating: boolean) => {
+    if (activating) {
+      checkForUpdate();
+    }
+  };
+  const appState = useAppState(appStateHandler);
-  const appState = useAppState(undefined);
  const needsUpdateCheck = () =>
    dateDifferenceInMilliSeconds(new Date(), lastCheckForUpdateTime) >
    monitorInterval;
```

`useAppState` now invokes your `appStateHandler` on every state change, passing an activating flag that’s true whenever the app moves into the active state.

## See the solution

Switch to the milestones branch on this [commit](https://github.com/expo/appjs25-eas-update-workshop-code/pull/1/commits/821e40d4f5fd075c47f149780600a1e6350f1a4e)

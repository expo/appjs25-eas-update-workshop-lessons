import { checkForUpdateAsync, fetchUpdateAsync } from "expo-updates";

// Wrap async expo-updates functions (errors are surfaced in useUpdates() hook so can be ignored)
export const checkForUpdate: () => Promise<string | undefined> = async () => {
  try {
    const result = await checkForUpdateAsync();
    return result.reason;
  } catch (_error) {
    if (__DEV__) {
      alert(_error); // checkError not surfaced in dev mode
    }
  }
};

export const downloadUpdate = () =>
  fetchUpdateAsync().catch((_error) => {
    if (__DEV__) {
      alert(_error); // downloadError not surfaced in dev mode
    }
  });

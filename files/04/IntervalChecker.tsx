import { dateDifferenceInMilliSeconds } from "@/utils/dateUtils";
import { checkForUpdate } from "@/utils/monitorUtils";

import { useAppState } from "@/utils/useAppState";
import { useInterval } from "@/utils/useInterval";

export default function IntervalChecker({
  lastCheckForUpdateTime,
  monitorInterval,
}: {
  lastCheckForUpdateTime?: Date;
  monitorInterval: number;
}) {
  // Check if needed when app becomes active
  const appStateHandler = (activating: boolean) => {
    if (activating) {
      checkForUpdate();
    }
  };
  const appState = useAppState(appStateHandler);
  const needsUpdateCheck = () =>
    dateDifferenceInMilliSeconds(new Date(), lastCheckForUpdateTime) >
    monitorInterval;

  // This effect runs periodically to see if an update check is needed
  // The effect interval should be smaller than monitorInterval
  useInterval(() => {
    if (appState === "active" && needsUpdateCheck() && !__DEV__) {
      checkForUpdate();
    }
  }, monitorInterval / 4);

  return null;
}

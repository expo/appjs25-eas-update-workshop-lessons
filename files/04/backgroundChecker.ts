import * as TaskManager from "expo-task-manager";
import * as BackgroundTask from "expo-background-task";
import * as Updates from "expo-updates";

const BACKGROUND_TASK_NAME = "task-run-expo-update";

export const setupBackgroundUpdates = async () => {
  console.log("⚙️ Background task starting");
  TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
    return Promise.resolve();
  });

  await BackgroundTask.registerTaskAsync(BACKGROUND_TASK_NAME, {
    minimumInterval: 15, // Try to repeat every 15 minutes while backgrounded
  });
};

setupBackgroundUpdates();

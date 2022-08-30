import React from "react";
import { Text, View } from "react-native";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { doGeofence } from "./geofence";

const BACKGROUND_FETCH_TASK = "background-fetch";

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  // Be sure to return the successful result type!
  await doGeofence(BACKGROUND_FETCH_TASK);
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

// 2. Register the task at some point in your app by providing the same name, and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 1, // 1 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background fetch calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export default function BackgroundFetchScreen() {
  // const [isRegistered, setIsRegistered] = React.useState(false);
  // const [status, setStatus] = React.useState(null);

  React.useEffect(() => {
    TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK).then((s) => {
      if (s) {
        unregisterBackgroundFetchAsync().then(() => {
          console.log(
            BACKGROUND_FETCH_TASK +
              " is already running.. now it is unregistered and registered again"
          );
          registerBackgroundFetchAsync();
        });
      } else {
        console.log("Registering task " + BACKGROUND_FETCH_TASK + "...");
        registerBackgroundFetchAsync();
      }
    });
    // checkStatusAsync();
  }, []);

  // const checkStatusAsync = async () => {
  //   const status = await BackgroundFetch.getStatusAsync();

  //   const isRegistered = await TaskManager.isTaskRegisteredAsync(
  //     BACKGROUND_FETCH_TASK
  //   );

  //   setStatus(status);
  //   setIsRegistered(isRegistered);
  // };

  return (
    <View>
      {/* <Text>
        Background fetch status:
        {status && BackgroundFetch.BackgroundFetchStatus[status]}
      </Text>
      <Text>
        Background fetch task name:
        {isRegistered ? BACKGROUND_FETCH_TASK : "Not registered yet!"}
      </Text> */}
    </View>
  );
}

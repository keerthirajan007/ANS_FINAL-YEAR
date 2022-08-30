import { data as USER_DATA } from "./src/screens/ZonesScreen/ZonesScreen";

export const _notifications = {
  token: null,
};
// api request for whether the user is inside the polygon or not
async function checkInside(lat, long, uid, time) {
  let t = await (
    await fetch(
      `http://fypams.000webhostapp.com/check_inside.php?lat=${lat}&long=${long}&uid=${uid}&time=${time}`
    )
  ).json();
  return t;
}

// api request for whether the user is outside the polygon or not
async function checkOutside(lat, long, uid, time) {
  let t = await (
    await fetch(
      `http://fypams.000webhostapp.com/check_outside.php?lat=${lat}&long=${long}&uid=${uid}&time=${time}`
    )
  ).json();
  return t;
}

// call the checkinside and check outside functions
export async function doGeofence(parentName, callback) {
  // let s = `doGeofence called from ${parentName} @${new Date().toLocaleString()}`;
  // console.log(s);
  let latitude = USER_DATA.current_location.latitude;
  let longitude = USER_DATA.current_location.longitude;
  let uid = USER_DATA.user_data.user_id;
  let time = new Date().toISOString().slice(0, 19).replace("T", " ");
  let inDanger = false;
  await checkInside(latitude, longitude, uid, time).then(async (t) => {
    await t.forEach(async (e) => {
      await sendPushNotification("Intruder Alert", e.message);
      inDanger = true;
    });
    await checkOutside(latitude, longitude, uid, time)
      .then(async (t) => {
        await t.forEach(async (e) => {
          await sendPushNotification("Extruder Alert", e.message);
          inDanger = true;
        });
      })
      .then(() => {
        if (callback) callback(inDanger);
      });
  });

  return inDanger;
}

const header = new Headers();
header.append("Content-Type", "application/json");

async function sendPushNotification(title, msg) {
  if (_notifications.token) {
    console.log("Push Notification called ");
    const message = {
      to: _notifications.token,
      sound: "default",
      title: title,
      body: msg,
      redirect: "follow",
    };

    fetch("http://fypams.000webhostapp.com/sendNotification.php", {
      method: "POST",
      headers: header,
      body: JSON.stringify(message),
    })
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }
}

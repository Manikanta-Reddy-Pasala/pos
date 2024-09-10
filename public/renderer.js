const { contextBridge, ipcRenderer, remote } = require('electron');

const {
  START_NOTIFICATION_SERVICE,
  NOTIFICATION_SERVICE_STARTED,
  NOTIFICATION_SERVICE_ERROR,
  NOTIFICATION_RECEIVED,
  TOKEN_UPDATED
} = require('electron-push-receiver/src/constants');

const { PosPrinter } = remote.require('oneshell-electron-pos-printer');

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => {
    // whitelist channels"
    let validChannels = ['toMain', 'print'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },

  PosPrinter: (data, options) => {
    // console.log("PosData",data)
    PosPrinter.print(data, options).catch((error) => console.log(error));
  },
  getPrinters: () => {
    let webContents = remote.getCurrentWebContents();
    let printers = webContents.getPrinters(); //list the printers
    // console.log(printers);
    return printers;
  }
});

// Listen for service successfully started
ipcRenderer.on(NOTIFICATION_SERVICE_STARTED, (_, token) => {
  // console.log('service successfully started', token);
  // console.log('token::', token);
  window.localStorage.setItem('firebasePlayerId', token);
});

// Handle notification errors
ipcRenderer.on(NOTIFICATION_SERVICE_ERROR, (_, error) => {
  console.log('notification error', error);
});

// Send FCM token to backend
ipcRenderer.on(TOKEN_UPDATED, (_, token) => {
  // console.log('token updated', token);
  window.localStorage.setItem('firebasePlayerId', token);
  // define the custom event
  let playerIdData = token;
  const myEvent = new CustomEvent('onPlayerIdEvent', {
    data: playerIdData
  });

  // dispatch the event
  window.dispatchEvent(myEvent);
});

// Display notification
ipcRenderer.on(NOTIFICATION_RECEIVED, (_, serverNotificationPayload) => {
  // check to see if payload contains a body string, if it doesn't consider it a silent push
  if (serverNotificationPayload.notification.body) {
    // payload has a body, so show it to the user
    console.log('display notification', serverNotificationPayload);

    let notificationData = {};

    notificationData.title = serverNotificationPayload.notification.title;
    notificationData.body = serverNotificationPayload.notification.body;

    console.log('notificationData', notificationData);
    window.localStorage.setItem('message', notificationData.body);

    // define the custom event
    const myEvent = new CustomEvent('onMessageEvent', {
      data: notificationData
    });

    // dispatch the event
    window.dispatchEvent(myEvent);
  } else {
    // payload has no body, so consider it silent (and just consider the data portion)
    console.log(
      'do something with the key/value pairs in the data',
      serverNotificationPayload.data
    );
  }
});

// Start service
const senderId = '626221847809'; // <-- replace with FCM sender ID from FCM web admin under Settings->Cloud Messaging
console.log('starting service and registering a client');

ipcRenderer.send(START_NOTIFICATION_SERVICE, senderId);

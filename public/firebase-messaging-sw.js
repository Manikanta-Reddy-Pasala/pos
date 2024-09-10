importScripts('https://www.gstatic.com/firebasejs/8.2.9/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.9/firebase-messaging.js');

const firebaseConfig = {
  apiKey: 'AIzaSyAl7Itzrh-ABvIWV6GzWiJAAznGdZq3O80',
  authDomain: 'oneshell-partner-6f48f.firebaseapp.com',
  databaseURL: 'https://oneshell-partner-6f48f.firebaseio.com',
  projectId: 'oneshell-partner-6f48f',
  storageBucket: 'oneshell-partner-6f48f.appspot.com',
  messagingSenderId: '626221847809',
  appId: '1:626221847809:web:822fa579e52c7f4bee3700',
  measurementId: 'G-62MK6PXJTF'
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

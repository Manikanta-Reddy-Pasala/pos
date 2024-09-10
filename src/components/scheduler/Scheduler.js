// import { useEffect } from 'react';
// import * as sync from './RePushUnSyncRecords';
//
// const Scheduler = () => {
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       // This code will run every 1 hours (3600000 milliseconds)
//       sync.pushNotSyncedRecordsFormTables();
//     }, 3600000);
//
//     // Clear the interval when the component unmounts
//     return () => {
//       clearInterval(intervalId);
//     };
//   }, []);
//
//   return null; // Since there's no UI component, return null
// };
//
// export default Scheduler;

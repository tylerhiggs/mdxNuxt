// import admin from "firebase-admin";
// import serviceAccount from "../secret-firebase-key.json";

// export default defineNuxtPlugin(() => {
//   try {
//     admin.initializeApp({
//       credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
//     });
//   } catch (e) {
//     console.error("Firebase Admin SDK initialization error:", e);
//   }
//   return {
//     provide: {
//       firebaseAdmin: admin,
//     },
//   };
// });

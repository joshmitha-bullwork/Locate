// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
// NOTE: For security, we use environment variables.
// Create a file named .env.local in the root of your project and add your
// Firebase configuration keys with the NEXT_PUBLIC_ prefix, like this:

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the app instance so it can be used in other files
export default app;

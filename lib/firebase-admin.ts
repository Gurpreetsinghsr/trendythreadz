import type { App } from "firebase-admin/app";
import type { Firestore } from "firebase-admin/firestore";

export const isAdminConfigured = !!(
  process.env.FIREBASE_ADMIN_CREDENTIALS ||
  process.env.GOOGLE_APPLICATION_CREDENTIALS
);

let _app: App | null = null;
let _db: Firestore | null = null;

function initAdmin(): App | null {
  if (_app) return _app;
  if (!isAdminConfigured) return null;

  try {
    const { initializeApp, getApps, cert } = require("firebase-admin/app");
    if (getApps().length) {
      _app = getApps()[0];
      return _app;
    }
    const creds = process.env.FIREBASE_ADMIN_CREDENTIALS
      ? JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS)
      : undefined;
    _app = initializeApp({
      credential: creds ? cert(creds) : undefined,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
    return _app;
  } catch (e) {
    console.error("Firebase Admin init error:", e);
    return null;
  }
}

export function getAdminDb(): Firestore | null {
  if (_db) return _db;
  const app = initAdmin();
  if (!app) return null;
  try {
    const { getFirestore } = require("firebase-admin/firestore");
    _db = getFirestore(app);
    return _db;
  } catch (e) {
    console.error("Firestore init error:", e);
    return null;
  }
}

// Firebase configuration for Volleyball Tournament Tracker
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue, update, remove } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA_s8dfX1jX3NHNikpYsIcTfxkromI7H1s",
    authDomain: "volleyball-tournament-tr-f8cd2.firebaseapp.com",
    databaseURL: "https://volleyball-tournament-tr-f8cd2-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "volleyball-tournament-tr-f8cd2",
    storageBucket: "volleyball-tournament-tr-f8cd2.firebasestorage.app",
    messagingSenderId: "981336109004",
    appId: "1:981336109004:web:87359f8572a8df30c3f769",
    measurementId: "G-8FBC1TVSMF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Initialize Analytics (only in browser)
let analytics = null;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}

// Database helper functions
export const dbRef = (path) => ref(database, path);

// Dynamic tournament path helper
export const getTournamentPath = (tournament, subPath) => `tournaments/${tournament}/${subPath}`;

// Global paths (not tournament-specific)
export const GLOBAL_PATHS = {
    language: 'league/language'
};

// Save data to database
export const saveData = async (path, data) => {
    try {
        await set(ref(database, path), data);
        return { success: true };
    } catch (error) {
        console.error("Error saving data:", error);
        return { success: false, error };
    }
};

// Get data from database
export const getData = async (path) => {
    try {
        const snapshot = await get(ref(database, path));
        if (snapshot.exists()) {
            return { success: true, data: snapshot.val() };
        } else {
            return { success: true, data: null };
        }
    } catch (error) {
        console.error("Error getting data:", error);
        return { success: false, error };
    }
};

// Update data in database
export const updateData = async (path, data) => {
    try {
        await update(ref(database, path), data);
        return { success: true };
    } catch (error) {
        console.error("Error updating data:", error);
        return { success: false, error };
    }
};

// Delete data from database
export const deleteData = async (path) => {
    try {
        await remove(ref(database, path));
        return { success: true };
    } catch (error) {
        console.error("Error deleting data:", error);
        return { success: false, error };
    }
};

// Subscribe to real-time updates
export const subscribeToData = (path, callback) => {
    const unsubscribe = onValue(ref(database, path), (snapshot) => {
        const data = snapshot.exists() ? snapshot.val() : null;
        callback(data);
    }, (error) => {
        console.error("Error subscribing to data:", error);
        callback(null, error);
    });

    return unsubscribe;
};

export { app, database, analytics };

const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const initialTeamsData = [
  { code: 'A1', name: 'Zlatý jádro Kladno', group: 'A' },
  // ... все команды
];

const initialMatchesData = [
  { id: 'A1-A2', court: 1, time: '09:00', team1: 'A1', team2: 'A2', group: 'A', 
    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, 
    set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  // ... все матчи
];

async function initializeData() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Добавляем команды
  await Promise.all(initialTeamsData.map(team => 
    setDoc(doc(db, "teams", team.code), team)
  ));
  
  // Добавляем матчи
  await Promise.all(initialMatchesData.map(match =>
    setDoc(doc(db, "matches", match.id), match)
  ));
  
  console.log("✅ Данные успешно инициализированы в Firestore");
}

initializeData().catch(e => {
  console.error("❌ Ошибка инициализации:", e);
  process.exit(1);
});

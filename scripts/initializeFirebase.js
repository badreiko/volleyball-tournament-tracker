// scripts/initializeFirebase.js

// Загрузка переменных окружения из файла .env
// Убедитесь, что файл .env находится в корне проекта
require('dotenv').config();

const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");

// --- Конфигурация Firebase (читается из .env) ---
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// --- Начальные данные ---
// ВАЖНО: Убедитесь, что эти данные полные и не содержат undefined!
const initialTeamsData = [
  { code: 'A1', name: 'Zlatý jádro Kladno', group: 'A' },
  { code: 'A2', name: 'Spořilov Praha', group: 'A' },
  { code: 'A3', name: 'Lážo Plážo Děčín', group: 'A' },
  { code: 'B1', name: 'Všude zdejší Slaný', group: 'B' },
  { code: 'B2', name: 'Sokol Benešov', group: 'B' },
  { code: 'B3', name: 'Kaliči Teplice', group: 'B' },
  { code: 'C1', name: 'DREAM TEAM Pardubice', group: 'C' },
  { code: 'C2', name: 'UB Mongolsko', group: 'C' },
  { code: 'C3', name: 'GNA Praha', group: 'C' },
  { code: 'C4', name: 'Bon Team Trutnov', group: 'C' },
];

const initialMatchesData = [
  // Группа A
  { id: 'A1-A2', court: 1, time: '09:00', team1: 'A1', team2: 'A2', group: 'A', 
    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, 
    set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  { id: 'A1-A3', court: 1, time: '10:30', team1: 'A1', team2: 'A3', group: 'A', 
    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, 
    set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  { id: 'A2-A3', court: 2, time: '09:00', team1: 'A2', team2: 'A3', group: 'A', 
    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, 
    set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  { id: 'A2-A1', court: 2, time: '12:30', team1: 'A2', team2: 'A1', group: 'A', 
    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, 
    set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  { id: 'A3-A1', court: 3, time: '11:00', team1: 'A3', team2: 'A1', group: 'A', 
    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, 
    set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  { id: 'A3-A2', court: 3, time: '12:30', team1: 'A3', team2: 'A2', group: 'A', 
    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, 
    set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },

  // Группа B
  { id: 'B1-B2', court: 1, time: '11:00', team1: 'B1', team2: 'B2', group: 'B', 
    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, 
    set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  { id: 'B1-B3', court: 1, time: '13:00', team1: 'B1', team2: 'B3', group: 'B', 
    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, 
    set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  { id: 'B2-B3', court: 2, time: '11:00', team1: 'B2', team2: 'B3', group: 'B', 
    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, 
    set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  { id: 'B2-B1', court: 2, time: '13:00', team1: 'B2', team2: 'B1', group: 'B', 
    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, 
    set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  { id: 'B3-B1', court: 3, time: '11:00', team1: 'B3', team2: 'B1', group: 'B', 
    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, 
    set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  { id: 'B3-B2', court: 3, time: '13:00', team1: 'B3', team2: 'B2', group: 'B', 
    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, 
    set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },

  // Группа C
  { id: 'C1-C2', court: 1, time: '09:30', team1: 'C1', team2: 'C2', group: 'C', 
    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, 
    set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  { id: 'C1-C3', court: 1, time: '10:00', team1: 'C1', team2: 'C3', group: 'C', 
    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, 
    set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  { id: 'C1-C4', court: 1, time: '10:30', team1: 'C1', team2: 'C4', group: 'C', 
    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, 
    set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  { id: 'C2-C3', court: 2, time: '09:30', team1: 'C2', team2: 'C3', group: 'C', 
    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, 
    set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  { id: 'C2-C4', court: 2, time: '10:00', team1: 'C2', team2: 'C4', group: 'C', 
    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, 
    set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  { id: 'C3-C4', court: 3, time: '09:30', team1: 'C3', team2: 'C4', group: 'C', 
    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, 
    set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },

  // Плей-офф
  { id: 'QF1', court: 1, time: '14:00', team1: 'A1', team2: 'B2', group: null, 
    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, 
    set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'quarterfinal' },
  { id: 'QF2', court: 2, time: '14:00', team1: 'B1', team2: 'A2', group: null, 
    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, 
    set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'quarterfinal' },
  { id: 'SF1', court: 1, time: '15:30', team1: 'QF1_winner', team2: 'QF2_winner', group: null, 
    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, 
    set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'semifinal' },
  { id: 'FINAL', court: 1, time: '17:00', team1: 'SF1_winner', team2: 'SF2_winner', group: null, 
    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, 
    set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'final' }
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
  
  console.log("✅ Все данные успешно загружены в Firestore");
  console.log(`Загружено: ${initialTeamsData.length} команд и ${initialMatchesData.length} матчей`);
}

initializeData().catch(console.error);
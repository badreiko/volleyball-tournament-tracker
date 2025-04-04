const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const { firebaseConfig } = require('./src/firebaseConfig');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkData() {
  try {
    // Проверка команд
    const teamsSnapshot = await getDocs(collection(db, 'teams'));
    console.log('Найдено команд:', teamsSnapshot.size);
    
    // Проверка матчей
    const matchesSnapshot = await getDocs(collection(db, 'matches'));
    console.log('Найдено матчей:', matchesSnapshot.size);
    
    if (teamsSnapshot.size === 0 || matchesSnapshot.size === 0) {
      console.log('Данные не найдены. Запустите инициализацию: npm run initialize-firebase');
    } else {
      console.log('✅ Данные успешно загружены в Firestore');
    }
  } catch (error) {
    console.error('Ошибка проверки:', error);
  }
}

checkData();

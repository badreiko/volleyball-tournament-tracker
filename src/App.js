import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
// Добавлена иконка FaWhistle
import { FaVolleyballBall, FaUsers, FaTrophy, FaRegClock, FaCheck, FaGlobe, FaExclamationTriangle, FaCalendarAlt, FaTable, FaChartBar, FaMapMarkerAlt, FaLink, FaBullhorn } from 'react-icons/fa';
import { translations, languageNames } from './translations';

// Начальные данные команд
const initialTeams = [
    { code: 'A1', name: 'Zlatý jádro Kladno', group: 'A', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0 },
    { code: 'A2', name: 'Spořilov Praha', group: 'A', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0 },
    { code: 'A3', name: 'Lážo Plážo Děčín', group: 'A', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0 },
    { code: 'B1', name: 'Všude zdejší Slaný', group: 'B', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0 },
    { code: 'B2', name: 'Sokol Benešov', group: 'B', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0 },
    { code: 'B3', name: 'Kaliči Teplice', group: 'B', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0 },
    { code: 'C1', name: 'DREAM TEAM Pardubice', group: 'C', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0 },
    { code: 'C2', name: 'UB Mongolsko', group: 'C', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0 },
    { code: 'C3', name: 'GNA Praha', group: 'C', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0 },
    { code: 'C4', name: 'Bon Team Trutnov', group: 'C', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0 },
];

// Начальные данные матчей с добавленными судьями и скорректированным временем
const initialMatches = [
      // Групповой этап - Группа A
      { id: 'A1-A2', court: 1, time: '09:00', team1: 'A1', team2: 'A2', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A3' },
      // Время изменено на 10:40 согласно документу (был 09:40)
      { id: 'A2-A3', court: 1, time: '10:40', team1: 'A2', team2: 'A3', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A1' },
      // Время изменено на 09:50 согласно документу (был 10:20)
      { id: 'A1-A3', court: 1, time: '09:50', team1: 'A1', team2: 'A3', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'C4' },
      // Групповой этап - Группа B
      // Время изменено на 09:50 согласно документу (был 09:00)
      { id: 'B1-B2', court: 2, time: '09:50', team1: 'B1', team2: 'B2', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B3' },
      // Время изменено на 11:30 согласно документу (был 09:40)
      { id: 'B2-B3', court: 2, time: '11:30', team1: 'B2', team2: 'B3', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B1' },
      // Время изменено на 10:40 согласно документу (был 10:20)
      { id: 'B1-B3', court: 2, time: '10:40', team1: 'B1', team2: 'B3', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B2' },
      // Групповой этап - Группа C
      { id: 'C1-C2', court: 3, time: '09:00', team1: 'C1', team2: 'C2', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B1' },
      // Время изменено на 09:00 согласно документу (был 09:40)
      { id: 'C3-C4', court: 3, time: '09:00', team1: 'C3', team2: 'C4', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B2' },
      // Время изменено на 11:30 согласно документу (был 10:20)
      { id: 'C1-C3', court: 3, time: '11:30', team1: 'C1', team2: 'C3', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A3' },
      // Время изменено на 11:30 согласно документу (был 11:00)
      { id: 'C2-C4', court: 3, time: '11:30', team1: 'C2', team2: 'C4', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A2' },
      // Время изменено на 10:40 согласно документу (был 11:40)
      { id: 'C1-C4', court: 3, time: '10:40', team1: 'C1', team2: 'C4', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'C2' },
      // Время изменено на 09:50 согласно документу (был 12:20)
      { id: 'C2-C3', court: 3, time: '09:50', team1: 'C2', team2: 'C3', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'C1' },
      // Четвертьфиналы
      // Время и судья изменены
      { id: 'QF-1A-1C', court: 1, time: '12:30', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'quarterfinal', refereeTeamCode: '1B' },
      // Время изменено, судья '??' -> null
      { id: 'QF-1B-2C', court: 2, time: '13:20', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'quarterfinal', refereeTeamCode: null },
      // Время и судья изменены
      { id: 'QF-2A-3B', court: 1, time: '12:30', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'quarterfinal', refereeTeamCode: '3C' },
      // Время и судья изменены
      { id: 'QF-3A-2B', court: 2, time: '12:30', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'quarterfinal', refereeTeamCode: '4C' },
      // Полуфиналы
      // Время изменено, судья 'pQ' -> null
      { id: 'SF-W1-W3', court: 1, time: '14:10', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'semifinal', refereeTeamCode: null },
      // Время изменено, судья 'pQ' -> null
      { id: 'SF-W2-W4', court: 2, time: '14:10', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'semifinal', refereeTeamCode: null },
      // Матч за 3-е место
      { id: 'F3-L1-L2', court: 2, time: '15:00', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'third_place', refereeTeamCode: null },
      // Финал
      // Время изменено, судья 'pSF' -> null
      { id: 'F-W1-W2', court: 1, time: '15:10', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'final', refereeTeamCode: null }
];

// Функция для безопасного парсинга JSON из localStorage
const loadFromLocalStorage = (key, defaultValue) => {
    try {
        const storedValue = localStorage.getItem(key);
        // Добавим проверку на null или undefined перед парсингом
        if (storedValue === null || storedValue === undefined) {
            return defaultValue;
        }
        return JSON.parse(storedValue);
    } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
        // В случае ошибки парсинга, лучше вернуть значение по умолчанию
        return defaultValue;
    }
};

// Функция для безопасной записи в localStorage
const saveToLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving to localStorage key "${key}":`, error);
        // Здесь можно добавить логику обработки ошибки, например, уведомление пользователю
    }
};


function App() {
  // --- Инициализация состояния из localStorage ---
  const [teams, setTeams] = useState(() => loadFromLocalStorage('teams', initialTeams));
  const [matches, setMatches] = useState(() => {
        const loadedMatches = loadFromLocalStorage('matches', initialMatches);
        // Обновляем информацию о судьях и времени из initialMatches при загрузке
        return loadedMatches.map(loadedMatch => {
            const initialMatchData = initialMatches.find(im => im.id === loadedMatch.id);
            return {
                ...loadedMatch,
                refereeTeamCode: initialMatchData?.refereeTeamCode ?? null,
                time: initialMatchData?.time ?? loadedMatch.time
            };
        });
  });
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'cs');
  const [tournamentSettings, setTournamentSettings] = useState(() => loadFromLocalStorage('tournamentSettings', { useTotalPointsForTie: true }));

  // UI состояния
  const [view, setView] = useState('matches');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showRules, setShowRules] = useState(false);
  // --- /Состояния ---

  const t = translations[language] || translations['cs'];

  // --- Сохранение данных в localStorage при их изменении ---
  useEffect(() => {
    saveToLocalStorage('teams', teams);
    saveToLocalStorage('matches', matches);
    // Язык сохраняем отдельно, так как он не объект/массив
    try {
        localStorage.setItem('language', language);
    } catch (error) {
        console.error(`Error saving language to localStorage:`, error);
    }
    saveToLocalStorage('tournamentSettings', tournamentSettings);
  }, [teams, matches, language, tournamentSettings]);


  // --- Пересчет всей статистики команд ---
  // --- Пересчет всей статистики команд ---
const recalculateAllTeamStats = useCallback((currentMatches) => {
  setTeams(prevBaseTeams => {
      let calculatedTeams = initialTeams.map(initialTeam => {
          const currentBaseInfo = prevBaseTeams.find(pt => pt.code === initialTeam.code) || initialTeam;
          return { ...currentBaseInfo, points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0 };
      });

      const completedGroupMatches = currentMatches.filter(m =>
          m.round === 'group' &&
          (m.status === 'completed' || m.status === 'completed_by_points' || m.winner !== null)
      );

      completedGroupMatches.forEach(match => {
          const team1Index = calculatedTeams.findIndex(t => t.code === match.team1);
          const team2Index = calculatedTeams.findIndex(t => t.code === match.team2);
          if (team1Index === -1 || team2Index === -1) return;

          let team1 = calculatedTeams[team1Index];
          let team2 = calculatedTeams[team2Index];
          
          // Подсчитываем количество выигранных сетов для каждой команды
          let team1SetsWon = 0, team2SetsWon = 0;
          
          // Учитываем первый сет
          if (match.set1Team1 > match.set1Team2) team1SetsWon++;
          else if (match.set1Team2 > match.set1Team1) team2SetsWon++;
          
          // Учитываем второй сет
          if (match.set2Team1 > match.set2Team2) team1SetsWon++;
          else if (match.set2Team2 > match.set2Team1) team2SetsWon++;
          
          // Проверяем третий сет (тайбрейк)
          let tiebreakWinner = null;
          if (match.set3Team1 >= 5) tiebreakWinner = team1.code;
          else if (match.set3Team2 >= 5) tiebreakWinner = team2.code;
          
          // Если есть победитель тайбрейка, считаем это как выигранный сет
          if (tiebreakWinner === team1.code) team1SetsWon++;
          else if (tiebreakWinner === team2.code) team2SetsWon++;
          
          let team1Points = 0, team2Points = 0;

          // Определяем победителя матча и начисляем очки
          if (match.winner === team1.code) {
              // 3 очка за "сухую" победу 2:0
              // 2 очка за победу с тайбрейком или по сумме очков
              team1Points = (team1SetsWon === 2 && team2SetsWon === 0) ? 3 : 2;
              team2Points = (team1SetsWon === 2 && team2SetsWon === 0) ? 0 : 1;
              team1.wins += 1; 
              team2.losses += 1;
          } else if (match.winner === team2.code) {
              team2Points = (team2SetsWon === 2 && team1SetsWon === 0) ? 3 : 2;
              team1Points = (team2SetsWon === 2 && team1SetsWon === 0) ? 0 : 1;
              team2.wins += 1; 
              team1.losses += 1;
          }

          // Обновляем статистику команд
          team1.points += team1Points; 
          team1.setsWon += team1SetsWon; 
          team1.setsLost += team2SetsWon;
          team2.points += team2Points; 
          team2.setsWon += team2SetsWon; 
          team2.setsLost += team1SetsWon;

          calculatedTeams[team1Index] = team1;
          calculatedTeams[team2Index] = team2;
      });
      
      console.log("Recalculated team stats", calculatedTeams);
      return calculatedTeams;
  });
}, []);


  // --- Обновление плей-офф команд ---
  const updatePlayoffTeams = useCallback((currentMatches, currentTeams) => {
    const groupRankings = {};
    ['A', 'B', 'C'].forEach(group => {
        groupRankings[group] = [...currentTeams]
            .filter(t => t.group === group)
            .sort((a, b) => b.points - a.points || (b.setsWon - b.setsLost) - (a.setsWon - a.setsLost) || b.setsWon - a.setsWon || a.name.localeCompare(b.name));
    });

    setMatches(prevMatches => {
        let changed = false;
        // Используем map для создания нового массива, чтобы React точно заметил изменения
        const updatedMatchesArray = prevMatches.map(match => {
            if (match.round !== 'group') {
                const updatedMatch = { ...match }; // Создаем копию для изменений
                let team1Code = null; let team2Code = null;

                // Логика определения кодов команд
                 if (match.id === 'QF-1A-1C') { team1Code = groupRankings['A'][0]?.code; team2Code = groupRankings['C'][0]?.code; }
                 else if (match.id === 'QF-1B-2C') { team1Code = groupRankings['B'][0]?.code; team2Code = groupRankings['C'][1]?.code; }
                 else if (match.id === 'QF-2A-3B') { team1Code = groupRankings['A'][1]?.code; team2Code = groupRankings['B'][2]?.code; }
                 else if (match.id === 'QF-3A-2B') { team1Code = groupRankings['A'][2]?.code; team2Code = groupRankings['B'][1]?.code; }
                 else if (match.id === 'SF-W1-W3') { const qf1 = currentMatches.find(m => m.id === 'QF-1A-1C'); const qf3 = currentMatches.find(m => m.id === 'QF-2A-3B'); team1Code = qf1?.winner; team2Code = qf3?.winner; }
                 else if (match.id === 'SF-W2-W4') { const qf2 = currentMatches.find(m => m.id === 'QF-1B-2C'); const qf4 = currentMatches.find(m => m.id === 'QF-3A-2B'); team1Code = qf2?.winner; team2Code = qf4?.winner; }
                 else if (match.id === 'F-W1-W2') { const sf1 = currentMatches.find(m => m.id === 'SF-W1-W3'); const sf2 = currentMatches.find(m => m.id === 'SF-W2-W4'); team1Code = sf1?.winner; team2Code = sf2?.winner; }
                 else if (match.id === 'F3-L1-L2') {
                     const sf1 = currentMatches.find(m => m.id === 'SF-W1-W3'); const sf2 = currentMatches.find(m => m.id === 'SF-W2-W4');
                     const loser1 = (sf1?.winner && sf1.team1 && sf1.team2) ? (sf1.winner === sf1.team1 ? sf1.team2 : sf1.team1) : null;
                     const loser2 = (sf2?.winner && sf2.team1 && sf2.team2) ? (sf2.winner === sf2.team1 ? sf2.team2 : sf2.team1) : null;
                     team1Code = loser1; team2Code = loser2;
                 }

                // Обновляем, если изменилось
                if (updatedMatch.team1 !== (team1Code || null)) { updatedMatch.team1 = team1Code || null; changed = true; }
                if (updatedMatch.team2 !== (team2Code || null)) { updatedMatch.team2 = team2Code || null; changed = true; }

                // Обновляем статус
                const oldStatus = updatedMatch.status;
                if (updatedMatch.team1 && updatedMatch.team2 && updatedMatch.status === 'waiting') {
                    updatedMatch.status = 'not_started';
                } else if ((!updatedMatch.team1 || !updatedMatch.team2) && updatedMatch.status === 'not_started') {
                     updatedMatch.status = 'waiting';
                     updatedMatch.set1Team1=0; updatedMatch.set1Team2=0; updatedMatch.set2Team1=0; updatedMatch.set2Team2=0; updatedMatch.set3Team1=0; updatedMatch.set3Team2=0; updatedMatch.winner=null;
                }
                 if (oldStatus !== updatedMatch.status) changed = true;

                 return updatedMatch; // Возвращаем обновленную копию
            }
            return match; // Возвращаем оригинальный объект, если не плей-офф
        });

        if (changed) {
            console.log("Updating matches state with playoff team changes.");
            return updatedMatchesArray; // Возвращаем новый массив
        } else {
            console.log("Playoff teams unchanged.");
            return prevMatches; // Возвращаем старое состояние, чтобы не вызывать лишний ререндер
        }
    });
  }, []);


  // --- Обновление счета матча (для localStorage версии) ---
  // --- Обновление счета матча (для localStorage версии) ---
const updateMatchScore = useCallback((matchId, set, team, scoreStr) => {
  const score = parseInt(scoreStr) >= 0 ? parseInt(scoreStr) : 0;
  let needsRecalculation = false;
  let modifiedMatches = []; // Для передачи в recalculate и updatePlayoff

  setMatches(prevMatches => {
    const updatedMatches = prevMatches.map(match => {
      if (match.id === matchId) {
        const updatedMatch = { ...match }; // Работаем с копией
        const field = `set${set}${team === 'team1' ? 'Team1' : 'Team2'}`;

        if (updatedMatch[field] === score) return match; // Если счет не изменился, вернуть старый объект

        updatedMatch[field] = score;

        const useTotalPointsRule = tournamentSettings.useTotalPointsForTie;
        let newWinner = updatedMatch.winner;
        let newStatus = updatedMatch.status;
        const { set1Team1, set1Team2, set2Team1, set2Team2, set3Team1, set3Team2 } = updatedMatch;
        const hasScores = (set1Team1 > 0 || set1Team2 > 0 || set2Team1 > 0 || set2Team2 > 0 || set3Team1 > 0 || set3Team2 > 0);
        const oldStatus = match.status;

        // --- Логика определения статуса/победителя ---
        // Проверка третьего сета (тайбрейка) - переместили в начало для приоритетной обработки
        if (set === 3 || (set3Team1 > 0 || set3Team2 > 0)) {
            // Правило тайбрейка: победа просто при достижении 5 очков
            if (set3Team1 >= 5) {
                newWinner = updatedMatch.team1;
                newStatus = 'completed';
            } else if (set3Team2 >= 5) {
                newWinner = updatedMatch.team2;
                newStatus = 'completed';
            } else if (set3Team1 > 0 || set3Team2 > 0) {
                // Если в третьем сете есть очки, но никто не достиг 5,
                // значит матч в процессе тайбрейка
                newWinner = null;
                newStatus = 'tie_needs_tiebreak';
            }
        } 
        // Финал имеет особые правила (до 2 побед из 3 сетов)
        else if (updatedMatch.round === 'final') {
            let t1w=(set1Team1>set1Team2?1:0)+(set2Team1>set2Team2?1:0)+(set3Team1>set3Team2?1:0);
            let t2w=(set1Team2>set1Team1?1:0)+(set2Team2>set2Team1?1:0)+(set3Team2>set3Team1?1:0);
            if(t1w>=2){newWinner=updatedMatch.team1;newStatus='completed';}
            else if(t2w>=2){newWinner=updatedMatch.team2;newStatus='completed';}
            else if(hasScores){newWinner=null;newStatus='in_progress';}
            else {newWinner=null;newStatus='not_started';}
        } 
        // Обычные матчи (до 2 сетов или до 1:1 + подсчет очков)
        else if (set >= 2 || (set2Team1 > 0 || set2Team2 > 0)) {
            let t1s=(set1Team1>set1Team2?1:0)+(set2Team1>set2Team2?1:0);
            let t2s=(set1Team2>set1Team1?1:0)+(set2Team2>set2Team1?1:0);
            if(t1s===2){newWinner=updatedMatch.team1;newStatus='completed';}
            else if(t2s===2){newWinner=updatedMatch.team2;newStatus='completed';}
            else if(t1s===1 && t2s===1){
                if(useTotalPointsRule){
                    const t1=set1Team1+set2Team1; const t2=set1Team2+set2Team2;
                    if(t1>t2){newWinner=updatedMatch.team1;newStatus='completed_by_points';}
                    else if(t2>t1){newWinner=updatedMatch.team2;newStatus='completed_by_points';}
                    else{newWinner=null;newStatus='tie_needs_tiebreak';}
                } else {newWinner=null;newStatus='tie_needs_tiebreak';}
            } else if(hasScores){newWinner=null;newStatus='in_progress';}
            else {newWinner=null;newStatus='not_started';}
        } else if (set === 1 || (set1Team1 > 0 || set1Team2 > 0)) {
            newWinner = null;
            newStatus = hasScores ? 'in_progress' : 'not_started';
        }

        if (newStatus !== 'not_started' && !hasScores) { newStatus = 'not_started'; newWinner = null; }
        if (oldStatus?.startsWith('completed') && !newStatus.startsWith('completed')) { newWinner = null; }
        // --- Конец логики статуса ---

        updatedMatch.status = newStatus;
        updatedMatch.winner = newWinner;

        if (newStatus.startsWith('completed') && oldStatus !== newStatus) {
            needsRecalculation = true;
        }
        if (oldStatus?.startsWith('completed') && !newStatus.startsWith('completed')) {
            needsRecalculation = true;
        }

        return updatedMatch;
      }
      return match;
    });
    // Сохраняем обновленные матчи для передачи в recalculate/updatePlayoff
    modifiedMatches = updatedMatches;
    return updatedMatches; // Возвращаем новый массив для обновления состояния
  });

  if (needsRecalculation) {
      // Передаем обновленный массив матчей и текущее состояние команд
      recalculateAllTeamStats(modifiedMatches);
      // setTeams вызовет обновление, и updatePlayoffTeams сработает в useEffect
      // Используем setTimeout, чтобы дать React время обновить состояние teams перед updatePlayoffTeams
      setTimeout(() => {
           // Передаем обновленные матчи и актуальные команды
           setTeams(currentTeams => { // Получаем самое свежее состояние teams
               updatePlayoffTeams(modifiedMatches, currentTeams);
               return currentTeams; // Не меняем teams здесь
           });
      }, 0);
  }

}, [tournamentSettings, recalculateAllTeamStats, updatePlayoffTeams, teams]); // Добавили teams


  // --- Обновление Настроек ---
  const handleSettingsChange = useCallback((newSettingValue) => {
      const newSettings = { ...tournamentSettings, useTotalPointsForTie: newSettingValue };
      setTournamentSettings(newSettings);
      // Пересчет статистики и плей-офф после изменения настроек
      setTimeout(() => {
           // Передаем текущие матчи и команды
           recalculateAllTeamStats(matches);
            setTimeout(() => {
                setTeams(currentTeams => { // Получаем свежие команды
                    updatePlayoffTeams(matches, currentTeams);
                    return currentTeams;
                });
           }, 0);
       }, 0);
  }, [tournamentSettings, recalculateAllTeamStats, updatePlayoffTeams, matches]); // Добавили matches


  // --- UI ---
  const changeLanguage = useCallback((lang) => {
    if (translations[lang]) {
        setLanguage(lang);
        // localStorage обновится в главном useEffect
    } else {
        setLanguage('cs');
    }
  }, []);


  // --- Функции рендеринга (мемоизированные) ---
  const renderMatches = useCallback(() => {
       return (
         <div className="p-4 overflow-x-auto">
           <h2 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center"><FaVolleyballBall className="mr-3 text-indigo-600" /><span>{t.matches}</span></h2>
           {matches.length === 0 && <p className="text-center p-4">{t.noMatches || 'Матчи не найдены.'}</p>}
           {matches.length > 0 && (
              <div className="bg-gradient-to-r from-[#C1CBA7] to-[#0B8E8D]/10 p-4 md:p-6 rounded-xl shadow-lg">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                  <thead className="bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs md:text-sm">{t.round}</th>
                      <th className="py-3 px-4 text-left text-xs md:text-sm">{t.match}</th>
                      <th className="py-3 px-4 text-center text-xs md:text-sm">{t.court}</th>
                      <th className="py-3 px-4 text-center text-xs md:text-sm">{t.time}</th>
                      {/* Новый столбец судьи */}
                      <th className="py-3 px-4 text-left text-xs md:text-sm">{t.referee || 'Судья'}</th>
                      <th className="py-3 px-4 text-center text-xs md:text-sm">{t.set1}</th>
                      <th className="py-3 px-4 text-center text-xs md:text-sm">{t.set2}</th>
                      <th className="py-3 px-4 text-center text-xs md:text-sm">{t.set3}</th>
                      <th className="py-3 px-4 text-left text-xs md:text-sm">{t.status}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...matches].sort((a, b) => a.time.localeCompare(b.time) || a.court - b.court).map(match => {
                         const team1 = teams.find(tm => tm.code === match.team1);
                         const team2 = teams.find(tm => tm.code === match.team2);
                         const refereeTeam = teams.find(tm => tm.code === match.refereeTeamCode);
                         const team1Name = team1?.name || (match.round !== 'group' && match.team1 ? `...` : t.tbd);
                         const team2Name = team2?.name || (match.round !== 'group' && match.team2 ? `...` : t.tbd);
                         const refereeName = refereeTeam?.name || (match.refereeTeamCode ? `(${match.refereeTeamCode})` : t.refereeTBD || '???');
                         let statusIcon, statusClass, statusText; const currentStatus = match.status || 'unknown'; statusText = t.statusNames?.[currentStatus] || currentStatus;
                         if(currentStatus==='completed'){statusIcon=<FaCheck className="mr-1 text-green-500"/>;statusClass='text-green-600 font-semibold';}else if(currentStatus==='completed_by_points'){statusIcon=<FaCheck className="mr-1 text-blue-500"/>;statusClass='text-blue-600 font-semibold';}else if(currentStatus==='tie_needs_tiebreak'){statusIcon=<FaExclamationTriangle className="mr-1 text-red-500"/>;statusClass='text-red-600 font-semibold';}else if(currentStatus==='in_progress'){statusIcon=<FaRegClock className="mr-1 text-yellow-600 animate-spin" style={{animationDuration:'2s'}}/>;statusClass='text-yellow-700 font-semibold';}else if(currentStatus==='waiting'){statusIcon=<FaRegClock className="mr-1 text-gray-400"/>;statusClass='text-gray-500';}else{statusIcon=<FaRegClock className="mr-1 text-gray-500"/>;statusClass='text-gray-600';}
                         let roundClass='px-2 py-1 rounded text-xs font-semibold inline-block'; const currentRound = match.round || 'unknown'; const roundText = t.roundNames?.[currentRound] || currentRound;
                         if(currentRound==='group'){roundClass+=' bg-[#C1CBA7]/50 text-[#06324F]';}else if(currentRound==='quarterfinal'){roundClass+=' bg-[#0B8E8D]/20 text-[#0B8E8D]';}else if(currentRound==='semifinal'){roundClass+=' bg-[#06324F]/20 text-[#06324F]';}else if(currentRound==='third_place'){roundClass+=' bg-orange-100 text-orange-700';}else if(currentRound==='final'){roundClass+=' bg-[#FDD80F]/20 text-[#FDD80F]/90';}else{roundClass+=' bg-gray-200 text-gray-700';}
                         const showThirdSet=currentRound==='final'||currentStatus==='tie_needs_tiebreak'||(match.set3Team1>0||match.set3Team2>0); const canOpenDetail=match.team1&&match.team2&&currentStatus!=='waiting';
                         return (
                             <tr key={match.id} className={`border-b transition-colors duration-150 ease-in-out ${canOpenDetail ? 'hover:bg-[#0B8E8D]/10 cursor-pointer' : 'opacity-70'}`} onClick={canOpenDetail ? () => { setView('matchDetail'); setSelectedMatch(match); } : undefined}>
                             <td className="p-2 text-sm md:text-base"><span className={roundClass}>{roundText}</span></td>
                             <td className="p-2 text-sm md:text-base font-medium">{team1Name} <span className="text-gray-400 mx-1">vs</span> {team2Name} {match.winner && (<FaTrophy className={`inline ml-1 ${match.winner === team1?.code ? 'text-yellow-500' : match.winner === team2?.code ? 'text-yellow-500' : 'text-gray-400'}`} title={`${t.winner}: ${teams.find(w => w.code === match.winner)?.name || '?'}`} />)}</td>
                             <td className="p-2 text-sm md:text-base text-center">{match.court}</td>
                             <td className="p-2 text-sm md:text-base text-gray-700 text-center"><div className="flex items-center justify-center"><FaCalendarAlt className="mr-1 text-indigo-500 hidden md:inline" />{match.time}</div></td>
                             {/* Отображение судьи */}
                             <td className="p-2 text-xs text-gray-600"><div className="flex items-center"><FaBullhorn className="mr-1 text-gray-400 flex-shrink-0" /><span>{refereeName}</span></div></td>
                             <td className="p-2 text-sm md:text-base font-bold text-center">{match.set1Team1 ?? 0}-{match.set1Team2 ?? 0}</td>
                             <td className="p-2 text-sm md:text-base font-bold text-center">{match.set2Team1 ?? 0}-{match.set2Team2 ?? 0}</td>
                             <td className="p-2 text-sm md:text-base font-bold text-center">{showThirdSet ? `${match.set3Team1 ?? 0}-${match.set3Team2 ?? 0}` : '-'}</td>
                             <td className={`p-2 text-sm md:text-base ${statusClass}`}><div className="flex items-center">{statusIcon}{statusText}</div></td>
                             </tr>
                         );
                    })}
                  </tbody>
                </table>
              </div>
           )}
         </div>
       );
   }, [matches, teams, t, setView, setSelectedMatch]);

  const renderGroups = useCallback(() => {
       return (
         <div className="p-4">
           <h2 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center"><FaUsers className="mr-3 text-indigo-600" /><span>{t.groups}</span></h2>
            {teams.length === 0 && <p className="text-center p-4">{t.noTeams || 'Команды не найдены.'}</p>}
            {teams.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['A', 'B', 'C'].map(group => {
                   const groupColors = {'A':{bg:'from-[#C1CBA7] to-[#0B8E8D]',lightBg:'from-[#C1CBA7]/20 to-[#0B8E8D]/10',text:'text-blue-700',border:'border-blue-200'},'B':{bg:'from-[#06324F] to-[#0B8E8D]',lightBg:'from-[#06324F]/10 to-[#0B8E8D]/10',text:'text-purple-700',border:'border-purple-200'},'C':{bg:'from-[#FDD80F] to-[#0B8E8D]',lightBg:'from-[#FDD80F]/10 to-[#0B8E8D]/10',text:'text-green-700',border:'border-green-200'}}; const colors = groupColors[group];
                   const groupTeams = teams.filter(tm => tm.group === group);
                  return (
                    <div key={group} className={`bg-gradient-to-r ${colors.lightBg} rounded-xl shadow-lg overflow-hidden`}>
                      <div className={`bg-gradient-to-r ${colors.bg} p-4 text-white`}><h3 className="text-xl font-bold flex items-center"><FaTable className="mr-2" /> {t.group} {group}</h3></div>
                      <div className="p-4 overflow-x-auto">
                         {groupTeams.length === 0 ? <p className="text-center text-gray-500 py-4">{t.noTeamsInGroup || 'Нет команд'}</p> : (
                            <table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
                              <thead className="bg-gray-50"><tr><th className="p-3 text-left text-xs md:text-sm font-semibold text-gray-700">{t.team}</th><th className="p-3 text-center text-xs md:text-sm font-semibold text-gray-700">{t.points}</th><th className="p-3 text-center text-xs md:text-sm font-semibold text-gray-700" title={t.winsLosses||'П/П'}>{t.winsLossesShort}</th><th className="p-3 text-center text-xs md:text-sm font-semibold text-gray-700" title={t.sets||'Сеты'}>{t.setsShort}</th><th className="p-3 text-center text-xs md:text-sm font-semibold text-gray-700" title={t.setsDifference||'Разн.'}>{t.setsDiffShort}</th></tr></thead>
                              <tbody>
                                {[...groupTeams].sort((a, b) => b.points - a.points || (b.setsWon - b.setsLost) - (a.setsWon - a.setsLost) || b.setsWon - a.setsWon || a.name.localeCompare(b.name)).map((team, index) => (
                                    <tr key={team.code} className={`${index < 2 ? 'bg-green-50' : ''} ${index === 0 ? 'font-bold' : ''} border-b ${colors.border} hover:bg-gray-50 transition-colors duration-150`}>
                                      <td className="p-3 text-sm md:text-base">{index < 3 && <FaTrophy className={`inline mr-2 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-400'}`} />} {team.name}</td>
                                      <td className="p-3 text-sm md:text-base text-center"><span className="inline-block w-8 h-8 rounded-full bg-[#0B8E8D]/20 text-[#06324F] font-bold flex items-center justify-center">{team.points || 0}</span></td>
                                      <td className="p-3 text-sm md:text-base text-center">{team.wins || 0}/{team.losses || 0}</td>
                                      <td className="p-3 text-sm md:text-base text-center"><span className="font-semibold text-green-600">{team.setsWon || 0}</span><span className="mx-1 text-gray-400">:</span><span className="font-semibold text-red-600">{team.setsLost || 0}</span></td>
                                      <td className={`p-3 text-sm md:text-base text-center font-semibold ${(team.setsWon - team.setsLost) > 0 ? 'text-green-700' : (team.setsWon - team.setsLost) < 0 ? 'text-red-700' : 'text-gray-600'}`}>{(team.setsWon - team.setsLost) > 0 ? '+' : ''}{team.setsWon - team.setsLost || 0}</td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                         )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
         </div>
        );
   }, [teams, t]);

  const renderMatchDetail = useCallback(() => {
       const currentMatchData = selectedMatch ? matches.find(m => m.id === selectedMatch.id) : null;
       if (!currentMatchData) { setSelectedMatch(null); return null; }
       const team1 = teams.find(t => t.code === currentMatchData.team1) || { name: t.tbd };
       const team2 = teams.find(t => t.code === currentMatchData.team2) || { name: t.tbd };
       const refereeTeam = teams.find(t => t.code === currentMatchData.refereeTeamCode); // Находим судью
       const refereeName = refereeTeam?.name || (currentMatchData.refereeTeamCode ? `(${currentMatchData.refereeTeamCode})` : t.refereeTBD || '???');

       let roundClass = 'px-3 py-1 rounded-full text-sm font-semibold inline-block mb-3'; let roundIcon;
       const currentRound = currentMatchData.round || 'unknown'; const roundText = t.roundNames?.[currentRound] || currentRound;
       if (currentRound === 'group') { roundClass += ' bg-[#C1CBA7]/50 text-[#06324F]'; roundIcon = <FaUsers className="mr-2" />; }
       else if (currentRound === 'quarterfinal') { roundClass += ' bg-[#0B8E8D]/20 text-[#0B8E8D]'; roundIcon = <FaChartBar className="mr-2" />; }
       else if (currentRound === 'semifinal') { roundClass += ' bg-[#06324F]/20 text-[#06324F]'; roundIcon = <FaChartBar className="mr-2" />; }
       else if (currentRound === 'third_place') { roundClass += ' bg-orange-100 text-orange-700'; roundIcon = <FaTrophy className="mr-2" />; }
       else if (currentRound === 'final') { roundClass += ' bg-[#FDD80F]/20 text-[#FDD80F]/90'; roundIcon = <FaTrophy className="mr-2" />; }
       else { roundClass += ' bg-gray-200 text-gray-700'; roundIcon = <FaVolleyballBall className="mr-2" />; }
       let statusClass = 'px-3 py-1 rounded-full text-sm font-semibold inline-block ml-2'; let statusIcon;
       const currentStatus = currentMatchData.status || 'unknown'; const statusText = t.statusNames?.[currentStatus] || currentStatus;
       if (currentStatus === 'completed') { statusClass += ' bg-green-100 text-green-800'; statusIcon = <FaCheck className="mr-2" />; }
       else if (currentStatus === 'completed_by_points') { statusClass += ' bg-blue-100 text-blue-800'; statusIcon = <FaCheck className="mr-2" />; }
       else if (currentStatus === 'tie_needs_tiebreak') { statusClass += ' bg-red-100 text-red-800'; statusIcon = <FaExclamationTriangle className="mr-2" />; }
       else if (currentStatus === 'in_progress') { statusClass += ' bg-yellow-100 text-yellow-800'; statusIcon = <FaRegClock className="mr-2 animate-spin" style={{ animationDuration: '2s' }} />; }
       else if (currentStatus === 'waiting') { statusClass += ' bg-gray-100 text-gray-500'; statusIcon = <FaRegClock className="mr-2" />; }
       else { statusClass += ' bg-gray-100 text-gray-800'; statusIcon = <FaRegClock className="mr-2" />; }
       const showThirdSetInput = currentRound === 'final' || currentStatus === 'tie_needs_tiebreak';

        return (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center p-4 z-[70] backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#0B8E8D] to-[#06324F] p-6 text-white"><div className="flex justify-between items-center"><h2 className="text-2xl font-bold">{t.matchDetail}</h2><button onClick={() => { setView('matches'); setSelectedMatch(null); }} className="text-white hover:text-red-200 transition-colors duration-150">✕</button></div></div>
              <div className="p-6 max-h-[80vh] overflow-y-auto">
                <div className="flex flex-wrap justify-between items-center mb-6 gap-y-2">
                    <div className="flex items-center flex-wrap gap-2">
                        <span className={roundClass}><span className="flex items-center">{roundIcon}{roundText}</span></span>
                        <span className={statusClass}><span className="flex items-center">{statusIcon}{statusText}</span></span>
                    </div>
                    <div className="text-sm text-gray-600 flex flex-col items-end space-y-1">
                         <div className="flex items-center"><FaCalendarAlt className="mr-2 text-indigo-500" />{currentMatchData.time} ({t.court} {currentMatchData.court})</div>
                         <div className="flex items-center"><FaBullhorn className="mr-2 text-gray-400" />{t.referee || 'Судья'}: {refereeName}</div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 p-4 rounded-lg mb-6"><div className="flex justify-between items-center"><div className="text-center w-5/12"><div className="text-lg font-bold text-indigo-800">{team1.name}</div></div><div className="text-center w-2/12"><div className="text-xl font-bold text-gray-600">vs</div></div><div className="text-center w-5/12"><div className="text-lg font-bold text-indigo-800">{team2.name}</div></div></div></div>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.set1}</label>
                    <div className="flex items-center justify-between">
                      <input type="number" min="0" defaultValue={currentMatchData.set1Team1 ?? 0} onBlur={(e) => updateMatchScore(currentMatchData.id, 1, 'team1', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                      <span className="text-gray-400 text-xl font-bold">:</span>
                      <input type="number" min="0" defaultValue={currentMatchData.set1Team2 ?? 0} onBlur={(e) => updateMatchScore(currentMatchData.id, 1, 'team2', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.set2}</label>
                    <div className="flex items-center justify-between">
                      <input type="number" min="0" defaultValue={currentMatchData.set2Team1 ?? 0} onBlur={(e) => updateMatchScore(currentMatchData.id, 2, 'team1', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                      <span className="text-gray-400 text-xl font-bold">:</span>
                      <input type="number" min="0" defaultValue={currentMatchData.set2Team2 ?? 0} onBlur={(e) => updateMatchScore(currentMatchData.id, 2, 'team2', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                  </div>
                  {showThirdSetInput && (
                    <div className={`bg-white p-4 rounded-lg shadow-sm border ${currentStatus === 'tie_needs_tiebreak' ? 'border-red-300' : 'border-gray-200'}`}>
                      <label className={`block text-sm font-medium ${currentStatus === 'tie_needs_tiebreak' ? 'text-red-700' : 'text-gray-700'} mb-2`}>
                        {currentStatus === 'tie_needs_tiebreak' ? t.tiebreak : t.set3} {currentStatus === 'tie_needs_tiebreak' && ` (${t.tiebreak_condition || 'до 5'})`}
                      </label>
                      <div className="flex items-center justify-between">
                        <input
                          type="number"
                          min="0"
                          max="5"
                          defaultValue={currentMatchData.set3Team1 ?? 0}
                          onBlur={(e) => updateMatchScore(currentMatchData.id, 3, 'team1', e.target.value)}
                          className={`w-20 p-2 border rounded-lg text-center font-bold text-lg focus:ring-2 ${currentStatus === 'tie_needs_tiebreak' ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                        />
                        <span className="text-gray-400 text-xl font-bold">:</span>
                        <input
                          type="number"
                          min="0"
                          max="5"
                          defaultValue={currentMatchData.set3Team2 ?? 0}
                          onBlur={(e) => updateMatchScore(currentMatchData.id, 3, 'team2', e.target.value)}
                          className={`w-20 p-2 border rounded-lg text-center font-bold text-lg focus:ring-2 ${currentStatus === 'tie_needs_tiebreak' ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex justify-end"><button onClick={() => { setView('matches'); setSelectedMatch(null); }} className="w-full bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white py-2 px-4 rounded-lg hover:from-[#0B8E8D]/90 hover:to-[#06324F]/90 transition-all duration-200 shadow-md flex items-center justify-center"><FaCheck className="mr-2"/> {t.close || 'Закрыть'}</button></div>
              </div>
            </div>
          </div>
        );
   }, [selectedMatch, matches, teams, t, updateMatchScore, setView, setSelectedMatch]);

  const renderRulesModal = useCallback(() => {
      return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-start justify-center p-4 z-[60] backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-4xl my-8 overflow-hidden">
            <div className="bg-gradient-to-r from-[#0B8E8D] to-[#06324F] p-6 text-white sticky top-0 z-10"><div className="flex justify-between items-center"><h2 className="text-2xl font-bold">{t.rules}</h2><div className="flex items-center space-x-2">{Object.keys(languageNames).filter(lang => translations[lang]).map(lang => (<button key={lang} onClick={() => changeLanguage(lang)} className={`px-2 py-1 text-xs rounded transition-colors duration-150 ${language === lang ? 'bg-white text-[#0B8E8D] shadow-sm' : 'bg-[#0B8E8D]/80 text-white hover:bg-[#0B8E8D]/90'}`} title={languageNames[lang]}>{lang.toUpperCase()}</button>))} <button onClick={() => setShowRules(false)} className="text-white hover:text-[#FDD80F] transition-colors ml-4" title={t.close}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></div></div></div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-[#06324F] mb-3">{t.tieRules?.settingsTitle || "Настройки (1:1)"}</h4>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" id="useTotalPointsForTie" checked={tournamentSettings.useTotalPointsForTie} onChange={(e) => handleSettingsChange(e.target.checked)} className="h-5 w-5 rounded text-[#0B8E8D] focus:ring-2 focus:ring-[#0B8E8D]/50 border-gray-300"/>
                  <label htmlFor="useTotalPointsForTie" className="text-gray-700 select-none cursor-pointer">{t.tieRules?.usePointsOption || "Исп. общ. кол-во очков"}</label>
                </div>
                 <p className="text-xs text-gray-500 mt-2">{tournamentSettings.useTotalPointsForTie ? t.tieRules?.usePointsOptionDescription || "При 1:1 выигрыш по очкам, при равенстве - тайбрейк." : t.tieRules?.useTiebreakOptionDescription || "При 1:1 всегда играется тайбрейк."}</p>
              </div>
               <div className="mb-8 bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 p-6 rounded-xl shadow-md border border-[#0B8E8D]/20">
                 <h3 className="text-xl font-bold text-[#06324F] mb-4">{t.tieRules?.title}</h3>
                 <div className="space-y-4">
                   <div className={`p-4 rounded-lg shadow-sm border ${tournamentSettings.useTotalPointsForTie ? 'bg-white border-green-200' : 'bg-gray-100 border-gray-200'}`}> <h4 className="text-lg font-semibold text-[#0B8E8D] mb-2">{t.tieRules?.option1}</h4> <p className="text-gray-700 text-sm">{t.tieRules?.option1Description}</p> </div>
                   <div className={`p-4 rounded-lg shadow-sm border ${!tournamentSettings.useTotalPointsForTie ? 'bg-white border-green-200' : 'bg-gray-100 border-gray-200'}`}> <h4 className="text-lg font-semibold text-[#0B8E8D] mb-2">{t.tieRules?.option2}</h4> <p className="text-gray-700 text-sm">{t.tieRules?.option2Description}</p> </div>
                 </div>
               </div>
              <div className="prose prose-sm max-w-none mt-6">
                 <h3 className="text-xl font-bold text-[#06324F] mb-4">{t.generalRulesTitle || "Общие правила"}</h3>
                 <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 bg-gray-50 p-4 rounded border border-gray-200">{t.tournamentRules || "Текст правил..."}</pre>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 sticky bottom-0"><button onClick={() => setShowRules(false)} className="w-full py-2 bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"><FaCheck className="mr-2" /> {t.hideRules || "Закрыть"}</button></div>
          </div>
        </div>
       );
   }, [language, tournamentSettings, t, handleSettingsChange, changeLanguage]); // Убрана зависимость showRules


  // --- Основной рендер ---
  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white shadow-md md:h-screen md:sticky top-0 z-40 border-t border-gray-200">
           <div className="p-4 border-b border-gray-200 flex justify-between items-center">
             <h1 className="text-xl font-bold text-[#06324F] flex items-center"><FaVolleyballBall className="mr-2 text-[#0B8E8D]" /> RVL</h1>
             <div className="flex space-x-1">
                {Object.keys(languageNames).filter(lang => translations[lang]).map(lang => (<button key={lang} onClick={() => changeLanguage(lang)} className={`px-2 py-1 text-xs rounded transition-colors duration-150 ${language === lang ? 'bg-[#0B8E8D] text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} title={languageNames[lang]}>{lang.toUpperCase()}</button>))}
             </div>
           </div>
           <div className="p-4 space-y-2">
             <button onClick={() => setView('matches')} className={`flex items-center w-full text-left p-3 rounded-lg transition-all duration-200 ${view === 'matches' ? 'bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white shadow-md' : 'hover:bg-[#0B8E8D]/10 text-gray-700'}`}><FaVolleyballBall className="mr-3" /> {t.matches}</button>
             <button onClick={() => setView('groups')} className={`flex items-center w-full text-left p-3 rounded-lg transition-all duration-200 ${view === 'groups' ? 'bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white shadow-md' : 'hover:bg-[#0B8E8D]/10 text-gray-700'}`}><FaUsers className="mr-3" /> {t.groups}</button>
             <button onClick={() => setShowRules(true)} className="flex items-center w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-[#0B8E8D]/10 text-gray-700 mt-2"><FaGlobe className="mr-3 text-[#FDD80F]" /> {t.rules}</button>
           </div>
           <div className="md:absolute md:bottom-6 md:left-0 md:right-0 px-6 mt-4 md:mt-0 hidden md:block">
             <div className="bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 p-4 rounded-lg shadow-sm border border-[#0B8E8D]/20">
               <h3 className="text-sm font-semibold text-[#06324F] mb-2">{t.tournamentInfo}</h3>
               <div className="text-xs text-gray-700 space-y-2">
                 <p className="flex items-center"><FaCalendarAlt className="mr-2 text-[#FDD80F]" /><span className="font-semibold mr-1">{t.dateLabel}:</span> {t.tournamentDate}</p>
                 <p className="flex items-start"><FaMapMarkerAlt className="mr-2 text-[#0B8E8D] mt-0.5 flex-shrink-0" /><div><span className="font-semibold mr-1">{t.addressLabel}:</span> {t.tournamentAddress}</div></p>
                 <p className="flex items-center"><FaLink className="mr-2 text-[#06324F]" /><span className="font-semibold mr-1">{t.websiteLabel}:</span><a href={t.tournamentWebsite} target="_blank" rel="noopener noreferrer" className="text-[#0B8E8D] ml-1 hover:underline truncate">{t.tournamentWebsite?.replace(/^(https?:\/\/)?(www\.)?/, '')}</a></p>
               </div>
               <div className="mt-3 pt-2 border-t border-[#0B8E8D]/20">
                 <h3 className="text-sm font-semibold text-[#06324F] mb-1">{t.aboutSection}</h3><p className="text-xs text-gray-600">{t.aboutApp}</p>
               </div>
             </div>
           </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-0 md:p-6 pb-20 md:pb-6">
          {view === 'matches' && renderMatches()}
          {view === 'groups' && renderGroups()}
           <div className="md:hidden p-4 mx-4 mt-4 mb-24 bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 rounded-lg shadow-sm border border-[#0B8E8D]/20">
             <h3 className="text-sm font-semibold text-[#06324F] mb-2">{t.tournamentInfo}</h3>
             <div className="text-xs text-gray-700 space-y-2">
                 <p className="flex items-center"><FaCalendarAlt className="mr-2 text-[#FDD80F]" /><span className="font-semibold mr-1">{t.dateLabel}:</span> {t.tournamentDate}</p>
                 <p className="flex items-start"><FaMapMarkerAlt className="mr-2 text-[#0B8E8D] mt-0.5 flex-shrink-0" /><div><span className="font-semibold mr-1">{t.addressLabel}:</span> {t.tournamentAddress}</div></p>
                 <p className="flex items-center"><FaLink className="mr-2 text-[#06324F]" /><span className="font-semibold mr-1">{t.websiteLabel}:</span><a href={t.tournamentWebsite} target="_blank" rel="noopener noreferrer" className="text-[#0B8E8D] ml-1 hover:underline truncate">{t.tournamentWebsite?.replace(/^(https?:\/\/)?(www\.)?/, '')}</a></p>
             </div>
           </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-2 flex justify-around md:hidden z-30 border-t border-gray-200">
           <button onClick={() => setView('matches')} className={`p-2 flex flex-col items-center transition-colors duration-150 ${view === 'matches' ? 'text-[#0B8E8D] font-semibold' : 'text-gray-600 hover:text-[#0B8E8D]'}`}><FaVolleyballBall className="text-xl mb-1" /><span className="text-xs">{t.matches}</span></button>
           <button onClick={() => setView('groups')} className={`p-2 flex flex-col items-center transition-colors duration-150 ${view === 'groups' ? 'text-[#0B8E8D] font-semibold' : 'text-gray-600 hover:text-[#0B8E8D]'}`}><FaUsers className="text-xl mb-1" /><span className="text-xs">{t.groups}</span></button>
           <button onClick={() => setShowRules(true)} className={`p-2 flex flex-col items-center text-gray-600 hover:text-[#0B8E8D] transition-colors duration-150`}><FaGlobe className="text-xl mb-1 text-[#FDD80F]" /><span className="text-xs">{t.rules}</span></button>
        </nav>
      </div>

      {/* Modals */}
      {showRules && renderRulesModal()}
      {view === 'matchDetail' && renderMatchDetail()}
    </>
  );
}

export default App;
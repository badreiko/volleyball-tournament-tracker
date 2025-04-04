import React, { useState, useEffect } from 'react';
import './App.css';
import { FaVolleyballBall, FaUsers, FaTrophy, FaRegClock, FaCheck, FaGlobe, FaExclamationTriangle, FaCalendarAlt, FaTable, FaChartBar, FaMapMarkerAlt, FaLink } from 'react-icons/fa';
// Предполагается, что этот файл существует и экспортирует translations и languageNames
import { translations, languageNames } from './translations';

// Начальные данные команд (остаются без изменений)
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

// Начальные данные матчей (остаются без изменений)
const initialMatches = [
    // Групповой этап - Группа A
    { id: 'A1-A2', court: 1, time: '09:00', team1: 'A1', team2: 'A2', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
    { id: 'A2-A3', court: 1, time: '09:40', team1: 'A2', team2: 'A3', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
    { id: 'A1-A3', court: 1, time: '10:20', team1: 'A1', team2: 'A3', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },

    // Групповой этап - Группа B
    { id: 'B1-B2', court: 2, time: '09:00', team1: 'B1', team2: 'B2', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
    { id: 'B2-B3', court: 2, time: '09:40', team1: 'B2', team2: 'B3', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
    { id: 'B1-B3', court: 2, time: '10:20', team1: 'B1', team2: 'B3', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },

    // Групповой этап - Группа C
    { id: 'C1-C2', court: 3, time: '09:00', team1: 'C1', team2: 'C2', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
    { id: 'C3-C4', court: 3, time: '09:40', team1: 'C3', team2: 'C4', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
    { id: 'C1-C3', court: 3, time: '10:20', team1: 'C1', team2: 'C3', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
    { id: 'C2-C4', court: 3, time: '11:00', team1: 'C2', team2: 'C4', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
    { id: 'C1-C4', court: 3, time: '11:40', team1: 'C1', team2: 'C4', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
    { id: 'C2-C3', court: 3, time: '12:20', team1: 'C2', team2: 'C3', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },

    // Четвертьфиналы
    { id: 'QF-1A-1C', court: 1, time: '13:00', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'quarterfinal' },
    { id: 'QF-1B-2C', court: 2, time: '13:00', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'quarterfinal' },
    { id: 'QF-2A-3B', court: 1, time: '13:40', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'quarterfinal' },
    { id: 'QF-3A-2B', court: 2, time: '13:40', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'quarterfinal' },

    // Полуфиналы
    { id: 'SF-W1-W3', court: 1, time: '14:20', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'semifinal' },
    { id: 'SF-W2-W4', court: 2, time: '14:20', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'semifinal' },

    // Матч за 3-е место
    { id: 'F3-L1-L2', court: 2, time: '15:00', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'third_place' },

    // Финал
    { id: 'F-W1-W2', court: 1, time: '15:00', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'final' }
];

function App() {
  const [teams, setTeams] = useState(() => JSON.parse(localStorage.getItem('teams')) || initialTeams);
  const [matches, setMatches] = useState(() => JSON.parse(localStorage.getItem('matches')) || initialMatches);
  const [view, setView] = useState('matches'); // matches, groups, matchDetail
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'cs');
  const [showRules, setShowRules] = useState(false);

  // --- ИЗМЕНЕНИЕ: Преобразование настроек в состояние ---
  const [tournamentSettings, setTournamentSettings] = useState(() => {
    const savedSettings = localStorage.getItem('tournamentSettings');
    // Устанавливаем значение по умолчанию, если в localStorage ничего нет
    return savedSettings ? JSON.parse(savedSettings) : { useTotalPointsForTie: true };
  });
  // ---------------------------------------------------

  // Получение текущих переводов
  const t = translations[language] || translations['cs']; // Добавлен fallback на 'cs'

  // --- ИЗМЕНЕНИЕ: Сохранение настроек в localStorage ---
  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
    localStorage.setItem('matches', JSON.stringify(matches));
    localStorage.setItem('language', language);
    localStorage.setItem('tournamentSettings', JSON.stringify(tournamentSettings)); // Сохраняем настройки
  }, [teams, matches, language, tournamentSettings]); // Добавлена зависимость tournamentSettings
  // -----------------------------------------------------

  // Обновление счета матча
  const updateMatchScore = (matchId, set, team, score) => {
    setMatches(prevMatches => {
      const updatedMatches = prevMatches.map(match => {
        if (match.id === matchId) {
          const updatedMatch = { ...match };
          updatedMatch[`set${set}${team === 'team1' ? 'Team1' : 'Team2'}`] = parseInt(score) || 0;

          // --- ИЗМЕНЕНИЕ: Используем tournamentSettings из состояния ---
          const useTotalPointsRule = tournamentSettings.useTotalPointsForTie;
          // ------------------------------------------------------------

          // Логика определения победителя и статуса матча...
          // (Использует useTotalPointsRule вместо константы)
          if ((set === 2 && match.round !== 'final') || (set === 3 && match.round === 'final') || (set === 3 && match.status === 'tie_needs_tiebreak')) {
             const { set1Team1, set1Team2, set2Team1, set2Team2, set3Team1, set3Team2 } = updatedMatch;

             if (match.round === 'final') {
               // Для финала: нужно выиграть 2 сета (до 2 побед)
               let team1Wins = (set1Team1 > set1Team2 ? 1 : 0) +
                                (set2Team1 > set2Team2 ? 1 : 0) +
                                (set3Team1 > set3Team2 ? 1 : 0);
               let team2Wins = (set1Team2 > set1Team1 ? 1 : 0) +
                                (set2Team2 > set2Team1 ? 1 : 0) +
                                (set3Team2 > set3Team1 ? 1 : 0);

               if (team1Wins >= 2) {
                 updatedMatch.winner = match.team1;
                 updatedMatch.status = 'completed';
               }
               else if (team2Wins >= 2) {
                 updatedMatch.winner = match.team2;
                 updatedMatch.status = 'completed';
               }
             } else if (match.status === 'tie_needs_tiebreak' && set === 3) {
               // Обработка тайбрейка (до 5 очков)
               if (set3Team1 >= 5 && set3Team1 > set3Team2) {
                 updatedMatch.winner = match.team1;
                 updatedMatch.status = 'completed';
               } else if (set3Team2 >= 5 && set3Team2 > set3Team1) {
                 updatedMatch.winner = match.team2;
                 updatedMatch.status = 'completed';
               }
             } else if (set === 2 && match.round !== 'final') { // Проверяем результат после 2-го сета для не-финалов
                let team1Sets = (set1Team1 > set1Team2 ? 1 : 0) + (set2Team1 > set2Team2 ? 1 : 0);
                let team2Sets = (set1Team2 > set1Team1 ? 1 : 0) + (set2Team2 > set2Team1 ? 1 : 0);

                if (team1Sets === 2) {
                    updatedMatch.winner = match.team1;
                    updatedMatch.status = 'completed';
                } else if (team2Sets === 2) {
                    updatedMatch.winner = match.team2;
                    updatedMatch.status = 'completed';
                } else if (team1Sets === 1 && team2Sets === 1) {
                    // Ничья по сетам (1:1)
                    if (useTotalPointsRule) { // Используем настройку из состояния
                        // Используем общие очки для определения победителя
                        const team1TotalPoints = set1Team1 + set2Team1;
                        const team2TotalPoints = set1Team2 + set2Team2;

                        if (team1TotalPoints > team2TotalPoints) {
                            updatedMatch.winner = match.team1;
                            updatedMatch.status = 'completed_by_points';
                        } else if (team2TotalPoints > team1TotalPoints) {
                            updatedMatch.winner = match.team2;
                            updatedMatch.status = 'completed_by_points';
                        } else {
                            // Равные очки - требуется тайбрейк
                            updatedMatch.status = 'tie_needs_tiebreak';
                        }
                    } else {
                        // Всегда требуется тайбрейк при счете 1:1
                        updatedMatch.status = 'tie_needs_tiebreak';
                    }
                } else {
                    // Если счет не 2:0, 0:2 или 1:1 после второго сета, возможно, матч еще не закончен
                    // или нужны дополнительные проверки (например, если вводятся очки за первый сет)
                    // Оставляем статус как есть или сбрасываем, если нужно
                     if (updatedMatch.winner) { // Сбросить победителя, если счет изменился и результат уже не окончательный
                        updatedMatch.winner = null;
                     }
                     // Определяем статус в зависимости от введенных очков
                     if ((set1Team1 > 0 || set1Team2 > 0) || (set2Team1 > 0 || set2Team2 > 0)) {
                         updatedMatch.status = 'in_progress'; // Или 'not_started', если хотите другую логику
                     } else {
                         updatedMatch.status = 'not_started';
                     }
                }
            }

             // Если матч завершен (любым способом), обновляем статистику команд
             if (updatedMatch.status === 'completed' || updatedMatch.status === 'completed_by_points') {
                // Важно: Пересчитываем всю статистику, чтобы избежать двойного учета
                // Сначала сбрасываем статистику, потом пересчитываем по всем завершенным матчам
                // Это более надежно, чем добавлять дельту
                recalculateAllTeamStats(updatedMatches); // Вызываем пересчет всей статистики
             }
          } else if (set === 1 && match.round !== 'final'){
              // Если изменен только первый сет, сбрасываем возможного предыдущего победителя и статус
               if (updatedMatch.winner) {
                  updatedMatch.winner = null;
               }
               if ((updatedMatch.set1Team1 > 0 || updatedMatch.set1Team2 > 0) && updatedMatch.status !== 'in_progress') {
                   updatedMatch.status = 'in_progress'; // Или другой статус по вашей логике
               } else if (updatedMatch.set1Team1 === 0 && updatedMatch.set1Team2 === 0 && updatedMatch.set2Team1 === 0 && updatedMatch.set2Team2 === 0) {
                   updatedMatch.status = 'not_started';
               }
          }

          return updatedMatch;
        }
        return match;
      });

      // Обновляем плей-офф только если статистика была пересчитана
      if (updatedMatches.some(m => m.status === 'completed' || m.status === 'completed_by_points')) {
          updatePlayoffTeams(updatedMatches); // Обновляем плей-офф после обновления матчей
      }
      return updatedMatches;
    });
  };


  // --- ИЗМЕНЕНИЕ: Функция для полного пересчета статистики ---
  // Необходимо, чтобы избежать ошибок при изменении уже завершенных матчей
  const recalculateAllTeamStats = (currentMatches) => {
      setTeams(prevTeams => {
          // Сбрасываем статистику к начальным значениям
          let resetTeams = initialTeams.map(team => ({ ...team })); // Используем initialTeams для сброса

          // Фильтруем только завершенные матчи
          const completedMatches = currentMatches.filter(m =>
              m.round === 'group' && // Считаем статистику только для группового этапа
              (m.status === 'completed' || m.status === 'completed_by_points' || m.status === 'tie_needs_tiebreak') // Учитываем и матчи с тайбрейком для очков
          );

          // Пересчитываем статистику на основе завершенных матчей
          completedMatches.forEach(match => {
              const team1Index = resetTeams.findIndex(t => t.code === match.team1);
              const team2Index = resetTeams.findIndex(t => t.code === match.team2);

              if (team1Index !== -1 && team2Index !== -1) {
                  let team1 = resetTeams[team1Index];
                  let team2 = resetTeams[team2Index];

                  let team1SetsWon = 0;
                  let team2SetsWon = 0;
                  let team1Points = 0;
                  let team2Points = 0;

                  // Подсчет выигранных сетов (до 2 для группы)
                  team1SetsWon += (match.set1Team1 > match.set1Team2 ? 1 : 0) + (match.set2Team1 > match.set2Team2 ? 1 : 0);
                  team2SetsWon += (match.set1Team2 > match.set1Team1 ? 1 : 0) + (match.set2Team2 > match.set2Team1 ? 1 : 0);

                  // Подсчет очков
                  if (match.status === 'completed' || match.status === 'completed_by_points') {
                      if (match.winner === team1.code) { // Team1 победил
                          team1Points = (team1SetsWon === 2 && team2SetsWon === 0) ? 3 : 2; // 3 очка за 2:0, 2 очка за 1:1 (по очкам или тайбрейку)
                          team2Points = (team1SetsWon === 2 && team2SetsWon === 0) ? 0 : 1; // 0 очков за 0:2, 1 очко за 1:1 (поражение)
                          team1.wins += 1;
                          team2.losses += 1;
                      } else if (match.winner === team2.code) { // Team2 победил
                          team2Points = (team2SetsWon === 2 && team1SetsWon === 0) ? 3 : 2;
                          team1Points = (team2SetsWon === 2 && team1SetsWon === 0) ? 0 : 1;
                          team2.wins += 1;
                          team1.losses += 1;
                      }
                  } else if (match.status === 'tie_needs_tiebreak') {
                      // Если матч закончился 1:1 и требует тайбрейка (по старым правилам),
                      // или если включено правило тайбрейка и счет 1:1 по очкам
                      // Даем по 1 очку каждой команде, пока тайбрейк не сыгран
                      // Либо по 2 и 1 если тайбрейк сыгран (но статус будет completed)
                       if (match.winner) { // Если победитель тайбрейка определен (перешел в completed)
                           if(match.winner === team1.code){
                               team1Points = 2; team2Points = 1; team1.wins += 1; team2.losses += 1;
                           } else {
                               team2Points = 2; team1Points = 1; team2.wins += 1; team1.losses += 1;
                           }
                       } else { // Если тайбрейк еще не сыгран (статус tie_needs_tiebreak)
                           // Логика очков здесь может зависеть от правил.
                           // Если очки начисляются только после определения победителя, то здесь 0.
                           // Если дается по 1 очку за ничью до тайбрейка, то:
                           // team1Points = 1; team2Points = 1;
                           // Оставим 0 по умолчанию, считая что очки только после исхода.
                       }
                  }


                  // Обновляем статистику команд
                  team1.points += team1Points;
                  team1.setsWon += team1SetsWon;
                  team1.setsLost += team2SetsWon;

                  team2.points += team2Points;
                  team2.setsWon += team2SetsWon;
                  team2.setsLost += team1SetsWon;

                  resetTeams[team1Index] = team1;
                  resetTeams[team2Index] = team2;
              }
          });

          return resetTeams;
      });
  };
  // -----------------------------------------------------------

  // Обновление плей-офф
  const updatePlayoffTeams = (updatedMatches) => {
      const groupRankings = {};
      // Используем актуальное состояние команд для расчета рейтинга
      const currentTeams = JSON.parse(localStorage.getItem('teams')) || initialTeams; // Читаем актуальные команды

      ['A', 'B', 'C'].forEach(group => {
          groupRankings[group] = currentTeams
              .filter(t => t.group === group)
              .sort((a, b) => b.points - a.points || (b.setsWon - b.setsLost) - (a.setsWon - a.setsLost) || b.setsWon - a.setsWon); // Добавлена сортировка по выигранным сетам при равенстве разницы
      });

      setMatches(prevMatches => {
        // Создаем новый массив матчей на основе предыдущего состояния
        let newMatches = prevMatches.map(m => ({ ...m }));

        // Обновляем команды в плей-офф матчах
        newMatches = newMatches.map(match => {
            if (match.round === 'quarterfinal' || match.round === 'semifinal' || match.round === 'final' || match.round === 'third_place') {
                const updatedMatch = { ...match };
                let team1Code = null;
                let team2Code = null;

                // --- Логика определения команд для плей-офф ---
                // Четвертьфиналы
                if (match.id === 'QF-1A-1C') { team1Code = groupRankings['A'][0]?.code; team2Code = groupRankings['C'][0]?.code; }
                else if (match.id === 'QF-1B-2C') { team1Code = groupRankings['B'][0]?.code; team2Code = groupRankings['C'][1]?.code; }
                else if (match.id === 'QF-2A-3B') { team1Code = groupRankings['A'][1]?.code; team2Code = groupRankings['B'][2]?.code; } // A2 vs B3
                else if (match.id === 'QF-3A-2B') { team1Code = groupRankings['A'][2]?.code; team2Code = groupRankings['B'][1]?.code; } // A3 vs B2

                // Полуфиналы (зависят от результатов QF)
                else if (match.id === 'SF-W1-W3') {
                    const qf1 = updatedMatches.find(m => m.id === 'QF-1A-1C');
                    const qf3 = updatedMatches.find(m => m.id === 'QF-2A-3B');
                    team1Code = qf1?.winner; team2Code = qf3?.winner;
                } else if (match.id === 'SF-W2-W4') {
                    const qf2 = updatedMatches.find(m => m.id === 'QF-1B-2C');
                    const qf4 = updatedMatches.find(m => m.id === 'QF-3A-2B');
                    team1Code = qf2?.winner; team2Code = qf4?.winner;
                }

                // Финал и 3-е место (зависят от результатов SF)
                else if (match.id === 'F-W1-W2') { // Финал
                    const sf1 = updatedMatches.find(m => m.id === 'SF-W1-W3');
                    const sf2 = updatedMatches.find(m => m.id === 'SF-W2-W4');
                    team1Code = sf1?.winner; team2Code = sf2?.winner;
                } else if (match.id === 'F3-L1-L2') { // Матч за 3-е место
                    const sf1 = updatedMatches.find(m => m.id === 'SF-W1-W3');
                    const sf2 = updatedMatches.find(m => m.id === 'SF-W2-W4');
                    const loser1 = (sf1?.winner && sf1.team1 && sf1.team2) ? (sf1.winner === sf1.team1 ? sf1.team2 : sf1.team1) : null;
                    const loser2 = (sf2?.winner && sf2.team1 && sf2.team2) ? (sf2.winner === sf2.team1 ? sf2.team2 : sf2.team1) : null;
                    team1Code = loser1; team2Code = loser2;
                }
                // --- Конец логики определения команд ---

                updatedMatch.team1 = team1Code || null; // Устанавливаем null, если команда не определена
                updatedMatch.team2 = team2Code || null;

                // Обновляем статус, если команды определены и матч еще не начат/не завершен
                if (updatedMatch.team1 && updatedMatch.team2 && updatedMatch.status === 'waiting') {
                    updatedMatch.status = 'not_started';
                } else if ((!updatedMatch.team1 || !updatedMatch.team2) && updatedMatch.status !== 'waiting') {
                     // Если команда "пропала" (например, из-за пересчета), вернуть статус waiting
                     if (match.round !== 'group') updatedMatch.status = 'waiting';
                     updatedMatch.winner = null; // Сбросить победителя на всякий случай
                     updatedMatch.set1Team1 = 0; updatedMatch.set1Team2 = 0;
                     updatedMatch.set2Team1 = 0; updatedMatch.set2Team2 = 0;
                     updatedMatch.set3Team1 = 0; updatedMatch.set3Team2 = 0;
                }
                return updatedMatch;
            }
            return match; // Возвращаем без изменений, если это не плей-офф матч
        });
        return newMatches; // Возвращаем обновленный массив матчей
      });
  };


  // Переключение языка
  const changeLanguage = (lang) => {
    // Проверяем, есть ли такой язык в переводах
    if (translations[lang]) {
        setLanguage(lang);
    } else {
        console.warn(`Language "${lang}" not found in translations. Falling back to 'cs'.`);
        setLanguage('cs'); // Откат на язык по умолчанию, если выбранный не найден
    }
  };

  // Рендер матчей
  const renderMatches = () => (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center">
        <FaVolleyballBall className="mr-3 text-indigo-600" />
        <span>{t.matches}</span>
      </h2>
      <div className="bg-gradient-to-r from-[#C1CBA7] to-[#0B8E8D]/10 p-6 rounded-xl shadow-lg">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white">
            <tr>
              <th className="py-3 px-4 text-left text-sm md:text-base">{t.round}</th>
              <th className="py-3 px-4 text-left text-sm md:text-base">{t.match}</th>
              <th className="py-3 px-4 text-left text-sm md:text-base">{t.court}</th>
              <th className="py-3 px-4 text-left text-sm md:text-base">{t.time}</th>
              <th className="py-3 px-4 text-left text-sm md:text-base">{t.set1}</th>
              <th className="py-3 px-4 text-left text-sm md:text-base">{t.set2}</th>
              <th className="py-3 px-4 text-left text-sm md:text-base">{t.set3}</th>
              <th className="py-3 px-4 text-left text-sm md:text-base">{t.status}</th>
            </tr>
          </thead>
          <tbody>
            {matches.map(match => {
               // Находим команды (используем актуальные данные из состояния teams)
               const team1 = teams.find(tm => tm.code === match.team1);
               const team2 = teams.find(tm => tm.code === match.team2);

               // Формируем имена команд, даже если они еще не определены в плей-офф
               const team1Name = team1?.name || (match.round !== 'group' && match.team1 ? `...` : t.tbd); // Показываем TBD или '...'
               const team2Name = team2?.name || (match.round !== 'group' && match.team2 ? `...` : t.tbd);

              // Определяем стили для статуса матча
              let statusIcon, statusClass, statusText;
              const currentStatus = match.status || 'unknown'; // Обработка случая undefined статуса
              statusText = t.statusNames?.[currentStatus] || currentStatus; // Используем безопасный доступ и fallback

              if (currentStatus === 'completed') {
                statusIcon = <FaCheck className="mr-1 text-green-500" />;
                statusClass = 'text-green-600 font-semibold';
              } else if (currentStatus === 'completed_by_points') {
                statusIcon = <FaCheck className="mr-1 text-blue-500" />;
                statusClass = 'text-blue-600 font-semibold';
              } else if (currentStatus === 'tie') { // Этот статус может быть неактуален с новой логикой
                statusIcon = <FaExclamationTriangle className="mr-1 text-orange-500" />;
                statusClass = 'text-orange-600 font-semibold';
              } else if (currentStatus === 'tie_needs_tiebreak') {
                statusIcon = <FaExclamationTriangle className="mr-1 text-red-500" />;
                statusClass = 'text-red-600 font-semibold';
              } else if (currentStatus === 'in_progress') {
                 statusIcon = <FaRegClock className="mr-1 text-yellow-600 animate-spin" style={{ animationDuration: '2s' }} />;
                 statusClass = 'text-yellow-700 font-semibold';
              } else if (currentStatus === 'waiting') {
                 statusIcon = <FaRegClock className="mr-1 text-gray-400" />;
                 statusClass = 'text-gray-500';
              }
              else { // not_started и другие/неизвестные
                statusIcon = <FaRegClock className="mr-1 text-gray-500" />;
                statusClass = 'text-gray-600';
              }

              // Определяем стили для раунда
              let roundClass = 'px-2 py-1 rounded text-xs font-semibold';
              const currentRound = match.round || 'unknown'; // Обработка undefined раунда
              const roundText = t.roundNames?.[currentRound] || currentRound; // Безопасный доступ

              if (currentRound === 'group') { roundClass += ' bg-[#C1CBA7]/50 text-[#06324F]'; }
              else if (currentRound === 'quarterfinal') { roundClass += ' bg-[#0B8E8D]/20 text-[#0B8E8D]'; }
              else if (currentRound === 'semifinal') { roundClass += ' bg-[#06324F]/20 text-[#06324F]'; }
              else if (currentRound === 'third_place') { roundClass += ' bg-orange-100 text-orange-700'; }
              else if (currentRound === 'final') { roundClass += ' bg-[#FDD80F]/20 text-[#FDD80F]/90'; }
              else { roundClass += ' bg-gray-200 text-gray-700'; } // Стиль по умолчанию

              // Условие отображения третьего сета
              const showThirdSet = currentRound === 'final' || currentStatus === 'tie_needs_tiebreak' || (match.set3Team1 > 0 || match.set3Team2 > 0);

              return (
                <tr key={match.id} className="border-b hover:bg-[#0B8E8D]/10 transition-colors duration-150 ease-in-out cursor-pointer"
                    onClick={() => { if (match.team1 && match.team2) { setView('matchDetail'); setSelectedMatch(match); } }}> {/* Разрешаем клик только если команды определены */}
                  <td className="p-3 text-sm md:text-base">
                    <span className={roundClass}>{roundText}</span>
                  </td>
                  <td className="p-3 text-sm md:text-base font-medium">
                      {team1Name} <span className="text-gray-400 mx-1">vs</span> {team2Name}
                      {match.winner && (team1?.code === match.winner || team2?.code === match.winner) && (
                        <FaTrophy className={`inline ml-2 ${team1?.code === match.winner ? 'text-yellow-500' : 'text-gray-400'}`} title={`${t.winner}: ${teams.find(w => w.code === match.winner)?.name || '?'}`} />
                      )}
                  </td>
                  <td className="p-3 text-sm md:text-base">{t.court} {match.court}</td>
                  <td className="p-3 text-sm md:text-base text-gray-700">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-indigo-500" />
                      {match.time}
                    </div>
                  </td>
                  <td className="p-3 text-sm md:text-base font-bold">{match.set1Team1} - {match.set1Team2}</td>
                  <td className="p-3 text-sm md:text-base font-bold">{match.set2Team1} - {match.set2Team2}</td>
                  <td className="p-3 text-sm md:text-base font-bold">
                    {showThirdSet ? `${match.set3Team1} - ${match.set3Team2}` : '-'}
                  </td>
                  <td className={`p-3 text-sm md:text-base ${statusClass}`}>
                    <div className="flex items-center">
                      {statusIcon}
                      {statusText}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Рендер групп
  const renderGroups = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center">
        <FaUsers className="mr-3 text-indigo-600" />
        <span>{t.groups}</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['A', 'B', 'C'].map(group => {
          // Выбираем цвета для каждой группы
          const groupColors = {
             'A': { bg: 'from-[#C1CBA7] to-[#0B8E8D]', lightBg: 'from-[#C1CBA7]/20 to-[#0B8E8D]/10', text: 'text-blue-700', border: 'border-blue-200' },
             'B': { bg: 'from-[#06324F] to-[#0B8E8D]', lightBg: 'from-[#06324F]/10 to-[#0B8E8D]/10', text: 'text-purple-700', border: 'border-purple-200' },
             'C': { bg: 'from-[#FDD80F] to-[#0B8E8D]', lightBg: 'from-[#FDD80F]/10 to-[#0B8E8D]/10', text: 'text-green-700', border: 'border-green-200' }
           };
          const colors = groupColors[group];

          return (
            <div key={group} className={`bg-gradient-to-r ${colors.lightBg} rounded-xl shadow-lg overflow-hidden`}>
              <div className={`bg-gradient-to-r ${colors.bg} p-4 text-white`}>
                <h3 className="text-xl font-bold flex items-center">
                  <FaTable className="mr-2" /> {t.group} {group}
                </h3>
              </div>
              <div className="p-4">
                <table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left text-xs md:text-sm font-semibold text-gray-700">{t.team}</th>
                      <th className="p-3 text-center text-xs md:text-sm font-semibold text-gray-700">{t.points}</th>
                      <th className="p-3 text-center text-xs md:text-sm font-semibold text-gray-700">{t.winsLossesShort}</th>
                      <th className="p-3 text-center text-xs md:text-sm font-semibold text-gray-700">{t.setsShort}</th>
                      <th className="p-3 text-center text-xs md:text-sm font-semibold text-gray-700">{t.setsDiffShort}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.filter(tm => tm.group === group)
                      // Сортировка: Очки -> Разница сетов -> Выигранные сеты -> Имя
                      .sort((a, b) =>
                          b.points - a.points ||
                          (b.setsWon - b.setsLost) - (a.setsWon - a.setsLost) ||
                          b.setsWon - a.setsWon ||
                          a.name.localeCompare(b.name)
                       )
                      .map((team, index) => (
                        <tr key={team.code} className={`${index < 2 ? 'bg-green-50' : ''} ${index === 0 ? 'font-bold' : ''} border-b ${colors.border} hover:bg-gray-50 transition-colors duration-150`}>
                          <td className="p-3 text-sm md:text-base">
                            {index < 3 && <FaTrophy className={`inline mr-2 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-400'}`} />}
                            {team.name}
                          </td>
                          <td className="p-3 text-sm md:text-base text-center">
                            <span className="inline-block w-8 h-8 rounded-full bg-[#0B8E8D]/20 text-[#06324F] font-bold flex items-center justify-center">
                              {team.points || 0}
                            </span>
                          </td>
                          <td className="p-3 text-sm md:text-base text-center">{team.wins || 0}/{team.losses || 0}</td>
                          <td className="p-3 text-sm md:text-base text-center">
                            <span className="font-semibold text-green-600">{team.setsWon || 0}</span>
                            <span className="mx-1 text-gray-400">:</span>
                            <span className="font-semibold text-red-600">{team.setsLost || 0}</span>
                          </td>
                          <td className={`p-3 text-sm md:text-base text-center font-semibold ${(team.setsWon - team.setsLost) > 0 ? 'text-green-700' : (team.setsWon - team.setsLost) < 0 ? 'text-red-700' : 'text-gray-600'}`}>
                             {(team.setsWon - team.setsLost) > 0 ? '+' : ''}{team.setsWon - team.setsLost || 0}
                           </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Рендер деталей матча
  const renderMatchDetail = () => {
    if (!selectedMatch) return null;

    // Получаем актуальные данные матча из состояния matches
    const currentMatchData = matches.find(m => m.id === selectedMatch.id);
    if (!currentMatchData) return null; // Если матч не найден (маловероятно)

    const team1 = teams.find(t => t.code === currentMatchData.team1) || { name: t.tbd };
    const team2 = teams.find(t => t.code === currentMatchData.team2) || { name: t.tbd };

    // Определяем стили для раунда (как в renderMatches)
    let roundClass = 'px-3 py-1 rounded-full text-sm font-semibold inline-block mb-3';
    let roundIcon;
    const currentRound = currentMatchData.round || 'unknown';
    const roundText = t.roundNames?.[currentRound] || currentRound;
     if (currentRound === 'group') { roundClass += ' bg-[#C1CBA7]/50 text-[#06324F]'; roundIcon = <FaUsers className="mr-2" />; }
     else if (currentRound === 'quarterfinal') { roundClass += ' bg-[#0B8E8D]/20 text-[#0B8E8D]'; roundIcon = <FaChartBar className="mr-2" />; }
     else if (currentRound === 'semifinal') { roundClass += ' bg-[#06324F]/20 text-[#06324F]'; roundIcon = <FaChartBar className="mr-2" />; }
     else if (currentRound === 'third_place') { roundClass += ' bg-orange-100 text-orange-700'; roundIcon = <FaTrophy className="mr-2" />; }
     else if (currentRound === 'final') { roundClass += ' bg-[#FDD80F]/20 text-[#FDD80F]/90'; roundIcon = <FaTrophy className="mr-2" />; }
     else { roundClass += ' bg-gray-200 text-gray-700'; roundIcon = <FaVolleyballBall className="mr-2" />; }


    // Определяем стили для статуса (как в renderMatches)
    let statusClass = 'px-3 py-1 rounded-full text-sm font-semibold inline-block ml-2';
    let statusIcon;
    const currentStatus = currentMatchData.status || 'unknown';
    const statusText = t.statusNames?.[currentStatus] || currentStatus;
     if (currentStatus === 'completed') { statusClass += ' bg-green-100 text-green-800'; statusIcon = <FaCheck className="mr-2" />; }
     else if (currentStatus === 'completed_by_points') { statusClass += ' bg-blue-100 text-blue-800'; statusIcon = <FaCheck className="mr-2" />; }
     else if (currentStatus === 'tie_needs_tiebreak') { statusClass += ' bg-red-100 text-red-800'; statusIcon = <FaExclamationTriangle className="mr-2" />; }
     else if (currentStatus === 'in_progress') { statusClass += ' bg-yellow-100 text-yellow-800'; statusIcon = <FaRegClock className="mr-2 animate-spin" style={{ animationDuration: '2s' }} />; }
     else if (currentStatus === 'waiting') { statusClass += ' bg-gray-100 text-gray-500'; statusIcon = <FaRegClock className="mr-2" />; }
     else { statusClass += ' bg-gray-100 text-gray-800'; statusIcon = <FaRegClock className="mr-2" />; } // not_started и др.

     // Условие отображения третьего сета
     const showThirdSetInput = currentRound === 'final' || currentStatus === 'tie_needs_tiebreak';

    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-lg overflow-hidden">
          {/* Шапка */}
          <div className="bg-gradient-to-r from-[#0B8E8D] to-[#06324F] p-6 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{t.matchDetail}</h2>
              <button
                onClick={() => setView('matches')}
                className="text-white hover:text-red-200 transition-colors duration-150"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Содержимое */}
          <div className="p-6">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-y-2">
              <div className="flex items-center flex-wrap gap-2">
                <span className={roundClass}>
                  <span className="flex items-center">
                    {roundIcon}
                    {roundText}
                  </span>
                </span>
                <span className={statusClass}>
                  <span className="flex items-center">
                    {statusIcon}
                    {statusText}
                  </span>
                </span>
              </div>
              <div className="text-gray-600 flex items-center">
                <FaCalendarAlt className="mr-2 text-indigo-500" />
                {currentMatchData.time} ({t.court} {currentMatchData.court})
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <div className="text-center w-5/12">
                  <div className="text-lg font-bold text-indigo-800">{team1.name}</div>
                </div>
                <div className="text-center w-2/12">
                  <div className="text-xl font-bold text-gray-600">vs</div>
                </div>
                <div className="text-center w-5/12">
                  <div className="text-lg font-bold text-indigo-800">{team2.name}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Set 1 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.set1}</label>
                <div className="flex items-center justify-between">
                  <input
                    type="number" min="0"
                    value={currentMatchData.set1Team1}
                    onChange={(e) => updateMatchScore(currentMatchData.id, 1, 'team1', e.target.value)}
                    className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <span className="text-gray-400 text-xl font-bold">:</span>
                  <input
                    type="number" min="0"
                    value={currentMatchData.set1Team2}
                    onChange={(e) => updateMatchScore(currentMatchData.id, 1, 'team2', e.target.value)}
                    className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Set 2 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.set2}</label>
                <div className="flex items-center justify-between">
                  <input
                    type="number" min="0"
                    value={currentMatchData.set2Team1}
                    onChange={(e) => updateMatchScore(currentMatchData.id, 2, 'team1', e.target.value)}
                    className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <span className="text-gray-400 text-xl font-bold">:</span>
                  <input
                    type="number" min="0"
                    value={currentMatchData.set2Team2}
                    onChange={(e) => updateMatchScore(currentMatchData.id, 2, 'team2', e.target.value)}
                    className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Set 3 / Tiebreak */}
              {showThirdSetInput && (
                <div className={`bg-white p-4 rounded-lg shadow-sm border ${currentStatus === 'tie_needs_tiebreak' ? 'border-red-300' : 'border-gray-200'}`}>
                  <label className={`block text-sm font-medium ${currentStatus === 'tie_needs_tiebreak' ? 'text-red-700' : 'text-gray-700'} mb-2`}>
                    {currentStatus === 'tie_needs_tiebreak' ? t.tiebreak : t.set3}
                     {currentStatus === 'tie_needs_tiebreak' && ` (${t.tiebreak_condition || 'до 5'})`}
                  </label>
                  <div className="flex items-center justify-between">
                    <input
                      type="number" min="0"
                      value={currentMatchData.set3Team1}
                      onChange={(e) => updateMatchScore(currentMatchData.id, 3, 'team1', e.target.value)}
                      className={`w-20 p-2 border rounded-lg text-center font-bold text-lg focus:ring-2 ${currentStatus === 'tie_needs_tiebreak' ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                    />
                    <span className="text-gray-400 text-xl font-bold">:</span>
                    <input
                      type="number" min="0"
                      value={currentMatchData.set3Team2}
                      onChange={(e) => updateMatchScore(currentMatchData.id, 3, 'team2', e.target.value)}
                      className={`w-20 p-2 border rounded-lg text-center font-bold text-lg focus:ring-2 ${currentStatus === 'tie_needs_tiebreak' ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setView('matches')} // Просто закрываем окно, сохранение происходит при вводе
                className="w-full bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white py-2 px-4 rounded-lg hover:from-[#0B8E8D]/90 hover:to-[#06324F]/90 transition-all duration-200 shadow-md flex items-center justify-center"
              >
                <FaCheck className="mr-2"/> {t.close || 'Закрыть'} {/* Используем 'Закрыть', т.к. сохранение авто */}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
        {/* Боковая панель */}
        <aside className="w-full md:w-64 bg-white shadow-md md:h-screen md:sticky top-0 z-20">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-xl font-bold text-[#06324F] flex items-center">
              <FaVolleyballBall className="mr-2 text-[#0B8E8D]" /> RVL
            </h1>
            <div className="flex space-x-1">
               {/* Кнопки выбора языка */}
              {Object.keys(languageNames) // Используем languageNames для порядка и доступных языков
                  .filter(lang => translations[lang]) // Показываем только языки, для которых есть переводы
                  .map(lang => (
                    <button
                        key={lang}
                        onClick={() => changeLanguage(lang)}
                        className={`px-2 py-1 text-xs rounded transition-colors duration-150 ${language === lang
                            ? 'bg-[#0B8E8D] text-white shadow-sm' // Активный стиль
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200' // Неактивный стиль
                        }`}
                        title={languageNames[lang]} // Показываем полное имя во всплывающей подсказке
                    >
                        {lang.toUpperCase()} {/* Показываем код языка (RU, UK, CS) */}
                    </button>
              ))}
            </div>
          </div>

          <div className="p-4 space-y-2">
            {/* Кнопки навигации */}
            <button
              onClick={() => setView('matches')}
              className={`flex items-center w-full text-left p-3 rounded-lg transition-all duration-200 ${view === 'matches'
                ? 'bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white shadow-md'
                : 'hover:bg-[#0B8E8D]/10 text-gray-700'}`}
            >
              <FaVolleyballBall className="mr-3" /> {t.matches}
            </button>
            <button
              onClick={() => setView('groups')}
              className={`flex items-center w-full text-left p-3 rounded-lg transition-all duration-200 ${view === 'groups'
                ? 'bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white shadow-md'
                : 'hover:bg-[#0B8E8D]/10 text-gray-700'}`}
            >
              <FaUsers className="mr-3" /> {t.groups}
            </button>
            <button
              onClick={() => setShowRules(true)}
              className="flex items-center w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-[#0B8E8D]/10 text-gray-700 mt-2"
            >
              <FaGlobe className="mr-3 text-[#FDD80F]" /> {t.rules}
            </button>
          </div>

          {/* Информация о турнире (Десктоп) */}
          <div className="md:absolute md:bottom-6 md:left-0 md:right-0 px-6 mt-4 md:mt-0 hidden md:block">
            <div className="bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 p-4 rounded-lg shadow-sm border border-[#0B8E8D]/20">
              <h3 className="text-sm font-semibold text-[#06324F] mb-2">{t.tournamentInfo}</h3>
              <div className="text-xs text-gray-700 space-y-2">
                <p className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-[#FDD80F]" />
                  <span className="font-semibold mr-1">{t.dateLabel}:</span> {t.tournamentDate}
                </p>
                <p className="flex items-start">
                   <FaMapMarkerAlt className="mr-2 text-[#0B8E8D] mt-0.5 flex-shrink-0" />
                   <div><span className="font-semibold mr-1">{t.addressLabel}:</span> {t.tournamentAddress}</div>
                </p>
                <p className="flex items-center">
                  <FaLink className="mr-2 text-[#06324F]" />
                  <span className="font-semibold mr-1">{t.websiteLabel}:</span>
                  <a href={t.tournamentWebsite} target="_blank" rel="noopener noreferrer" className="text-[#0B8E8D] ml-1 hover:underline truncate">
                     {t.tournamentWebsite?.replace(/^(https?:\/\/)?(www\.)?/, '')} {/* Убираем http/www для краткости */}
                  </a>
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#0B8E8D]/20">
                <h3 className="text-sm font-semibold text-[#06324F] mb-1">{t.aboutSection}</h3>
                <p className="text-xs text-gray-600">{t.aboutApp}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Основной контент */}
        <main className="flex-1 p-0 md:p-6 pb-20 md:pb-6">
          {view === 'matches' && renderMatches()}
          {view === 'groups' && renderGroups()}
          {/* matchDetail рендерится как модальное окно поверх всего */}
          {view === 'matchDetail' && renderMatchDetail()}

          {/* Информация о турнире для мобильных устройств (вне main для лучшего позиционирования?) */}
           <div className="md:hidden p-4 mx-4 mt-4 mb-24 bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 rounded-lg shadow-sm border border-[#0B8E8D]/20">
             <h3 className="text-sm font-semibold text-[#06324F] mb-2">{t.tournamentInfo}</h3>
             <div className="text-xs text-gray-700 space-y-2">
               {/* ... содержимое идентично десктопной версии ... */}
               <p className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-[#FDD80F]" />
                  <span className="font-semibold mr-1">{t.dateLabel}:</span> {t.tournamentDate}
               </p>
               <p className="flex items-start">
                  <FaMapMarkerAlt className="mr-2 text-[#0B8E8D] mt-0.5 flex-shrink-0" />
                  <div><span className="font-semibold mr-1">{t.addressLabel}:</span> {t.tournamentAddress}</div>
               </p>
               <p className="flex items-center">
                   <FaLink className="mr-2 text-[#06324F]" />
                   <span className="font-semibold mr-1">{t.websiteLabel}:</span>
                   <a href={t.tournamentWebsite} target="_blank" rel="noopener noreferrer" className="text-[#0B8E8D] ml-1 hover:underline truncate">
                       {t.tournamentWebsite?.replace(/^(https?:\/\/)?(www\.)?/, '')}
                   </a>
               </p>
             </div>
           </div>
        </main>

        {/* Нижняя навигация для мобильных */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-2 flex justify-around md:hidden z-10 border-t border-gray-200">
          <button
            onClick={() => setView('matches')}
            className={`p-2 flex flex-col items-center transition-colors duration-150 ${view === 'matches' ? 'text-[#0B8E8D] font-semibold' : 'text-gray-600 hover:text-[#0B8E8D]'}`}
          >
            <FaVolleyballBall className="text-xl mb-1" />
            <span className="text-xs">{t.matches}</span>
          </button>
          <button
            onClick={() => setView('groups')}
            className={`p-2 flex flex-col items-center transition-colors duration-150 ${view === 'groups' ? 'text-[#0B8E8D] font-semibold' : 'text-gray-600 hover:text-[#0B8E8D]'}`}
          >
            <FaUsers className="text-xl mb-1" />
            <span className="text-xs">{t.groups}</span>
          </button>
          <button
            onClick={() => setShowRules(true)}
            className={`p-2 flex flex-col items-center text-gray-600 hover:text-[#0B8E8D] transition-colors duration-150`}
          >
            <FaGlobe className="text-xl mb-1 text-[#FDD80F]" />
            <span className="text-xs">{t.rules}</span>
          </button>
        </nav>
      </div>

      {/* Модальное окно с правилами турнира */}
      {showRules && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-start justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-4xl my-8 overflow-hidden">
            {/* Шапка модального окна */}
            <div className="bg-gradient-to-r from-[#0B8E8D] to-[#06324F] p-6 text-white sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{t.rules}</h2>
                <div className="flex items-center space-x-2">
                   {/* Переключатель языков в модальном окне */}
                   {Object.keys(languageNames)
                       .filter(lang => translations[lang])
                       .map(lang => (
                        <button
                            key={lang}
                            onClick={() => changeLanguage(lang)}
                            className={`px-2 py-1 text-xs rounded transition-colors duration-150 ${language === lang
                                ? 'bg-white text-[#0B8E8D] shadow-sm'
                                : 'bg-[#0B8E8D]/80 text-white hover:bg-[#0B8E8D]/90'}`}
                            title={languageNames[lang]}
                        >
                            {lang.toUpperCase()}
                        </button>
                    ))}
                  <button
                    onClick={() => setShowRules(false)}
                    className="text-white hover:text-[#FDD80F] transition-colors ml-4"
                    title={t.close}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Содержимое модального окна */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">

              {/* --- ИЗМЕНЕНИЕ: Интерфейс для настроек правил --- */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-[#06324F] mb-3">
                  {t.tieRules?.settingsTitle || "Настройки определения победителя (1:1)"} {/* Добавьте tieRules.settingsTitle в переводы */}
                </h4>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="useTotalPointsForTie"
                    checked={tournamentSettings.useTotalPointsForTie}
                    onChange={(e) => setTournamentSettings({ ...tournamentSettings, useTotalPointsForTie: e.target.checked })}
                    className="h-5 w-5 rounded text-[#0B8E8D] focus:ring-2 focus:ring-[#0B8E8D]/50 border-gray-300"
                  />
                  <label htmlFor="useTotalPointsForTie" className="text-gray-700 select-none cursor-pointer">
                    {t.tieRules?.usePointsOption || "Использовать общее количество очков"} {/* Добавьте tieRules.usePointsOption в переводы */}
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    {tournamentSettings.useTotalPointsForTie
                     ? t.tieRules?.usePointsOptionDescription || "Если выбрано, при счете 1:1 побеждает команда с большим количеством набранных очков в двух сетах. При равенстве очков - тайбрейк."
                     : t.tieRules?.useTiebreakOptionDescription || "Если не выбрано, при счете 1:1 всегда играется тайбрейк."}
                     {/* Добавьте соответствующие описания в переводы */}
                </p>
              </div>
              {/* ---------------------------------------------- */}


              {/* Описание правил */}
              <div className="mb-8 bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 p-6 rounded-xl shadow-md border border-[#0B8E8D]/20">
                <h3 className="text-xl font-bold text-[#06324F] mb-4">{t.tieRules?.title}</h3> {/* Правила при счете 1:1 */}

                <div className="space-y-4">
                   {/* Описание опций */}
                  <div className={`p-4 rounded-lg shadow-sm border ${tournamentSettings.useTotalPointsForTie ? 'bg-white border-green-200' : 'bg-gray-100 border-gray-200'}`}>
                    <h4 className="text-lg font-semibold text-[#0B8E8D] mb-2">{t.tieRules?.option1 || "Вариант 1: По очкам"}</h4>
                    <p className="text-gray-700 text-sm">{t.tieRules?.option1Description || "Побеждает команда, набравшая больше очков за 2 сета. Если очков поровну, играется тай-брейк (например, до 5)."}</p>
                  </div>

                  <div className={`p-4 rounded-lg shadow-sm border ${!tournamentSettings.useTotalPointsForTie ? 'bg-white border-green-200' : 'bg-gray-100 border-gray-200'}`}>
                    <h4 className="text-lg font-semibold text-[#0B8E8D] mb-2">{t.tieRules?.option2 || "Вариант 2: Всегда тай-брейк"}</h4>
                    <p className="text-gray-700 text-sm">{t.tieRules?.option2Description || "При счете 1:1 по сетам всегда играется решающий тай-брейк (например, до 5)."}</p>
                  </div>

                  {/* Текущее правило - уже отображается в настройках выше, можно убрать или оставить для ясности */}
                  {/*
                  <div className="bg-[#FDD80F]/10 p-4 rounded-lg shadow-sm border border-[#FDD80F]/30">
                    <h4 className="text-lg font-semibold text-[#06324F] mb-2">{t.tieRules?.currentRule || "Текущее правило турнира"}</h4>
                    <p className="text-[#06324F] font-bold">
                      {tournamentSettings.useTotalPointsForTie
                       ? (t.tieRules?.option1 || "Вариант 1: По очкам")
                       : (t.tieRules?.option2 || "Вариант 2: Всегда тай-брейк")}
                    </p>
                  </div>
                  */}
                </div>
              </div>

              {/* Основные правила турнира */}
              <div className="prose prose-sm max-w-none mt-6">
                 <h3 className="text-xl font-bold text-[#06324F] mb-4">{t.generalRulesTitle || "Общие правила"}</h3>
                {/* Используем <pre> для сохранения форматирования из translations.js */}
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 bg-gray-50 p-4 rounded border border-gray-200">{t.tournamentRules || "Текст общих правил турнира..."}</pre>
              </div>
            </div>

            {/* Кнопка закрытия модального окна */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 sticky bottom-0">
              <button
                onClick={() => setShowRules(false)}
                className="w-full py-2 bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
              >
                <FaCheck className="mr-2" /> {t.hideRules || "Закрыть правила"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
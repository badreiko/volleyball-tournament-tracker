import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { FaVolleyballBall, FaUsers, FaTrophy, FaRegClock, FaCheck, FaGlobe, FaExclamationTriangle, FaCalendarAlt, FaTable, FaChartBar, FaMapMarkerAlt, FaLink, FaBullhorn, FaSyncAlt, FaUndo } from 'react-icons/fa';
import { translations, languageNames } from './translations';

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

const initialMatches = [
    { id: 'A1-A2', court: 1, time: '09:00', team1: 'A1', team2: 'A2', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A3', refereeRule: null },
    { id: 'A2-A3', court: 1, time: '10:40', team1: 'A2', team2: 'A3', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A1', refereeRule: null },
    { id: 'A1-A3', court: 1, time: '09:50', team1: 'A1', team2: 'A3', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'C4', refereeRule: null },
    { id: 'B1-B2', court: 2, time: '09:50', team1: 'B1', team2: 'B2', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B3', refereeRule: null },
    { id: 'B2-B3', court: 2, time: '11:30', team1: 'B2', team2: 'B3', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B1', refereeRule: null },
    { id: 'B1-B3', court: 2, time: '10:40', team1: 'B1', team2: 'B3', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B2', refereeRule: null },
    { id: 'C1-C2', court: 3, time: '09:00', team1: 'C1', team2: 'C2', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B1', refereeRule: null },
    { id: 'C3-C4', court: 3, time: '09:00', team1: 'C3', team2: 'C4', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B2', refereeRule: null },
    { id: 'C1-C3', court: 3, time: '11:30', team1: 'C1', team2: 'C3', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A3', refereeRule: null },
    { id: 'C2-C4', court: 3, time: '11:30', team1: 'C2', team2: 'C4', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A2', refereeRule: null },
    { id: 'C1-C4', court: 3, time: '10:40', team1: 'C1', team2: 'C4', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'C2', refereeRule: null },
    { id: 'C2-C3', court: 3, time: '09:50', team1: 'C2', team2: 'C3', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'C1', refereeRule: null },
    { id: 'QF-1A-1C', court: 1, time: '12:30', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'quarterfinal', refereeTeamCode: null, refereeRule: '1B' },
    { id: 'QF-1B-2C', court: 2, time: '13:20', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'quarterfinal', refereeTeamCode: null, refereeRule: null },
    { id: 'QF-2A-3B', court: 1, time: '12:30', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'quarterfinal', refereeTeamCode: null, refereeRule: '3C' },
    { id: 'QF-3A-2B', court: 2, time: '12:30', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'quarterfinal', refereeTeamCode: null, refereeRule: '4C' },
    { id: 'SF-W1-W3', court: 1, time: '14:10', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'semifinal', refereeTeamCode: null, refereeRule: null },
    { id: 'SF-W2-W4', court: 2, time: '14:10', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'semifinal', refereeTeamCode: null, refereeRule: null },
    { id: 'F3-L1-L2', court: 2, time: '15:00', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'third_place', refereeTeamCode: null, refereeRule: null },
    { id: 'F-W1-W2', court: 1, time: '15:10', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'final', refereeTeamCode: null, refereeRule: null }
];

const loadFromLocalStorage = (key, defaultValue) => {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue === null || storedValue === undefined) {
            return defaultValue;
        }
        return JSON.parse(storedValue);
    } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
        return defaultValue;
    }
};

const saveToLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving to localStorage key "${key}":`, error);
    }
};

const validateScore = (score, isFinalSet, isTiebreak) => {
    const maxRegular = 25;
    const maxTiebreak = isFinalSet ? 15 : 5;
    const maxPoints = isTiebreak ? maxTiebreak : maxRegular;
    return Math.max(0, Math.min(score, maxPoints));
};

const isSetCompleted = (team1Score, team2Score, isFinalSet, isTiebreak) => {
    const minWinDiff = 2;
    const winThreshold = isTiebreak ? (isFinalSet ? 15 : 5) : 25;
    return (team1Score >= winThreshold || team2Score >= winThreshold) &&
           Math.abs(team1Score - team2Score) >= minWinDiff;
};

function App() {
    const [teams, setTeams] = useState(() => loadFromLocalStorage('teams', initialTeams));
    const [matches, setMatches] = useState(() => {
        const loadedMatches = loadFromLocalStorage('matches', initialMatches);
        return loadedMatches.map(loadedMatch => {
            const initialMatchData = initialMatches.find(im => im.id === loadedMatch.id);
            return {
                ...initialMatchData,
                ...loadedMatch,
                court: initialMatchData?.court ?? loadedMatch.court,
                time: initialMatchData?.time ?? loadedMatch.time,
                round: initialMatchData?.round ?? loadedMatch.round,
                refereeRule: initialMatchData?.refereeRule ?? null
            };
        });
    });
    const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'cs');
    const [tournamentSettings, setTournamentSettings] = useState(() => loadFromLocalStorage('tournamentSettings', { useTotalPointsForTie: true }));
    const [view, setView] = useState('matches');
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [showRules, setShowRules] = useState(false);

    const t = translations[language] || translations['cs'];

    useEffect(() => {
        saveToLocalStorage('teams', teams);
        saveToLocalStorage('matches', matches);
        try {
            localStorage.setItem('language', language);
        } catch (error) {
            console.error(`Error saving language to localStorage:`, error);
        }
        saveToLocalStorage('tournamentSettings', tournamentSettings);
    }, [teams, matches, language, tournamentSettings]);

    const recalculateAllTeamStats = useCallback((currentMatches) => {
        console.log("Recalculating team stats...");
        setTeams(() => {
            let calculatedTeams = initialTeams.map(initialTeam => ({
                ...initialTeam,
                points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0
            }));

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
                let team1SetsWon = 0, team2SetsWon = 0;
                const isFinal = match.round === 'final';

                if (isSetCompleted(match.set1Team1, match.set1Team2, false, false)) {
                    match.set1Team1 > match.set1Team2 ? team1SetsWon++ : team2SetsWon++;
                }
                if (isSetCompleted(match.set2Team1, match.set2Team2, false, false)) {
                    match.set2Team1 > match.set2Team2 ? team1SetsWon++ : team2SetsWon++;
                }
                if (isSetCompleted(match.set3Team1, match.set3Team2, isFinal, true)) {
                     match.set3Team1 > match.set3Team2 ? team1SetsWon++ : team2SetsWon++;
                }

                if (match.winner === team1.code) {
                    team1.points += (team1SetsWon === 2 && team2SetsWon === 0) ? 3 : 2;
                    team2.points += (team1SetsWon === 2 && team2SetsWon === 0) ? 0 : 1;
                    team1.wins++;
                    team2.losses++;
                } else if (match.winner === team2.code) {
                    team2.points += (team2SetsWon === 2 && team1SetsWon === 0) ? 3 : 2;
                    team1.points += (team2SetsWon === 2 && team1SetsWon === 0) ? 0 : 1;
                    team2.wins++;
                    team1.losses++;
                }

                team1.setsWon += team1SetsWon;
                team1.setsLost += team2SetsWon;
                team2.setsWon += team2SetsWon;
                team2.setsLost += team1SetsWon;

                calculatedTeams[team1Index] = team1;
                calculatedTeams[team2Index] = team2;
            });
            return calculatedTeams;
        });
    }, []);

    const assignReferees = useCallback((matchesToUpdate, currentTeams) => {
        console.log("Назначение судей для плей-офф матчей (assignReferees)");
        const refereeCodes = {
            '1A': 'A1', '2A': 'A2', '3A': 'A3',
            '1B': 'B1', '2B': 'B2', '3B': 'B3',
            '1C': 'C1', '2C': 'C2', '3C': 'C3', '4C': 'C4'
          };

        return matchesToUpdate.map(match => {
            if (match.round === 'group') return match;

            const updatedMatch = { ...match };

           if (updatedMatch.refereeTeamCode && refereeCodes[updatedMatch.refereeTeamCode]) {
                updatedMatch.refereeTeamCode = refereeCodes[updatedMatch.refereeTeamCode];
           }

            if (match.team1 && match.team2 && (!updatedMatch.refereeTeamCode || updatedMatch.refereeTeamCode === match.team1 || updatedMatch.refereeTeamCode === match.team2)) {
               const availableReferees = currentTeams
                   .filter(team => team.code !== match.team1 && team.code !== match.team2)
                   .map(team => team.code);

               if (availableReferees.length > 0) {
                   const randomIndex = Math.floor(Math.random() * availableReferees.length);
                   updatedMatch.refereeTeamCode = availableReferees[randomIndex];
                   console.log(`Матч ${match.id}: динамически назначен судья ${updatedMatch.refereeTeamCode}`);
               } else {
                   console.warn(`Матч ${match.id}: нет доступных судей!`);
                   updatedMatch.refereeTeamCode = null;
               }
           }
            else if (!updatedMatch.refereeTeamCode) {
              const initialMatchData = initialMatches.find(im => im.id === match.id);
              if (initialMatchData?.refereeRule) {
                 const groupRankings = {};
                 ['A', 'B', 'C'].forEach(group => {
                      const teamsInGroup = currentTeams.filter(t => t.group === group);
                      groupRankings[group] = [...teamsInGroup].sort((a, b) => b.points - a.points || (b.setsWon - b.setsLost) - (a.setsWon - a.setsLost) || b.setsWon - a.setsWon || a.name.localeCompare(b.name));
                  });
                  const rule = initialMatchData.refereeRule; // '1B', '3C' etc.
                  const groupLetter = rule[1];
                  const rank = parseInt(rule[0]);
                  const potentialRefCode = groupRankings[groupLetter]?.[rank - 1]?.code;

                  if (potentialRefCode && potentialRefCode !== match.team1 && potentialRefCode !== match.team2) {
                     updatedMatch.refereeTeamCode = potentialRefCode;
                      console.log(`Матч ${match.id}: назначен предопределенный судья ${potentialRefCode} по правилу ${rule}`);
                  } else {
                       console.log(`Матч ${match.id}: не удалось назначить предопределенного судью ${rule}, будет назначен динамически если возможно.`);
                       const availableReferees = currentTeams.filter(team => team.code !== match.team1 && team.code !== match.team2).map(team => team.code);
                       if (availableReferees.length > 0) {
                          const randomIndex = Math.floor(Math.random() * availableReferees.length);
                          updatedMatch.refereeTeamCode = availableReferees[randomIndex];
                           console.log(`Матч ${match.id}: динамически назначен судья ${updatedMatch.refereeTeamCode} (fallback)`);
                       } else {
                          updatedMatch.refereeTeamCode = null;
                       }
                  }
              }
            }
            return updatedMatch;
        });
    }, []);

    const updatePlayoffTeams = useCallback((currentMatches, currentTeams) => {
        console.log("--- updatePlayoffTeams START ---");
        const groupLetters = ['A', 'B', 'C'];
        const groupRankings = {};
        groupLetters.forEach(group => {
             const teamsInGroup = currentTeams.filter(t => t.group === group);
             groupRankings[group] = [...teamsInGroup].sort((a, b) => b.points - a.points || (b.setsWon - b.setsLost) - (a.setsWon - a.setsLost) || b.setsWon - a.setsWon || a.name.localeCompare(b.name));
         });
        const getRankedTeamCode = (group, rank) => groupRankings[group]?.[rank - 1]?.code || null;

         const potentialRefereeCodes = {
             '1B': getRankedTeamCode('B', 1),
             '3C': getRankedTeamCode('C', 3),
             '4C': getRankedTeamCode('C', 4),
         };
         console.log("Calculated Rankings (Top 1):", "A:", getRankedTeamCode('A',1), "B:", getRankedTeamCode('B',1), "C:", getRankedTeamCode('C',1));

        setMatches(prevMatches => {
            let changed = false;
            const updatedMatchesArray = prevMatches.map(match => {
                if (match.round === 'group') return match;

                // Логируем исходное состояние матча плей-офф
                // console.log(`Checking match: ${match.id}, Status: ${match.status}, Teams: ${match.team1}-${match.team2}, Ref: ${match.refereeTeamCode}`);

                const initialMatchData = initialMatches.find(im => im.id === match.id);
                const refereeRule = initialMatchData?.refereeRule;

                let currentTeam1 = match.team1;
                let currentTeam2 = match.team2;
                let currentReferee = match.refereeTeamCode;
                let currentStatus = match.status;

                let newTeam1Code = null;
                let newTeam2Code = null;

                switch (match.id) {
                    case 'QF-1A-1C': newTeam1Code = getRankedTeamCode('A', 1); newTeam2Code = getRankedTeamCode('C', 1); break;
                    case 'QF-1B-2C': newTeam1Code = getRankedTeamCode('B', 1); newTeam2Code = getRankedTeamCode('C', 2); break;
                    case 'QF-2A-3B': newTeam1Code = getRankedTeamCode('A', 2); newTeam2Code = getRankedTeamCode('B', 3); break;
                    case 'QF-3A-2B': newTeam1Code = getRankedTeamCode('A', 3); newTeam2Code = getRankedTeamCode('B', 2); break;
                    case 'SF-W1-W3': { const qf1 = prevMatches.find(m => m.id === 'QF-1A-1C'); const qf3 = prevMatches.find(m => m.id === 'QF-2A-3B'); newTeam1Code = qf1?.winner || null; newTeam2Code = qf3?.winner || null; break; }
                    case 'SF-W2-W4': { const qf2 = prevMatches.find(m => m.id === 'QF-1B-2C'); const qf4 = prevMatches.find(m => m.id === 'QF-3A-2B'); newTeam1Code = qf2?.winner || null; newTeam2Code = qf4?.winner || null; break; }
                    case 'F-W1-W2': { const sf1 = prevMatches.find(m => m.id === 'SF-W1-W3'); const sf2 = prevMatches.find(m => m.id === 'SF-W2-W4'); newTeam1Code = sf1?.winner || null; newTeam2Code = sf2?.winner || null; break; }
                    case 'F3-L1-L2': { const sf1 = prevMatches.find(m => m.id === 'SF-W1-W3'); const sf2 = prevMatches.find(m => m.id === 'SF-W2-W4'); newTeam1Code = (sf1?.winner && sf1.team1 && sf1.team2) ? (sf1.winner === sf1.team1 ? sf1.team2 : sf1.team1) : null; newTeam2Code = (sf2?.winner && sf2.team1 && sf2.team2) ? (sf2.winner === sf2.team1 ? sf2.team2 : sf2.team1) : null; break; }
                    default: return match;
                }

                const teamsDetermined = !!(newTeam1Code && newTeam2Code);
                const needsTeamUpdate = teamsDetermined && (currentStatus === 'waiting' || (currentStatus === 'not_started' && (currentTeam1 !== newTeam1Code || currentTeam2 !== newTeam2Code)));

                let newRefereeCode = currentReferee;
                let refereeChanged = false;
                 if (refereeRule && potentialRefereeCodes[refereeRule]) {
                    const potentialRef = potentialRefereeCodes[refereeRule];
                     if (potentialRef && potentialRef !== newTeam1Code && potentialRef !== newTeam2Code) {
                         if (currentReferee !== potentialRef) {
                             newRefereeCode = potentialRef;
                             refereeChanged = true;
                         }
                     } else if (currentReferee !== null && potentialRef && (potentialRef === newTeam1Code || potentialRef === newTeam2Code)) {
                         newRefereeCode = null;
                         refereeChanged = true;
                     }
                 }

                 // ОТЛАДКА: Выводим информацию перед принятием решения об обновлении
                 if (match.round !== 'group') { // Логируем только для плей-офф
                     console.log(`[${match.id}] Current: ${currentTeam1}-${currentTeam2} (Status: ${currentStatus}, Ref: ${currentReferee}). Calculated: ${newTeam1Code}-${newTeam2Code}. TeamsDetermined: ${teamsDetermined}. NeedsUpdate: ${needsTeamUpdate}. RefRule: ${refereeRule}. NewRef: ${newRefereeCode}. RefChanged: ${refereeChanged}`);
                 }


                if (needsTeamUpdate || (refereeChanged && currentReferee !== newRefereeCode)) {
                    changed = true;
                    // ОТЛАДКА: Логируем, что обновление сейчас произойдет
                    console.log(`---> UPDATING ${match.id}: Teams: ${newTeam1Code}-${newTeam2Code}, Status: ${teamsDetermined ? 'not_started' : 'waiting'}, Ref: ${newRefereeCode}`);
                    return {
                        ...match,
                        team1: newTeam1Code,
                        team2: newTeam2Code,
                        status: teamsDetermined ? 'not_started' : 'waiting',
                        refereeTeamCode: newRefereeCode,
                        set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null
                    };
                 }

                return match;
            });
             console.log("--- updatePlayoffTeams END --- Changed:", changed);
            return changed ? updatedMatchesArray : prevMatches;
        });
    }, [setMatches]);

    const forceUpdatePlayoffTeams = useCallback(() => {
        console.log("--- forceUpdatePlayoffTeams START (Button Click) ---");

        const groupRankings = {};
        ['A', 'B', 'C'].forEach(group => {
            const teamsInGroup = teams.filter(t => t.group === group);
            groupRankings[group] = [...teamsInGroup]
                .sort((a, b) =>
                    b.points - a.points ||
                    (b.setsWon - b.setsLost) - (a.setsWon - a.setsLost) ||
                    b.setsWon - a.setsWon ||
                    a.name.localeCompare(b.name)
                );
        });
        const getRankedTeamCode = (group, rank) => groupRankings[group]?.[rank - 1]?.code || null;
         console.log("ForceUpdate Calculated Rankings (Top 1):", "A:", getRankedTeamCode('A',1), "B:", getRankedTeamCode('B',1), "C:", getRankedTeamCode('C',1));

        const potentialRefereeCodes = {
            '1B': getRankedTeamCode('B', 1),
            '3C': getRankedTeamCode('C', 3),
            '4C': getRankedTeamCode('C', 4),
        };

        setMatches(prevMatches => {
            const updatedMatchesBase = prevMatches.map(match => {
                if (match.round === 'group') return match;

                const initialMatchData = initialMatches.find(im => im.id === match.id);
                const refereeRule = initialMatchData?.refereeRule;

                let newTeam1Code = null;
                let newTeam2Code = null;
                let newStatus = 'waiting';
                let predefinedRefereeCode = null;

                 switch (match.id) {
                    case 'QF-1A-1C': newTeam1Code = getRankedTeamCode('A', 1); newTeam2Code = getRankedTeamCode('C', 1); break;
                    case 'QF-1B-2C': newTeam1Code = getRankedTeamCode('B', 1); newTeam2Code = getRankedTeamCode('C', 2); break;
                    case 'QF-2A-3B': newTeam1Code = getRankedTeamCode('A', 2); newTeam2Code = getRankedTeamCode('B', 3); break;
                    case 'QF-3A-2B': newTeam1Code = getRankedTeamCode('A', 3); newTeam2Code = getRankedTeamCode('B', 2); break;
                    case 'SF-W1-W3': { const qf1 = prevMatches.find(m => m.id === 'QF-1A-1C'); const qf3 = prevMatches.find(m => m.id === 'QF-2A-3B'); newTeam1Code = qf1?.winner || null; newTeam2Code = qf3?.winner || null; break; }
                    case 'SF-W2-W4': { const qf2 = prevMatches.find(m => m.id === 'QF-1B-2C'); const qf4 = prevMatches.find(m => m.id === 'QF-3A-2B'); newTeam1Code = qf2?.winner || null; newTeam2Code = qf4?.winner || null; break; }
                    case 'F-W1-W2': { const sf1 = prevMatches.find(m => m.id === 'SF-W1-W3'); const sf2 = prevMatches.find(m => m.id === 'SF-W2-W4'); newTeam1Code = sf1?.winner || null; newTeam2Code = sf2?.winner || null; break; }
                    case 'F3-L1-L2': { const sf1 = prevMatches.find(m => m.id === 'SF-W1-W3'); const sf2 = prevMatches.find(m => m.id === 'SF-W2-W4'); newTeam1Code = (sf1?.winner && sf1.team1 && sf1.team2) ? (sf1.winner === sf1.team1 ? sf1.team2 : sf1.team1) : null; newTeam2Code = (sf2?.winner && sf2.team1 && sf2.team2) ? (sf2.winner === sf2.team1 ? sf2.team2 : sf2.team1) : null; break; }
                    default: return match;
                 }

                if (newTeam1Code && newTeam2Code) {
                    newStatus = 'not_started';
                }

                 if (refereeRule && potentialRefereeCodes[refereeRule]) {
                    const potentialRef = potentialRefereeCodes[refereeRule];
                     if (potentialRef && potentialRef !== newTeam1Code && potentialRef !== newTeam2Code) {
                         predefinedRefereeCode = potentialRef;
                     }
                 }
                 // ОТЛАДКА: Логируем, что будет установлено этой функцией перед вызовом assignReferees
                 console.log(`[${match.id} Button] Setting Teams: ${newTeam1Code}-${newTeam2Code}, Status: ${newStatus}, PredefinedRef: ${predefinedRefereeCode}`);

                return {
                    ...match,
                    team1: newTeam1Code,
                    team2: newTeam2Code,
                    status: newStatus,
                    refereeTeamCode: predefinedRefereeCode, // Устанавливаем предопределенного (или null)
                    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null
                };
            });

            // Вызываем assignReferees ПОСЛЕ основного маппинга, чтобы он назначил динамических судей там, где predefinedRefereeCode остался null или некорректен
            const matchesWithReferees = assignReferees(updatedMatchesBase, teams);
            console.log("--- forceUpdatePlayoffTeams END ---");
            return matchesWithReferees;
        });
    }, [teams, setMatches, assignReferees]); // Добавили assignReferees в зависимости

    
     useEffect(() => { checkAllMatchesStatus(); }, [matches, checkAllMatchesStatus]);
     useEffect(() => { recalculateAllTeamStats(matches); }, [matches, recalculateAllTeamStats]);
     useEffect(() => { updatePlayoffTeams(matches, teams); }, [teams, matches, updatePlayoffTeams]); // Убедитесь, что updatePlayoffTeams в зависимостях
    
     return (
         <>
             {/* ... Структура JSX без изменений ... */}
             <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
                <aside {/* ... */}> {/* ... */} </aside>
                <main className="flex-1 p-0 md:p-6 pb-20 md:pb-6 overflow-y-auto">
                    {view === 'matches' && renderMatches()}
                    {view === 'groups' && renderGroups()}
                    <div className="md:hidden p-4 mx-4 mt-4 mb-24 bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 rounded-lg shadow-sm border border-[#0B8E8D]/20"> {/* ... */} </div>
                 </main>
                 <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-2 flex justify-around md:hidden z-30 border-t border-gray-200"> {/* ... */} </nav>
             </div>
             {showRules && renderRulesModal()}
             {view === 'matchDetail' && renderMatchDetail()}
         </>
     );

    const updateMatchScore = useCallback((matchId, set, team, scoreStr) => {
        const score = parseInt(scoreStr);
        const validScore = isNaN(score) || score < 0 ? 0 : score;
        const match = matches.find(m => m.id === matchId);
        if (!match) return;
        const isFinalSet = match.round === 'final' && set === 3;
        const isTiebreak = set === 3 || match.status === 'tie_needs_tiebreak';
        const validatedScore = validateScore(validScore, isFinalSet, isTiebreak);
        setMatches(prevMatches =>
            prevMatches.map(m =>
                m.id === matchId
                    ? { ...m, [`set${set}${team === 'team1' ? 'Team1' : 'Team2'}`]: validatedScore }
                    : m
            )
        );
    }, [matches, setMatches]);

    const checkAllMatchesStatus = useCallback(() => {
        setMatches(prevMatches => {
            let needsUpdate = false;
            const updatedMatches = prevMatches.map(match => {
                if (match.status === 'waiting') return match;

                const { set1Team1, set1Team2, set2Team1, set2Team2, set3Team1, set3Team2 } = match;

                if (set1Team1 === 0 && set1Team2 === 0 && set2Team1 === 0 && set2Team2 === 0 && set3Team1 === 0 && set3Team2 === 0 && match.status !== 'not_started') {
                    if (match.status !== 'waiting') {
                       needsUpdate = true;
                       return { ...match, status: 'not_started', winner: null };
                    } else {
                       return match;
                    }
                }

                const isFinal = match.round === 'final';
                const set1Completed = isSetCompleted(set1Team1, set1Team2, false, false);
                const set2Completed = isSetCompleted(set2Team1, set2Team2, false, false);
                const set3Relevant = (set1Completed && set2Completed) || isFinal;
                const set3Completed = set3Relevant && isSetCompleted(set3Team1, set3Team2, isFinal, true);

                let team1Wins = 0, team2Wins = 0;
                if (set1Completed) (set1Team1 > set1Team2) ? team1Wins++ : team2Wins++;
                if (set2Completed) (set2Team1 > set2Team2) ? team1Wins++ : team2Wins++;
                if (set3Relevant && set3Completed) (set3Team1 > set3Team2) ? team1Wins++ : team2Wins++;

                let newStatus = match.status;
                let newWinner = match.winner;

                if (isFinal) {
                     if (team1Wins >= 2) { newStatus = 'completed'; newWinner = match.team1; }
                     else if (team2Wins >= 2) { newStatus = 'completed'; newWinner = match.team2; }
                     else if (set1Completed && set2Completed && set3Relevant && !set3Completed) { newStatus = 'in_progress'; newWinner = null; }
                     else if (set1Completed || set2Completed || (set1Team1 > 0 || set1Team2 > 0)) { newStatus = 'in_progress'; newWinner = null; }
                     else { newStatus = 'not_started'; newWinner = null; }
                } else {
                    if (team1Wins === 2) { newStatus = 'completed'; newWinner = match.team1; }
                    else if (team2Wins === 2) { newStatus = 'completed'; newWinner = match.team2; }
                    else if (team1Wins === 1 && team2Wins === 1) {
                        if (tournamentSettings.useTotalPointsForTie) {
                            const team1TotalPoints = set1Team1 + set2Team1;
                            const team2TotalPoints = set1Team2 + set2Team2;
                            if (team1TotalPoints > team2TotalPoints) { newStatus = 'completed_by_points'; newWinner = match.team1; }
                            else if (team2TotalPoints > team1TotalPoints) { newStatus = 'completed_by_points'; newWinner = match.team2; }
                            else {
                                newStatus = 'tie_needs_tiebreak'; newWinner = null;
                                if (isSetCompleted(set3Team1, set3Team2, false, true)) { newStatus = 'completed'; newWinner = (set3Team1 > set3Team2) ? match.team1 : match.team2; }
                            }
                        } else {
                            newStatus = 'tie_needs_tiebreak'; newWinner = null;
                             if (isSetCompleted(set3Team1, set3Team2, false, true)) { newStatus = 'completed'; newWinner = (set3Team1 > set3Team2) ? match.team1 : match.team2; }
                        }
                    } else if (set1Completed || set2Completed || (set1Team1 > 0 || set1Team2 > 0 || set2Team1 > 0 || set2Team2 > 0)) {
                       newStatus = 'in_progress'; newWinner = null;
                    }
                    else {
                        newStatus = match.status === 'waiting' ? 'waiting' : 'not_started'; newWinner = null;
                    }
                }

                if (newStatus !== match.status || newWinner !== match.winner) {
                    needsUpdate = true;
                    return { ...match, status: newStatus, winner: newWinner };
                }
                return match;
            });
            return needsUpdate ? updatedMatches : prevMatches;
        });
    }, [tournamentSettings.useTotalPointsForTie, setMatches]);

    useEffect(() => {
        checkAllMatchesStatus();
    }, [matches, checkAllMatchesStatus]);

     useEffect(() => {
         recalculateAllTeamStats(matches);
     }, [matches, recalculateAllTeamStats]);

    useEffect(() => {
        updatePlayoffTeams(matches, teams);
    }, [teams, matches, updatePlayoffTeams]);

    const handleSettingsChange = useCallback((newSettingValue) => {
        const newSettings = { ...tournamentSettings, useTotalPointsForTie: newSettingValue };
        setTournamentSettings(newSettings);
        checkAllMatchesStatus();
    }, [tournamentSettings, checkAllMatchesStatus, setTournamentSettings]);

    const changeLanguage = useCallback((lang) => {
        if (translations[lang]) {
            setLanguage(lang);
        } else {
            setLanguage('cs');
        }
    }, [setLanguage]);

    const resetMatch = useCallback((matchId) => {
        const initialMatch = initialMatches.find(m => m.id === matchId);
        const originalStatus = initialMatch ? initialMatch.status : 'not_started';
        setMatches(prevMatches => prevMatches.map(m => {
            if (m.id === matchId) {
                console.log(`Сброс матча: ${matchId}`);
                return {
                    ...m,
                    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0,
                    winner: null, status: originalStatus
                };
            }
            return m;
        }));
         setSelectedMatch(null);
         setView('matches');
    }, [setMatches, setSelectedMatch, setView]);

    const renderMatches = useCallback(() => {
        const sortedMatches = [...matches].sort((a, b) => {
            const timeA = a.time || "99:99";
            const timeB = b.time || "99:99";
            const timeCompare = timeA.localeCompare(timeB);
            if (timeCompare !== 0) return timeCompare;
            return (a.court || 99) - (b.court || 99);
        });

        return (
            <div className="p-4 overflow-x-auto">
                <div className="flex justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-indigo-700 flex items-center">
                        <FaVolleyballBall className="mr-3 text-indigo-600" />
                        <span>{t.matches}</span>
                    </h2>
                     <button
                        onClick={forceUpdatePlayoffTeams}
                        className="px-4 py-2 bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white rounded-lg shadow-md hover:opacity-90 transition-opacity flex items-center text-sm shrink-0"
                        title={t.updatePlayoffTeamsTooltip || "Пересчитать сетку плей-офф и назначить судей"}
                     >
                         <FaSyncAlt className="mr-2" />
                         {t.updatePlayoffTeamsShort || "Обновить плей-офф"}
                    </button>
                 </div>

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
                                    <th className="py-3 px-4 text-left text-xs md:text-sm">{t.referee || 'Судья'}</th>
                                    <th className="py-3 px-4 text-center text-xs md:text-sm">{t.set1}</th>
                                    <th className="py-3 px-4 text-center text-xs md:text-sm">{t.set2}</th>
                                    <th className="py-3 px-4 text-center text-xs md:text-sm">{t.set3}</th>
                                    <th className="py-3 px-4 text-left text-xs md:text-sm">{t.status}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedMatches.map(match => {
                                    const team1 = teams.find(tm => tm.code === match.team1);
                                    const team2 = teams.find(tm => tm.code === match.team2);
                                    const refereeTeam = teams.find(tm => tm.code === match.refereeTeamCode);
                                    const team1Name = team1?.name || (match.round !== 'group' && match.team1 ? `...` : t.tbd);
                                    const team2Name = team2?.name || (match.round !== 'group' && match.team2 ? `...` : t.tbd);
                                    const refereeName = refereeTeam?.name || (match.refereeTeamCode ? `(${t.refereeTBD || '???'})` : (t.refereeTBD || '???'));
                                    let statusIcon, statusClass, statusText; const currentStatus = match.status || 'unknown'; statusText = t.statusNames?.[currentStatus] || currentStatus;
                                    if(currentStatus==='completed'){statusIcon=<FaCheck className="mr-1 text-green-500"/>;statusClass='text-green-600 font-semibold';}else if(currentStatus==='completed_by_points'){statusIcon=<FaCheck className="mr-1 text-blue-500"/>;statusClass='text-blue-600 font-semibold';}else if(currentStatus==='tie_needs_tiebreak'){statusIcon=<FaExclamationTriangle className="mr-1 text-red-500"/>;statusClass='text-red-600 font-semibold';}else if(currentStatus==='in_progress'){statusIcon=<FaRegClock className="mr-1 text-yellow-600 animate-spin" style={{animationDuration:'2s'}}/>;statusClass='text-yellow-700 font-semibold';}else if(currentStatus==='waiting'){statusIcon=<FaRegClock className="mr-1 text-gray-400"/>;statusClass='text-gray-500';}else{statusIcon=<FaRegClock className="mr-1 text-gray-500"/>;statusClass='text-gray-600';}
                                    let roundClass='px-2 py-1 rounded text-xs font-semibold inline-block'; const currentRound = match.round || 'unknown'; const roundText = t.roundNames?.[currentRound] || currentRound;
                                    if(currentRound==='group'){roundClass+=' bg-[#C1CBA7]/50 text-[#06324F]';}else if(currentRound==='quarterfinal'){roundClass+=' bg-[#0B8E8D]/20 text-[#0B8E8D]';}else if(currentRound==='semifinal'){roundClass+=' bg-[#06324F]/20 text-[#06324F]';}else if(currentRound==='third_place'){roundClass+=' bg-orange-100 text-orange-700';}else if(currentRound==='final'){roundClass+=' bg-[#FDD80F]/20 text-[#FDD80F]/90';}else{roundClass+=' bg-gray-200 text-gray-700';}
                                    const showThirdSet=currentRound==='final'||currentStatus==='tie_needs_tiebreak'||(match.set3Team1>0||match.set3Team2>0);
                                    const canOpenDetail = !!(match.team1 && match.team2);
                                    const isTeam1Winner = match.winner && team1 && match.winner === team1.code;
                                    const isTeam2Winner = match.winner && team2 && match.winner === team2.code;

                                    return (
                                        <tr key={match.id} className={`border-b transition-colors duration-150 ease-in-out ${canOpenDetail ? 'hover:bg-[#0B8E8D]/10 cursor-pointer' : 'opacity-70 cursor-not-allowed'}`} onClick={canOpenDetail ? () => { setView('matchDetail'); setSelectedMatch(match); } : undefined}>
                                            <td className="p-2 text-sm md:text-base"><span className={roundClass}>{roundText}</span></td>
                                            <td className="p-2 text-sm md:text-base font-medium">
                                                <span className={isTeam1Winner ? 'font-bold text-indigo-800' : ''}>{team1Name}</span>
                                                <span className="text-gray-400 mx-1">vs</span>
                                                <span className={isTeam2Winner ? 'font-bold text-indigo-800' : ''}>{team2Name}</span>
                                            </td>
                                            <td className="p-2 text-sm md:text-base text-center">{match.court}</td>
                                            <td className="p-2 text-sm md:text-base text-gray-700 text-center"><div className="flex items-center justify-center"><FaCalendarAlt className="mr-1 text-indigo-500 hidden md:inline" />{match.time}</div></td>
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
    }, [matches, teams, t, setView, setSelectedMatch, forceUpdatePlayoffTeams]);

    const renderGroups = useCallback(() => {
        return (
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center"><FaUsers className="mr-3 text-indigo-600" /><span>{t.groups}</span></h2>
                {teams.length === 0 && <p className="text-center p-4">{t.noTeams || 'Команды не найдены.'}</p>}
                {teams.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {['A', 'B', 'C'].map(group => {
                             const groupColors = {
                                 'A':{bg:'from-[#C1CBA7] to-[#0B8E8D]', lightBg:'from-[#C1CBA7]/20 to-[#0B8E8D]/10', text:'text-blue-700', border:'border-blue-200'},
                                 'B':{bg:'from-[#06324F] to-[#0B8E8D]', lightBg:'from-[#06324F]/10 to-[#0B8E8D]/10', text:'text-purple-700', border:'border-purple-200'},
                                 'C':{bg:'from-[#FDD80F] to-[#0B8E8D]', lightBg:'from-[#FDD80F]/10 to-[#0B8E8D]/10', text:'text-green-700', border:'border-green-200'}
                             };
                            const colors = groupColors[group] || groupColors['A'];
                            const groupTeams = teams.filter(tm => tm.group === group);
                            const sortedGroupTeams = [...groupTeams].sort((a, b) => b.points - a.points || (b.setsWon - b.setsLost) - (a.setsWon - a.setsLost) || b.setsWon - a.setsWon || a.name.localeCompare(b.name));

                            return (
                                <div key={group} className={`bg-gradient-to-r ${colors.lightBg} rounded-xl shadow-lg overflow-hidden`}>
                                    <div className={`bg-gradient-to-r ${colors.bg} p-4 text-white`}>
                                         <h3 className="text-xl font-bold flex items-center"><FaTable className="mr-2" /> {t.group} {group}</h3>
                                     </div>
                                    <div className="p-4 overflow-x-auto">
                                        {groupTeams.length === 0 ? <p className="text-center text-gray-500 py-4">{t.noTeamsInGroup || 'Нет команд'}</p> : (
                                            <table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
                                                 <thead className="bg-gray-50">
                                                     <tr>
                                                         <th className="p-3 text-left text-xs md:text-sm font-semibold text-gray-700">{t.team}</th>
                                                         <th className="p-3 text-center text-xs md:text-sm font-semibold text-gray-700">{t.points}</th>
                                                         <th className="p-3 text-center text-xs md:text-sm font-semibold text-gray-700" title={t.winsLosses||'Победы/Поражения'}>{t.winsLossesShort || 'В/П'}</th>
                                                         <th className="p-3 text-center text-xs md:text-sm font-semibold text-gray-700" title={t.sets||'Сеты'}>{t.setsShort || 'С'}</th>
                                                         <th className="p-3 text-center text-xs md:text-sm font-semibold text-gray-700" title={t.setsDifference||'Разница сетов'}>{t.setsDiffShort || 'Р'}</th>
                                                     </tr>
                                                 </thead>
                                                <tbody>
                                                    {sortedGroupTeams.map((team, index) => {
                                                        const rank = index + 1;
                                                        let rowClass = `border-b ${colors.border} hover:bg-gray-50 transition-colors duration-150`;
                                                        let rankIcon = null;
                                                        if (rank === 1) { rowClass += ' bg-green-50 font-bold'; rankIcon = <FaTrophy className="inline mr-2 text-yellow-500" />; }
                                                        else if (rank === 2) { rowClass += ' bg-green-50'; rankIcon = <FaTrophy className="inline mr-2 text-gray-400" />; }
                                                        else if (rank === 3 && (group === 'A' || group === 'B')) { rankIcon = <FaTrophy className="inline mr-2 text-orange-400" />; }
                                                        return (
                                                        <tr key={team.code} className={rowClass}>
                                                            <td className="p-3 text-sm md:text-base">{rankIcon}{team.name}</td>
                                                            <td className="p-3 text-sm md:text-base text-center"><span className="inline-block w-8 h-8 rounded-full bg-[#0B8E8D]/20 text-[#06324F] font-bold flex items-center justify-center">{team.points || 0}</span></td>
                                                            <td className="p-3 text-sm md:text-base text-center">{team.wins || 0}/{team.losses || 0}</td>
                                                            <td className="p-3 text-sm md:text-base text-center"><span className="font-semibold text-green-600">{team.setsWon || 0}</span><span className="mx-1 text-gray-400">:</span><span className="font-semibold text-red-600">{team.setsLost || 0}</span></td>
                                                            <td className={`p-3 text-sm md:text-base text-center font-semibold ${(team.setsWon - team.setsLost) > 0 ? 'text-green-700' : (team.setsWon - team.setsLost) < 0 ? 'text-red-700' : 'text-gray-600'}`}>{(team.setsWon - team.setsLost) > 0 ? '+' : ''}{team.setsWon - team.setsLost || 0}</td>
                                                        </tr>
                                                        );
                                                    })}
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
        if (!currentMatchData) {
             if(selectedMatch) setSelectedMatch(null);
             return null;
        }

        const team1 = teams.find(t => t.code === currentMatchData.team1) || { name: t.tbd };
        const team2 = teams.find(t => t.code === currentMatchData.team2) || { name: t.tbd };
        const refereeTeam = teams.find(t => t.code === currentMatchData.refereeTeamCode);
         const refereeName = refereeTeam?.name || (currentMatchData.refereeTeamCode ? `(${t.refereeTBD || '???'})` : (t.refereeTBD || '???'));

        let roundClass = 'px-3 py-1 rounded-full text-sm font-semibold inline-block mb-3'; let roundIcon;
        const currentRound = currentMatchData.round || 'unknown'; const roundText = t.roundNames?.[currentRound] || currentRound;
        if(currentRound==='group'){roundClass+=' bg-[#C1CBA7]/50 text-[#06324F]';roundIcon=<FaUsers className="mr-2"/>;}else if(currentRound==='quarterfinal'){roundClass+=' bg-[#0B8E8D]/20 text-[#0B8E8D]';roundIcon=<FaChartBar className="mr-2"/>;}else if(currentRound==='semifinal'){roundClass+=' bg-[#06324F]/20 text-[#06324F]';roundIcon=<FaChartBar className="mr-2"/>;}else if(currentRound==='third_place'){roundClass+=' bg-orange-100 text-orange-700';roundIcon=<FaTrophy className="mr-2"/>;}else if(currentRound==='final'){roundClass+=' bg-[#FDD80F]/20 text-[#FDD80F]/90';roundIcon=<FaTrophy className="mr-2"/>;}else{roundClass+=' bg-gray-200 text-gray-700';roundIcon=<FaVolleyballBall className="mr-2"/>;}

        let statusClass = 'px-3 py-1 rounded-full text-sm font-semibold inline-block ml-2'; let statusIcon;
        const currentStatus = currentMatchData.status || 'unknown'; const statusText = t.statusNames?.[currentStatus] || currentStatus;
        if(currentStatus==='completed'){statusClass+=' bg-green-100 text-green-800';statusIcon=<FaCheck className="mr-2"/>;}else if(currentStatus==='completed_by_points'){statusClass+=' bg-blue-100 text-blue-800';statusIcon=<FaCheck className="mr-2"/>;}else if(currentStatus==='tie_needs_tiebreak'){statusClass+=' bg-red-100 text-red-800';statusIcon=<FaExclamationTriangle className="mr-2"/>;}else if(currentStatus==='in_progress'){statusClass+=' bg-yellow-100 text-yellow-800';statusIcon=<FaRegClock className="mr-2 animate-spin" style={{animationDuration:'2s'}}/>;}else if(currentStatus==='waiting'){statusClass+=' bg-gray-100 text-gray-500';statusIcon=<FaRegClock className="mr-2"/>;}else{statusClass+=' bg-gray-100 text-gray-800';statusIcon=<FaRegClock className="mr-2"/>;}

        const isTiebreakSituation = currentStatus === 'tie_needs_tiebreak';
        const showThirdSetInput = currentRound === 'final' || isTiebreakSituation || (currentMatchData.set3Team1 > 0 || currentMatchData.set3Team2 > 0);

        return (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center p-4 z-[70] backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-[#0B8E8D] to-[#06324F] p-6 text-white">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">{t.matchDetail}</h2>
                            <button onClick={() => { setView('matches'); setSelectedMatch(null); }} className="text-white hover:text-red-200 transition-colors duration-150 text-3xl leading-none">&times;</button>
                        </div>
                    </div>
                    <div className="p-6 max-h-[80vh] overflow-y-auto">
                        <div className="flex flex-wrap justify-between items-start mb-6 gap-y-2">
                            <div className="flex items-center flex-wrap gap-2">
                                <span className={roundClass}><span className="flex items-center">{roundIcon}{roundText}</span></span>
                                <span className={statusClass}><span className="flex items-center">{statusIcon}{statusText}</span></span>
                            </div>
                            <div className="text-sm text-gray-600 flex flex-col items-end space-y-1">
                                <div className="flex items-center"><FaCalendarAlt className="mr-2 text-indigo-500" />{currentMatchData.time} ({t.court} {currentMatchData.court})</div>
                                <div className="flex items-center"><FaBullhorn className="mr-2 text-gray-400" />{t.referee || 'Судья'}: {refereeName}</div>
                            </div>
                        </div>
                         <div className="bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 p-4 rounded-lg mb-6">
                            <div className="flex justify-between items-center">
                                <div className="text-center w-5/12"><div className="text-lg font-bold text-indigo-800">{team1.name}</div></div>
                                <div className="text-center w-2/12"><div className="text-xl font-bold text-gray-600">vs</div></div>
                                <div className="text-center w-5/12"><div className="text-lg font-bold text-indigo-800">{team2.name}</div></div>
                             </div>
                         </div>
                        <div className="space-y-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t.set1}</label>
                                <div className="flex items-center justify-between">
                                    <input type="number" min="0" max="99" defaultValue={currentMatchData.set1Team1 ?? 0} onBlur={(e) => updateMatchScore(currentMatchData.id, 1, 'team1', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                    <span className="text-gray-400 text-xl font-bold">:</span>
                                    <input type="number" min="0" max="99" defaultValue={currentMatchData.set1Team2 ?? 0} onBlur={(e) => updateMatchScore(currentMatchData.id, 1, 'team2', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t.set2}</label>
                                <div className="flex items-center justify-between">
                                     <input type="number" min="0" max="99" defaultValue={currentMatchData.set2Team1 ?? 0} onBlur={(e) => updateMatchScore(currentMatchData.id, 2, 'team1', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                    <span className="text-gray-400 text-xl font-bold">:</span>
                                    <input type="number" min="0" max="99" defaultValue={currentMatchData.set2Team2 ?? 0} onBlur={(e) => updateMatchScore(currentMatchData.id, 2, 'team2', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                            </div>
                            {showThirdSetInput && (
                                <div className={`bg-white p-4 rounded-lg shadow-sm border ${isTiebreakSituation ? 'border-red-300' : 'border-gray-200'}`}>
                                    <label className={`block text-sm font-medium ${isTiebreakSituation ? 'text-red-700' : 'text-gray-700'} mb-2`}>
                                         {currentRound === 'final' ? t.set3 : (isTiebreakSituation ? t.tiebreak : t.set3)}
                                         {currentRound !== 'final' && isTiebreakSituation && ` (${t.tiebreak_condition || 'до 5'})`}
                                         {currentRound === 'final' && ` (${t.finalTiebreakCondition || 'до 15'})`}
                                    </label>
                                    <div className="flex items-center justify-between">
                                        <input
                                            type="number" min="0"
                                            max={currentRound === 'final' ? "99" : (isTiebreakSituation ? "99" : "99")}
                                            defaultValue={currentMatchData.set3Team1 ?? 0}
                                            onBlur={(e) => updateMatchScore(currentMatchData.id, 3, 'team1', e.target.value)}
                                            className={`w-20 p-2 border rounded-lg text-center font-bold text-lg focus:ring-2 ${isTiebreakSituation ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                                        />
                                        <span className="text-gray-400 text-xl font-bold">:</span>
                                        <input
                                             type="number" min="0"
                                             max={currentRound === 'final' ? "99" : (isTiebreakSituation ? "99" : "99")}
                                             defaultValue={currentMatchData.set3Team2 ?? 0}
                                             onBlur={(e) => updateMatchScore(currentMatchData.id, 3, 'team2', e.target.value)}
                                             className={`w-20 p-2 border rounded-lg text-center font-bold text-lg focus:ring-2 ${isTiebreakSituation ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                                        />
                                    </div>
                                     {isTiebreakSituation && <p className="text-xs text-red-600 mt-2">{t.tiebreakInfo || "Введите счет тай-брейка (до 5, разница 2)."}</p>}
                                     {currentRound === 'final' && showThirdSetInput && <p className="text-xs text-gray-500 mt-2">{t.finalTiebreakInfo || "Третий сет финала играется до 15 (разница 2)."}</p>}
                                </div>
                            )}
                        </div>
                        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                             <button
                                onClick={() => resetMatch(currentMatchData.id)}
                                className="w-full sm:w-auto bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-all duration-200 shadow-sm border border-red-200 flex items-center justify-center text-sm"
                                title={t.resetMatchTooltip || "Сбросить счет и статус матча к начальным"}
                             >
                                 <FaUndo className="mr-2"/> {t.resetMatch || 'Сбросить'}
                             </button>
                            <button
                                onClick={() => { setView('matches'); setSelectedMatch(null); }}
                                className="w-full sm:w-auto bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white py-2 px-4 rounded-lg hover:opacity-90 transition-all duration-200 shadow-md flex items-center justify-center text-sm"
                            >
                                <FaCheck className="mr-2"/> {t.close || 'Закрыть'}
                            </button>
                         </div>
                    </div>
                </div>
            </div>
        );
    }, [selectedMatch, matches, teams, t, updateMatchScore, setView, setSelectedMatch, resetMatch]);

    const renderRulesModal = useCallback(() => {
        return (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-start justify-center p-4 z-[60] backdrop-blur-sm overflow-y-auto">
                <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-4xl my-8 overflow-hidden">
                     <div className="bg-gradient-to-r from-[#0B8E8D] to-[#06324F] p-6 text-white sticky top-0 z-10">
                         <div className="flex justify-between items-center">
                             <h2 className="text-2xl font-bold flex items-center"><FaGlobe className="mr-2" />{t.rules}</h2>
                             <div className="flex items-center space-x-2">
                                {Object.keys(languageNames).filter(lang => translations[lang]).map(lang => (
                                    <button key={lang} onClick={() => changeLanguage(lang)} className={`px-2 py-1 text-xs rounded transition-colors duration-150 ${language === lang ? 'bg-white text-[#0B8E8D] shadow-sm font-semibold' : 'bg-[#0B8E8D]/80 text-white hover:bg-[#0B8E8D]/90'}`} title={languageNames[lang]}>{lang.toUpperCase()}</button>
                                ))}
                                 <button onClick={() => setShowRules(false)} className="text-white hover:text-[#FDD80F] transition-colors ml-4" title={t.close}>
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                 </button>
                             </div>
                         </div>
                     </div>
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                         <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
                            <h4 className="text-lg font-semibold text-[#06324F] mb-3">{t.tieRules?.settingsTitle || "Настройки определения победителя (при 1:1 по сетам)"}</h4>
                            <div className="flex items-center space-x-3">
                                <input
                                     type="checkbox"
                                     id="useTotalPointsForTie"
                                     checked={tournamentSettings.useTotalPointsForTie}
                                     onChange={(e) => handleSettingsChange(e.target.checked)}
                                     className="h-5 w-5 rounded text-[#0B8E8D] focus:ring-2 focus:ring-[#0B8E8D]/50 border-gray-300 cursor-pointer"
                                 />
                                 <label htmlFor="useTotalPointsForTie" className="text-gray-700 select-none cursor-pointer">{t.tieRules?.usePointsOption || "Учитывать общее кол-во очков в 2 сетах"}</label>
                             </div>
                             <p className="text-xs text-gray-500 mt-2">
                                 {tournamentSettings.useTotalPointsForTie
                                     ? (t.tieRules?.usePointsOptionDescription || "Если счет 1:1, выигрывает команда с большим кол-вом очков за 2 сета. При равенстве очков играется тай-брейк до 5.")
                                     : (t.tieRules?.useTiebreakOptionDescription || "Если счет 1:1, всегда играется тай-брейк до 5.")
                                }
                            </p>
                         </div>
                        <div className="mb-8 bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 p-6 rounded-xl shadow-md border border-[#0B8E8D]/20">
                            <h3 className="text-xl font-bold text-[#06324F] mb-4">{t.tieRules?.title || "Правила определения победителя (при 1:1 по сетам)"}</h3>
                            <div className="space-y-4">
                                 <div className={`p-4 rounded-lg shadow-sm border transition-all duration-300 ${tournamentSettings.useTotalPointsForTie ? 'bg-white border-green-300 ring-2 ring-green-200' : 'bg-gray-100 border-gray-200 opacity-70'}`}>
                                    <h4 className="text-lg font-semibold text-[#0B8E8D] mb-2 flex items-center">
                                         {tournamentSettings.useTotalPointsForTie && <FaCheck className="text-green-500 mr-2" />} {t.tieRules?.option1 || "Вариант 1: По очкам"}
                                     </h4>
                                     <p className="text-gray-700 text-sm">{t.tieRules?.option1Description || "Побеждает команда, набравшая больше очков в сумме за 2 сета. Если очков поровну, играется тай-брейк до 5 очков (разница 2)."}</p>
                                 </div>
                                 <div className={`p-4 rounded-lg shadow-sm border transition-all duration-300 ${!tournamentSettings.useTotalPointsForTie ? 'bg-white border-green-300 ring-2 ring-green-200' : 'bg-gray-100 border-gray-200 opacity-70'}`}>
                                    <h4 className="text-lg font-semibold text-[#0B8E8D] mb-2 flex items-center">
                                        {!tournamentSettings.useTotalPointsForTie && <FaCheck className="text-green-500 mr-2" />} {t.tieRules?.option2 || "Вариант 2: Всегда тай-брейк"}
                                     </h4>
                                    <p className="text-gray-700 text-sm">{t.tieRules?.option2Description || "Всегда играется тай-брейк до 5 очков (разница 2)."}</p>
                                 </div>
                             </div>
                         </div>
                        <div className="prose prose-sm max-w-none mt-6">
                             <h3 className="text-xl font-bold text-[#06324F] mb-4">{t.generalRulesTitle || "Общие правила турнира"}</h3>
                             <div className="whitespace-pre-wrap font-sans text-sm text-gray-800 bg-gray-50 p-4 rounded border border-gray-200">
                                {t.tournamentRules || "Здесь будут общие правила турнира..."}
                            </div>
                         </div>
                     </div>
                     <div className="p-4 border-t border-gray-200 bg-gray-50 sticky bottom-0">
                         <button onClick={() => setShowRules(false)} className="w-full py-2 bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center shadow-md">
                            <FaCheck className="mr-2" /> {t.hideRules || "Закрыть правила"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }, [language, tournamentSettings, t, handleSettingsChange, changeLanguage]);

    return (
        <>
            <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
                <aside className="w-full md:w-64 bg-white shadow-md md:h-screen md:sticky md:top-0 z-40 border-b md:border-b-0 md:border-r border-gray-200 shrink-0">
                     <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h1 className="text-xl font-bold text-[#06324F] flex items-center"><FaVolleyballBall className="mr-2 text-[#0B8E8D]" /> {t.appName || 'RVL Scoreboard'}</h1>
                         <div className="hidden md:flex space-x-1">
                             {Object.keys(languageNames).filter(lang => translations[lang]).map(lang => (
                                <button key={lang} onClick={() => changeLanguage(lang)} className={`px-2 py-1 text-xs rounded transition-colors duration-150 ${language === lang ? 'bg-[#0B8E8D] text-white shadow-sm font-semibold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} title={languageNames[lang]}>{lang.toUpperCase()}</button>
                            ))}
                        </div>
                    </div>
                     <div className="p-4 space-y-2">
                        <button onClick={() => setView('matches')} className={`flex items-center w-full text-left p-3 rounded-lg transition-all duration-200 ${view === 'matches' ? 'bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white shadow-md' : 'hover:bg-[#0B8E8D]/10 text-gray-700'}`}><FaVolleyballBall className="mr-3" /> {t.matches}</button>
                        <button onClick={() => setView('groups')} className={`flex items-center w-full text-left p-3 rounded-lg transition-all duration-200 ${view === 'groups' ? 'bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white shadow-md' : 'hover:bg-[#0B8E8D]/10 text-gray-700'}`}><FaUsers className="mr-3" /> {t.groups}</button>
                        <button onClick={() => setShowRules(true)} className="flex items-center w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-[#0B8E8D]/10 text-gray-700 mt-2"><FaGlobe className="mr-3 text-[#FDD80F]" /> {t.rules}</button>
                    </div>
                     <div className="md:absolute md:bottom-0 md:left-0 md:right-0 p-4 hidden md:block">
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

                <main className="flex-1 p-0 md:p-6 pb-20 md:pb-6 overflow-y-auto">
                    {view === 'matches' && renderMatches()}
                    {view === 'groups' && renderGroups()}

                    <div className="md:hidden p-4 mx-4 mt-4 mb-24 bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 rounded-lg shadow-sm border border-[#0B8E8D]/20">
                        <h3 className="text-sm font-semibold text-[#06324F] mb-2">{t.tournamentInfo}</h3>
                        <div className="text-xs text-gray-700 space-y-2">
                            <p className="flex items-center"><FaCalendarAlt className="mr-2 text-[#FDD80F]" /><span className="font-semibold mr-1">{t.dateLabel}:</span> {t.tournamentDate}</p>
                            <p className="flex items-start"><FaMapMarkerAlt className="mr-2 text-[#0B8E8D] mt-0.5 flex-shrink-0" /><div><span className="font-semibold mr-1">{t.addressLabel}:</span> {t.tournamentAddress}</div></p>
                            <p className="flex items-center"><FaLink className="mr-2 text-[#06324F]" /><span className="font-semibold mr-1">{t.websiteLabel}:</span><a href={t.tournamentWebsite} target="_blank" rel="noopener noreferrer" className="text-[#0B8E8D] ml-1 hover:underline truncate">{t.tournamentWebsite?.replace(/^(https?:\/\/)?(www\.)?/, '')}</a></p>
                        </div>
                         <div className="flex space-x-1 mt-3 pt-2 border-t border-[#0B8E8D]/20">
                             {Object.keys(languageNames).filter(lang => translations[lang]).map(lang => (
                                <button key={lang} onClick={() => changeLanguage(lang)} className={`px-2 py-1 text-xs rounded transition-colors duration-150 ${language === lang ? 'bg-[#0B8E8D] text-white shadow-sm font-semibold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} title={languageNames[lang]}>{lang.toUpperCase()}</button>
                            ))}
                        </div>
                    </div>
                </main>

                <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-2 flex justify-around md:hidden z-30 border-t border-gray-200">
                    <button onClick={() => setView('matches')} className={`p-2 flex flex-col items-center transition-colors duration-150 ${view === 'matches' ? 'text-[#0B8E8D] font-semibold' : 'text-gray-600 hover:text-[#0B8E8D]'}`}><FaVolleyballBall className="text-xl mb-1" /><span className="text-xs">{t.matches}</span></button>
                    <button onClick={() => setView('groups')} className={`p-2 flex flex-col items-center transition-colors duration-150 ${view === 'groups' ? 'text-[#0B8E8D] font-semibold' : 'text-gray-600 hover:text-[#0B8E8D]'}`}><FaUsers className="text-xl mb-1" /><span className="text-xs">{t.groups}</span></button>
                    <button onClick={() => setShowRules(true)} className={`p-2 flex flex-col items-center text-gray-600 hover:text-[#0B8E8D] transition-colors duration-150`}><FaGlobe className="text-xl mb-1 text-[#FDD80F]" /><span className="text-xs">{t.rules}</span></button>
                </nav>
            </div>

            {showRules && renderRulesModal()}
            {view === 'matchDetail' && renderMatchDetail()}
        </>
    );
}

export default App;
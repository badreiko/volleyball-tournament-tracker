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
                  } else if (currentReferee !== null && potentialRefCode && (potentialRefCode === newTeam1Code || potentialRefCode === newTeam2Code)) {
                       updatedMatch.refereeTeamCode = null;
                       refereeChanged = true;
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
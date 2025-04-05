
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { FaVolleyballBall, FaUsers, FaTrophy, FaRegClock, FaCheck, FaGlobe, FaExclamationTriangle, FaCalendarAlt, FaTable, FaChartBar, FaMapMarkerAlt, FaLink, FaBullhorn, FaSyncAlt, FaUndo } from 'react-icons/fa'; // Added FaSyncAlt, FaUndo
import { translations, languageNames } from './translations';

// Initial data remains the same
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
    { id: 'A1-A2', court: 1, time: '09:00', team1: 'A1', team2: 'A2', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A3' },
    { id: 'A2-A3', court: 1, time: '10:40', team1: 'A2', team2: 'A3', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A1' },
    { id: 'A1-A3', court: 1, time: '09:50', team1: 'A1', team2: 'A3', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'C4' },
    { id: 'B1-B2', court: 2, time: '09:50', team1: 'B1', team2: 'B2', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B3' },
    { id: 'B2-B3', court: 2, time: '11:30', team1: 'B2', team2: 'B3', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B1' },
    { id: 'B1-B3', court: 2, time: '10:40', team1: 'B1', team2: 'B3', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B2' },
    { id: 'C1-C2', court: 3, time: '09:00', team1: 'C1', team2: 'C2', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B1' },
    { id: 'C3-C4', court: 3, time: '09:00', team1: 'C3', team2: 'C4', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B2' },
    { id: 'C1-C3', court: 3, time: '11:30', team1: 'C1', team2: 'C3', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A3' },
    { id: 'C2-C4', court: 3, time: '11:30', team1: 'C2', team2: 'C4', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A2' },
    { id: 'C1-C4', court: 3, time: '10:40', team1: 'C1', team2: 'C4', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'C2' },
    { id: 'C2-C3', court: 3, time: '09:50', team1: 'C2', team2: 'C3', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'C1' },
    { id: 'QF-1A-1C', court: 1, time: '12:30', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'quarterfinal', refereeTeamCode: null }, // Referee needs to be assigned based on B group 1st place
    { id: 'QF-1B-2C', court: 2, time: '13:20', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'quarterfinal', refereeTeamCode: null }, // Referee assigned dynamically
    { id: 'QF-2A-3B', court: 1, time: '12:30', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'quarterfinal', refereeTeamCode: null }, // Referee needs C3
    { id: 'QF-3A-2B', court: 2, time: '12:30', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'quarterfinal', refereeTeamCode: null }, // Referee needs C4
    { id: 'SF-W1-W3', court: 1, time: '14:10', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'semifinal', refereeTeamCode: null }, // Referee assigned dynamically
    { id: 'SF-W2-W4', court: 2, time: '14:10', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'semifinal', refereeTeamCode: null }, // Referee assigned dynamically
    { id: 'F3-L1-L2', court: 2, time: '15:00', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'third_place', refereeTeamCode: null }, // Referee assigned dynamically
    { id: 'F-W1-W2', court: 1, time: '15:10', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'final', refereeTeamCode: null } // Referee assigned dynamically
];

// Local storage functions remain the same
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

// Validation and completion logic remains the same
const validateScore = (score, isFinalSet, isTiebreak) => {
    const maxRegular = 25;
    const maxTiebreak = isFinalSet ? 15 : 5; // Tiebreak in final to 15, otherwise to 5
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
    // State definitions remain the same
    const [teams, setTeams] = useState(() => loadFromLocalStorage('teams', initialTeams));
    const [matches, setMatches] = useState(() => {
        const loadedMatches = loadFromLocalStorage('matches', initialMatches);
        // Ensure loaded matches have the correct static data like refereeTeamCode and time from initialMatches
        return loadedMatches.map(loadedMatch => {
            const initialMatchData = initialMatches.find(im => im.id === loadedMatch.id);
            // Keep loaded scores/status, but take time/court/initial referee from definition
            return {
                ...loadedMatch, // Keep saved scores, winner, status etc.
                court: initialMatchData?.court ?? loadedMatch.court,
                time: initialMatchData?.time ?? loadedMatch.time,
                group: initialMatchData?.group ?? loadedMatch.group,
                round: initialMatchData?.round ?? loadedMatch.round,
                refereeTeamCode: initialMatchData?.refereeTeamCode // Restore initial referee if needed
                 ?? loadedMatch.refereeTeamCode // Or keep the loaded one if it was dynamically assigned/saved
                 ?? null
            };
        });
    });
    const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'cs');
    const [tournamentSettings, setTournamentSettings] = useState(() => loadFromLocalStorage('tournamentSettings', { useTotalPointsForTie: true }));
    const [view, setView] = useState('matches');
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [showRules, setShowRules] = useState(false);

    const t = translations[language] || translations['cs'];

    // useEffect for saving to localStorage remains the same
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

    // recalculateAllTeamStats remains the same
    const recalculateAllTeamStats = useCallback((currentMatches) => {
        setTeams(prevBaseTeams => {
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
                const isFinal = match.round === 'final'; // Although this function only processes group matches currently

                // Determine set wins based on completed status
                if (isSetCompleted(match.set1Team1, match.set1Team2, false, false)) {
                    match.set1Team1 > match.set1Team2 ? team1SetsWon++ : team2SetsWon++;
                }
                if (isSetCompleted(match.set2Team1, match.set2Team2, false, false)) {
                    match.set2Team1 > match.set2Team2 ? team1SetsWon++ : team2SetsWon++;
                }
                // Tiebreak set completion check (though not relevant for standard group scoring)
                if (isSetCompleted(match.set3Team1, match.set3Team2, isFinal, true)) {
                     match.set3Team1 > match.set3Team2 ? team1SetsWon++ : team2SetsWon++;
                }

                // Assign points based on winner and set score (3 for 2-0, 2 for 2-1, 1 for 1-2, 0 for 0-2)
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

                // Update total sets won/lost
                team1.setsWon += team1SetsWon;
                team1.setsLost += team2SetsWon;
                team2.setsWon += team2SetsWon;
                team2.setsLost += team1SetsWon;

                calculatedTeams[team1Index] = team1;
                calculatedTeams[team2Index] = team2;
            });

            console.log("Updated teams:", calculatedTeams);
            return calculatedTeams;
        });
    }, []); // Depends only on initialTeams structure, calculation based on passed currentMatches

    // Original updatePlayoffTeams function (for automatic updates)
    const updatePlayoffTeams = useCallback((currentMatches, currentTeams) => {
        console.log("Автоматическое обновление команд плей-офф (если необходимо)");
        const groupLetters = ['A', 'B', 'C'];
        const groupRankings = {};

        groupLetters.forEach(group => {
            const teamsInGroup = currentTeams.filter(t => t.group === group);
            groupRankings[group] = [...teamsInGroup]
                .sort((a, b) =>
                    b.points - a.points ||
                    (b.setsWon - b.setsLost) - (a.setsWon - a.setsLost) ||
                    b.setsWon - a.setsWon ||
                    a.name.localeCompare(b.name) // Tie-breaker by name if all else equal
                );
        });

        // Helper to get ranked team code, returning null if rank doesn't exist
        const getRankedTeamCode = (group, rank) => groupRankings[group]?.[rank - 1]?.code || null;

        // Get referee codes based on rankings for specific assignments
        // These are *potential* referees, actual assignment might differ
        const potentialRefereeCodes = {
             '1A': getRankedTeamCode('A', 1), '2A': getRankedTeamCode('A', 2), '3A': getRankedTeamCode('A', 3),
             '1B': getRankedTeamCode('B', 1), '2B': getRankedTeamCode('B', 2), '3B': getRankedTeamCode('B', 3),
             '1C': getRankedTeamCode('C', 1), '2C': getRankedTeamCode('C', 2), '3C': getRankedTeamCode('C', 3), '4C': getRankedTeamCode('C', 4)
         };


        setMatches(prevMatches => {
            let changed = false;

            const updatedMatchesArray = prevMatches.map(match => {
                // Only update playoff matches automatically if they are still in 'waiting' status
                if (match.round === 'group' || match.status !== 'waiting') return match;

                const updatedMatch = { ...match };
                let team1Code = updatedMatch.team1; // Keep existing if already set (e.g., by manual update)
                let team2Code = updatedMatch.team2;
                let newStatus = updatedMatch.status;

                // Determine teams based on round ID and rankings/previous winners
                switch (match.id) {
                    case 'QF-1A-1C':
                        team1Code = getRankedTeamCode('A', 1);
                        team2Code = getRankedTeamCode('C', 1);
                        // Assign predefined referee based on rules (1st place B)
                        updatedMatch.refereeTeamCode = potentialRefereeCodes['1B'] || updatedMatch.refereeTeamCode;
                        break;
                    case 'QF-1B-2C':
                        team1Code = getRankedTeamCode('B', 1);
                        team2Code = getRankedTeamCode('C', 2);
                        // Referee might be assigned dynamically later or manually
                        break;
                    case 'QF-2A-3B':
                        team1Code = getRankedTeamCode('A', 2);
                        team2Code = getRankedTeamCode('B', 3);
                         // Assign predefined referee (3rd place C)
                        updatedMatch.refereeTeamCode = potentialRefereeCodes['3C'] || updatedMatch.refereeTeamCode;
                        break;
                    case 'QF-3A-2B':
                        team1Code = getRankedTeamCode('A', 3);
                        team2Code = getRankedTeamCode('B', 2);
                         // Assign predefined referee (4th place C)
                        updatedMatch.refereeTeamCode = potentialRefereeCodes['4C'] || updatedMatch.refereeTeamCode;
                        break;
                    case 'SF-W1-W3': {
                        const qf1 = prevMatches.find(m => m.id === 'QF-1A-1C');
                        const qf3 = prevMatches.find(m => m.id === 'QF-2A-3B');
                        team1Code = qf1?.winner || null;
                        team2Code = qf3?.winner || null;
                        break;
                    }
                    case 'SF-W2-W4': {
                        const qf2 = prevMatches.find(m => m.id === 'QF-1B-2C');
                        const qf4 = prevMatches.find(m => m.id === 'QF-3A-2B');
                        team1Code = qf2?.winner || null;
                        team2Code = qf4?.winner || null;
                        break;
                    }
                    case 'F-W1-W2': {
                        const sf1 = prevMatches.find(m => m.id === 'SF-W1-W3');
                        const sf2 = prevMatches.find(m => m.id === 'SF-W2-W4');
                        team1Code = sf1?.winner || null;
                        team2Code = sf2?.winner || null;
                        break;
                    }
                    case 'F3-L1-L2': {
                        const sf1 = prevMatches.find(m => m.id === 'SF-W1-W3');
                        const sf2 = prevMatches.find(m => m.id === 'SF-W2-W4');
                        team1Code = null; // Reset loser
                        team2Code = null;
                        if (sf1?.winner && sf1.team1 && sf1.team2) {
                            team1Code = sf1.winner === sf1.team1 ? sf1.team2 : sf1.team1;
                        }
                        if (sf2?.winner && sf2.team1 && sf2.team2) {
                            team2Code = sf2.winner === sf2.team1 ? sf2.team2 : sf2.team1;
                        }
                        break;
                    }
                    default: break; // No automatic update for this match ID
                }

                // Update match only if teams are determined and status was 'waiting'
                if (team1Code && team2Code) {
                    if (updatedMatch.team1 !== team1Code || updatedMatch.team2 !== team2Code) {
                        updatedMatch.team1 = team1Code;
                        updatedMatch.team2 = team2Code;
                        updatedMatch.status = 'not_started'; // Change status from waiting
                        changed = true;
                         console.log(`Автоматически обновлен матч ${match.id}: ${team1Code} vs ${team2Code}`);
                    }
                } else {
                     // If teams cannot be determined yet, ensure status remains 'waiting'
                     if (updatedMatch.status !== 'waiting') {
                        // This case should not happen based on the initial check, but for safety:
                        updatedMatch.team1 = null;
                        updatedMatch.team2 = null;
                        updatedMatch.status = 'waiting';
                        updatedMatch.set1Team1=0; updatedMatch.set1Team2=0;
                        updatedMatch.set2Team1=0; updatedMatch.set2Team2=0;
                        updatedMatch.set3Team1=0; updatedMatch.set3Team2=0;
                        updatedMatch.winner=null;
                        changed = true;
                     }
                }
                return updatedMatch;
            });

            // Only return new array if changes were made to avoid unnecessary re-renders
            return changed ? updatedMatchesArray : prevMatches;
        });
    }, []); // dependency array needs careful consideration, maybe depends on 'teams'

    // updateMatchScore remains mostly the same, potentially add max validation clarification
    const updateMatchScore = useCallback((matchId, set, team, scoreStr) => {
        const score = parseInt(scoreStr);
         // Allow empty input to be treated as 0, handle NaN
         const validScore = isNaN(score) || score < 0 ? 0 : score;

        const match = matches.find(m => m.id === matchId);
        if (!match) return;

        const isFinalSet = match.round === 'final' && set === 3;
        // Tiebreak applies to set 3 OR if status explicitly requires it (1:1 sets, points equal)
        const isTiebreak = set === 3 || match.status === 'tie_needs_tiebreak';

        // Use validation function
        const validatedScore = validateScore(validScore, isFinalSet, isTiebreak);

        setMatches(prevMatches =>
            prevMatches.map(m =>
                m.id === matchId
                    ? { ...m, [`set${set}${team === 'team1' ? 'Team1' : 'Team2'}`]: validatedScore }
                    : m
            )
        );
    }, [matches]); // Depends on matches state to find the match

    // checkAllMatchesStatus remains mostly the same
    const checkAllMatchesStatus = useCallback(() => {
        console.log("Проверка статусов всех матчей...");
        setMatches(prevMatches => {
            let needsUpdate = false;
            const updatedMatches = prevMatches.map(match => {
                 // Don't change status if it's 'waiting' or manually reset to 'not_started' before scores are entered
                if (match.status === 'waiting') return match;
                // If all scores are 0, ensure status is 'not_started' (unless it's waiting)
                if (match.set1Team1 === 0 && match.set1Team2 === 0 &&
                    match.set2Team1 === 0 && match.set2Team2 === 0 &&
                    match.set3Team1 === 0 && match.set3Team2 === 0 &&
                    match.status !== 'not_started') {
                    // Needs reset to 'not_started' state, unless waiting
                    if (match.status !== 'waiting') {
                       needsUpdate = true;
                       return { ...match, status: 'not_started', winner: null };
                    } else {
                       return match; // Keep waiting status
                    }
                }


                const { set1Team1, set1Team2, set2Team1, set2Team2, set3Team1, set3Team2 } = match;
                const isFinal = match.round === 'final';

                const set1Completed = isSetCompleted(set1Team1, set1Team2, false, false);
                const set2Completed = isSetCompleted(set2Team1, set2Team2, false, false);
                // Set 3 only matters if sets 1 and 2 result in 1:1, or if it's the final
                const set3Relevant = (isSetCompleted(set1Team1, set1Team2, false, false) && isSetCompleted(set2Team1, set2Team2, false, false)) || isFinal;
                const set3Completed = set3Relevant && isSetCompleted(set3Team1, set3Team2, isFinal, true);

                let team1Wins = 0, team2Wins = 0;
                if (set1Completed) (set1Team1 > set1Team2) ? team1Wins++ : team2Wins++;
                if (set2Completed) (set2Team1 > set2Team2) ? team1Wins++ : team2Wins++;
                // Only count set 3 if it was relevant and completed
                if (set3Relevant && set3Completed) (set3Team1 > set3Team2) ? team1Wins++ : team2Wins++;


                let newStatus = match.status;
                let newWinner = match.winner;

                 // Check for match completion based on set wins
                if (isFinal) { // Final is best of 3 sets
                     if (team1Wins >= 2) {
                         newStatus = 'completed'; newWinner = match.team1;
                     } else if (team2Wins >= 2) {
                         newStatus = 'completed'; newWinner = match.team2;
                     } else if (set1Completed && set2Completed && set3Relevant && !set3Completed) {
                         newStatus = 'in_progress'; // Waiting for tiebreak result
                         newWinner = null;
                     } else if (set1Completed || set2Completed) {
                         newStatus = 'in_progress'; // At least one set done
                         newWinner = null;
                     } else if (set1Team1 > 0 || set1Team2 > 0 || set2Team1 > 0 || set2Team2 > 0 || set3Team1 > 0 || set3Team2 > 0){
                          newStatus = 'in_progress'; // Some points scored
                          newWinner = null;
                     }
                     else {
                         // If no scores yet, keep original status (likely not_started)
                          newStatus = 'not_started';
                          newWinner = null;
                     }
                } else { // Other matches are 2 sets + potential tie/tiebreak
                    if (team1Wins === 2) {
                        newStatus = 'completed'; newWinner = match.team1;
                    } else if (team2Wins === 2) {
                        newStatus = 'completed'; newWinner = match.team2;
                    } else if (team1Wins === 1 && team2Wins === 1) { // Sets are 1:1
                        if (tournamentSettings.useTotalPointsForTie) {
                            // Calculate points only from the two completed sets
                            const team1TotalPoints = set1Team1 + set2Team1;
                            const team2TotalPoints = set1Team2 + set2Team2;
                            if (team1TotalPoints > team2TotalPoints) {
                                newStatus = 'completed_by_points'; newWinner = match.team1;
                            } else if (team2TotalPoints > team1TotalPoints) {
                                newStatus = 'completed_by_points'; newWinner = match.team2;
                            } else { // Points are equal, need tiebreak
                                newStatus = 'tie_needs_tiebreak';
                                newWinner = null;
                                // Check if tiebreak is completed
                                if (isSetCompleted(set3Team1, set3Team2, false, true)) {
                                    newStatus = 'completed'; // Completed via tiebreak
                                    newWinner = (set3Team1 > set3Team2) ? match.team1 : match.team2;
                                }
                            }
                        } else { // Always play tiebreak if 1:1
                            newStatus = 'tie_needs_tiebreak';
                            newWinner = null;
                             // Check if tiebreak is completed
                             if (isSetCompleted(set3Team1, set3Team2, false, true)) {
                                 newStatus = 'completed'; // Completed via tiebreak
                                 newWinner = (set3Team1 > set3Team2) ? match.team1 : match.team2;
                             }
                        }
                    } else if (set1Completed || set2Completed) { // Only one set completed
                       newStatus = 'in_progress';
                       newWinner = null;
                    } else if (set1Team1 > 0 || set1Team2 > 0 || set2Team1 > 0 || set2Team2 > 0 || set3Team1 > 0 || set3Team2 > 0){
                         newStatus = 'in_progress'; // Some points scored
                         newWinner = null;
                    }
                    else {
                        // If no scores yet, keep original status (likely not_started or waiting)
                        newStatus = match.status === 'waiting' ? 'waiting' : 'not_started';
                        newWinner = null;
                    }
                }


                // If status or winner changed, mark for update
                if (newStatus !== match.status || newWinner !== match.winner) {
                    needsUpdate = true;
                    return { ...match, status: newStatus, winner: newWinner };
                }
                return match; // No change
            });

            return needsUpdate ? updatedMatches : prevMatches; // Return new array only if modified
        });
    }, [tournamentSettings.useTotalPointsForTie]); // Depends on the setting


    // useEffect to run checks and calculations when matches change
    useEffect(() => {
        console.log("Matches changed, running checks...");
        checkAllMatchesStatus(); // Check status first based on scores
        // Note: recalculateAllTeamStats depends on the *result* of checkAllMatchesStatus (winner field)
        // Running them in the same effect might use slightly stale state if checkAllMatchesStatus updates state async
        // It's generally okay here because setMatches queues the update, but for complex flows, consider chaining effects
        // or using the functional update form of setMatches more extensively.
    }, [matches, checkAllMatchesStatus]); // Rerun when matches change

     // Separate useEffect to recalculate stats *after* status check potentially updated matches
     useEffect(() => {
         console.log("Recalculating team stats...");
         recalculateAllTeamStats(matches);
     }, [matches, recalculateAllTeamStats]); // Depend on matches too

    // useEffect to update playoff teams *after* stats have been recalculated
    useEffect(() => {
        console.log("Teams changed, updating playoff teams automatically...");
        updatePlayoffTeams(matches, teams);
    }, [teams, matches, updatePlayoffTeams]); // Depend on teams and matches


    // handleSettingsChange remains the same
    const handleSettingsChange = useCallback((newSettingValue) => {
        const newSettings = { ...tournamentSettings, useTotalPointsForTie: newSettingValue };
        setTournamentSettings(newSettings);
        // Re-check matches status immediately after setting changes
        checkAllMatchesStatus();
    }, [tournamentSettings, checkAllMatchesStatus]);

    // changeLanguage remains the same
    const changeLanguage = useCallback((lang) => {
        if (translations[lang]) {
            setLanguage(lang);
        } else {
            setLanguage('cs'); // Fallback to default
        }
    }, []);


    // ----- NEW: Function to reset a match score and status -----
    const resetMatch = useCallback((matchId) => {
        const initialMatch = initialMatches.find(m => m.id === matchId);
        const originalStatus = initialMatch ? initialMatch.status : 'not_started'; // Use initial status

        setMatches(prevMatches => prevMatches.map(m => {
            if (m.id === matchId) {
                console.log(`Сброс матча: ${matchId}`);
                return {
                    ...m, // Keep court, time, teams, round, referee etc.
                    set1Team1: 0,
                    set1Team2: 0,
                    set2Team1: 0,
                    set2Team2: 0,
                    set3Team1: 0,
                    set3Team2: 0,
                    winner: null,
                    status: originalStatus // Reset to original status ('not_started' or 'waiting')
                };
            }
            return m;
        }));
         // Close detail view after reset
         setSelectedMatch(null);
         setView('matches');
    }, [setMatches]); // Depends on setMatches

    // ----- NEW: assignReferees function -----
     const assignReferees = useCallback((matchesToUpdate, currentTeams) => {
         console.log("Назначение судей для плей-офф матчей");

         // Map to potentially convert legacy codes if needed (might be redundant now)
         const refereeCodes = {
             '1A': 'A1', '2A': 'A2', '3A': 'A3',
             '1B': 'B1', '2B': 'B2', '3B': 'B3',
             '1C': 'C1', '2C': 'C2', '3C': 'C3', '4C': 'C4'
           };

         return matchesToUpdate.map(match => {
             // Skip group matches
             if (match.round === 'group') return match;

             const updatedMatch = { ...match };

              // Convert legacy code if present
             if (updatedMatch.refereeTeamCode && refereeCodes[updatedMatch.refereeTeamCode]) {
                 updatedMatch.refereeTeamCode = refereeCodes[updatedMatch.refereeTeamCode];
             }


             // Check if referee needs dynamic assignment (playoff, teams set, but no referee)
              // Also assign if the initial referee code points to a player in the current match
             if (match.team1 && match.team2 && (!updatedMatch.refereeTeamCode || updatedMatch.refereeTeamCode === match.team1 || updatedMatch.refereeTeamCode === match.team2)) {
                  // Find available teams (not playing in this match)
                 const availableReferees = currentTeams
                     .filter(team => team.code !== match.team1 && team.code !== match.team2)
                     .map(team => team.code);

                 if (availableReferees.length > 0) {
                     // Simple random assignment for now
                     const randomIndex = Math.floor(Math.random() * availableReferees.length);
                     updatedMatch.refereeTeamCode = availableReferees[randomIndex];
                     console.log(`Матч ${match.id}: динамически назначен судья ${updatedMatch.refereeTeamCode}`);
                 } else {
                      // Fallback if no referees available (shouldn't happen with 10 teams)
                      console.warn(`Матч ${match.id}: нет доступных судей!`);
                      updatedMatch.refereeTeamCode = null; // Or keep previous invalid one? Set null for clarity.
                 }
             }
             // Add logic for pre-defined playoff referees based on initialMatches data if needed
              else if (!updatedMatch.refereeTeamCode) {
                const initialMatchData = initialMatches.find(im => im.id === match.id);
                if (initialMatchData?.refereeTeamCode) {
                   // If initial data had a referee code (like '1B'), try to resolve it
                   const groupRankings = {}; // Need rankings again here, or pass them in
                   ['A', 'B', 'C'].forEach(group => {
                        const teamsInGroup = currentTeams.filter(t => t.group === group);
                        groupRankings[group] = [...teamsInGroup].sort((a, b) => b.points - a.points || (b.setsWon - b.setsLost) - (a.setsWon - a.setsLost) || b.setsWon - a.setsWon || a.name.localeCompare(b.name));
                    });
                   const potentialRefCode = groupRankings[initialMatchData.refereeTeamCode[1]]?.[parseInt(initialMatchData.refereeTeamCode[0]) - 1]?.code;
                   if (potentialRefCode && potentialRefCode !== match.team1 && potentialRefCode !== match.team2) {
                      updatedMatch.refereeTeamCode = potentialRefCode;
                       console.log(`Матч ${match.id}: назначен предопределенный судья ${potentialRefCode} по коду ${initialMatchData.refereeTeamCode}`);
                   } else {
                        console.log(`Матч ${match.id}: не удалось назначить предопределенного судью ${initialMatchData.refereeTeamCode}, будет назначен динамически если возможно.`);
                         // Potentially re-run dynamic assignment logic here if pre-defined failed
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
     }, []); // Empty dependency array as it operates on arguments, but uses Math.random

    // ----- NEW: forceUpdatePlayoffTeams function -----
     const forceUpdatePlayoffTeams = useCallback(() => {
         console.log("Принудительное обновление команд плей-офф и назначение судей");

         // Get current group rankings
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
         // Helper to get ranked team code
          const getRankedTeamCode = (group, rank) => groupRankings[group]?.[rank - 1]?.code || null;


         setMatches(prevMatches => {
             // Create a mutable copy to update
             const newMatches = prevMatches.map(m => ({ ...m })); // Deep copy needed? No, shallow is enough here

             // Find playoff matches
             const qf1 = newMatches.find(m => m.id === 'QF-1A-1C');
             const qf2 = newMatches.find(m => m.id === 'QF-1B-2C');
             const qf3 = newMatches.find(m => m.id === 'QF-2A-3B');
             const qf4 = newMatches.find(m => m.id === 'QF-3A-2B');
             const sf1 = newMatches.find(m => m.id === 'SF-W1-W3');
             const sf2 = newMatches.find(m => m.id === 'SF-W2-W4');
             const final = newMatches.find(m => m.id === 'F-W1-W2');
             const thirdPlace = newMatches.find(m => m.id === 'F3-L1-L2');

             // Reset referees for all playoff matches before assigning teams/new refs
             [qf1, qf2, qf3, qf4, sf1, sf2, final, thirdPlace].forEach(match => {
                 if (match) match.refereeTeamCode = null;
             });


             // Update Quarterfinals teams and status
             if (qf1) {
                 qf1.team1 = getRankedTeamCode('A', 1);
                 qf1.team2 = getRankedTeamCode('C', 1);
                 if(qf1.team1 && qf1.team2) qf1.status = 'not_started'; else qf1.status = 'waiting';
                 // Pre-defined referee logic is now handled within assignReferees fallback
             }
             if (qf2) {
                 qf2.team1 = getRankedTeamCode('B', 1);
                 qf2.team2 = getRankedTeamCode('C', 2);
                  if(qf2.team1 && qf2.team2) qf2.status = 'not_started'; else qf2.status = 'waiting';
             }
             if (qf3) {
                 qf3.team1 = getRankedTeamCode('A', 2);
                 qf3.team2 = getRankedTeamCode('B', 3);
                  if(qf3.team1 && qf3.team2) qf3.status = 'not_started'; else qf3.status = 'waiting';
             }
              if (qf4) {
                 qf4.team1 = getRankedTeamCode('A', 3);
                 qf4.team2 = getRankedTeamCode('B', 2);
                  if(qf4.team1 && qf4.team2) qf4.status = 'not_started'; else qf4.status = 'waiting';
             }

             // Update Semifinals based on QF winners
             if (sf1) {
                 sf1.team1 = qf1?.winner || null;
                 sf1.team2 = qf3?.winner || null;
                  if(sf1.team1 && sf1.team2) sf1.status = 'not_started'; else sf1.status = 'waiting';
             }
             if (sf2) {
                 sf2.team1 = qf2?.winner || null;
                 sf2.team2 = qf4?.winner || null;
                  if(sf2.team1 && sf2.team2) sf2.status = 'not_started'; else sf2.status = 'waiting';
             }

             // Update Final and 3rd Place based on SF winners/losers
              if (final) {
                 final.team1 = sf1?.winner || null;
                 final.team2 = sf2?.winner || null;
                  if(final.team1 && final.team2) final.status = 'not_started'; else final.status = 'waiting';
             }
              if (thirdPlace) {
                 thirdPlace.team1 = null;
                 thirdPlace.team2 = null;
                 if (sf1?.winner && sf1.team1 && sf1.team2) {
                     thirdPlace.team1 = sf1.winner === sf1.team1 ? sf1.team2 : sf1.team1;
                 }
                 if (sf2?.winner && sf2.team1 && sf2.team2) {
                     thirdPlace.team2 = sf2.winner === sf2.team1 ? sf2.team2 : sf2.team1;
                 }
                  if(thirdPlace.team1 && thirdPlace.team2) thirdPlace.status = 'not_started'; else thirdPlace.status = 'waiting';
             }

             // Reset scores for any playoff match that turned back to 'waiting'
             [qf1, qf2, qf3, qf4, sf1, sf2, final, thirdPlace].forEach(match => {
                if (match && match.status === 'waiting') {
                    match.set1Team1=0; match.set1Team2=0;
                    match.set2Team1=0; match.set2Team2=0;
                    match.set3Team1=0; match.set3Team2=0;
                    match.winner=null;
                }
             });


             // Assign referees dynamically AFTER teams are set
             // Pass the modified newMatches array and the current teams state
             const matchesWithReferees = assignReferees(newMatches, teams);

             console.log("Матчи плей-офф обновлены принудительно");
             return matchesWithReferees; // Return the fully updated array
         });
     }, [teams, setMatches, assignReferees]); // Depends on teams state and assignReferees function


    // ----- MODIFIED: renderMatches with button -----
    const renderMatches = useCallback(() => {
        // Sort matches by time, then court for display
        const sortedMatches = [...matches].sort((a, b) => {
            // Handle potential null times or invalid time formats gracefully
            const timeA = a.time || "99:99";
            const timeB = b.time || "99:99";
            const timeCompare = timeA.localeCompare(timeB);
            if (timeCompare !== 0) return timeCompare;
            return (a.court || 99) - (b.court || 99); // Sort by court if times are equal
        });

        return (
            <div className="p-4 overflow-x-auto">
                <div className="flex justify-between items-center mb-6 gap-4"> {/* Flex container for title and button */}
                    <h2 className="text-2xl font-bold text-indigo-700 flex items-center">
                        <FaVolleyballBall className="mr-3 text-indigo-600" />
                        <span>{t.matches}</span>
                    </h2>
                     {/* Button to force update playoff teams and assign referees */}
                     <button
                        onClick={forceUpdatePlayoffTeams}
                        className="px-4 py-2 bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white rounded-lg shadow-md hover:opacity-90 transition-opacity flex items-center text-sm shrink-0" // Added shrink-0
                        title={t.updatePlayoffTeamsTooltip || "Пересчитать сетку плей-офф и назначить судей"}
                     >
                         <FaSyncAlt className="mr-2" /> {/* Added Icon */}
                         {t.updatePlayoffTeamsShort || "Обновить плей-офф"} {/* Shortened Text */}
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
                                {sortedMatches.map(match => { // Use sortedMatches here
                                    const team1 = teams.find(tm => tm.code === match.team1);
                                    const team2 = teams.find(tm => tm.code === match.team2);
                                    const refereeTeam = teams.find(tm => tm.code === match.refereeTeamCode);

                                    const team1Name = team1?.name || (match.round !== 'group' && match.team1 ? `...` : t.tbd);
                                    const team2Name = team2?.name || (match.round !== 'group' && match.team2 ? `...` : t.tbd);
                                    const refereeName = refereeTeam?.name || (match.refereeTeamCode ? `(${t.refereeTBD || '???'})` : (t.refereeTBD || '???'));

                                    let statusIcon, statusClass, statusText; const currentStatus = match.status || 'unknown'; statusText = t.statusNames?.[currentStatus] || currentStatus;
                                    if(currentStatus==='completed'){statusIcon=<FaCheck className="mr-1 text-green-500"/>;statusClass='text-green-600 font-semibold';}else if(currentStatus==='completed_by_points'){statusIcon=<FaCheck className="mr-1 text-blue-500"/>;statusClass='text-blue-600 font-semibold';}else if(currentStatus==='tie_needs_tiebreak'){statusIcon=<FaExclamationTriangle className="mr-1 text-red-500"/>;statusClass='text-red-600 font-semibold';}else if(currentStatus==='in_progress'){statusIcon=<FaRegClock className="mr-1 text-yellow-600 animate-spin" style={{animationDuration:'2s'}}/>;statusClass='text-yellow-700 font-semibold';}else if(currentStatus==='waiting'){statusIcon=<FaRegClock className="mr-1 text-gray-400"/>;statusClass='text-gray-500';}else{statusIcon=<FaRegClock className="mr-1 text-gray-500"/>;statusClass='text-gray-600';} // Default 'not_started'

                                    let roundClass='px-2 py-1 rounded text-xs font-semibold inline-block'; const currentRound = match.round || 'unknown'; const roundText = t.roundNames?.[currentRound] || currentRound;
                                    if(currentRound==='group'){roundClass+=' bg-[#C1CBA7]/50 text-[#06324F]';}else if(currentRound==='quarterfinal'){roundClass+=' bg-[#0B8E8D]/20 text-[#0B8E8D]';}else if(currentRound==='semifinal'){roundClass+=' bg-[#06324F]/20 text-[#06324F]';}else if(currentRound==='third_place'){roundClass+=' bg-orange-100 text-orange-700';}else if(currentRound==='final'){roundClass+=' bg-[#FDD80F]/20 text-[#FDD80F]/90';}else{roundClass+=' bg-gray-200 text-gray-700';}

                                    const showThirdSet=currentRound==='final'||currentStatus==='tie_needs_tiebreak'||(match.set3Team1>0||match.set3Team2>0);
                                    // Can open detail if teams are assigned (even if status is waiting/not_started)
                                    const canOpenDetail = !!(match.team1 && match.team2);

                                    return (
                                        <tr key={match.id} className={`border-b transition-colors duration-150 ease-in-out ${canOpenDetail ? 'hover:bg-[#0B8E8D]/10 cursor-pointer' : 'opacity-70 cursor-not-allowed'}`} onClick={canOpenDetail ? () => { setView('matchDetail'); setSelectedMatch(match); } : undefined}>
                                            <td className="p-2 text-sm md:text-base"><span className={roundClass}>{roundText}</span></td>
                                            <td className="p-2 text-sm md:text-base font-medium">{team1Name} <span className="text-gray-400 mx-1">vs</span> {team2Name} {match.winner && (<FaTrophy className={`inline ml-1 ${match.winner === team1?.code ? 'text-yellow-500' : 'text-yellow-500'}`} title={`${t.winner}: ${teams.find(w => w.code === match.winner)?.name || '?'}`} />)}</td>
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
    }, [matches, teams, t, setView, setSelectedMatch, forceUpdatePlayoffTeams]); // Added forceUpdatePlayoffTeams dependency


    // renderGroups remains the same
    const renderGroups = useCallback(() => {
        console.log("Rendering groups with teams:", teams); // Log for debugging
        return (
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center"><FaUsers className="mr-3 text-indigo-600" /><span>{t.groups}</span></h2>
                {teams.length === 0 && <p className="text-center p-4">{t.noTeams || 'Команды не найдены.'}</p>}
                {teams.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {['A', 'B', 'C'].map(group => {
                             // Define colors per group for better visual separation
                             const groupColors = {
                                'A': { bg: 'from-blue-500 to-blue-700', lightBg: 'from-blue-50 to-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
                                'B': { bg: 'from-purple-500 to-purple-700', lightBg: 'from-purple-50 to-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
                                'C': { bg: 'from-green-500 to-green-700', lightBg: 'from-green-50 to-green-100', text: 'text-green-700', border: 'border-green-200' }
                            };
                            // Original colors:
                            //const groupColors = {'A':{bg:'from-[#C1CBA7] to-[#0B8E8D]',lightBg:'from-[#C1CBA7]/20 to-[#0B8E8D]/10',text:'text-blue-700',border:'border-blue-200'},'B':{bg:'from-[#06324F] to-[#0B8E8D]',lightBg:'from-[#06324F]/10 to-[#0B8E8D]/10',text:'text-purple-700',border:'border-purple-200'},'C':{bg:'from-[#FDD80F] to-[#0B8E8D]',lightBg:'from-[#FDD80F]/10 to-[#0B8E8D]/10',text:'text-green-700',border:'border-green-200'}};

                            const colors = groupColors[group] || groupColors['A']; // Fallback to A colors
                            const groupTeams = teams.filter(tm => tm.group === group);

                            // Sort teams within the group for display
                             const sortedGroupTeams = [...groupTeams].sort((a, b) =>
                                b.points - a.points ||                                       // Points desc
                                (b.setsWon - b.setsLost) - (a.setsWon - a.setsLost) ||      // Set difference desc
                                b.setsWon - a.setsWon ||                                    // Sets won desc
                                a.name.localeCompare(b.name)                                // Team name asc
                            );

                            return (
                                <div key={group} className={`bg-gradient-to-r ${colors.lightBg} rounded-xl shadow-lg overflow-hidden`}>
                                    <div className={`bg-gradient-to-r ${colors.bg} p-4 text-white`}><h3 className="text-xl font-bold flex items-center"><FaTable className="mr-2" /> {t.group} {group}</h3></div>
                                    <div className="p-4 overflow-x-auto">
                                        {groupTeams.length === 0 ? <p className="text-center text-gray-500 py-4">{t.noTeamsInGroup || 'Нет команд'}</p> : (
                                            <table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
                                                 <thead className="bg-gray-50"><tr><th className="p-3 text-left text-xs md:text-sm font-semibold text-gray-700">{t.team}</th><th className="p-3 text-center text-xs md:text-sm font-semibold text-gray-700">{t.points}</th><th className="p-3 text-center text-xs md:text-sm font-semibold text-gray-700" title={t.winsLosses||'Победы/Поражения'}>{t.winsLossesShort || 'В/П'}</th><th className="p-3 text-center text-xs md:text-sm font-semibold text-gray-700" title={t.sets||'Сеты'}>{t.setsShort || 'С'}</th><th className="p-3 text-center text-xs md:text-sm font-semibold text-gray-700" title={t.setsDifference||'Разница сетов'}>{t.setsDiffShort || 'Р'}</th></tr></thead>
                                                <tbody>
                                                    {sortedGroupTeams.map((team, index) => {
                                                        // Highlight top teams advancing (example: top 2 + potentially best 3rd)
                                                        const rank = index + 1;
                                                        let rowClass = `border-b ${colors.border} hover:bg-gray-50 transition-colors duration-150`;
                                                        let rankIcon = null;
                                                        // Example highlighting (adjust based on actual progression rules)
                                                        if (rank === 1) { rowClass += ' bg-green-50 font-bold'; rankIcon = <FaTrophy className="inline mr-2 text-yellow-500" />; }
                                                        else if (rank === 2) { rowClass += ' bg-green-50'; rankIcon = <FaTrophy className="inline mr-2 text-gray-400" />; }
                                                         else if (rank === 3 && group === 'A') { rankIcon = <FaTrophy className="inline mr-2 text-orange-400" />; } // Example: 3rd in A advances
                                                         else if (rank === 3 && group === 'B') { rankIcon = <FaTrophy className="inline mr-2 text-orange-400" />; } // Example: 3rd in B advances

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
    }, [teams, t]); // Depends on teams and translations


    // ----- MODIFIED: renderMatchDetail with Reset button -----
    const renderMatchDetail = useCallback(() => {
        const currentMatchData = selectedMatch ? matches.find(m => m.id === selectedMatch.id) : null;
        if (!currentMatchData) {
            // If selectedMatch data is somehow lost, close the modal
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
        if(currentStatus==='completed'){statusClass+=' bg-green-100 text-green-800';statusIcon=<FaCheck className="mr-2"/>;}else if(currentStatus==='completed_by_points'){statusClass+=' bg-blue-100 text-blue-800';statusIcon=<FaCheck className="mr-2"/>;}else if(currentStatus==='tie_needs_tiebreak'){statusClass+=' bg-red-100 text-red-800';statusIcon=<FaExclamationTriangle className="mr-2"/>;}else if(currentStatus==='in_progress'){statusClass+=' bg-yellow-100 text-yellow-800';statusIcon=<FaRegClock className="mr-2 animate-spin" style={{animationDuration:'2s'}}/>;}else if(currentStatus==='waiting'){statusClass+=' bg-gray-100 text-gray-500';statusIcon=<FaRegClock className="mr-2"/>;}else{statusClass+=' bg-gray-100 text-gray-800';statusIcon=<FaRegClock className="mr-2"/>;} // Default 'not_started'

        // Determine if set 3 input should be shown
         const isTiebreakSituation = currentStatus === 'tie_needs_tiebreak';
         // Show set 3 input if it's the final, or if it's needed for tiebreak, or if points have been entered already
         const showThirdSetInput = currentRound === 'final' || isTiebreakSituation || (currentMatchData.set3Team1 > 0 || currentMatchData.set3Team2 > 0);


        return (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center p-4 z-[70] backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-[#0B8E8D] to-[#06324F] p-6 text-white">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">{t.matchDetail}</h2>
                            <button onClick={() => { setView('matches'); setSelectedMatch(null); }} className="text-white hover:text-red-200 transition-colors duration-150 text-3xl leading-none">&times;</button> {/* Improved Close Button */}
                        </div>
                    </div>

                    <div className="p-6 max-h-[80vh] overflow-y-auto">
                        {/* Match Info Header */}
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

                        {/* Team Names */}
                         <div className="bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 p-4 rounded-lg mb-6">
                            <div className="flex justify-between items-center">
                                <div className="text-center w-5/12"><div className="text-lg font-bold text-indigo-800">{team1.name}</div></div>
                                <div className="text-center w-2/12"><div className="text-xl font-bold text-gray-600">vs</div></div>
                                <div className="text-center w-5/12"><div className="text-lg font-bold text-indigo-800">{team2.name}</div></div>
                             </div>
                         </div>

                        {/* Score Inputs */}
                        <div className="space-y-4">
                            {/* Set 1 */}
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t.set1}</label>
                                <div className="flex items-center justify-between">
                                    <input type="number" min="0" max="99" defaultValue={currentMatchData.set1Team1 ?? 0} onBlur={(e) => updateMatchScore(currentMatchData.id, 1, 'team1', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                    <span className="text-gray-400 text-xl font-bold">:</span>
                                    <input type="number" min="0" max="99" defaultValue={currentMatchData.set1Team2 ?? 0} onBlur={(e) => updateMatchScore(currentMatchData.id, 1, 'team2', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                            </div>
                            {/* Set 2 */}
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t.set2}</label>
                                <div className="flex items-center justify-between">
                                     <input type="number" min="0" max="99" defaultValue={currentMatchData.set2Team1 ?? 0} onBlur={(e) => updateMatchScore(currentMatchData.id, 2, 'team1', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                    <span className="text-gray-400 text-xl font-bold">:</span>
                                    <input type="number" min="0" max="99" defaultValue={currentMatchData.set2Team2 ?? 0} onBlur={(e) => updateMatchScore(currentMatchData.id, 2, 'team2', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                            </div>
                            {/* Set 3 / Tiebreak */}
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
                                            max={currentRound === 'final' ? "99" : (isTiebreakSituation ? "99" : "99")} // Adjust max if needed, validation handles actual limits
                                            defaultValue={currentMatchData.set3Team1 ?? 0}
                                            onBlur={(e) => updateMatchScore(currentMatchData.id, 3, 'team1', e.target.value)}
                                            className={`w-20 p-2 border rounded-lg text-center font-bold text-lg focus:ring-2 ${isTiebreakSituation ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                                        />
                                        <span className="text-gray-400 text-xl font-bold">:</span>
                                        <input
                                             type="number" min="0"
                                             max={currentRound === 'final' ? "99" : (isTiebreakSituation ? "99" : "99")} // Adjust max if needed
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

                        {/* Action Buttons */}
                        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                             {/* NEW Reset Button */}
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
    // Added resetMatch to dependencies
    }, [selectedMatch, matches, teams, t, updateMatchScore, setView, setSelectedMatch, resetMatch]);


    // renderRulesModal remains the same
    const renderRulesModal = useCallback(() => {
        return (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-start justify-center p-4 z-[60] backdrop-blur-sm overflow-y-auto">
                <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-4xl my-8 overflow-hidden">
                     <div className="bg-gradient-to-r from-[#0B8E8D] to-[#06324F] p-6 text-white sticky top-0 z-10">
                         <div className="flex justify-between items-center">
                             <h2 className="text-2xl font-bold flex items-center"><FaGlobe className="mr-2" />{t.rules}</h2>
                             <div className="flex items-center space-x-2">
                                 {/* Language Selection */}
                                {Object.keys(languageNames).filter(lang => translations[lang]).map(lang => (
                                    <button key={lang} onClick={() => changeLanguage(lang)} className={`px-2 py-1 text-xs rounded transition-colors duration-150 ${language === lang ? 'bg-white text-[#0B8E8D] shadow-sm font-semibold' : 'bg-[#0B8E8D]/80 text-white hover:bg-[#0B8E8D]/90'}`} title={languageNames[lang]}>{lang.toUpperCase()}</button>
                                ))}
                                {/* Close Button */}
                                 <button onClick={() => setShowRules(false)} className="text-white hover:text-[#FDD80F] transition-colors ml-4" title={t.close}>
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                 </button>
                             </div>
                         </div>
                     </div>

                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                         {/* Tie Rule Settings */}
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

                        {/* Tie Rule Explanation */}
                        <div className="mb-8 bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 p-6 rounded-xl shadow-md border border-[#0B8E8D]/20">
                            <h3 className="text-xl font-bold text-[#06324F] mb-4">{t.tieRules?.title || "Правила определения победителя (при 1:1 по сетам)"}</h3>
                            <div className="space-y-4">
                                {/* Option 1: Use Points */}
                                 <div className={`p-4 rounded-lg shadow-sm border transition-all duration-300 ${tournamentSettings.useTotalPointsForTie ? 'bg-white border-green-300 ring-2 ring-green-200' : 'bg-gray-100 border-gray-200 opacity-70'}`}>
                                    <h4 className="text-lg font-semibold text-[#0B8E8D] mb-2 flex items-center">
                                         {tournamentSettings.useTotalPointsForTie && <FaCheck className="text-green-500 mr-2" />} {t.tieRules?.option1 || "Вариант 1: По очкам"}
                                     </h4>
                                     <p className="text-gray-700 text-sm">{t.tieRules?.option1Description || "Побеждает команда, набравшая больше очков в сумме за 2 сета. Если очков поровну, играется тай-брейк до 5 очков (разница 2)."}</p>
                                 </div>
                                 {/* Option 2: Always Tiebreak */}
                                 <div className={`p-4 rounded-lg shadow-sm border transition-all duration-300 ${!tournamentSettings.useTotalPointsForTie ? 'bg-white border-green-300 ring-2 ring-green-200' : 'bg-gray-100 border-gray-200 opacity-70'}`}>
                                    <h4 className="text-lg font-semibold text-[#0B8E8D] mb-2 flex items-center">
                                        {!tournamentSettings.useTotalPointsForTie && <FaCheck className="text-green-500 mr-2" />} {t.tieRules?.option2 || "Вариант 2: Всегда тай-брейк"}
                                     </h4>
                                    <p className="text-gray-700 text-sm">{t.tieRules?.option2Description || "Всегда играется тай-брейк до 5 очков (разница 2)."}</p>
                                 </div>
                             </div>
                         </div>

                        {/* General Rules Text */}
                        <div className="prose prose-sm max-w-none mt-6">
                             <h3 className="text-xl font-bold text-[#06324F] mb-4">{t.generalRulesTitle || "Общие правила турнира"}</h3>
                             {/* Use dangerouslySetInnerHTML if rules contain HTML, otherwise use pre or div */}
                             <div className="whitespace-pre-wrap font-sans text-sm text-gray-800 bg-gray-50 p-4 rounded border border-gray-200">
                                {t.tournamentRules || "Здесь будут общие правила турнира..."}
                            </div>
                         </div>
                     </div>

                    {/* Modal Footer */}
                     <div className="p-4 border-t border-gray-200 bg-gray-50 sticky bottom-0">
                         <button onClick={() => setShowRules(false)} className="w-full py-2 bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center shadow-md">
                            <FaCheck className="mr-2" /> {t.hideRules || "Закрыть правила"}
                        </button>
                    </div>
                </div>
            </div>
        );
    // Dependencies include settings and handlers
    }, [language, tournamentSettings, t, handleSettingsChange, changeLanguage]);

    // Main component render structure (Sidebar, Main, Nav, Modals)
    return (
        <>
            <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
                {/* Sidebar */}
                <aside className="w-full md:w-64 bg-white shadow-md md:h-screen md:sticky md:top-0 z-40 border-b md:border-b-0 md:border-r border-gray-200 shrink-0"> {/* Ensure sidebar doesn't shrink */}
                     {/* Sidebar Header */}
                     <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h1 className="text-xl font-bold text-[#06324F] flex items-center"><FaVolleyballBall className="mr-2 text-[#0B8E8D]" /> {t.appName || 'RVL Scoreboard'}</h1>
                         {/* Language switcher (Desktop) */}
                         <div className="hidden md:flex space-x-1">
                             {Object.keys(languageNames).filter(lang => translations[lang]).map(lang => (
                                <button key={lang} onClick={() => changeLanguage(lang)} className={`px-2 py-1 text-xs rounded transition-colors duration-150 ${language === lang ? 'bg-[#0B8E8D] text-white shadow-sm font-semibold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} title={languageNames[lang]}>{lang.toUpperCase()}</button>
                            ))}
                        </div>
                    </div>
                     {/* Sidebar Navigation */}
                     <div className="p-4 space-y-2">
                        <button onClick={() => setView('matches')} className={`flex items-center w-full text-left p-3 rounded-lg transition-all duration-200 ${view === 'matches' ? 'bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white shadow-md' : 'hover:bg-[#0B8E8D]/10 text-gray-700'}`}><FaVolleyballBall className="mr-3" /> {t.matches}</button>
                        <button onClick={() => setView('groups')} className={`flex items-center w-full text-left p-3 rounded-lg transition-all duration-200 ${view === 'groups' ? 'bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white shadow-md' : 'hover:bg-[#0B8E8D]/10 text-gray-700'}`}><FaUsers className="mr-3" /> {t.groups}</button>
                        <button onClick={() => setShowRules(true)} className="flex items-center w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-[#0B8E8D]/10 text-gray-700 mt-2"><FaGlobe className="mr-3 text-[#FDD80F]" /> {t.rules}</button>
                    </div>
                     {/* Tournament Info (Desktop - bottom of sidebar) */}
                     <div className="md:absolute md:bottom-0 md:left-0 md:right-0 p-4 hidden md:block"> {/* Adjusted padding */}
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

                {/* Main Content Area */}
                <main className="flex-1 p-0 md:p-6 pb-20 md:pb-6 overflow-y-auto"> {/* Allow main content to scroll */}
                    {view === 'matches' && renderMatches()}
                    {view === 'groups' && renderGroups()}

                    {/* Tournament Info (Mobile - bottom of main content) */}
                    <div className="md:hidden p-4 mx-4 mt-4 mb-24 bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 rounded-lg shadow-sm border border-[#0B8E8D]/20">
                        <h3 className="text-sm font-semibold text-[#06324F] mb-2">{t.tournamentInfo}</h3>
                        <div className="text-xs text-gray-700 space-y-2">
                            <p className="flex items-center"><FaCalendarAlt className="mr-2 text-[#FDD80F]" /><span className="font-semibold mr-1">{t.dateLabel}:</span> {t.tournamentDate}</p>
                            <p className="flex items-start"><FaMapMarkerAlt className="mr-2 text-[#0B8E8D] mt-0.5 flex-shrink-0" /><div><span className="font-semibold mr-1">{t.addressLabel}:</span> {t.tournamentAddress}</div></p>
                            <p className="flex items-center"><FaLink className="mr-2 text-[#06324F]" /><span className="font-semibold mr-1">{t.websiteLabel}:</span><a href={t.tournamentWebsite} target="_blank" rel="noopener noreferrer" className="text-[#0B8E8D] ml-1 hover:underline truncate">{t.tournamentWebsite?.replace(/^(https?:\/\/)?(www\.)?/, '')}</a></p>
                        </div>
                         {/* Language switcher (Mobile) */}
                         <div className="flex space-x-1 mt-3 pt-2 border-t border-[#0B8E8D]/20">
                             {Object.keys(languageNames).filter(lang => translations[lang]).map(lang => (
                                <button key={lang} onClick={() => changeLanguage(lang)} className={`px-2 py-1 text-xs rounded transition-colors duration-150 ${language === lang ? 'bg-[#0B8E8D] text-white shadow-sm font-semibold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} title={languageNames[lang]}>{lang.toUpperCase()}</button>
                            ))}
                        </div>
                    </div>
                </main>

                {/* Bottom Navigation (Mobile) */}
                <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-2 flex justify-around md:hidden z-30 border-t border-gray-200">
                    <button onClick={() => setView('matches')} className={`p-2 flex flex-col items-center transition-colors duration-150 ${view === 'matches' ? 'text-[#0B8E8D] font-semibold' : 'text-gray-600 hover:text-[#0B8E8D]'}`}><FaVolleyballBall className="text-xl mb-1" /><span className="text-xs">{t.matches}</span></button>
                    <button onClick={() => setView('groups')} className={`p-2 flex flex-col items-center transition-colors duration-150 ${view === 'groups' ? 'text-[#0B8E8D] font-semibold' : 'text-gray-600 hover:text-[#0B8E8D]'}`}><FaUsers className="text-xl mb-1" /><span className="text-xs">{t.groups}</span></button>
                    <button onClick={() => setShowRules(true)} className={`p-2 flex flex-col items-center text-gray-600 hover:text-[#0B8E8D] transition-colors duration-150`}><FaGlobe className="text-xl mb-1 text-[#FDD80F]" /><span className="text-xs">{t.rules}</span></button>
                </nav>
            </div>

            {/* Conditionally rendered Modals */}
            {showRules && renderRulesModal()}
            {view === 'matchDetail' && renderMatchDetail()}
        </>
    );
}

export default App;
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
// Импорты иконок остаются без изменений
import { FaVolleyballBall, FaUsers, FaTrophy, FaRegClock, FaCheck, FaGlobe, FaExclamationTriangle, FaCalendarAlt, FaTable, FaChartBar, FaMapMarkerAlt, FaLink, FaBullhorn, FaSyncAlt, FaUndo } from 'react-icons/fa';
import { translations, languageNames } from './translations';

// initialTeams и initialMatches остаются без изменений
const initialTeams = [
    // ... (данные команд)
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
    // ... (данные матчей)
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
    // Плей-офф матчи с refereeRule
    { id: 'QF-1A-1C', court: 1, time: '12:30', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'quarterfinal', refereeTeamCode: null, refereeRule: '1B' }, // Судья: 1-е место группы B
    { id: 'QF-1B-2C', court: 2, time: '13:20', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'quarterfinal', refereeTeamCode: null, refereeRule: null }, // Судья: Динамический?
    { id: 'QF-2A-3B', court: 1, time: '12:30', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'quarterfinal', refereeTeamCode: null, refereeRule: '3C' }, // Судья: 3-е место группы C
    { id: 'QF-3A-2B', court: 2, time: '12:30', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'quarterfinal', refereeTeamCode: null, refereeRule: '4C' }, // Судья: 4-е место группы C
    // Полуфиналы и Финалы - refereeRule обычно null, назначаются динамически или из проигравших QF/SF
    { id: 'SF-W1-W3', court: 1, time: '14:10', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'semifinal', refereeTeamCode: null, refereeRule: null }, // Судья: L-QF2?
    { id: 'SF-W2-W4', court: 2, time: '14:10', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'semifinal', refereeTeamCode: null, refereeRule: null }, // Судья: L-QF1?
    { id: 'F3-L1-L2', court: 2, time: '15:00', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'third_place', refereeTeamCode: null, refereeRule: null }, // Судья: W-Final? или L-Final?
    { id: 'F-W1-W2', court: 1, time: '15:10', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'final', refereeTeamCode: null, refereeRule: null }      // Судья: W-3rd?
];


// --- Функции LocalStorage --- (без изменений)
const loadFromLocalStorage = (key, defaultValue) => {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue === null || storedValue === undefined) {
            return defaultValue;
        }
        return JSON.parse(storedValue);
    } catch (error) {
        // console.error(`Error parsing localStorage key "${key}":`, error);
        return defaultValue;
    }
};

const saveToLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        // console.error(`Error saving to localStorage key "${key}":`, error);
    }
};

// --- Функции валидации счета и сета --- (без изменений)
const validateScore = (score, isFinalSet, isTiebreak) => {
    // ... (логика валидации)
    const maxRegular = 25;
    const maxTiebreak = isFinalSet ? 15 : 5; // ВАЖНО: Тайбрейк для НЕ финала до 5
    const maxPoints = isTiebreak ? maxTiebreak : maxRegular;
    // Ограничиваем максимальное значение, но не минимальное (оно уже 0)
    // Можно добавить ограничение, чтобы счет не был слишком большим, например 99
    const validated = Math.max(0, score);
    return validated; // Убрано ограничение сверху, т.к. isSetCompleted проверяет разницу
    // return Math.max(0, Math.min(score, maxPoints)); // Старый вариант с ограничением
};

const isSetCompleted = (team1Score, team2Score, isFinalSet, isTiebreak) => {
    const minWinDiff = 2;
    // Порог победы: 15 для финального тай-брейка, 5 для обычного тай-брейка, 25 для обычного сета
    const winThreshold = isTiebreak ? (isFinalSet ? 15 : 5) : 25;
    return (team1Score >= winThreshold || team2Score >= winThreshold) &&
           Math.abs(team1Score - team2Score) >= minWinDiff;
};

// --- Новая утилитарная функция для сортировки команд ---
/**
 * Сортирует массив команд по правилам: Очки -> Разница сетов -> Забитые сеты -> Имя.
 * @param {Array} teamsToSort Массив объектов команд для сортировки.
 * @returns {Array} Отсортированный массив команд.
 */
const sortTeamsByRank = (teamsToSort) => {
    if (!teamsToSort || teamsToSort.length === 0) return [];
    return [...teamsToSort].sort((a, b) =>
        (b.points || 0) - (a.points || 0) ||
        ((b.setsWon || 0) - (b.setsLost || 0)) - ((a.setsWon || 0) - (a.setsLost || 0)) ||
        (b.setsWon || 0) - (a.setsWon || 0) ||
        a.name.localeCompare(b.name)
    );
};


function App() {
    // --- Состояния --- (без изменений, кроме начальной загрузки matches)
    const [teams, setTeams] = useState(() => loadFromLocalStorage('teams', initialTeams));
    const [matches, setMatches] = useState(() => {
        const loadedMatches = loadFromLocalStorage('matches', initialMatches);
        // Убедимся, что все матчи из initialMatches присутствуют и имеют актуальные поля court, time, round, refereeRule
        return initialMatches.map(initialMatch => {
            const loadedMatchData = loadedMatches.find(lm => lm.id === initialMatch.id);
            return {
                ...initialMatch, // Берем за основу initialMatch (со свежими time, court, round, refereeRule)
                ...(loadedMatchData || {}), // Перезаписываем сохраненными данными (счет, статус, команды и т.д.)
                 // Явно сохраняем поля из initialMatch, которые могли быть не сохранены или изменились
                court: initialMatch.court,
                time: initialMatch.time,
                round: initialMatch.round,
                refereeRule: initialMatch.refereeRule,
            };
        });
    });
    const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'cs');
    const [tournamentSettings, setTournamentSettings] = useState(() => loadFromLocalStorage('tournamentSettings', { useTotalPointsForTie: true }));
    const [view, setView] = useState('matches');
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [showRules, setShowRules] = useState(false);

    const t = translations[language] || translations['cs'];

    // --- Эффект для сохранения в localStorage --- (без изменений)
    useEffect(() => {
        saveToLocalStorage('teams', teams);
        saveToLocalStorage('matches', matches);
        try {
            localStorage.setItem('language', language);
        } catch (error) {
            // console.error(`Error saving language to localStorage:`, error);
        }
        saveToLocalStorage('tournamentSettings', tournamentSettings);
    }, [teams, matches, language, tournamentSettings]);

    // --- Пересчет статистики команд --- (Использует новую функцию сортировки для единообразия, хотя здесь она не нужна)
    const recalculateAllTeamStats = useCallback((currentMatches) => {
        // console.log("Recalculating team stats...");
        setTeams(() => {
            let calculatedTeams = initialTeams.map(initialTeam => ({
                ...initialTeam,
                points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0
            }));

            const completedGroupMatches = currentMatches.filter(m =>
                m.round === 'group' &&
                (m.status === 'completed' || m.status === 'completed_by_points' || m.winner !== null) &&
                m.team1 && m.team2 // Убедимся, что команды определены
            );

            completedGroupMatches.forEach(match => {
                const team1Index = calculatedTeams.findIndex(t => t.code === match.team1);
                const team2Index = calculatedTeams.findIndex(t => t.code === match.team2);
                if (team1Index === -1 || team2Index === -1) return; // Если команда не найдена (маловероятно)

                let team1 = { ...calculatedTeams[team1Index] }; // Копируем для изменения
                let team2 = { ...calculatedTeams[team2Index] };
                let team1SetsWonCount = 0, team2SetsWonCount = 0;
                const isFinal = match.round === 'final'; // Хотя это для групповых, оставим для полноты

                // Подсчет выигранных сетов в этом матче
                if (isSetCompleted(match.set1Team1, match.set1Team2, false, false)) {
                     match.set1Team1 > match.set1Team2 ? team1SetsWonCount++ : team2SetsWonCount++;
                }
                if (isSetCompleted(match.set2Team1, match.set2Team2, false, false)) {
                     match.set2Team1 > match.set2Team2 ? team1SetsWonCount++ : team2SetsWonCount++;
                }
                // Тай-брейк в группе учитывается только если он был сыгран (status='completed' после tie_needs_tiebreak)
                // Или если статус completed_by_points, сетов 1:1
                 const wasTie = team1SetsWonCount === 1 && team2SetsWonCount === 1;
                 if (wasTie && match.status !== 'completed_by_points' && isSetCompleted(match.set3Team1, match.set3Team2, false, true)) {
                     match.set3Team1 > match.set3Team2 ? team1SetsWonCount++ : team2SetsWonCount++;
                 }


                // Начисление очков и статистики W/L
                if (match.winner === team1.code) {
                    // Победа 2:0 -> 3 очка; Победа 2:1 -> 2 очка
                    team1.points += (team1SetsWonCount === 2 && team2SetsWonCount === 0) ? 3 : 2;
                    // Поражение 0:2 -> 0 очков; Поражение 1:2 -> 1 очко
                    team2.points += (team1SetsWonCount === 2 && team2SetsWonCount === 0) ? 0 : 1;
                    team1.wins++;
                    team2.losses++;
                } else if (match.winner === team2.code) {
                    team2.points += (team2SetsWonCount === 2 && team1SetsWonCount === 0) ? 3 : 2;
                    team1.points += (team2SetsWonCount === 2 && team1SetsWonCount === 0) ? 0 : 1;
                    team2.wins++;
                    team1.losses++;
                }

                // Обновление статистики сетов
                team1.setsWon += team1SetsWonCount;
                team1.setsLost += team2SetsWonCount;
                team2.setsWon += team2SetsWonCount;
                team2.setsLost += team1SetsWonCount;

                calculatedTeams[team1Index] = team1;
                calculatedTeams[team2Index] = team2;
            });
            // Можно отсортировать команды внутри их групп для отображения, но setTeams вернет общий массив
            return calculatedTeams;
        });
    }, [/* initialTeams - константа */]); // Зависимостей нет, т.к. initialTeams константа

    // --- Централизованная функция назначения судей для плей-офф ---
    const assignReferees = useCallback((matchesToUpdate, allTeams) => {
        // console.log("Assigning referees for playoff matches...");

        // 1. Рассчитать рейтинги для всех групп один раз
        const groupRankings = {};
        const groupLetters = ['A', 'B', 'C'];
        groupLetters.forEach(group => {
            const teamsInGroup = allTeams.filter(t => t.group === group);
            groupRankings[group] = sortTeamsByRank(teamsInGroup); // Используем новую функцию сортировки
        });

        const getRankedTeamCode = (group, rank) => groupRankings[group]?.[rank - 1]?.code || null;

        // 2. Пройти по матчам и назначить судей
        return matchesToUpdate.map(match => {
            // Назначаем только для плей-офф матчей, у которых есть обе команды
            if (match.round === 'group' || !match.team1 || !match.team2) {
                // Для групповых матчей судья обычно предопределен в initialMatches
                 // Если судья группового матча стал null, можно попробовать восстановить из initialMatches
                 if (match.round === 'group' && !match.refereeTeamCode) {
                     const initialMatchData = initialMatches.find(im => im.id === match.id);
                     if (initialMatchData && initialMatchData.refereeTeamCode) {
                         // console.log(`Restoring initial referee ${initialMatchData.refereeTeamCode} for group match ${match.id}`);
                         return { ...match, refereeTeamCode: initialMatchData.refereeTeamCode };
                     }
                 }
                return match;
            }

            const initialMatchData = initialMatches.find(im => im.id === match.id);
            const refereeRule = initialMatchData?.refereeRule; // Правило типа '1B', '3C'
            let potentialRefCode = null;
            let assignedByRule = false;

            // 3. Попытка назначения по правилу (refereeRule)
            if (refereeRule) {
                const ruleGroup = refereeRule[1]; // 'B'
                const ruleRank = parseInt(refereeRule[0]); // 1
                if (ruleGroup && !isNaN(ruleRank) && groupRankings[ruleGroup]) {
                    potentialRefCode = getRankedTeamCode(ruleGroup, ruleRank);
                    // console.log(`[${match.id}] Rule ${refereeRule} -> Potential Ref: ${potentialRefCode}`);
                     if (potentialRefCode && potentialRefCode !== match.team1 && potentialRefCode !== match.team2) {
                         // console.log(`[${match.id}] Assigning referee ${potentialRefCode} based on rule ${refereeRule}.`);
                         assignedByRule = true;
                         // Не выходим из функции, чтобы проверить динамическое назначение, если этот судья станет невалидным
                     } else {
                          // console.log(`[${match.id}] Potential referee ${potentialRefCode} from rule ${refereeRule} is invalid (playing or null).`);
                          potentialRefCode = null; // Сбрасываем, т.к. невалиден
                     }
                } else {
                     // console.log(`[${match.id}] Invalid refereeRule format or group/rank not found: ${refereeRule}`);
                }
            }

            // 4. Если по правилу не назначен ИЛИ текущий судья стал невалиден (играет)
            let finalRefereeCode = assignedByRule ? potentialRefCode : match.refereeTeamCode;

            // Проверяем, не играет ли текущий (или назначенный по правилу) судья
            if (finalRefereeCode === match.team1 || finalRefereeCode === match.team2) {
                 // console.log(`[${match.id}] Current/Rule referee ${finalRefereeCode} is playing. Needs dynamic assignment.`);
                 finalRefereeCode = null;
            }


             // 5. Динамическое назначение, если судья не назначен или стал невалиден
             if (!finalRefereeCode) {
                // console.log(`[${match.id}] Attempting dynamic referee assignment.`);
                const availableReferees = allTeams
                    .filter(team => team.code !== match.team1 && team.code !== match.team2) // Не играющие
                    .map(team => team.code);

                if (availableReferees.length > 0) {
                    // Простая логика: случайный выбор
                    const randomIndex = Math.floor(Math.random() * availableReferees.length);
                    finalRefereeCode = availableReferees[randomIndex];
                    // console.log(`[${match.id}] Dynamically assigned referee: ${finalRefereeCode}`);
                } else {
                    // console.warn(`[${match.id}] No available referees found!`);
                    finalRefereeCode = null; // Оставляем null, если никого нет
                }
             }

             // 6. Обновляем матч только если судья изменился
             if (finalRefereeCode !== match.refereeTeamCode) {
                 // console.log(`[${match.id}] Referee changed from ${match.refereeTeamCode} to ${finalRefereeCode}`);
                return { ...match, refereeTeamCode: finalRefereeCode };
             } else {
                 return match; // Судья не изменился
             }
        });
    }, [/* initialMatches - константа */]); // Зависит от allTeams и matchesToUpdate (передаются как аргументы)

    // --- Обновление команд плей-офф (Упрощено: только команды и статус) ---
    const updatePlayoffTeams = useCallback((currentMatches, currentTeams) => {
        // console.log("--- updatePlayoffTeams START (Automatic Check) ---");
        const groupLetters = ['A', 'B', 'C'];
        const groupRankings = {};
        groupLetters.forEach(group => {
            const teamsInGroup = currentTeams.filter(t => t.group === group);
            // Используем новую функцию сортировки
            groupRankings[group] = sortTeamsByRank(teamsInGroup);
        });
        const getRankedTeamCode = (group, rank) => groupRankings[group]?.[rank - 1]?.code || null;

        // console.log("Auto Update Rankings (Top 1):", "A:", getRankedTeamCode('A',1), "B:", getRankedTeamCode('B',1), "C:", getRankedTeamCode('C',1));

        let changed = false;
        const updatedMatchesArray = currentMatches.map(match => {
            if (match.round === 'group') return match;

            // Сохраняем текущие значения для сравнения
            const currentTeam1 = match.team1;
            const currentTeam2 = match.team2;
            const currentStatus = match.status;

            let newTeam1Code = null;
            let newTeam2Code = null;

            // --- Определение команд для каждого матча плей-офф ---
            // (Логика switch остается прежней)
            switch (match.id) {
                case 'QF-1A-1C': newTeam1Code = getRankedTeamCode('A', 1); newTeam2Code = getRankedTeamCode('C', 1); break;
                case 'QF-1B-2C': newTeam1Code = getRankedTeamCode('B', 1); newTeam2Code = getRankedTeamCode('C', 2); break;
                case 'QF-2A-3B': newTeam1Code = getRankedTeamCode('A', 2); newTeam2Code = getRankedTeamCode('B', 3); break;
                case 'QF-3A-2B': newTeam1Code = getRankedTeamCode('A', 3); newTeam2Code = getRankedTeamCode('B', 2); break;
                case 'SF-W1-W3': { const qf1 = currentMatches.find(m => m.id === 'QF-1A-1C'); const qf3 = currentMatches.find(m => m.id === 'QF-2A-3B'); newTeam1Code = qf1?.winner || null; newTeam2Code = qf3?.winner || null; break; }
                case 'SF-W2-W4': { const qf2 = currentMatches.find(m => m.id === 'QF-1B-2C'); const qf4 = currentMatches.find(m => m.id === 'QF-3A-2B'); newTeam1Code = qf2?.winner || null; newTeam2Code = qf4?.winner || null; break; }
                case 'F-W1-W2': { const sf1 = currentMatches.find(m => m.id === 'SF-W1-W3'); const sf2 = currentMatches.find(m => m.id === 'SF-W2-W4'); newTeam1Code = sf1?.winner || null; newTeam2Code = sf2?.winner || null; break; }
                case 'F3-L1-L2': {
                    const sf1 = currentMatches.find(m => m.id === 'SF-W1-W3');
                    const sf2 = currentMatches.find(m => m.id === 'SF-W2-W4');
                    // Определение проигравших полуфиналы
                    const getLoser = (sfMatch) => {
                        if (!sfMatch || !sfMatch.winner || !sfMatch.team1 || !sfMatch.team2) return null;
                        return sfMatch.winner === sfMatch.team1 ? sfMatch.team2 : sfMatch.team1;
                    };
                    newTeam1Code = getLoser(sf1);
                    newTeam2Code = getLoser(sf2);
                    break;
                }
                default: return match; // Не плей-офф матч или неизвестный ID
            }

            // Определяем, изменились ли команды или статус
            const teamsDetermined = !!(newTeam1Code && newTeam2Code);
            const newStatus = teamsDetermined ? 'not_started' : 'waiting';

            // Обновляем матч, если изменились команды или статус (если команды определились, а статус был 'waiting')
            if (currentTeam1 !== newTeam1Code || currentTeam2 !== newTeam2Code || (currentStatus === 'waiting' && newStatus === 'not_started')) {
                changed = true;
                // console.log(`---> Auto UPDATING ${match.id}: Teams: ${newTeam1Code}-${newTeam2Code}, Status: ${newStatus}. (Referee not updated here)`);
                // Сбрасываем счет и победителя при смене команд
                return {
                    ...match,
                    team1: newTeam1Code,
                    team2: newTeam2Code,
                    status: newStatus,
                    // НЕ ТРОГАЕМ СУДЬЮ ЗДЕСЬ - это сделает forceUpdate или assignReferees
                    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null
                };
            }

            // Если команды не изменились, возвращаем исходный матч
            return match;
        });

         // console.log("--- updatePlayoffTeams END --- Changed:", changed);
        // Возвращаем обновленный массив ТОЛЬКО если были изменения
        return changed ? updatedMatchesArray : currentMatches;

    }, [/* Использует sortTeamsByRank - стабильна */]); // Зависит от currentMatches, currentTeams (аргументы)

    // --- Принудительное обновление плей-офф (Команды + Судьи) ---
    const forceUpdatePlayoffTeams = useCallback(() => {
        // console.log("--- forceUpdatePlayoffTeams START (Button Click) ---");

        // 1. Определяем команды плей-офф (почти как в updatePlayoffTeams, но на основе текущего teams)
        const groupLetters = ['A', 'B', 'C'];
        const groupRankings = {};
        groupLetters.forEach(group => {
            const teamsInGroup = teams.filter(t => t.group === group);
            groupRankings[group] = sortTeamsByRank(teamsInGroup); // Используем хелпер
        });
        const getRankedTeamCode = (group, rank) => groupRankings[group]?.[rank - 1]?.code || null;
        // console.log("Force Update Rankings (Top 1):", "A:", getRankedTeamCode('A',1), "B:", getRankedTeamCode('B',1), "C:", getRankedTeamCode('C',1));

        // 2. Создаем базовый обновленный список матчей (только команды и статус)
        let updatedMatchesBase = matches.map(match => {
            if (match.round === 'group') return match;

            let newTeam1Code = null;
            let newTeam2Code = null;
            let newStatus = 'waiting';

            // Логика switch для определения команд (такая же, как в updatePlayoffTeams)
            switch (match.id) {
                case 'QF-1A-1C': newTeam1Code = getRankedTeamCode('A', 1); newTeam2Code = getRankedTeamCode('C', 1); break;
                case 'QF-1B-2C': newTeam1Code = getRankedTeamCode('B', 1); newTeam2Code = getRankedTeamCode('C', 2); break;
                case 'QF-2A-3B': newTeam1Code = getRankedTeamCode('A', 2); newTeam2Code = getRankedTeamCode('B', 3); break;
                case 'QF-3A-2B': newTeam1Code = getRankedTeamCode('A', 3); newTeam2Code = getRankedTeamCode('B', 2); break;
                case 'SF-W1-W3': { const qf1 = matches.find(m => m.id === 'QF-1A-1C'); const qf3 = matches.find(m => m.id === 'QF-2A-3B'); newTeam1Code = qf1?.winner || null; newTeam2Code = qf3?.winner || null; break; }
                case 'SF-W2-W4': { const qf2 = matches.find(m => m.id === 'QF-1B-2C'); const qf4 = matches.find(m => m.id === 'QF-3A-2B'); newTeam1Code = qf2?.winner || null; newTeam2Code = qf4?.winner || null; break; }
                case 'F-W1-W2': { const sf1 = matches.find(m => m.id === 'SF-W1-W3'); const sf2 = matches.find(m => m.id === 'SF-W2-W4'); newTeam1Code = sf1?.winner || null; newTeam2Code = sf2?.winner || null; break; }
                case 'F3-L1-L2': {
                    const sf1 = matches.find(m => m.id === 'SF-W1-W3');
                    const sf2 = matches.find(m => m.id === 'SF-W2-W4');
                     const getLoser = (sfMatch) => {
                        if (!sfMatch || !sfMatch.winner || !sfMatch.team1 || !sfMatch.team2) return null;
                        return sfMatch.winner === sfMatch.team1 ? sfMatch.team2 : sfMatch.team1;
                    };
                    newTeam1Code = getLoser(sf1);
                    newTeam2Code = getLoser(sf2);
                    break;
                }
                default: return match;
            }

            if (newTeam1Code && newTeam2Code) {
                newStatus = 'not_started';
            }

            // Сбрасываем счет и победителя, если команды изменились
            const teamsChanged = match.team1 !== newTeam1Code || match.team2 !== newTeam2Code;

            // console.log(`[${match.id} Button] Setting Teams: ${newTeam1Code}-${newTeam2Code}, Status: ${newStatus}.`);
            return {
                ...match,
                team1: newTeam1Code,
                team2: newTeam2Code,
                status: newStatus,
                // Сбрасываем судью здесь перед вызовом assignReferees,
                // чтобы он назначился заново по правилам или динамически.
                // Оставляем старого, если команды не изменились? Нет, лучше переназначать принудительно.
                refereeTeamCode: null, // Сброс перед assignReferees
                ...(teamsChanged && { // Сброс счета только при смене команд
                    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null
                })
            };
        });

        // 3. Вызываем assignReferees для назначения судей на основе обновленных команд
        // console.log("Calling assignReferees after force update...");
        const matchesWithReferees = assignReferees(updatedMatchesBase, teams);

        // 4. Обновляем состояние
        setMatches(matchesWithReferees);
        // console.log("--- forceUpdatePlayoffTeams END ---");
    }, [teams, matches, setMatches, assignReferees]); // Добавили matches

    // --- Обновление счета матча --- (Без изменений, но проверена валидация)
     const updateMatchScore = useCallback((matchId, set, team, scoreStr) => {
         const score = parseInt(scoreStr);
         // Разрешаем ввод 0, но не отрицательных чисел или NaN
         const validScore = isNaN(score) || score < 0 ? 0 : score;

         setMatches(prevMatches =>
             prevMatches.map(m => {
                 if (m.id === matchId) {
                     const isFinalSet = m.round === 'final' && set === 3;
                      // Тай-брейк играется в 3-м сете ИЛИ если статус требует его (1:1 по сетам)
                     const isTiebreak = set === 3 && (m.status === 'tie_needs_tiebreak' || isFinalSet);
                     // Валидация больше не ограничивает сверху, isSetCompleted сделает проверку
                     // const validatedScore = validateScore(validScore, isFinalSet, isTiebreak);
                     return { ...m, [`set${set}${team === 'team1' ? 'Team1' : 'Team2'}`]: validScore }; // Используем validScore
                 }
                 return m;
             })
         );
     }, [setMatches]); // Зависит только от setMatches

    // --- Проверка статуса всех матчей --- (Без изменений)
    const checkAllMatchesStatus = useCallback(() => {
        setMatches(prevMatches => {
            let needsUpdate = false;
            const updatedMatches = prevMatches.map(match => {
                 // Пропускаем матчи в ожидании команд
                 if (match.status === 'waiting') return match;

                const { set1Team1, set1Team2, set2Team1, set2Team2, set3Team1, set3Team2 } = match;

                // Если все очки 0, но статус не 'not_started' или 'waiting', сбрасываем
                 const allScoresZero = (set1Team1 === 0 && set1Team2 === 0 && set2Team1 === 0 && set2Team2 === 0 && set3Team1 === 0 && set3Team2 === 0);
                 if (allScoresZero && match.status !== 'not_started' && match.status !== 'waiting') {
                    // console.log(`Resetting status for ${match.id} due to zero scores.`);
                     needsUpdate = true;
                     return { ...match, status: 'not_started', winner: null };
                 }
                 // Если уже not_started, ничего не делаем
                 if (allScoresZero && match.status === 'not_started') {
                    return match;
                 }


                // Определяем завершенность сетов
                const isFinal = match.round === 'final';
                const set1Completed = isSetCompleted(set1Team1, set1Team2, false, false);
                const set2Completed = isSetCompleted(set2Team1, set2Team2, false, false);

                // 3-й сет релевантен для финала ИЛИ если первые два завершены 1:1 ИЛИ если очки в 3м сете уже есть
                const needThirdSet = (set1Completed && set2Completed && (set1Team1 > set1Team2 !== set2Team1 > set2Team2)) || isFinal;
                // Тай-брейк в 3м сете играется в финале или если нужен 3й сет и это не финал
                 const isThirdSetTiebreak = needThirdSet && !isFinal;
                 const set3Relevant = needThirdSet || set3Team1 > 0 || set3Team2 > 0; // Показываем поле, если есть очки
                const set3Completed = set3Relevant && isSetCompleted(set3Team1, set3Team2, isFinal, isThirdSetTiebreak);


                // Считаем выигранные сеты
                let team1Wins = 0, team2Wins = 0;
                if (set1Completed) (set1Team1 > set1Team2) ? team1Wins++ : team2Wins++;
                if (set2Completed) (set2Team1 > set2Team2) ? team1Wins++ : team2Wins++;
                 // Сет 3 засчитывается только если он был завершен
                if (set3Completed) (set3Team1 > set3Team2) ? team1Wins++ : team2Wins++;


                let newStatus = match.status;
                let newWinner = match.winner;

                // --- Логика определения статуса и победителя ---
                 if (team1Wins >= 2) { // Команда 1 выиграла матч (2:0 или 2:1)
                     newStatus = 'completed';
                     newWinner = match.team1;
                 } else if (team2Wins >= 2) { // Команда 2 выиграла матч (2:0 или 2:1)
                     newStatus = 'completed';
                     newWinner = match.team2;
                 } else if (set1Completed && set2Completed && team1Wins === 1 && team2Wins === 1) { // Счет 1:1 по сетам
                     // Нужен 3-й сет (тай-брейк или финальный)
                     if (isFinal) { // Финал, играем до 15
                         if (set3Completed) { // Финальный тай-брейк завершен
                             newStatus = 'completed';
                             newWinner = (set3Team1 > set3Team2) ? match.team1 : match.team2;
                         } else if (set3Team1 > 0 || set3Team2 > 0) { // Финальный тай-брейк идет
                             newStatus = 'in_progress';
                             newWinner = null;
                         } else { // Финальный тай-брейк еще не начался
                             newStatus = 'tie_needs_tiebreak'; // Используем этот статус для индикации необходимости 3-го сета
                             newWinner = null;
                         }
                     } else { // Не финал, счет 1:1
                         if (tournamentSettings.useTotalPointsForTie) {
                             // Сравниваем очки за 2 сета
                             const team1TotalPoints = set1Team1 + set2Team1;
                             const team2TotalPoints = set1Team2 + set2Team2;
                             if (team1TotalPoints > team2TotalPoints) {
                                 newStatus = 'completed_by_points';
                                 newWinner = match.team1;
                             } else if (team2TotalPoints > team1TotalPoints) {
                                 newStatus = 'completed_by_points';
                                 newWinner = match.team2;
                             } else { // Очки равны, нужен тай-брейк до 5
                                 if (set3Completed) { // Тай-брейк завершен
                                     newStatus = 'completed';
                                     newWinner = (set3Team1 > set3Team2) ? match.team1 : match.team2;
                                 } else if (set3Team1 > 0 || set3Team2 > 0) { // Тай-брейк идет
                                     newStatus = 'in_progress'; // Или оставить 'tie_needs_tiebreak'? 'in_progress' логичнее
                                     newWinner = null;
                                 } else { // Тай-брейк не начат
                                     newStatus = 'tie_needs_tiebreak';
                                     newWinner = null;
                                 }
                             }
                         } else { // Тай-брейк играется всегда при 1:1
                             if (set3Completed) { // Тай-брейк завершен
                                 newStatus = 'completed';
                                 newWinner = (set3Team1 > set3Team2) ? match.team1 : match.team2;
                              } else if (set3Team1 > 0 || set3Team2 > 0) { // Тай-брейк идет
                                 newStatus = 'in_progress';
                                 newWinner = null;
                             } else { // Тай-брейк не начат
                                 newStatus = 'tie_needs_tiebreak';
                                 newWinner = null;
                             }
                         }
                     }
                 } else if (set1Team1 > 0 || set1Team2 > 0 || set2Team1 > 0 || set2Team2 > 0 || set3Team1 > 0 || set3Team2 > 0) {
                     // Если есть хоть какие-то очки, но матч не завершен и не 1:1
                     newStatus = 'in_progress';
                     newWinner = null;
                 } else {
                     // Все очки 0, команды могут быть null (waiting) или определены (not_started)
                     newStatus = match.team1 && match.team2 ? 'not_started' : 'waiting';
                     newWinner = null;
                 }

                // Обновляем, только если статус или победитель изменились
                if (newStatus !== match.status || newWinner !== match.winner) {
                    needsUpdate = true;
                    return { ...match, status: newStatus, winner: newWinner };
                }
                return match;
            });
            // Возвращаем новый массив только если были изменения
            return needsUpdate ? updatedMatches : prevMatches;
        });
    }, [tournamentSettings.useTotalPointsForTie, setMatches]); // Зависит от настроек и setMatches


    // --- Обработчики настроек, языка, сброса матча --- (Без изменений)
     const handleSettingsChange = useCallback((newSettingValue) => {
        const newSettings = { ...tournamentSettings, useTotalPointsForTie: newSettingValue };
        setTournamentSettings(newSettings);
        // Немедленно перепроверяем статусы матчей после смены настройки
        // checkAllMatchesStatus(); // Вызовется через useEffect ниже
    }, [tournamentSettings, setTournamentSettings]); // Убрали checkAllMatchesStatus, т.к. он в useEffect

    const changeLanguage = useCallback((lang) => {
        if (translations[lang]) {
            setLanguage(lang);
        } else {
            setLanguage('cs'); // Fallback
        }
    }, [setLanguage]);

    const resetMatch = useCallback((matchId) => {
        const initialMatch = initialMatches.find(m => m.id === matchId);
        // Статус берем из initialMatches или 'not_started'/'waiting' в зависимости от наличия команд
        const originalStatus = initialMatch
            ? (initialMatch.team1 && initialMatch.team2 ? 'not_started' : 'waiting')
            : 'not_started';

        setMatches(prevMatches => prevMatches.map(m => {
            if (m.id === matchId) {
                 // console.log(`Resetting match: ${matchId}`);
                // Сбрасываем счет, победителя, статус. Команды и судью НЕ трогаем.
                return {
                    ...m,
                    set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0,
                    winner: null,
                    status: originalStatus
                };
            }
            return m;
        }));
         // Закрываем модальное окно после сброса
         setSelectedMatch(null);
         setView('matches');
    }, [setMatches, setSelectedMatch, setView /* initialMatches - константа */]);


    // --- Главные useEffect для запуска логики ---
    // 1. Обновляем статусы при изменении матчей (или настроек тай-брейка)
     useEffect(() => {
        // console.log("Effect: checkAllMatchesStatus triggered");
         checkAllMatchesStatus();
     }, [matches, tournamentSettings.useTotalPointsForTie, checkAllMatchesStatus]); // Добавили tournamentSettings

     // 2. Пересчитываем статистику команд при изменении матчей
     useEffect(() => {
         // console.log("Effect: recalculateAllTeamStats triggered");
         recalculateAllTeamStats(matches);
     }, [matches, recalculateAllTeamStats]);

     // 3. Автоматически обновляем команды плей-офф (но не судей) при изменении команд или матчей
     useEffect(() => {
         // console.log("Effect: updatePlayoffTeams triggered");
          // Эта функция теперь возвращает новый массив только если были изменения
         const updatedMatchesResult = updatePlayoffTeams(matches, teams);
         // Обновляем состояние только если функция вернула новый массив
         if (updatedMatchesResult !== matches) {
              // console.log("Applying automatic playoff team updates.");
              setMatches(updatedMatchesResult);
         }
     }, [teams, matches, updatePlayoffTeams, setMatches]); // Добавили setMatches

    // --- Рендер-функции ---

    // Пример декомпозиции: выносим рендер строки матча
     const MatchRow = React.memo(({ match, teams, t, onRowClick }) => {
         const team1 = teams.find(tm => tm.code === match.team1);
         const team2 = teams.find(tm => tm.code === match.team2);
         const refereeTeam = teams.find(tm => tm.code === match.refereeTeamCode);
         const team1Name = team1?.name || (match.round !== 'group' && match.team1 ? `...` : t.tbd);
         const team2Name = team2?.name || (match.round !== 'group' && match.team2 ? `...` : t.tbd);
          const refereeName = refereeTeam?.name || (match.refereeTeamCode ? `(${t.refereeTBD || '???'})` : (t.refereeTBD || '???'));

         // Логика статуса и раунда (без изменений)
         let statusIcon, statusClass, statusText; const currentStatus = match.status || 'unknown'; statusText = t.statusNames?.[currentStatus] || currentStatus;
        if(currentStatus==='completed'){statusIcon=<FaCheck className="mr-1 text-green-500"/>;statusClass='text-green-600 font-semibold';}else if(currentStatus==='completed_by_points'){statusIcon=<FaCheck className="mr-1 text-blue-500"/>;statusClass='text-blue-600 font-semibold';}else if(currentStatus==='tie_needs_tiebreak'){statusIcon=<FaExclamationTriangle className="mr-1 text-red-500"/>;statusClass='text-red-600 font-semibold';}else if(currentStatus==='in_progress'){statusIcon=<FaRegClock className="mr-1 text-yellow-600 animate-spin" style={{animationDuration:'2s'}}/>;statusClass='text-yellow-700 font-semibold';}else if(currentStatus==='waiting'){statusIcon=<FaRegClock className="mr-1 text-gray-400"/>;statusClass='text-gray-500';}else{statusIcon=<FaRegClock className="mr-1 text-gray-500"/>;statusClass='text-gray-600';}

        let roundClass='px-2 py-1 rounded text-xs font-semibold inline-block'; const currentRound = match.round || 'unknown'; const roundText = t.roundNames?.[currentRound] || currentRound;
        if(currentRound==='group'){roundClass+=' bg-[#C1CBA7]/50 text-[#06324F]';}else if(currentRound==='quarterfinal'){roundClass+=' bg-[#0B8E8D]/20 text-[#0B8E8D]';}else if(currentRound==='semifinal'){roundClass+=' bg-[#06324F]/20 text-[#06324F]';}else if(currentRound==='third_place'){roundClass+=' bg-orange-100 text-orange-700';}else if(currentRound==='final'){roundClass+=' bg-[#FDD80F]/20 text-[#FDD80F]/90';}else{roundClass+=' bg-gray-200 text-gray-700';}

        const isFinal = currentRound === 'final';
        const set1Completed = isSetCompleted(match.set1Team1, match.set1Team2, false, false);
        const set2Completed = isSetCompleted(match.set2Team1, match.set2Team2, false, false);
         const team1SetWins = (set1Completed && match.set1Team1 > match.set1Team2 ? 1 : 0) + (set2Completed && match.set2Team1 > match.set2Team2 ? 1 : 0);
         const team2SetWins = (set1Completed && match.set1Team1 < match.set1Team2 ? 1 : 0) + (set2Completed && match.set2Team1 < match.set2Team2 ? 1 : 0);

        const showThirdSet = isFinal || currentStatus === 'tie_needs_tiebreak' || (set1Completed && set2Completed && team1SetWins === 1 && team2SetWins === 1) || match.set3Team1 > 0 || match.set3Team2 > 0;
        const canOpenDetail = !!(match.team1 && match.team2); // Можно открыть, если обе команды определены
         const isTeam1Winner = match.winner && team1 && match.winner === team1.code;
         const isTeam2Winner = match.winner && team2 && match.winner === team2.code;

         return (
             <tr
                key={match.id}
                className={`border-b transition-colors duration-150 ease-in-out ${canOpenDetail ? 'hover:bg-[#0B8E8D]/10 cursor-pointer' : 'opacity-70 cursor-not-allowed'}`}
                onClick={canOpenDetail ? () => onRowClick(match) : undefined}
            >
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
                 <td className={`p-2 text-sm md:text-base font-bold text-center ${!showThirdSet ? 'text-gray-400' : ''}`}>{showThirdSet ? `${match.set3Team1 ?? 0}-${match.set3Team2 ?? 0}` : '-'}</td>
                 <td className={`p-2 text-sm md:text-base ${statusClass}`}><div className="flex items-center">{statusIcon}{statusText}</div></td>
             </tr>
         );
     });

    const renderMatches = useCallback(() => {
        const sortedMatches = [...matches].sort((a, b) => {
            const timeA = a.time || "99:99";
            const timeB = b.time || "99:99";
            const timeCompare = timeA.localeCompare(timeB);
            if (timeCompare !== 0) return timeCompare;
            return (a.court || 99) - (b.court || 99);
        });

        const handleRowClick = (match) => {
             setView('matchDetail');
             setSelectedMatch(match);
         };

        return (
            <div className="p-4 overflow-x-auto">
                 <div className="flex justify-between items-center mb-6 gap-4">
                     <h2 className="text-2xl font-bold text-indigo-700 flex items-center">
                         <FaVolleyballBall className="mr-3 text-indigo-600" />
                         <span>{t.matches}</span>
                     </h2>
                      {/* Кнопка для принудительного обновления команд И СУДЕЙ плей-офф */}
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
                                     {/* Заголовки таблицы */}
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
                                 {/* Используем компонент MatchRow */}
                                 {sortedMatches.map(match => (
                                     <MatchRow
                                         key={match.id}
                                         match={match}
                                         teams={teams}
                                         t={t}
                                         onRowClick={handleRowClick}
                                     />
                                 ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }, [matches, teams, t, setView, setSelectedMatch, forceUpdatePlayoffTeams]); // Добавили forceUpdatePlayoffTeams в зависимости

     // --- Рендер групп --- (Использует новую функцию сортировки)
     const renderGroups = useCallback(() => {
         return (
             <div className="p-4">
                 <h2 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center"><FaUsers className="mr-3 text-indigo-600" /><span>{t.groups}</span></h2>
                 {teams.length === 0 && <p className="text-center p-4">{t.noTeams || 'Команды не найдены.'}</p>}
                 {teams.length > 0 && (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {['A', 'B', 'C'].map(group => {
                             const groupColors = { /* ...цвета... */
                                 'A':{bg:'from-[#C1CBA7] to-[#0B8E8D]', lightBg:'from-[#C1CBA7]/20 to-[#0B8E8D]/10', text:'text-blue-700', border:'border-blue-200'},
                                 'B':{bg:'from-[#06324F] to-[#0B8E8D]', lightBg:'from-[#06324F]/10 to-[#0B8E8D]/10', text:'text-purple-700', border:'border-purple-200'},
                                 'C':{bg:'from-[#FDD80F] to-[#0B8E8D]', lightBg:'from-[#FDD80F]/10 to-[#0B8E8D]/10', text:'text-green-700', border:'border-green-200'}
                             };
                            const colors = groupColors[group] || groupColors['A'];
                            const groupTeams = teams.filter(tm => tm.group === group);
                            // Используем новую функцию сортировки
                            const sortedGroupTeams = sortTeamsByRank(groupTeams);

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
                                                          {/* Заголовки таблицы групп */}
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
                                                         // Логика иконок ранга
                                                          if (rank === 1) { rowClass += ' bg-green-50 font-bold'; rankIcon = <FaTrophy className="inline mr-2 text-yellow-500" />; }
                                                          else if (rank === 2) { rowClass += ' bg-green-50'; rankIcon = <FaTrophy className="inline mr-2 text-gray-400" />; }
                                                         // Уточнить правила выхода из групп для иконки 3го места
                                                          else if (rank === 3 && (group === 'A' || group === 'B' || group === 'C')) { rankIcon = <FaTrophy className="inline mr-2 text-orange-400" />; } // Показываем для всех групп, если 3е место выходит
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
     }, [teams, t]); // Использует sortTeamsByRank - стабильна

     // --- Рендер деталей матча --- (Без существенных изменений, проверена логика showThirdSetInput)
    const renderMatchDetail = useCallback(() => {
        // Находим актуальные данные матча из состояния 'matches'
        const currentMatchData = selectedMatch ? matches.find(m => m.id === selectedMatch.id) : null;
         if (!currentMatchData) {
             // Если матч не найден (например, после сброса или ошибки), закрываем окно
             if(selectedMatch) setSelectedMatch(null);
             if(view === 'matchDetail') setView('matches'); // Возвращаемся к списку
             return null;
         }

         const team1 = teams.find(t => t.code === currentMatchData.team1) || { name: t.tbd };
         const team2 = teams.find(t => t.code === currentMatchData.team2) || { name: t.tbd };
         const refereeTeam = teams.find(t => t.code === currentMatchData.refereeTeamCode);
         const refereeName = refereeTeam?.name || (currentMatchData.refereeTeamCode ? `(${t.refereeTBD || '???'})` : (t.refereeTBD || '???'));

        // Логика классов и иконок для раунда и статуса (без изменений)
        let roundClass = 'px-3 py-1 rounded-full text-sm font-semibold inline-block mb-3'; let roundIcon;
        const currentRound = currentMatchData.round || 'unknown'; const roundText = t.roundNames?.[currentRound] || currentRound;
        if(currentRound==='group'){roundClass+=' bg-[#C1CBA7]/50 text-[#06324F]';roundIcon=<FaUsers className="mr-2"/>;}else if(currentRound==='quarterfinal'){roundClass+=' bg-[#0B8E8D]/20 text-[#0B8E8D]';roundIcon=<FaChartBar className="mr-2"/>;}else if(currentRound==='semifinal'){roundClass+=' bg-[#06324F]/20 text-[#06324F]';roundIcon=<FaChartBar className="mr-2"/>;}else if(currentRound==='third_place'){roundClass+=' bg-orange-100 text-orange-700';roundIcon=<FaTrophy className="mr-2"/>;}else if(currentRound==='final'){roundClass+=' bg-[#FDD80F]/20 text-[#FDD80F]/90';roundIcon=<FaTrophy className="mr-2"/>;}else{roundClass+=' bg-gray-200 text-gray-700';roundIcon=<FaVolleyballBall className="mr-2"/>;}

        let statusClass = 'px-3 py-1 rounded-full text-sm font-semibold inline-block ml-2'; let statusIcon;
        const currentStatus = currentMatchData.status || 'unknown'; const statusText = t.statusNames?.[currentStatus] || currentStatus;
        if(currentStatus==='completed'){statusClass+=' bg-green-100 text-green-800';statusIcon=<FaCheck className="mr-2"/>;}else if(currentStatus==='completed_by_points'){statusClass+=' bg-blue-100 text-blue-800';statusIcon=<FaCheck className="mr-2"/>;}else if(currentStatus==='tie_needs_tiebreak'){statusClass+=' bg-red-100 text-red-800';statusIcon=<FaExclamationTriangle className="mr-2"/>;}else if(currentStatus==='in_progress'){statusClass+=' bg-yellow-100 text-yellow-800';statusIcon=<FaRegClock className="mr-2 animate-spin" style={{animationDuration:'2s'}}/>;}else if(currentStatus==='waiting'){statusClass+=' bg-gray-100 text-gray-500';statusIcon=<FaRegClock className="mr-2"/>;}else{statusClass+=' bg-gray-100 text-gray-800';statusIcon=<FaRegClock className="mr-2"/>;}


        // Определяем, нужно ли показывать поле для 3-го сета
         const isFinal = currentRound === 'final';
         const set1Completed = isSetCompleted(currentMatchData.set1Team1, currentMatchData.set1Team2, false, false);
         const set2Completed = isSetCompleted(currentMatchData.set2Team1, currentMatchData.set2Team2, false, false);
         const isTieSituation = set1Completed && set2Completed && (currentMatchData.set1Team1 > currentMatchData.set1Team2 !== currentMatchData.set2Team1 > currentMatchData.set2Team2);
         const showThirdSetInput = isFinal || currentStatus === 'tie_needs_tiebreak' || isTieSituation || currentMatchData.set3Team1 > 0 || currentMatchData.set3Team2 > 0;
         // Является ли 3й сет тай-брейком (до 5 или 15)
         const isThirdSetTiebreak = showThirdSetInput && (isFinal || currentStatus === 'tie_needs_tiebreak' || isTieSituation);
         const tiebreakScoreLimit = isFinal ? 15 : 5;


         return (
             <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center p-4 z-[70] backdrop-blur-sm">
                 <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-lg overflow-hidden">
                      {/* Шапка модального окна */}
                     <div className="bg-gradient-to-r from-[#0B8E8D] to-[#06324F] p-6 text-white">
                         <div className="flex justify-between items-center">
                             <h2 className="text-2xl font-bold">{t.matchDetail}</h2>
                             <button onClick={() => { setView('matches'); setSelectedMatch(null); }} className="text-white hover:text-red-200 transition-colors duration-150 text-3xl leading-none">&times;</button>
                         </div>
                     </div>
                      {/* Тело модального окна */}
                     <div className="p-6 max-h-[80vh] overflow-y-auto">
                         {/* Информация о матче */}
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
                         {/* Команды */}
                         <div className="bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 p-4 rounded-lg mb-6">
                            <div className="flex justify-between items-center">
                                <div className="text-center w-5/12"><div className="text-lg font-bold text-indigo-800">{team1.name}</div></div>
                                <div className="text-center w-2/12"><div className="text-xl font-bold text-gray-600">vs</div></div>
                                <div className="text-center w-5/12"><div className="text-lg font-bold text-indigo-800">{team2.name}</div></div>
                             </div>
                         </div>
                         {/* Поля ввода счета */}
                         <div className="space-y-4">
                              {/* Сет 1 */}
                             <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                 <label className="block text-sm font-medium text-gray-700 mb-2">{t.set1}</label>
                                 <div className="flex items-center justify-between">
                                     <input type="number" min="0" max="99" defaultValue={currentMatchData.set1Team1 ?? 0} onBlur={(e) => updateMatchScore(currentMatchData.id, 1, 'team1', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                     <span className="text-gray-400 text-xl font-bold">:</span>
                                     <input type="number" min="0" max="99" defaultValue={currentMatchData.set1Team2 ?? 0} onBlur={(e) => updateMatchScore(currentMatchData.id, 1, 'team2', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                 </div>
                             </div>
                              {/* Сет 2 */}
                             <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                 <label className="block text-sm font-medium text-gray-700 mb-2">{t.set2}</label>
                                 <div className="flex items-center justify-between">
                                      <input type="number" min="0" max="99" defaultValue={currentMatchData.set2Team1 ?? 0} onBlur={(e) => updateMatchScore(currentMatchData.id, 2, 'team1', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                      <span className="text-gray-400 text-xl font-bold">:</span>
                                      <input type="number" min="0" max="99" defaultValue={currentMatchData.set2Team2 ?? 0} onBlur={(e) => updateMatchScore(currentMatchData.id, 2, 'team2', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                  </div>
                             </div>
                              {/* Сет 3 / Тай-брейк */}
                              {showThirdSetInput && (
                                 <div className={`bg-white p-4 rounded-lg shadow-sm border ${currentStatus === 'tie_needs_tiebreak' ? 'border-red-300' : 'border-gray-200'}`}>
                                     <label className={`block text-sm font-medium ${currentStatus === 'tie_needs_tiebreak' ? 'text-red-700' : 'text-gray-700'} mb-2`}>
                                         {isFinal ? t.set3 : t.tiebreak}
                                         {isThirdSetTiebreak && ` (${isFinal ? (t.finalTiebreakCondition || 'до 15') : (t.tiebreak_condition || 'до 5')})`}
                                     </label>
                                     <div className="flex items-center justify-between">
                                          <input
                                             type="number" min="0" max="99"
                                             defaultValue={currentMatchData.set3Team1 ?? 0}
                                             onBlur={(e) => updateMatchScore(currentMatchData.id, 3, 'team1', e.target.value)}
                                             className={`w-20 p-2 border rounded-lg text-center font-bold text-lg focus:ring-2 ${currentStatus === 'tie_needs_tiebreak' ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                                         />
                                         <span className="text-gray-400 text-xl font-bold">:</span>
                                         <input
                                              type="number" min="0" max="99"
                                              defaultValue={currentMatchData.set3Team2 ?? 0}
                                              onBlur={(e) => updateMatchScore(currentMatchData.id, 3, 'team2', e.target.value)}
                                              className={`w-20 p-2 border rounded-lg text-center font-bold text-lg focus:ring-2 ${currentStatus === 'tie_needs_tiebreak' ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`}
                                          />
                                      </div>
                                     {/* Подсказки */}
                                     {currentStatus === 'tie_needs_tiebreak' && !isFinal && <p className="text-xs text-red-600 mt-2">{t.tiebreakInfo || `Введите счет тай-брейка (до ${tiebreakScoreLimit}, разница 2).`}</p>}
                                      {isFinal && <p className="text-xs text-gray-500 mt-2">{t.finalTiebreakInfo || `Третий сет финала играется до ${tiebreakScoreLimit} (разница 2).`}</p>}
                                  </div>
                              )}
                         </div>
                         {/* Кнопки действий */}
                         <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                              <button
                                 onClick={() => resetMatch(currentMatchData.id)} // Используем обновленный resetMatch
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
    }, [selectedMatch, matches, teams, t, updateMatchScore, setView, setSelectedMatch, resetMatch]); // Добавили matches и teams в зависимости

     // --- Рендер модального окна правил --- (Без изменений)
     const renderRulesModal = useCallback(() => {
        // ... (JSX и логика без изменений) ...
         return (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-start justify-center p-4 z-[60] backdrop-blur-sm overflow-y-auto">
                <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-4xl my-8 overflow-hidden">
                     {/* Шапка */}
                     <div className="bg-gradient-to-r from-[#0B8E8D] to-[#06324F] p-6 text-white sticky top-0 z-10">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold flex items-center"><FaGlobe className="mr-2" />{t.rules}</h2>
                            <div className="flex items-center space-x-2">
                                 {/* Кнопки языков */}
                                 {Object.keys(languageNames).filter(lang => translations[lang]).map(lang => (
                                     <button key={lang} onClick={() => changeLanguage(lang)} className={`px-2 py-1 text-xs rounded transition-colors duration-150 ${language === lang ? 'bg-white text-[#0B8E8D] shadow-sm font-semibold' : 'bg-[#0B8E8D]/80 text-white hover:bg-[#0B8E8D]/90'}`} title={languageNames[lang]}>{lang.toUpperCase()}</button>
                                 ))}
                                 {/* Кнопка закрыть */}
                                 <button onClick={() => setShowRules(false)} className="text-white hover:text-[#FDD80F] transition-colors ml-4" title={t.close}>
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                 </button>
                             </div>
                         </div>
                     </div>
                     {/* Тело */}
                     <div className="p-6 max-h-[70vh] overflow-y-auto">
                          {/* Настройки правил тай-брейка */}
                         <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
                             <h4 className="text-lg font-semibold text-[#06324F] mb-3">{t.tieRules?.settingsTitle || "Настройки определения победителя (при 1:1 по сетам)"}</h4>
                             <div className="flex items-center space-x-3">
                                 <input
                                     type="checkbox"
                                     id="useTotalPointsForTie"
                                     checked={tournamentSettings.useTotalPointsForTie}
                                     onChange={(e) => handleSettingsChange(e.target.checked)} // Вызывает useCallback
                                     className="h-5 w-5 rounded text-[#0B8E8D] focus:ring-2 focus:ring-[#0B8E8D]/50 border-gray-300 cursor-pointer"
                                 />
                                 <label htmlFor="useTotalPointsForTie" className="text-gray-700 select-none cursor-pointer">{t.tieRules?.usePointsOption || "Учитывать общее кол-во очков в 2 сетах"}</label>
                             </div>
                             <p className="text-xs text-gray-500 mt-2">
                                 {tournamentSettings.useTotalPointsForTie
                                     ? (t.tieRules?.usePointsOptionDescription || "Если счет 1:1, выигрывает команда с большим кол-вом очков за 2 сета. При равенстве очков играется тай-брейк до 5.")
                                     : (t.tieRules?.useTiebreakOptionDescription || "Если счет 1:1, всегда играется тай-брейк до 5.")
                                 } ({t.scoreDifferenceLabel || "Разница в 2 очка"})
                             </p>
                         </div>
                          {/* Объяснение правил */}
                         <div className="mb-8 bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 p-6 rounded-xl shadow-md border border-[#0B8E8D]/20">
                             {/* ... (остальное без изменений) ... */}
                              <h3 className="text-xl font-bold text-[#06324F] mb-4">{t.tieRules?.title || "Правила определения победителя (при 1:1 по сетам)"}</h3>
                              <div className="space-y-4">
                                 {/* Вариант 1 */}
                                 <div className={`p-4 rounded-lg shadow-sm border transition-all duration-300 ${tournamentSettings.useTotalPointsForTie ? 'bg-white border-green-300 ring-2 ring-green-200' : 'bg-gray-100 border-gray-200 opacity-70'}`}>
                                     <h4 className="text-lg font-semibold text-[#0B8E8D] mb-2 flex items-center">
                                         {tournamentSettings.useTotalPointsForTie && <FaCheck className="text-green-500 mr-2" />} {t.tieRules?.option1 || "Вариант 1: По очкам"}
                                     </h4>
                                     <p className="text-gray-700 text-sm">{t.tieRules?.option1Description || "Побеждает команда, набравшая больше очков в сумме за 2 сета. Если очков поровну, играется тай-брейк до 5 очков (разница 2)."}</p>
                                 </div>
                                 {/* Вариант 2 */}
                                  <div className={`p-4 rounded-lg shadow-sm border transition-all duration-300 ${!tournamentSettings.useTotalPointsForTie ? 'bg-white border-green-300 ring-2 ring-green-200' : 'bg-gray-100 border-gray-200 opacity-70'}`}>
                                     <h4 className="text-lg font-semibold text-[#0B8E8D] mb-2 flex items-center">
                                         {!tournamentSettings.useTotalPointsForTie && <FaCheck className="text-green-500 mr-2" />} {t.tieRules?.option2 || "Вариант 2: Всегда тай-брейк"}
                                     </h4>
                                     <p className="text-gray-700 text-sm">{t.tieRules?.option2Description || "Всегда играется тай-брейк до 5 очков (разница 2)."}</p>
                                 </div>
                              </div>
                         </div>
                          {/* Общие правила */}
                         <div className="prose prose-sm max-w-none mt-6">
                            <h3 className="text-xl font-bold text-[#06324F] mb-4">{t.generalRulesTitle || "Общие правила турнира"}</h3>
                            <div className="whitespace-pre-wrap font-sans text-sm text-gray-800 bg-gray-50 p-4 rounded border border-gray-200">
                                {t.tournamentRules || "Здесь будут общие правила турнира..."}
                            </div>
                         </div>
                     </div>
                     {/* Подвал */}
                     <div className="p-4 border-t border-gray-200 bg-gray-50 sticky bottom-0">
                        <button onClick={() => setShowRules(false)} className="w-full py-2 bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center shadow-md">
                            <FaCheck className="mr-2" /> {t.hideRules || "Закрыть правила"}
                        </button>
                     </div>
                </div>
            </div>
        );
     }, [language, tournamentSettings, t, handleSettingsChange, changeLanguage]); // Добавили зависимости

    // --- Основной рендер компонента App ---
    return (
        <>
             {/* Структура JSX с aside, main, nav остается прежней */}
             <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
                {/* Sidebar */}
                <aside className="w-full md:w-64 bg-white shadow-md md:h-screen md:sticky md:top-0 z-40 border-b md:border-b-0 md:border-r border-gray-200 shrink-0">
                     {/* Шапка Sidebar */}
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h1 className="text-xl font-bold text-[#06324F] flex items-center"><FaVolleyballBall className="mr-2 text-[#0B8E8D]" /> {t.appName || 'RVL Scoreboard'}</h1>
                        {/* Переключатель языка (Desktop) */}
                         <div className="hidden md:flex space-x-1">
                             {Object.keys(languageNames).filter(lang => translations[lang]).map(lang => (
                                 <button key={lang} onClick={() => changeLanguage(lang)} className={`px-2 py-1 text-xs rounded transition-colors duration-150 ${language === lang ? 'bg-[#0B8E8D] text-white shadow-sm font-semibold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} title={languageNames[lang]}>{lang.toUpperCase()}</button>
                             ))}
                         </div>
                    </div>
                    {/* Навигация Sidebar */}
                     <div className="p-4 space-y-2">
                        <button onClick={() => setView('matches')} className={`flex items-center w-full text-left p-3 rounded-lg transition-all duration-200 ${view === 'matches' ? 'bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white shadow-md' : 'hover:bg-[#0B8E8D]/10 text-gray-700'}`}><FaVolleyballBall className="mr-3" /> {t.matches}</button>
                        <button onClick={() => setView('groups')} className={`flex items-center w-full text-left p-3 rounded-lg transition-all duration-200 ${view === 'groups' ? 'bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white shadow-md' : 'hover:bg-[#0B8E8D]/10 text-gray-700'}`}><FaUsers className="mr-3" /> {t.groups}</button>
                        <button onClick={() => setShowRules(true)} className="flex items-center w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-[#0B8E8D]/10 text-gray-700 mt-2"><FaGlobe className="mr-3 text-[#FDD80F]" /> {t.rules}</button>
                    </div>
                     {/* Инфо-блок в Sidebar (Desktop) */}
                    <div className="md:absolute md:bottom-0 md:left-0 md:right-0 p-4 hidden md:block">
                        {/* ... (информация о турнире и приложении без изменений) ... */}
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

                {/* Основной контент */}
                <main className="flex-1 p-0 md:p-6 pb-20 md:pb-6 overflow-y-auto">
                    {view === 'matches' && renderMatches()}
                    {view === 'groups' && renderGroups()}

                     {/* Инфо-блок (Mobile) */}
                     <div className="md:hidden p-4 mx-4 mt-4 mb-24 bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 rounded-lg shadow-sm border border-[#0B8E8D]/20">
                        {/* ... (информация о турнире и переключатель языка для мобильных) ... */}
                         <h3 className="text-sm font-semibold text-[#06324F] mb-2">{t.tournamentInfo}</h3>
                         <div className="text-xs text-gray-700 space-y-2">
                             <p className="flex items-center"><FaCalendarAlt className="mr-2 text-[#FDD80F]" /><span className="font-semibold mr-1">{t.dateLabel}:</span> {t.tournamentDate}</p>
                             <p className="flex items-start"><FaMapMarkerAlt className="mr-2 text-[#0B8E8D] mt-0.5 flex-shrink-0" /><div><span className="font-semibold mr-1">{t.addressLabel}:</span> {t.tournamentAddress}</div></p>
                             <p className="flex items-center"><FaLink className="mr-2 text-[#06324F]" /><span className="font-semibold mr-1">{t.websiteLabel}:</span><a href={t.tournamentWebsite} target="_blank" rel="noopener noreferrer" className="text-[#0B8E8D] ml-1 hover:underline truncate">{t.tournamentWebsite?.replace(/^(https?:\/\/)?(www\.)?/, '')}</a></p>
                         </div>
                         {/* Переключатель языка (Mobile) */}
                          <div className="flex space-x-1 mt-3 pt-2 border-t border-[#0B8E8D]/20">
                             {Object.keys(languageNames).filter(lang => translations[lang]).map(lang => (
                                 <button key={lang} onClick={() => changeLanguage(lang)} className={`px-2 py-1 text-xs rounded transition-colors duration-150 ${language === lang ? 'bg-[#0B8E8D] text-white shadow-sm font-semibold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} title={languageNames[lang]}>{lang.toUpperCase()}</button>
                             ))}
                         </div>
                     </div>
                 </main>

                 {/* Нижняя навигация (Mobile) */}
                 <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-2 flex justify-around md:hidden z-30 border-t border-gray-200">
                    <button onClick={() => setView('matches')} className={`p-2 flex flex-col items-center transition-colors duration-150 ${view === 'matches' ? 'text-[#0B8E8D] font-semibold' : 'text-gray-600 hover:text-[#0B8E8D]'}`}><FaVolleyballBall className="text-xl mb-1" /><span className="text-xs">{t.matches}</span></button>
                    <button onClick={() => setView('groups')} className={`p-2 flex flex-col items-center transition-colors duration-150 ${view === 'groups' ? 'text-[#0B8E8D] font-semibold' : 'text-gray-600 hover:text-[#0B8E8D]'}`}><FaUsers className="text-xl mb-1" /><span className="text-xs">{t.groups}</span></button>
                    <button onClick={() => setShowRules(true)} className={`p-2 flex flex-col items-center text-gray-600 hover:text-[#0B8E8D] transition-colors duration-150`}><FaGlobe className="text-xl mb-1 text-[#FDD80F]" /><span className="text-xs">{t.rules}</span></button>
                 </nav>
             </div>

             {/* Модальные окна */}
            {showRules && renderRulesModal()}
            {view === 'matchDetail' && renderMatchDetail()}
        </>
    );
}

export default App;
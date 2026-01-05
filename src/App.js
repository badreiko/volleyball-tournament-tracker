import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
// Иконки остаются
import { FaVolleyballBall, FaUsers, FaTrophy, FaRegClock, FaCheck, FaGlobe, FaExclamationTriangle, FaCalendarAlt, FaTable, FaChartBar, FaMapMarkerAlt, FaLink, FaBullhorn, FaSyncAlt, FaUndo, FaSpinner, FaExchangeAlt } from 'react-icons/fa';
// Переводы и названия языков должны быть в './translations.js'
import { translations, languageNames } from './translations';
// Firebase
import { saveData, subscribeToData, getTournamentPath, GLOBAL_PATHS } from './firebase';

// === КОНФИГУРАЦИЯ ТУРНИРОВ RVL 2025/26 ===
const LEAGUE_SEASON = '2025-26';

const TOURNAMENTS = {
    autumn: {
        id: 'autumn',
        name: 'Podzimní',
        nameRu: 'Осенний',
        nameUk: 'Осінній',
        date: '2.11.2025',
        status: 'completed'
    },
    winter: {
        id: 'winter',
        name: 'Zimní',
        nameRu: 'Зимний',
        nameUk: 'Зимовий',
        date: '11.1.2026',
        status: 'active'
    },
    spring: {
        id: 'spring',
        name: 'Jarní',
        nameRu: 'Весенний',
        nameUk: 'Весняний',
        date: '7.3.2026',
        status: 'upcoming'
    },
    finals: {
        id: 'finals',
        name: 'Finále',
        nameRu: 'Финал',
        nameUk: 'Фінал',
        date: '19.4.2026',
        status: 'upcoming'
    }
};

// Результаты осеннего турнира (2.11.2025) - спарсено с RVL сайта
const AUTUMN_STANDINGS = [
    { name: 'Lážo plážo Děčín', leaguePoints: 10 },
    { name: 'Sokol Benešov', leaguePoints: 8 },
    { name: 'Kondor Slaný', leaguePoints: 6 },
    { name: 'Dvojka Za Praha', leaguePoints: 5 },
    { name: 'Zlatý jádro Kladno', leaguePoints: 4 },
    { name: 'Spořilov Praha', leaguePoints: 3 },
    { name: 'Všude zdejší Tuchlovice', leaguePoints: 2 },
    { name: 'Karpaty Liberec', leaguePoints: 1 },
    // Команды не участвовавшие в осеннем турнире получают 0 очков
];


// Начальные данные команд
const initialTeams = [
    { code: 'A1', name: 'Lážo Plážo Děčín', group: 'A', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0, ballsWon: 0, ballsLost: 0 },
    { code: 'A2', name: 'Zlatý jádro Kladno', group: 'A', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0, ballsWon: 0, ballsLost: 0 },
    { code: 'A3', name: 'Spořilov Praha', group: 'A', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0, ballsWon: 0, ballsLost: 0 },
    { code: 'A4', name: 'Dobrá Parta Plzeň', group: 'A', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0, ballsWon: 0, ballsLost: 0 },
    { code: 'A5', name: 'Prajd Pardubice', group: 'A', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0, ballsWon: 0, ballsLost: 0 },
    { code: 'B1', name: 'Sokol Benešov', group: 'B', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0, ballsWon: 0, ballsLost: 0 },
    { code: 'B2', name: 'Kondor Slaný', group: 'B', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0, ballsWon: 0, ballsLost: 0 },
    { code: 'B3', name: 'Všude zdejší Tuchlovice', group: 'B', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0, ballsWon: 0, ballsLost: 0 },
    { code: 'B4', name: 'UB Mongolsko', group: 'B', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0, ballsWon: 0, ballsLost: 0 },
    { code: 'B5', name: 'Dream team Praha', group: 'B', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0, ballsWon: 0, ballsLost: 0 },
];

// Начальные данные матчей - правильное расписание без конфликтов
// 3 корта, слоты по 30 минут, каждая команда играет максимум 1 матч за слот
const initialMatches = [
    // === РАУНД 1 (09:00) ===
    { id: 'A1-A2', court: 1, time: '09:00', team1: 'A1', team2: 'A2', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A5', refereeRule: null },
    { id: 'A3-A4', court: 2, time: '09:00', team1: 'A3', team2: 'A4', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B5', refereeRule: null },
    { id: 'B1-B2', court: 3, time: '09:00', team1: 'B1', team2: 'B2', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B5', refereeRule: null },

    // === РАУНД 2 (09:30) ===
    { id: 'A1-A3', court: 1, time: '09:30', team1: 'A1', team2: 'A3', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A4', refereeRule: null },
    { id: 'A2-A5', court: 2, time: '09:30', team1: 'A2', team2: 'A5', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B4', refereeRule: null },
    { id: 'B3-B4', court: 3, time: '09:30', team1: 'B3', team2: 'B4', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B5', refereeRule: null },

    // === РАУНД 3 (10:00) ===
    { id: 'A1-A4', court: 1, time: '10:00', team1: 'A1', team2: 'A4', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A2', refereeRule: null },
    { id: 'A3-A5', court: 2, time: '10:00', team1: 'A3', team2: 'A5', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B2', refereeRule: null },
    { id: 'B1-B3', court: 3, time: '10:00', team1: 'B1', team2: 'B3', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B4', refereeRule: null },

    // === РАУНД 4 (10:30) ===
    { id: 'A1-A5', court: 1, time: '10:30', team1: 'A1', team2: 'A5', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A3', refereeRule: null },
    { id: 'A2-A4', court: 2, time: '10:30', team1: 'A2', team2: 'A4', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B3', refereeRule: null },
    { id: 'B2-B5', court: 3, time: '10:30', team1: 'B2', team2: 'B5', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B1', refereeRule: null },

    // === РАУНД 5 (11:00) ===
    { id: 'A2-A3', court: 1, time: '11:00', team1: 'A2', team2: 'A3', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A1', refereeRule: null },
    { id: 'A4-A5', court: 2, time: '11:00', team1: 'A4', team2: 'A5', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B1', refereeRule: null },
    { id: 'B1-B4', court: 3, time: '11:00', team1: 'B1', team2: 'B4', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B5', refereeRule: null },

    // === РАУНД 6 (11:30) ===
    { id: 'B1-B5', court: 1, time: '11:30', team1: 'B1', team2: 'B5', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A1', refereeRule: null },
    { id: 'B2-B3', court: 2, time: '11:30', team1: 'B2', team2: 'B3', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A2', refereeRule: null },

    // === РАУНД 7 (12:00) ===
    { id: 'B2-B4', court: 1, time: '12:00', team1: 'B2', team2: 'B4', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A3', refereeRule: null },
    { id: 'B3-B5', court: 2, time: '12:00', team1: 'B3', team2: 'B5', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A4', refereeRule: null },

    // === РАУНД 8 (12:30) ===
    { id: 'B4-B5', court: 1, time: '12:30', team1: 'B4', team2: 'B5', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A5', refereeRule: null },

    // === ФИНАЛЫ (13:00) ===
    { id: 'F-1A-1B', court: 1, time: '13:00', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'final', refereeTeamCode: null, refereeRule: null },
    { id: 'F3-2A-2B', court: 2, time: '13:00', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'third_place', refereeTeamCode: null, refereeRule: null },
    { id: 'F5-3A-3B', court: 3, time: '13:00', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'fifth_place', refereeTeamCode: null, refereeRule: null }
];



// --- Firebase Database Paths теперь динамические ---
// Используем getTournamentPath(tournament, 'teams') и т.д.
// Глобальные пути в GLOBAL_PATHS (language)

// --- Функции валидации счета и сета ---
const validateScore = (score, isFinalSet, isTiebreak) => {
    const validated = Math.max(0, score); // Только > 0
    return validated;
};

const isSetCompleted = (team1Score, team2Score, isFinalSet, isTiebreak, setPointLimit = 25, winDifference = 2) => {
    const score1 = team1Score ?? 0;
    const score2 = team2Score ?? 0;

    // Тай-брейк группы (до 5, первый достигший побеждает)
    if (isTiebreak && !isFinalSet) {
        return score1 === 5 || score2 === 5;
    }

    // Тай-брейк финала (до 15, разница 2)
    if (isTiebreak && isFinalSet) {
        return (score1 >= 15 || score2 >= 15) && Math.abs(score1 - score2) >= 2;
    }

    // Обычный сет: setPointLimit с указанной разницей
    return (score1 >= setPointLimit || score2 >= setPointLimit) &&
        Math.abs(score1 - score2) >= winDifference;
};

// --- Вспомогательная функция сортировки команд ---
// Приоритет: 1) Очки, 2) Разница сетов, 3) Выигранные сеты, 4) Разница мячей, 5) По имени
const sortTeamsByRank = (teamsToSort) => {
    if (!teamsToSort || teamsToSort.length === 0) return [];
    return [...teamsToSort].sort((a, b) =>
        (b.points || 0) - (a.points || 0) ||
        ((b.setsWon || 0) - (b.setsLost || 0)) - ((a.setsWon || 0) - (a.setsLost || 0)) ||
        (b.setsWon || 0) - (a.setsWon || 0) ||
        ((b.ballsWon || 0) - (b.ballsLost || 0)) - ((a.ballsWon || 0) - (a.ballsLost || 0)) ||
        (b.ballsWon || 0) - (a.ballsWon || 0) ||
        a.name.localeCompare(b.name) // По имени для окончательного разрешения ничьих
    );
};


function App() {
    // --- Состояния ---
    const [teams, setTeams] = useState(initialTeams);
    const [matches, setMatches] = useState(initialMatches);
    const [language, setLanguage] = useState('cs'); // Язык по умолчанию 'cs'
    const [tournamentSettings, setTournamentSettings] = useState({
        useTotalPointsForTie: true,
        // Групповые матчи
        groupSetPointLimit: 20,    // Сет до X очков
        groupWinDifference: 1,     // Разница для победы (1 или 2)
        // Плей-офф/Финалы
        playoffSetPointLimit: 25,  // Сет до X очков
        playoffWinDifference: 2    // Разница для победы
    });
    const [view, setView] = useState('matches'); // Начальный вид - матчи
    const [selectedMatch, setSelectedMatch] = useState(null); // Для открытия деталей матча
    const [showRules, setShowRules] = useState(false); // Для модального окна правил
    const [isLoading, setIsLoading] = useState(true); // Загрузка данных из Firebase
    const [isSaving, setIsSaving] = useState(false); // Индикатор сохранения
    const [isSwapped, setIsSwapped] = useState(false); // Перевёрнутый порядок команд в UI
    const [currentTournament, setCurrentTournament] = useState('winter'); // Текущий выбранный турнир

    // Получаем объект перевода для текущего языка
    const t = translations[language] || translations['cs'];

    // --- Эффект для загрузки данных из Firebase (подписка на изменения) ---
    // Переподписывается при смене турнира
    useEffect(() => {
        const unsubscribers = [];
        setIsLoading(true);

        // Динамические пути для текущего турнира
        const teamsPath = getTournamentPath(currentTournament, 'teams');
        const matchesPath = getTournamentPath(currentTournament, 'matches');
        const settingsPath = getTournamentPath(currentTournament, 'settings');

        // Подписка на teams
        unsubscribers.push(
            subscribeToData(teamsPath, (data) => {
                if (data) {
                    const teamsArray = Array.isArray(data) ? data : Object.values(data);
                    setTeams(teamsArray);
                } else {
                    // Если данных нет для этого турнира, инициализируем начальными
                    setTeams(initialTeams);
                    saveData(teamsPath, initialTeams);
                }
            })
        );

        // Подписка на matches
        unsubscribers.push(
            subscribeToData(matchesPath, (data) => {
                if (data) {
                    const matchesArray = Array.isArray(data) ? data : Object.values(data);
                    const mergedMatches = initialMatches.map(initialMatch => {
                        const loadedMatchData = matchesArray.find(lm => lm.id === initialMatch.id);
                        if (loadedMatchData) {
                            return { ...initialMatch, ...loadedMatchData };
                        }
                        return initialMatch;
                    });
                    setMatches(mergedMatches);
                } else {
                    setMatches(initialMatches);
                    saveData(matchesPath, initialMatches);
                }
                setIsLoading(false);
            })
        );

        // Подписка на settings (турнир-специфичные)
        unsubscribers.push(
            subscribeToData(settingsPath, (data) => {
                if (data) {
                    // Мержим загруженные настройки с дефолтными значениями
                    const defaultSettings = {
                        useTotalPointsForTie: true,
                        groupSetPointLimit: 20,
                        groupWinDifference: 1,
                        playoffSetPointLimit: 25,
                        playoffWinDifference: 2
                    };
                    setTournamentSettings({ ...defaultSettings, ...data });
                }
            })
        );

        // Подписка на language (глобальный)
        unsubscribers.push(
            subscribeToData(GLOBAL_PATHS.language, (data) => {
                if (data) {
                    setLanguage(data);
                }
            })
        );

        // Отписка при размонтировании или смене турнира
        return () => {
            unsubscribers.forEach(unsub => {
                if (typeof unsub === 'function') unsub();
            });
        };
    }, [currentTournament]); // Переподписка при смене турнира!

    // --- Эффект для сохранения в Firebase при изменении данных ---
    const saveToFirebase = useCallback(async (path, data) => {
        setIsSaving(true);
        await saveData(path, data);
        setIsSaving(false);
    }, []);

    // Ref для отслеживания первой загрузки (чтобы не сохранять при инициализации)
    const isInitialLoad = React.useRef(true);

    // Автосохранение matches в Firebase (динамический путь)
    // Используем ref для хранения таймера, чтобы не отменять при быстрых изменениях
    const saveMatchesRef = React.useRef(null);
    useEffect(() => {
        if (isInitialLoad.current) return;
        // Очищаем предыдущий таймер
        if (saveMatchesRef.current) clearTimeout(saveMatchesRef.current);
        // Сохраняем немедленно (без debounce для надёжности)
        saveData(getTournamentPath(currentTournament, 'matches'), matches);
    }, [matches, currentTournament]);

    // Автосохранение teams в Firebase (динамический путь)
    useEffect(() => {
        if (isInitialLoad.current) return;
        const timer = setTimeout(() => {
            saveData(getTournamentPath(currentTournament, 'teams'), teams);
        }, 500);
        return () => clearTimeout(timer);
    }, [teams, currentTournament]);

    // Автосохранение settings в Firebase (динамический путь)
    useEffect(() => {
        if (isInitialLoad.current) return;
        saveData(getTournamentPath(currentTournament, 'settings'), tournamentSettings);
    }, [tournamentSettings, currentTournament]);

    // Автосохранение language в Firebase (глобальный путь)
    useEffect(() => {
        if (isInitialLoad.current) return;
        saveData(GLOBAL_PATHS.language, language);
    }, [language]);

    // Сброс флага первой загрузки после инициализации
    useEffect(() => {
        if (!isLoading) {
            isInitialLoad.current = false;
        }
    }, [isLoading]);

    // --- Пересчет статистики команд ---
    const recalculateAllTeamStats = useCallback((currentMatches) => {
        // console.log("Recalculating team stats...");
        setTeams(prevTeams => { // Используем функциональное обновление для prevTeams
            let calculatedTeams = initialTeams.map(initialTeam => ({
                ...initialTeam, // Сброс статистики к начальным значениям
                points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0, ballsWon: 0, ballsLost: 0
            }));

            const completedGroupMatches = currentMatches.filter(m =>
                m.round === 'group' &&
                (m.status === 'completed' || m.status === 'completed_by_points' || m.winner !== null) &&
                m.team1 && m.team2 // Убедимся, что команды определены
            );

            completedGroupMatches.forEach(match => {
                const team1Index = calculatedTeams.findIndex(t => t.code === match.team1);
                const team2Index = calculatedTeams.findIndex(t => t.code === match.team2);
                if (team1Index === -1 || team2Index === -1) return;

                let team1 = { ...calculatedTeams[team1Index] }; // Копируем для изменения
                let team2 = { ...calculatedTeams[team2Index] };
                let team1SetsWonCount = 0;
                let team2SetsWonCount = 0;

                // Подсчет выигранных сетов в этом матче
                if (isSetCompleted(match.set1Team1, match.set1Team2, false, false, tournamentSettings.groupSetPointLimit, tournamentSettings.groupWinDifference)) {
                    match.set1Team1 > match.set1Team2 ? team1SetsWonCount++ : team2SetsWonCount++;
                }
                if (isSetCompleted(match.set2Team1, match.set2Team2, false, false, tournamentSettings.groupSetPointLimit, tournamentSettings.groupWinDifference)) {
                    match.set2Team1 > match.set2Team2 ? team1SetsWonCount++ : team2SetsWonCount++;
                }
                // Тай-брейк в группе учитывается только если он был сыгран и завершен
                const wasTie = team1SetsWonCount === 1 && team2SetsWonCount === 1;
                if (wasTie && match.status !== 'completed_by_points' && isSetCompleted(match.set3Team1, match.set3Team2, false, true, tournamentSettings.groupSetPointLimit, tournamentSettings.groupWinDifference)) {
                    match.set3Team1 > match.set3Team2 ? team1SetsWonCount++ : team2SetsWonCount++;
                }

                // Начисление очков и статистики W/L
                if (match.winner === team1.code) {
                    team1.points += (team1SetsWonCount === 2 && team2SetsWonCount === 0) ? 3 : 2;
                    team2.points += (team1SetsWonCount === 2 && team2SetsWonCount === 0) ? 0 : 1;
                    team1.wins++; team2.losses++;
                } else if (match.winner === team2.code) {
                    team2.points += (team2SetsWonCount === 2 && team1SetsWonCount === 0) ? 3 : 2;
                    team1.points += (team2SetsWonCount === 2 && team1SetsWonCount === 0) ? 0 : 1;
                    team2.wins++; team1.losses++;
                }

                // Обновление статистики сетов
                team1.setsWon += team1SetsWonCount; team1.setsLost += team2SetsWonCount;
                team2.setsWon += team2SetsWonCount; team2.setsLost += team1SetsWonCount;

                // Обновление статистики мячей (míčů) - сумма всех очков во всех сетах
                const team1Balls = (match.set1Team1 || 0) + (match.set2Team1 || 0) + (match.set3Team1 || 0);
                const team2Balls = (match.set1Team2 || 0) + (match.set2Team2 || 0) + (match.set3Team2 || 0);
                team1.ballsWon += team1Balls; team1.ballsLost += team2Balls;
                team2.ballsWon += team2Balls; team2.ballsLost += team1Balls;

                calculatedTeams[team1Index] = team1;
                calculatedTeams[team2Index] = team2;
            });
            // Сравниваем, изменились ли данные команд, чтобы избежать лишнего ререндера
            if (JSON.stringify(calculatedTeams) === JSON.stringify(prevTeams)) {
                return prevTeams;
            }
            return calculatedTeams;
        });
    }, [tournamentSettings.groupSetPointLimit, tournamentSettings.groupWinDifference]); // Зависит от настроек группы

    // --- Автоматическое обновление плей-офф (только команды и статус) ---
    const updatePlayoffTeams = useCallback(() => {
        setMatches(prevMatches => {
            // *** НОВОЕ: Подсчет завершенных групповых матчей ***
            const completedGroupMatches = prevMatches.filter(m =>
                m.round === 'group' &&
                (m.status === 'completed' || m.status === 'completed_by_points')
            );
            const completedGroupMatchesCount = completedGroupMatches.length;
            const requiredMatchesBeforePlayoff = 10; // Половина от 20 групповых матчей

            let changed = false; // Флаг, указывающий были ли изменения

            // *** НОВОЕ: Проверка условия для заполнения плей-офф ***
            if (completedGroupMatchesCount < requiredMatchesBeforePlayoff) {
                // Если сыграно недостаточно матчей, сбрасываем плей-офф в ожидание
                // console.log(`Playoff update skipped: Only ${completedGroupMatchesCount}/${requiredMatchesBeforePlayoff} group matches completed.`);
                const resetMatches = prevMatches.map(match => {
                    // Сбрасываем только матчи плей-офф, если они не пустые
                    if (match.round !== 'group' && (match.team1 !== null || match.team2 !== null || match.status !== 'waiting')) {
                        changed = true; // Отмечаем, что было изменение
                        return {
                            ...match,
                            team1: null,
                            team2: null,
                            refereeTeamCode: null,
                            status: 'waiting',
                            // Также сбрасываем счет и победителя
                            set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null
                        };
                    }
                    return match; // Оставляем как есть (групповые или уже пустые плей-офф)
                });
                // Возвращаем новый массив только если были сбросы
                return changed ? resetMatches : prevMatches;
            }

            // *** СТАРАЯ ЛОГИКА (выполняется, если сыграно достаточно матчей) ***
            // console.log(`Updating playoffs: ${completedGroupMatchesCount}/${requiredMatchesBeforePlayoff} group matches completed.`);

            // 1. Ранжирование (на основе текущих 'teams')
            const groupLetters = ['A', 'B'];
            const groupRankings = {};
            groupLetters.forEach(group => {
                const teamsInGroup = teams.filter(t => t.group === group);
                groupRankings[group] = sortTeamsByRank(teamsInGroup);
            });
            const getRankedTeamCode = (group, rank) => groupRankings[group]?.[rank - 1]?.code || null;

            // 2. Обновление матчей плей-офф
            const updatedMatchesArray = prevMatches.map(match => {
                if (match.round === 'group') return match;

                const currentTeam1 = match.team1;
                const currentTeam2 = match.team2;
                const currentStatus = match.status;
                const currentReferee = match.refereeTeamCode;

                let newTeam1Code = null;
                let newTeam2Code = null;

                // Определение команд для финальных матчей
                switch (match.id) {
                    // Финальные матчи - топ-3 из каждой группы
                    case 'F-1A-1B': newTeam1Code = getRankedTeamCode('A', 1); newTeam2Code = getRankedTeamCode('B', 1); break;
                    case 'F3-2A-2B': newTeam1Code = getRankedTeamCode('A', 2); newTeam2Code = getRankedTeamCode('B', 2); break;
                    case 'F5-3A-3B': newTeam1Code = getRankedTeamCode('A', 3); newTeam2Code = getRankedTeamCode('B', 3); break;
                    default: return match;
                }

                const teamsDetermined = !!(newTeam1Code && newTeam2Code);
                const newStatus = teamsDetermined ? 'not_started' : 'waiting';
                const teamsChanged = currentTeam1 !== newTeam1Code || currentTeam2 !== newTeam2Code;
                const statusChanged = currentStatus !== newStatus;
                // Сбрасываем судью плей-офф, если команды изменились (т.к. выбор ручной)
                const newRefereeCode = teamsChanged ? null : currentReferee;
                const refereeMaybeChanged = currentReferee !== newRefereeCode;

                if (teamsChanged || statusChanged || refereeMaybeChanged) {
                    if (!changed) changed = true; // Отмечаем, что были изменения
                    return {
                        ...match,
                        team1: newTeam1Code,
                        team2: newTeam2Code,
                        status: newStatus,
                        refereeTeamCode: newRefereeCode,
                        ...(teamsChanged && {
                            set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null
                        })
                    };
                }
                return match; // Нет изменений для этого матча
            });

            // Возвращаем новый массив только если были изменения
            return changed ? updatedMatchesArray : prevMatches;
        }); // Конец setMatches
    }, [teams, setMatches]); // Зависит от teams и setMatches

    // --- Обновление счета матча ---
    const updateMatchScore = useCallback((matchId, set, team, scoreStr) => {
        const score = parseInt(scoreStr);

        // Находим матч для определения типа (группа или плей-офф)
        setMatches(prevMatches =>
            prevMatches.map(m => {
                if (m.id === matchId) {
                    const isPlayoff = m.round !== 'group';
                    const setPointLimit = isPlayoff ? tournamentSettings.playoffSetPointLimit : tournamentSettings.groupSetPointLimit;

                    let maxScore;
                    if (set === 3) {
                        maxScore = 20; // max для тай-брейка
                    } else {
                        maxScore = (setPointLimit || 25) + 15;
                    }

                    const validScore = isNaN(score) || score < 0 ? 0 : Math.min(score, maxScore);
                    return { ...m, [`set${set}${team === 'team1' ? 'Team1' : 'Team2'}`]: validScore };
                }
                return m;
            })
        );
    }, [setMatches, tournamentSettings.playoffSetPointLimit, tournamentSettings.groupSetPointLimit]);

    // --- Проверка статуса всех матчей ---
    const checkAllMatchesStatus = useCallback(() => {
        setMatches(prevMatches => {
            let needsUpdate = false;
            const updatedMatches = prevMatches.map(match => {
                // Пропускаем матчи в ожидании команд
                if (match.status === 'waiting') return match;
                const { set1Team1, set1Team2, set2Team1, set2Team2, set3Team1, set3Team2 } = match;
                const allScoresZero = !(set1Team1 > 0 || set1Team2 > 0 || set2Team1 > 0 || set2Team2 > 0 || set3Team1 > 0 || set3Team2 > 0);

                // Сброс статуса, если все очки 0, а статус не 'not_started' или 'waiting'
                if (allScoresZero && match.status !== 'not_started' && match.status !== 'waiting') {
                    needsUpdate = true;
                    return { ...match, status: match.team1 && match.team2 ? 'not_started' : 'waiting', winner: null };
                }
                // Если уже not_started или waiting и все 0, не трогаем
                if (allScoresZero && (match.status === 'not_started' || match.status === 'waiting')) {
                    return match;
                }

                // Логика определения статуса и победителя
                const isFinal = match.round === 'final' || match.round === 'third_place' || match.round === 'fifth_place';
                const isPlayoff = match.round !== 'group';
                // Выбор настроек в зависимости от типа матча
                const setLimit = isPlayoff ? tournamentSettings.playoffSetPointLimit : tournamentSettings.groupSetPointLimit;
                const winDiff = isPlayoff ? tournamentSettings.playoffWinDifference : tournamentSettings.groupWinDifference;

                const set1Completed = isSetCompleted(set1Team1, set1Team2, false, false, setLimit, winDiff);
                const set2Completed = isSetCompleted(set2Team1, set2Team2, false, false, setLimit, winDiff);
                const needThirdSet = (set1Completed && set2Completed && (set1Team1 > set1Team2 !== set2Team1 > set2Team2)) || isFinal;
                const isThirdSetTiebreak = needThirdSet && !isFinal;
                const set3Relevant = needThirdSet || (set3Team1 ?? 0) > 0 || (set3Team2 ?? 0) > 0;
                const set3Completed = set3Relevant && isSetCompleted(set3Team1, set3Team2, isFinal, isThirdSetTiebreak, setLimit, winDiff);
                let team1Wins = 0, team2Wins = 0;
                if (set1Completed) (set1Team1 > set1Team2) ? team1Wins++ : team2Wins++;
                if (set2Completed) (set2Team1 > set2Team2) ? team1Wins++ : team2Wins++;
                if (set3Completed) (set3Team1 > set3Team2) ? team1Wins++ : team2Wins++;
                let newStatus = match.status; let newWinner = match.winner;

                if (team1Wins >= 2) { newStatus = 'completed'; newWinner = match.team1; }
                else if (team2Wins >= 2) { newStatus = 'completed'; newWinner = match.team2; }
                else if (set1Completed && set2Completed && team1Wins === 1 && team2Wins === 1) {
                    if (isFinal) {
                        if (set3Completed) { newStatus = 'completed'; newWinner = (set3Team1 > set3Team2) ? match.team1 : match.team2; }
                        else if ((set3Team1 ?? 0) > 0 || (set3Team2 ?? 0) > 0) { newStatus = 'in_progress'; newWinner = null; }
                        else { newStatus = 'tie_needs_tiebreak'; newWinner = null; }
                    } else {
                        if (tournamentSettings.useTotalPointsForTie) {
                            const t1Pts = (set1Team1 ?? 0) + (set2Team1 ?? 0); const t2Pts = (set1Team2 ?? 0) + (set2Team2 ?? 0);
                            if (t1Pts > t2Pts) { newStatus = 'completed_by_points'; newWinner = match.team1; }
                            else if (t2Pts > t1Pts) { newStatus = 'completed_by_points'; newWinner = match.team2; }
                            else { // Tiebreak needed
                                if (set3Completed) { newStatus = 'completed'; newWinner = (set3Team1 > set3Team2) ? match.team1 : match.team2; }
                                else if ((set3Team1 ?? 0) > 0 || (set3Team2 ?? 0) > 0) { newStatus = 'in_progress'; newWinner = null; }
                                else { newStatus = 'tie_needs_tiebreak'; newWinner = null; }
                            }
                        } else { // Always tiebreak
                            if (set3Completed) { newStatus = 'completed'; newWinner = (set3Team1 > set3Team2) ? match.team1 : match.team2; }
                            else if ((set3Team1 ?? 0) > 0 || (set3Team2 ?? 0) > 0) { newStatus = 'in_progress'; newWinner = null; }
                            else { newStatus = 'tie_needs_tiebreak'; newWinner = null; }
                        }
                    }
                } else if (!allScoresZero) { // Если есть очки, но не завершен и не 1:1
                    newStatus = 'in_progress'; newWinner = null;
                } else { // Все очки 0
                    newStatus = match.team1 && match.team2 ? 'not_started' : 'waiting'; newWinner = null;
                }

                if (newStatus !== match.status || newWinner !== match.winner) {
                    needsUpdate = true; return { ...match, status: newStatus, winner: newWinner };
                }
                return match;
            });
            return needsUpdate ? updatedMatches : prevMatches;
        });
    }, [tournamentSettings.useTotalPointsForTie, tournamentSettings.groupSetPointLimit, tournamentSettings.groupWinDifference, tournamentSettings.playoffSetPointLimit, tournamentSettings.playoffWinDifference, setMatches]); // Зависит от всех настроек

    // --- Обработчики настроек, языка, сброса матча ---
    const handleSettingsChange = useCallback((newSettingValue) => {
        const newSettings = { ...tournamentSettings, useTotalPointsForTie: newSettingValue };
        setTournamentSettings(newSettings);
        // Статус матчей обновится через useEffect
    }, [tournamentSettings, setTournamentSettings]);

    const changeLanguage = useCallback((lang) => {
        if (translations[lang]) { setLanguage(lang); } else { setLanguage('cs'); }
    }, [setLanguage]);

    const resetMatch = useCallback((matchId) => {
        setMatches(prevMatches => {
            const matchIndex = prevMatches.findIndex(m => m.id === matchId);
            if (matchIndex === -1) return prevMatches;

            const initialMatch = initialMatches.find(im => im.id === matchId);
            const matchToReset = prevMatches[matchIndex];

            const originalStatus = initialMatch
                ? (matchToReset.team1 && matchToReset.team2 ? 'not_started' : 'waiting') // Статус зависит от наличия команд в ТЕКУЩЕМ состоянии
                : 'not_started';

            // Сбрасываем счет, победителя, статус.
            // Судью плей-офф НЕ сбрасываем, пользователь выбрал его вручную.
            // Судью группы восстанавливаем из initialMatches, если он пропал.
            const refereeToKeep = matchToReset.round !== 'group'
                ? matchToReset.refereeTeamCode // Сохраняем ручной выбор для плей-офф
                : (initialMatch?.refereeTeamCode || matchToReset.refereeTeamCode); // Восстанавливаем/сохраняем для группы

            const updatedMatch = {
                ...matchToReset,
                set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0,
                winner: null,
                status: originalStatus,
                refereeTeamCode: refereeToKeep
            };

            const newMatches = [...prevMatches];
            newMatches[matchIndex] = updatedMatch;
            return newMatches;
        });
        // Закрываем модальное окно
        setSelectedMatch(null);
        setView('matches');
    }, [setMatches, setSelectedMatch, setView /* initialMatches - константа */]);

    // --- Обработчик редактирования деталей матча (корт, время, судья) ---
    const updateMatchDetails = useCallback((matchId, field, value) => {
        setMatches(prevMatches =>
            prevMatches.map(m => {
                if (m.id === matchId) {
                    return { ...m, [field]: value || null };
                }
                return m;
            })
        );
    }, [setMatches]);

    // --- Главные useEffect для запуска логики ---
    useEffect(() => {
        checkAllMatchesStatus();
    }, [matches, tournamentSettings.useTotalPointsForTie, checkAllMatchesStatus]);

    useEffect(() => {
        recalculateAllTeamStats(matches);
    }, [matches, recalculateAllTeamStats]);

    useEffect(() => {
        // Автоматически обновляем только команды плей-офф
        updatePlayoffTeams();
    }, [teams, matches, updatePlayoffTeams]); // updatePlayoffTeams зависит от teams, setMatches

    // --- Рендер-функции ---

    // Компонент MatchRow (без изменений)
    const MatchRow = React.memo(({ match, teams, t, onRowClick }) => {
        const team1 = teams.find(tm => tm.code === match.team1);
        const team2 = teams.find(tm => tm.code === match.team2);
        const refereeTeam = teams.find(tm => tm.code === match.refereeTeamCode);
        const team1Name = team1?.name || (match.round !== 'group' && match.team1 ? `...` : t.tbd);
        const team2Name = team2?.name || (match.round !== 'group' && match.team2 ? `...` : t.tbd);
        const refereeName = refereeTeam?.name || (match.refereeTeamCode ? `(${t.refereeTBD || '???'})` : (match.round !== 'group' ? `(${t.selectRefereePlaceholder || 'Не назначен'})` : (t.refereeTBD || '???'))); // Уточняем плейсхолдер

        let statusIcon, statusClass, statusText; const currentStatus = match.status || 'unknown'; statusText = t.statusNames?.[currentStatus] || currentStatus;
        if (currentStatus === 'completed') { statusIcon = <FaCheck className="mr-1 text-green-500" />; statusClass = 'text-green-600 font-semibold'; } else if (currentStatus === 'completed_by_points') { statusIcon = <FaCheck className="mr-1 text-blue-500" />; statusClass = 'text-blue-600 font-semibold'; } else if (currentStatus === 'tie_needs_tiebreak') { statusIcon = <FaExclamationTriangle className="mr-1 text-red-500" />; statusClass = 'text-red-600 font-semibold'; } else if (currentStatus === 'in_progress') { statusIcon = <FaRegClock className="mr-1 text-yellow-600 animate-spin" style={{ animationDuration: '2s' }} />; statusClass = 'text-yellow-700 font-semibold'; } else if (currentStatus === 'waiting') { statusIcon = <FaRegClock className="mr-1 text-gray-400" />; statusClass = 'text-gray-500'; } else { statusIcon = <FaRegClock className="mr-1 text-gray-500" />; statusClass = 'text-gray-600'; }
        let roundClass = 'px-2 py-1 rounded text-xs font-semibold inline-block'; const currentRound = match.round || 'unknown'; const roundText = t.roundNames?.[currentRound] || currentRound;
        if (currentRound === 'group') { roundClass += ' bg-[#C1CBA7]/50 text-[#06324F]'; } else if (currentRound === 'quarterfinal') { roundClass += ' bg-[#0B8E8D]/20 text-[#0B8E8D]'; } else if (currentRound === 'semifinal') { roundClass += ' bg-[#06324F]/20 text-[#06324F]'; } else if (currentRound === 'third_place') { roundClass += ' bg-orange-100 text-orange-700'; } else if (currentRound === 'final') { roundClass += ' bg-[#FDD80F]/20 text-[#FDD80F]/90'; } else { roundClass += ' bg-gray-200 text-gray-700'; }
        const isFinal = currentRound === 'final' || currentRound === 'third_place' || currentRound === 'fifth_place';
        const isPlayoff = currentRound !== 'group';
        const setLimit = isPlayoff ? tournamentSettings.playoffSetPointLimit : tournamentSettings.groupSetPointLimit;
        const winDiff = isPlayoff ? tournamentSettings.playoffWinDifference : tournamentSettings.groupWinDifference;
        const set1Completed = isSetCompleted(match.set1Team1, match.set1Team2, false, false, setLimit, winDiff);
        const set2Completed = isSetCompleted(match.set2Team1, match.set2Team2, false, false, setLimit, winDiff);
        const team1SetWins = (set1Completed && match.set1Team1 > match.set1Team2 ? 1 : 0) + (set2Completed && match.set2Team1 > match.set2Team2 ? 1 : 0);
        const team2SetWins = (set1Completed && match.set1Team1 < match.set1Team2 ? 1 : 0) + (set2Completed && match.set2Team1 < match.set2Team2 ? 1 : 0);
        const showThirdSet = isFinal || currentStatus === 'tie_needs_tiebreak' || (set1Completed && set2Completed && team1SetWins === 1 && team2SetWins === 1) || (match.set3Team1 ?? 0) > 0 || (match.set3Team2 ?? 0) > 0;
        const canOpenDetail = !!(match.team1 && match.team2);
        const isTeam1Winner = match.winner && team1 && match.winner === team1.code;
        const isTeam2Winner = match.winner && team2 && match.winner === team2.code;

        return (
            <tr key={match.id} className={`border-b transition-colors duration-150 ease-in-out ${canOpenDetail ? 'hover:bg-[#0B8E8D]/10 cursor-pointer' : 'opacity-70 cursor-not-allowed'}`} onClick={canOpenDetail ? () => onRowClick(match) : undefined}>
                <td className="p-2 text-sm md:text-base"><span className={roundClass}>{roundText}</span></td>
                <td className="p-2 text-sm md:text-base font-medium"><span className={isTeam1Winner ? 'font-bold text-indigo-800' : ''}>{team1Name}</span><span className="text-gray-400 mx-1">vs</span><span className={isTeam2Winner ? 'font-bold text-indigo-800' : ''}>{team2Name}</span></td>
                <td className="p-2 text-sm md:text-base text-center">{match.court}</td>
                <td className="p-2 text-sm md:text-base text-gray-700 text-center"><div className="flex items-center justify-center"><FaCalendarAlt className="mr-1 text-indigo-500" />{match.time}</div></td>
                {/* Отображаем имя судьи (для плей-офф будет показан плейсхолдер, если не выбран) */}
                <td className="p-2 text-sm md:text-base text-gray-600"><div className="flex items-center"><FaBullhorn className={`mr-1 ${match.round !== 'group' && !match.refereeTeamCode ? 'text-red-400 animate-pulse' : 'text-gray-400'} flex-shrink-0`} title={match.round !== 'group' && !match.refereeTeamCode ? t.refereeNotAssignedTooltip || 'Судья не назначен!' : ''} /><span className={match.round !== 'group' && !match.refereeTeamCode ? 'text-red-600' : ''}>{refereeName}</span></div></td>
                <td className="p-2 text-sm md:text-base font-bold text-center">{match.set1Team1 ?? 0}-{match.set1Team2 ?? 0}</td>
                <td className="p-2 text-sm md:text-base font-bold text-center">{match.set2Team1 ?? 0}-{match.set2Team2 ?? 0}</td>
                <td className={`p-2 text-sm md:text-base font-bold text-center ${!showThirdSet ? 'text-gray-400' : ''}`}>{showThirdSet ? `${match.set3Team1 ?? 0}-${match.set3Team2 ?? 0}` : '-'}</td>
                <td className={`p-2 text-sm md:text-base ${statusClass}`}><div className="flex items-center">{statusIcon}{statusText}</div></td>
            </tr>
        );
    });

    // Рендер списка матчей (кнопка обновления удалена)
    const renderMatches = useCallback(() => {
        const sortedMatches = [...matches].sort((a, b) => {
            const timeA = a.time || "99:99"; const timeB = b.time || "99:99";
            const timeCompare = timeA.localeCompare(timeB);
            if (timeCompare !== 0) return timeCompare;
            return (a.court || 99) - (b.court || 99);
        });
        const handleRowClick = (match) => { setView('matchDetail'); setSelectedMatch(match); };

        return (
            <div className="p-4 overflow-x-auto">
                {/* Заголовок без кнопки обновления */}
                <div className="flex justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-indigo-700 flex items-center">
                        <FaVolleyballBall className="mr-3 text-indigo-600" />
                        <span>{t.matches}</span>
                    </h2>
                    {/* Кнопка ручного обновления УДАЛЕНА */}
                </div>
                {/* Таблица матчей */}
                {matches.length === 0 && <p className="text-center p-4">{t.noMatches || 'Матчи не найдены.'}</p>}
                {matches.length > 0 && (
                    <div className="bg-gradient-to-r from-[#C1CBA7] to-[#0B8E8D]/10 p-4 md:p-6 rounded-xl shadow-lg">
                        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                            <thead className="bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white">
                                {/* ... Заголовки таблицы ... */}
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm md:text-base">{t.round}</th>
                                    <th className="py-3 px-4 text-left text-sm md:text-base">{t.match}</th>
                                    <th className="py-3 px-4 text-center text-sm md:text-base">{t.court}</th>
                                    <th className="py-3 px-4 text-center text-sm md:text-base">{t.time}</th>
                                    <th className="py-3 px-4 text-left text-sm md:text-base">{t.referee || 'Судья'}</th>
                                    <th className="py-3 px-4 text-center text-sm md:text-base">{t.set1}</th>
                                    <th className="py-3 px-4 text-center text-sm md:text-base">{t.set2}</th>
                                    <th className="py-3 px-4 text-center text-sm md:text-base">{t.set3}</th>
                                    <th className="py-3 px-4 text-left text-sm md:text-base">{t.status}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedMatches.map(match => (
                                    <MatchRow key={match.id} match={match} teams={teams} t={t} onRowClick={handleRowClick} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
        // Зависимость forceUpdatePlayoffTeams удалена
    }, [matches, teams, t, setView, setSelectedMatch]);

    // Рендер групп (без изменений)
    const renderGroups = useCallback(() => {
        // ... (JSX без изменений, использует sortTeamsByRank)
        return (
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center"><FaUsers className="mr-3 text-indigo-600" /><span>{t.groups}</span></h2>
                {teams.length === 0 && <p className="text-center p-4">{t.noTeams || 'Команды не найдены.'}</p>}
                {teams.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {['A', 'B'].map(group => {
                            const groupColors = { 'A': { bg: 'from-[#C1CBA7] to-[#0B8E8D]', lightBg: 'from-[#C1CBA7]/20 to-[#0B8E8D]/10', text: 'text-blue-700', border: 'border-blue-200' }, 'B': { bg: 'from-[#06324F] to-[#0B8E8D]', lightBg: 'from-[#06324F]/10 to-[#0B8E8D]/10', text: 'text-purple-700', border: 'border-purple-200' }, 'C': { bg: 'from-[#FDD80F] to-[#0B8E8D]', lightBg: 'from-[#FDD80F]/10 to-[#0B8E8D]/10', text: 'text-green-700', border: 'border-green-200' } };
                            const colors = groupColors[group] || groupColors['A'];
                            const groupTeams = teams.filter(tm => tm.group === group);
                            const sortedGroupTeams = sortTeamsByRank(groupTeams);
                            return (
                                <div key={group} className={`bg-gradient-to-r ${colors.lightBg} rounded-xl shadow-lg overflow-hidden`}>
                                    <div className={`bg-gradient-to-r ${colors.bg} p-4 text-white`}><h3 className="text-xl font-bold flex items-center"><FaTable className="mr-2" /> {t.group} {group}</h3></div>
                                    <div className="p-4 overflow-x-auto">
                                        {groupTeams.length === 0 ? <p className="text-center text-gray-500 py-4">{t.noTeamsInGroup || 'Нет команд'}</p> : (
                                            <table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="p-3 text-left text-sm md:text-base font-semibold text-gray-700">{t.team}</th>
                                                        <th className="p-3 text-center text-sm md:text-base font-semibold text-gray-700">{t.points}</th>
                                                        <th className="p-3 text-center text-sm md:text-base font-semibold text-gray-700" title={t.winsLosses || 'Победы/Поражения'}>{t.winsLossesShort || 'В/П'}</th>
                                                        <th className="p-3 text-center text-sm md:text-base font-semibold text-gray-700" title={t.sets || 'Сеты'}>{t.setsShort || 'С'}</th>
                                                        <th className="p-3 text-center text-sm md:text-base font-semibold text-gray-700" title={t.setsDifference || 'Разница сетов'}>{t.setsDiffShort || 'Р'}</th>
                                                        <th className="p-3 text-center text-sm md:text-base font-semibold text-gray-700" title={t.balls || 'Míčů'}>{t.ballsShort || 'М'}</th>
                                                        <th className="p-3 text-center text-sm md:text-base font-semibold text-gray-700" title={t.ballsDifference || 'Разница мячей'}>{t.ballsDiffShort || 'РМ'}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sortedGroupTeams.map((team, index) => {
                                                        const rank = index + 1; let rowClass = `border-b ${colors.border} hover:bg-gray-50 transition-colors duration-150`; let rankIcon = null;
                                                        if (rank === 1) { rowClass += ' bg-green-50 font-bold'; rankIcon = <FaTrophy className="inline mr-2 text-yellow-500" />; } else if (rank === 2) { rowClass += ' bg-green-50'; rankIcon = <FaTrophy className="inline mr-2 text-gray-400" />; } else if (rank === 3 && (group === 'A' || group === 'B' || group === 'C')) { rankIcon = <FaTrophy className="inline mr-2 text-orange-400" />; }
                                                        return (
                                                            <tr key={team.code} className={rowClass}>
                                                                <td className="p-3 text-sm md:text-base">{rankIcon}{team.name}</td>
                                                                <td className="p-3 text-sm md:text-base text-center"><span className="inline-block w-8 h-8 rounded-full bg-[#0B8E8D]/20 text-[#06324F] font-bold flex items-center justify-center">{team.points || 0}</span></td>
                                                                <td className="p-3 text-sm md:text-base text-center">{team.wins || 0}/{team.losses || 0}</td>
                                                                <td className="p-3 text-sm md:text-base text-center"><span className="font-semibold text-green-600">{team.setsWon || 0}</span><span className="mx-1 text-gray-400">:</span><span className="font-semibold text-red-600">{team.setsLost || 0}</span></td>
                                                                <td className={`p-3 text-sm md:text-base text-center font-semibold ${(team.setsWon - team.setsLost) > 0 ? 'text-green-700' : (team.setsWon - team.setsLost) < 0 ? 'text-red-700' : 'text-gray-600'}`}>{(team.setsWon - team.setsLost) > 0 ? '+' : ''}{team.setsWon - team.setsLost || 0}</td>
                                                                <td className="p-3 text-sm md:text-base text-center"><span className="text-green-600">{team.ballsWon || 0}</span><span className="mx-1 text-gray-400">:</span><span className="text-red-600">{team.ballsLost || 0}</span></td>
                                                                <td className={`p-3 text-sm md:text-base text-center font-semibold ${((team.ballsWon || 0) - (team.ballsLost || 0)) > 0 ? 'text-green-700' : ((team.ballsWon || 0) - (team.ballsLost || 0)) < 0 ? 'text-red-700' : 'text-gray-600'}`}>{((team.ballsWon || 0) - (team.ballsLost || 0)) > 0 ? '+' : ''}{(team.ballsWon || 0) - (team.ballsLost || 0)}</td>
                                                            </tr>);
                                                    })}
                                                </tbody>
                                            </table>)}
                                        {groupTeams.length > 0 && (
                                            <div className="mt-3 px-2 text-xs md:text-sm text-gray-600 border-t border-gray-200 pt-2">
                                                <div className="flex flex-wrap gap-x-3 gap-y-1">
                                                    <span><strong>{t.winsLossesShort || 'В/П'}:</strong> {t.winsLosses || 'Победы/Поражения'}</span>
                                                    <span><strong>{t.setsShort || 'С'}:</strong> {t.sets || 'Сеты'}</span>
                                                    <span><strong>{t.setsDiffShort || 'Р'}:</strong> {t.setsDifference || 'Разница сетов'}</span>
                                                    <span><strong>{t.ballsShort || 'М'}:</strong> {t.balls || 'Мячи'}</span>
                                                    <span><strong>{t.ballsDiffShort || 'РМ'}:</strong> {t.ballsDifference || 'Разница мячей'}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>);
                        })}
                    </div>)}
            </div>);
    }, [teams, t]); // Зависит от teams и t

    // Рендер деталей матча (добавлен выбор судьи)
    const renderMatchDetail = useCallback(() => {
        const currentMatchData = selectedMatch ? matches.find(m => m.id === selectedMatch.id) : null;
        if (!currentMatchData) {
            if (selectedMatch) setSelectedMatch(null); if (view === 'matchDetail') setView('matches'); return null;
        }
        const team1 = teams.find(t => t.code === currentMatchData.team1) || { name: t.tbd };
        const team2 = teams.find(t => t.code === currentMatchData.team2) || { name: t.tbd };
        const currentRefereeTeam = teams.find(t => t.code === currentMatchData.refereeTeamCode);
        // Обновляем отображение имени судьи для плейсхолдера
        const currentRefereeName = currentRefereeTeam?.name || (currentMatchData.refereeTeamCode ? `(${t.refereeTBD || '???'})` : `(${t.selectRefereePlaceholder || 'Не назначен'})`);

        const currentRound = currentMatchData.round || 'unknown';
        const isPlayoffMatch = currentRound !== 'group';
        const teamsAreSet = !!(currentMatchData.team1 && currentMatchData.team2);
        const availableReferees = teams.filter(t => t.code !== currentMatchData.team1 && t.code !== currentMatchData.team2);

        // Логика статусов/раундов/3го сета - без изменений
        let roundClass = 'px-3 py-1 rounded-full text-sm font-semibold inline-block mb-3'; let roundIcon; const roundText = t.roundNames?.[currentRound] || currentRound; if (currentRound === 'group') { roundClass += ' bg-[#C1CBA7]/50 text-[#06324F]'; roundIcon = <FaUsers className="mr-2" />; } else if (currentRound === 'quarterfinal') { roundClass += ' bg-[#0B8E8D]/20 text-[#0B8E8D]'; roundIcon = <FaChartBar className="mr-2" />; } else if (currentRound === 'semifinal') { roundClass += ' bg-[#06324F]/20 text-[#06324F]'; roundIcon = <FaChartBar className="mr-2" />; } else if (currentRound === 'third_place') { roundClass += ' bg-orange-100 text-orange-700'; roundIcon = <FaTrophy className="mr-2" />; } else if (currentRound === 'final') { roundClass += ' bg-[#FDD80F]/20 text-[#FDD80F]/90'; roundIcon = <FaTrophy className="mr-2" />; } else { roundClass += ' bg-gray-200 text-gray-700'; roundIcon = <FaVolleyballBall className="mr-2" />; }
        let statusClass = 'px-3 py-1 rounded-full text-sm font-semibold inline-block ml-2'; let statusIcon; const currentStatus = currentMatchData.status || 'unknown'; const statusText = t.statusNames?.[currentStatus] || currentStatus; if (currentStatus === 'completed') { statusClass += ' bg-green-100 text-green-800'; statusIcon = <FaCheck className="mr-2" />; } else if (currentStatus === 'completed_by_points') { statusClass += ' bg-blue-100 text-blue-800'; statusIcon = <FaCheck className="mr-2" />; } else if (currentStatus === 'tie_needs_tiebreak') { statusClass += ' bg-red-100 text-red-800'; statusIcon = <FaExclamationTriangle className="mr-2" />; } else if (currentStatus === 'in_progress') { statusClass += ' bg-yellow-100 text-yellow-800'; statusIcon = <FaRegClock className="mr-2 animate-spin" style={{ animationDuration: '2s' }} />; } else if (currentStatus === 'waiting') { statusClass += ' bg-gray-100 text-gray-500'; statusIcon = <FaRegClock className="mr-2" />; } else { statusClass += ' bg-gray-100 text-gray-800'; statusIcon = <FaRegClock className="mr-2" />; }
        const isFinal = currentRound === 'final' || currentRound === 'third_place' || currentRound === 'fifth_place'; const isPlayoff = currentRound !== 'group'; const setLimit = isPlayoff ? tournamentSettings.playoffSetPointLimit : tournamentSettings.groupSetPointLimit; const winDiff = isPlayoff ? tournamentSettings.playoffWinDifference : tournamentSettings.groupWinDifference; const set1Completed = isSetCompleted(currentMatchData.set1Team1, currentMatchData.set1Team2, false, false, setLimit, winDiff); const set2Completed = isSetCompleted(currentMatchData.set2Team1, currentMatchData.set2Team2, false, false, setLimit, winDiff); const isTieSituation = set1Completed && set2Completed && (currentMatchData.set1Team1 > currentMatchData.set1Team2 !== currentMatchData.set2Team1 > currentMatchData.set2Team2); const showThirdSetInput = isFinal || currentStatus === 'tie_needs_tiebreak' || isTieSituation || (currentMatchData.set3Team1 ?? 0) > 0 || (currentMatchData.set3Team2 ?? 0) > 0; const isThirdSetTiebreak = showThirdSetInput && (isFinal || currentStatus === 'tie_needs_tiebreak' || isTieSituation); const tiebreakScoreLimit = isFinal ? 15 : 5;

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
                        {/* Инфо о матче (раунд, статус, время, корт, СУДЬЯ) */}
                        <div className="flex flex-wrap justify-between items-start mb-6 gap-y-2">
                            <div className="flex items-center flex-wrap gap-2">
                                <span className={roundClass}><span className="flex items-center">{roundIcon}{roundText}</span></span>
                                <span className={statusClass}><span className="flex items-center">{statusIcon}{statusText}</span></span>
                            </div>
                            {/* Редактируемые поля: Корт, Время, Судья */}
                            <div className="bg-gray-50 p-3 rounded-lg space-y-3 w-full">
                                {/* Время */}
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                        <FaCalendarAlt className="mr-2 text-indigo-500" />
                                        {t.time || 'Время'}:
                                    </label>
                                    <input
                                        type="time"
                                        value={currentMatchData.time || ''}
                                        onChange={(e) => updateMatchDetails(currentMatchData.id, 'time', e.target.value)}
                                        className="p-2 border border-gray-300 rounded-lg text-center font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                {/* Корт */}
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                        <FaMapMarkerAlt className="mr-2 text-[#0B8E8D]" />
                                        {t.court || 'Корт'}:
                                    </label>
                                    <select
                                        value={currentMatchData.court || 1}
                                        onChange={(e) => updateMatchDetails(currentMatchData.id, 'court', parseInt(e.target.value))}
                                        className="p-2 border border-gray-300 rounded-lg font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value={1}>{t.court || 'Корт'} 1</option>
                                        <option value={2}>{t.court || 'Корт'} 2</option>
                                        <option value={3}>{t.court || 'Корт'} 3</option>
                                    </select>
                                </div>
                                {/* Судья */}
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                        <FaBullhorn className={`mr-2 ${!currentMatchData.refereeTeamCode ? 'text-red-400' : 'text-gray-400'}`} />
                                        {t.referee || 'Судья'}:
                                    </label>
                                    <select
                                        value={currentMatchData.refereeTeamCode || ""}
                                        onChange={(e) => updateMatchDetails(currentMatchData.id, 'refereeTeamCode', e.target.value)}
                                        className={`p-2 border rounded-lg font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[150px] ${!currentMatchData.refereeTeamCode ? 'border-red-300' : 'border-gray-300'}`}
                                    >
                                        <option value="">{t.selectRefereePlaceholder || '-- Не назначен --'}</option>
                                        {availableReferees.map(team => (
                                            <option key={team.code} value={team.code}>
                                                {team.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        {/* Команды с кнопкой смены сторон */}
                        <div className="bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 p-4 rounded-lg mb-6">
                            <div className="flex justify-between items-center">
                                <div className="text-center w-5/12">
                                    <div className="text-lg font-bold text-indigo-800">{isSwapped ? team2.name : team1.name}</div>
                                    <div className="text-xs text-gray-500">{isSwapped ? '← Справа' : '← Слева'}</div>
                                </div>
                                <div className="text-center w-2/12">
                                    <button
                                        onClick={() => setIsSwapped(!isSwapped)}
                                        className="p-2 bg-[#0B8E8D] text-white rounded-full hover:bg-[#06324F] transition-colors shadow-md"
                                        title={t.swapTeams || 'Поменять стороны'}
                                    >
                                        <FaExchangeAlt className="text-lg" />
                                    </button>
                                </div>
                                <div className="text-center w-5/12">
                                    <div className="text-lg font-bold text-indigo-800">{isSwapped ? team1.name : team2.name}</div>
                                    <div className="text-xs text-gray-500">{isSwapped ? 'Слева →' : 'Справа →'}</div>
                                </div>
                            </div>
                        </div>
                        {/* Поля ввода счета */}
                        <div className="space-y-4">
                            {/* Сет 1 */}
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t.set1}</label>
                                <div className="flex items-center justify-between">
                                    <input type="number" min="0" max="99" defaultValue={isSwapped ? (currentMatchData.set1Team2 ?? 0) : (currentMatchData.set1Team1 ?? 0)} key={`s1t1-${isSwapped}`} onBlur={(e) => updateMatchScore(currentMatchData.id, 1, isSwapped ? 'team2' : 'team1', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                    <span className="text-gray-400 text-xl font-bold">:</span>
                                    <input type="number" min="0" max="99" defaultValue={isSwapped ? (currentMatchData.set1Team1 ?? 0) : (currentMatchData.set1Team2 ?? 0)} key={`s1t2-${isSwapped}`} onBlur={(e) => updateMatchScore(currentMatchData.id, 1, isSwapped ? 'team1' : 'team2', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                            </div>
                            {/* Сет 2 */}
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t.set2}</label>
                                <div className="flex items-center justify-between">
                                    <input type="number" min="0" max="99" defaultValue={isSwapped ? (currentMatchData.set2Team2 ?? 0) : (currentMatchData.set2Team1 ?? 0)} key={`s2t1-${isSwapped}`} onBlur={(e) => updateMatchScore(currentMatchData.id, 2, isSwapped ? 'team2' : 'team1', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                    <span className="text-gray-400 text-xl font-bold">:</span>
                                    <input type="number" min="0" max="99" defaultValue={isSwapped ? (currentMatchData.set2Team1 ?? 0) : (currentMatchData.set2Team2 ?? 0)} key={`s2t2-${isSwapped}`} onBlur={(e) => updateMatchScore(currentMatchData.id, 2, isSwapped ? 'team1' : 'team2', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                            </div>
                            {/* Сет 3 / Тай-брейк */}
                            {showThirdSetInput && (
                                <div className={`bg-white p-4 rounded-lg shadow-sm border ${currentStatus === 'tie_needs_tiebreak' ? 'border-red-300' : 'border-gray-200'}`}>
                                    <label className={`block text-sm font-medium ${currentStatus === 'tie_needs_tiebreak' ? 'text-red-700' : 'text-gray-700'} mb-2`}>{isFinal ? t.set3 : t.tiebreak}{isThirdSetTiebreak && ` (${isFinal ? (t.finalTiebreakCondition || 'до 15') : (t.tiebreak_condition || 'до 5')})`}</label>
                                    <div className="flex items-center justify-between">
                                        <input type="number" min="0" max="99" defaultValue={isSwapped ? (currentMatchData.set3Team2 ?? 0) : (currentMatchData.set3Team1 ?? 0)} key={`s3t1-${isSwapped}`} onBlur={(e) => updateMatchScore(currentMatchData.id, 3, isSwapped ? 'team2' : 'team1', e.target.value)} className={`w-20 p-2 border rounded-lg text-center font-bold text-lg focus:ring-2 ${currentStatus === 'tie_needs_tiebreak' ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`} />
                                        <span className="text-gray-400 text-xl font-bold">:</span>
                                        <input type="number" min="0" max="99" defaultValue={isSwapped ? (currentMatchData.set3Team1 ?? 0) : (currentMatchData.set3Team2 ?? 0)} key={`s3t2-${isSwapped}`} onBlur={(e) => updateMatchScore(currentMatchData.id, 3, isSwapped ? 'team1' : 'team2', e.target.value)} className={`w-20 p-2 border rounded-lg text-center font-bold text-lg focus:ring-2 ${currentStatus === 'tie_needs_tiebreak' ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`} />
                                    </div>
                                    {currentStatus === 'tie_needs_tiebreak' && !isFinal && <p className="text-xs text-red-600 mt-2">{t.tiebreakInfo || `Введите счет тай-брейка (до ${tiebreakScoreLimit}, разница 2).`}</p>}
                                    {isFinal && showThirdSetInput && <p className="text-xs text-gray-500 mt-2">{t.finalTiebreakInfo || `Третий сет финала играется до ${tiebreakScoreLimit} (разница 2).`}</p>}
                                </div>
                            )}
                        </div>
                        {/* Кнопки действий */}
                        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                            <button onClick={() => resetMatch(currentMatchData.id)} className="w-full sm:w-auto bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-all duration-200 shadow-sm border border-red-200 flex items-center justify-center text-sm" title={t.resetMatchTooltip || "Сбросить счет и статус матча к начальным"}> <FaUndo className="mr-2" /> {t.resetMatch || 'Сбросить'} </button>
                            <button onClick={() => { setView('matches'); setSelectedMatch(null); }} className="w-full sm:w-auto bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white py-2 px-4 rounded-lg hover:opacity-90 transition-all duration-200 shadow-md flex items-center justify-center text-sm"> <FaCheck className="mr-2" /> {t.close || 'Закрыть'} </button>
                        </div>
                    </div>
                </div>
            </div>
        );
        // Добавили isSwapped, setIsSwapped, updateMatchDetails в зависимости
    }, [selectedMatch, matches, teams, t, updateMatchScore, setView, setSelectedMatch, resetMatch, updateMatchDetails, isSwapped, setIsSwapped]);

    // Рендер модального окна правил (без изменений)
    const renderRulesModal = useCallback(() => {
        // ... (JSX без изменений)
        return (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-start justify-center p-4 z-[60] backdrop-blur-sm overflow-y-auto">
                <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-4xl my-8 overflow-hidden">
                    {/* Шапка */}
                    <div className="bg-gradient-to-r from-[#0B8E8D] to-[#06324F] p-6 text-white sticky top-0 z-10">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold flex items-center"><FaGlobe className="mr-2" />{t.rules}</h2>
                            <div className="flex items-center space-x-2">
                                {Object.keys(languageNames).filter(lang => translations[lang]).map(lang => (<button key={lang} onClick={() => changeLanguage(lang)} className={`px-2 py-1 text-xs rounded transition-colors duration-150 ${language === lang ? 'bg-white text-[#0B8E8D] shadow-sm font-semibold' : 'bg-[#0B8E8D]/80 text-white hover:bg-[#0B8E8D]/90'}`} title={languageNames[lang]}>{lang.toUpperCase()}</button>))}
                                <button onClick={() => setShowRules(false)} className="text-white hover:text-[#FDD80F] transition-colors ml-4" title={t.close}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                            </div>
                        </div>
                    </div>
                    {/* Тело */}
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                        <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
                            <h4 className="text-lg font-semibold text-[#06324F] mb-3">{t.tieRules?.settingsTitle || "Настройки определения победителя (при 1:1 по сетам)"}</h4>
                            <div className="flex items-center space-x-3"><input type="checkbox" id="useTotalPointsForTie" checked={tournamentSettings.useTotalPointsForTie} onChange={(e) => handleSettingsChange(e.target.checked)} className="h-5 w-5 rounded text-[#0B8E8D] focus:ring-2 focus:ring-[#0B8E8D]/50 border-gray-300 cursor-pointer" /><label htmlFor="useTotalPointsForTie" className="text-gray-700 select-none cursor-pointer">{t.tieRules?.usePointsOption || "Учитывать общее кол-во очков в 2 сетах"}</label></div>
                            <p className="text-xs text-gray-500 mt-2">{tournamentSettings.useTotalPointsForTie ? (t.tieRules?.usePointsOptionDescription || "Если счет 1:1, выигрывает команда с большим кол-вом очков за 2 сета. При равенстве очков играется тай-брейк до 5.") : (t.tieRules?.useTiebreakOptionDescription || "Если счет 1:1, всегда играется тай-брейк до 5.")} ({t.scoreDifferenceLabel || "Разница в 2 очка"})</p>

                            {/* Настройка очков сета - ГРУППОВЫЕ МАТЧИ */}
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <h5 className="text-sm font-bold text-[#06324F] mb-3 flex items-center">
                                    <span className="bg-[#C1CBA7]/50 px-2 py-1 rounded mr-2">Skupina</span>
                                    {t.groupMatchSettings || "Групповые матчи"}
                                </h5>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">{t.setPointsLabel || "Очков в сете"}</label>
                                        <input
                                            type="number" min="10" max="25"
                                            value={tournamentSettings.groupSetPointLimit || 20}
                                            onChange={(e) => setTournamentSettings({ ...tournamentSettings, groupSetPointLimit: Math.min(25, Math.max(10, parseInt(e.target.value) || 20)) })}
                                            className="w-full p-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8E8D]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">{t.winDifferenceLabel || "Разница для победы"}</label>
                                        <select
                                            value={tournamentSettings.groupWinDifference || 1}
                                            onChange={(e) => setTournamentSettings({ ...tournamentSettings, groupWinDifference: parseInt(e.target.value) })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8E8D]"
                                        >
                                            <option value={1}>1 {t.point || "очко"}</option>
                                            <option value={2}>2 {t.points || "очка"}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Настройка очков сета - ПЛЕЙ-ОФФ */}
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <h5 className="text-sm font-bold text-[#06324F] mb-3 flex items-center">
                                    <span className="bg-[#FDD80F]/30 px-2 py-1 rounded mr-2">Play-off</span>
                                    {t.playoffMatchSettings || "Плей-офф / Финалы"}
                                </h5>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">{t.setPointsLabel || "Очков в сете"}</label>
                                        <input
                                            type="number" min="15" max="25"
                                            value={tournamentSettings.playoffSetPointLimit || 25}
                                            onChange={(e) => setTournamentSettings({ ...tournamentSettings, playoffSetPointLimit: Math.min(25, Math.max(15, parseInt(e.target.value) || 25)) })}
                                            className="w-full p-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD80F]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">{t.winDifferenceLabel || "Разница для победы"}</label>
                                        <select
                                            value={tournamentSettings.playoffWinDifference || 2}
                                            onChange={(e) => setTournamentSettings({ ...tournamentSettings, playoffWinDifference: parseInt(e.target.value) })}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD80F]"
                                        >
                                            <option value={1}>1 {t.point || "очко"}</option>
                                            <option value={2}>2 {t.points || "очка"}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-8 bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 p-6 rounded-xl shadow-md border border-[#0B8E8D]/20">
                            <h3 className="text-xl font-bold text-[#06324F] mb-4">{t.tieRules?.title || "Правила определения победителя (при 1:1 по сетам)"}</h3>
                            <div className="space-y-4"><div className={`p-4 rounded-lg shadow-sm border transition-all duration-300 ${tournamentSettings.useTotalPointsForTie ? 'bg-white border-green-300 ring-2 ring-green-200' : 'bg-gray-100 border-gray-200 opacity-70'}`}><h4 className="text-lg font-semibold text-[#0B8E8D] mb-2 flex items-center">{tournamentSettings.useTotalPointsForTie && <FaCheck className="text-green-500 mr-2" />} {t.tieRules?.option1 || "Вариант 1: По очкам"}</h4><p className="text-gray-700 text-sm">{t.tieRules?.option1Description || "Побеждает команда, набравшая больше очков в сумме за 2 сета. Если очков поровну, играется тай-брейк до 5 очков (разница 2)."}</p></div><div className={`p-4 rounded-lg shadow-sm border transition-all duration-300 ${!tournamentSettings.useTotalPointsForTie ? 'bg-white border-green-300 ring-2 ring-green-200' : 'bg-gray-100 border-gray-200 opacity-70'}`}><h4 className="text-lg font-semibold text-[#0B8E8D] mb-2 flex items-center">{!tournamentSettings.useTotalPointsForTie && <FaCheck className="text-green-500 mr-2" />} {t.tieRules?.option2 || "Вариант 2: Всегда тай-брейк"}</h4><p className="text-gray-700 text-sm">{t.tieRules?.option2Description || "Всегда играется тай-брейк до 5 очков (разница 2)."}</p></div></div>
                        </div>
                        <div className="prose prose-sm max-w-none mt-6"><h3 className="text-xl font-bold text-[#06324F] mb-4">{t.generalRulesTitle || "Общие правила турнира"}</h3><div className="whitespace-pre-wrap font-sans text-sm text-gray-800 bg-gray-50 p-4 rounded border border-gray-200">{t.tournamentRules || "Здесь будут общие правила турнира..."}</div></div>
                    </div>
                    {/* Подвал */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50 sticky bottom-0"><button onClick={() => setShowRules(false)} className="w-full py-2 bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center shadow-md"><FaCheck className="mr-2" /> {t.hideRules || "Закрыть правила"}</button></div>
                </div>
            </div>
        );
    }, [language, tournamentSettings, t, handleSettingsChange, changeLanguage]);

    // --- Основной рендер компонента App ---

    // Показываем спиннер загрузки пока данные загружаются из Firebase
    // --- Рендер Cumulative League Standings ---
    const renderLeagueStandings = useCallback(() => {
        // Рассчитываем накопительные очки лиги
        const leagueData = {};

        // Добавляем очки из осеннего турнира
        AUTUMN_STANDINGS.forEach(team => {
            const normalizedName = team.name.toLowerCase().replace(/\s+/g, ' ').trim();
            leagueData[normalizedName] = {
                name: team.name,
                autumn: team.leaguePoints,
                winter: 0,
                spring: 0,
                total: team.leaguePoints
            };
        });

        // Добавляем очки из зимнего турнира (текущий)
        teams.forEach(team => {
            const normalizedName = team.name.toLowerCase().replace(/\s+/g, ' ').trim();
            if (!leagueData[normalizedName]) {
                leagueData[normalizedName] = {
                    name: team.name,
                    autumn: 0,
                    winter: 0,
                    spring: 0,
                    total: 0
                };
            }
            leagueData[normalizedName].winter = team.points || 0;
            leagueData[normalizedName].total = (leagueData[normalizedName].autumn || 0) + (team.points || 0);
            leagueData[normalizedName].name = team.name; // Используем актуальное имя
        });

        // Сортируем по накопительным очкам
        const sortedLeague = Object.values(leagueData).sort((a, b) => b.total - a.total);

        return (
            <div className="p-4 md:p-6">
                <div className="bg-white rounded-xl shadow-md p-6 border border-[#FDD80F]/30">
                    <h2 className="text-xl font-bold text-[#06324F] mb-4 flex items-center">
                        <FaTrophy className="mr-3 text-[#FDD80F]" />
                        {t.leagueStandings || 'Průběžné pořadí ligy'} RVL {LEAGUE_SEASON}
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                        {t.leagueCumulativeInfo || 'Součet bodů ze všech turnajů sezóny.'}
                    </p>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gradient-to-r from-[#FDD80F]/20 to-[#0B8E8D]/10">
                                <tr>
                                    <th className="p-3 text-left text-sm font-semibold text-[#06324F]">#</th>
                                    <th className="p-3 text-left text-sm font-semibold text-[#06324F]">{t.team || 'Tým'}</th>
                                    <th className="p-3 text-center text-sm font-semibold text-gray-600" title={TOURNAMENTS.autumn.name}>🍂</th>
                                    <th className="p-3 text-center text-sm font-semibold text-gray-600" title={TOURNAMENTS.winter.name}>❄️</th>
                                    <th className="p-3 text-center text-sm font-semibold text-gray-600" title={TOURNAMENTS.spring.name}>🌸</th>
                                    <th className="p-3 text-center text-sm font-bold text-[#06324F]">{t.total || 'Celkem'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedLeague.map((team, index) => {
                                    const rank = index + 1;
                                    let rowClass = 'border-b border-gray-100 hover:bg-gray-50';
                                    let rankIcon = null;
                                    if (rank === 1) { rowClass += ' bg-yellow-50 font-bold'; rankIcon = <FaTrophy className="inline text-yellow-500" />; }
                                    else if (rank === 2) { rowClass += ' bg-gray-50'; rankIcon = <FaTrophy className="inline text-gray-400" />; }
                                    else if (rank === 3) { rankIcon = <FaTrophy className="inline text-orange-400" />; }

                                    return (
                                        <tr key={team.name} className={rowClass}>
                                            <td className="p-3 text-sm">{rankIcon || rank}.</td>
                                            <td className="p-3 text-sm font-medium">{team.name}</td>
                                            <td className="p-3 text-center text-sm text-gray-600">{team.autumn || '-'}</td>
                                            <td className="p-3 text-center text-sm text-blue-600 font-medium">{team.winter || '-'}</td>
                                            <td className="p-3 text-center text-sm text-gray-400">-</td>
                                            <td className="p-3 text-center text-lg font-bold text-[#06324F]">{team.total}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                        <p>🍂 {TOURNAMENTS.autumn.name} ({TOURNAMENTS.autumn.date}) - ✅ {t.completed || 'Dokončeno'}</p>
                        <p>❄️ {TOURNAMENTS.winter.name} ({TOURNAMENTS.winter.date}) - 🟢 {t.active || 'Aktivní'}</p>
                        <p>🌸 {TOURNAMENTS.spring.name} ({TOURNAMENTS.spring.date}) - 🔜 {t.upcoming || 'Připravuje se'}</p>
                    </div>
                </div>
            </div>
        );
    }, [teams, t]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-6xl text-[#0B8E8D] mx-auto mb-4" />
                    <p className="text-xl text-gray-600">{t.loading || 'Загрузка...'}</p>
                </div>
            </div>
        );
    }


    return (
        <>
            {/* Индикатор сохранения */}
            {isSaving && (
                <div className="fixed top-2 right-2 z-50 bg-[#0B8E8D] text-white px-3 py-1 rounded-full text-sm flex items-center shadow-lg">
                    <FaSpinner className="animate-spin mr-2" />
                    {t.saving || 'Сохранение...'}
                </div>
            )}
            <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
                {/* Sidebar */}
                <aside className="w-full md:w-64 bg-white shadow-md md:h-screen md:sticky md:top-0 z-40 border-b md:border-b-0 md:border-r border-gray-200 shrink-0">
                    {/* Шапка Sidebar */}
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h1 className="text-xl font-bold text-[#06324F] flex items-center"><FaVolleyballBall className="mr-2 text-[#0B8E8D]" /> {t.appName || 'RVL Scoreboard'}</h1>
                        <div className="hidden md:flex space-x-1">{Object.keys(languageNames).filter(lang => translations[lang]).map(lang => (<button key={lang} onClick={() => changeLanguage(lang)} className={`px-2 py-1 text-xs rounded transition-colors duration-150 ${language === lang ? 'bg-[#0B8E8D] text-white shadow-sm font-semibold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} title={languageNames[lang]}>{lang.toUpperCase()}</button>))}</div>
                    </div>
                    {/* Навигация Sidebar */}
                    <div className="p-4 space-y-2">
                        {/* Селектор турнира */}
                        <div className="mb-4 p-3 bg-gradient-to-r from-[#FDD80F]/20 to-[#0B8E8D]/10 rounded-lg border border-[#FDD80F]/30">
                            <label className="block text-xs font-semibold text-[#06324F] mb-2">
                                <FaTrophy className="inline mr-2 text-[#FDD80F]" />
                                {t.selectTournament || 'Turnaj'}
                            </label>
                            <select
                                value={currentTournament}
                                onChange={(e) => setCurrentTournament(e.target.value)}
                                className="w-full p-2 text-sm rounded border border-[#0B8E8D]/30 bg-white focus:ring-2 focus:ring-[#0B8E8D] focus:border-[#0B8E8D]"
                            >
                                {Object.values(TOURNAMENTS).map(t => (
                                    <option key={t.id} value={t.id} disabled={t.status === 'upcoming'}>
                                        {t.name} ({t.date}) {t.status === 'active' ? '🟢' : t.status === 'completed' ? '✅' : '🔜'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button onClick={() => setView('matches')} className={`flex items-center w-full text-left p-3 rounded-lg transition-all duration-200 ${view === 'matches' ? 'bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white shadow-md' : 'hover:bg-[#0B8E8D]/10 text-gray-700'}`}><FaVolleyballBall className="mr-3" /> {t.matches}</button>
                        <button onClick={() => setView('groups')} className={`flex items-center w-full text-left p-3 rounded-lg transition-all duration-200 ${view === 'groups' ? 'bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white shadow-md' : 'hover:bg-[#0B8E8D]/10 text-gray-700'}`}><FaUsers className="mr-3" /> {t.groups}</button>
                        <button onClick={() => setView('league')} className={`flex items-center w-full text-left p-3 rounded-lg transition-all duration-200 ${view === 'league' ? 'bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white shadow-md' : 'hover:bg-[#0B8E8D]/10 text-gray-700'}`}><FaTrophy className="mr-3 text-[#FDD80F]" /> {t.leagueStandings || 'Pořadí ligy'}</button>
                        <button onClick={() => setShowRules(true)} className="flex items-center w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-[#0B8E8D]/10 text-gray-700 mt-2"><FaGlobe className="mr-3 text-[#FDD80F]" /> {t.rules}</button>
                    </div>
                    {/* Инфо-блок в Sidebar */}
                    <div className="md:absolute md:bottom-0 md:left-0 md:right-0 p-4 hidden md:block">
                        <div className="bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 p-4 rounded-lg shadow-sm border border-[#0B8E8D]/20">
                            <h3 className="text-sm font-semibold text-[#06324F] mb-2">{t.tournamentInfo}</h3>
                            <div className="text-xs text-gray-700 space-y-2">
                                <p className="flex items-center"><FaCalendarAlt className="mr-2 text-[#FDD80F]" /><span className="font-semibold mr-1">{t.dateLabel}:</span> {t.tournamentDate}</p>
                                <p className="flex items-start"><FaMapMarkerAlt className="mr-2 text-[#0B8E8D] mt-0.5 flex-shrink-0" /><div><span className="font-semibold mr-1">{t.addressLabel}:</span> {t.tournamentAddress} <span className="ml-2 space-x-2"><a href="https://maps.app.goo.gl/6jAwW9cVsyf11EEg6" target="_blank" rel="noopener noreferrer" className="text-[#0B8E8D] hover:underline text-xs">[Google]</a><a href="https://mapy.com/s/lobalakeru" target="_blank" rel="noopener noreferrer" className="text-[#0B8E8D] hover:underline text-xs">[Mapy.cz]</a></span></div></p>
                                <p className="flex items-center"><FaLink className="mr-2 text-[#06324F]" /><span className="font-semibold mr-1">{t.websiteLabel}:</span><a href={t.tournamentWebsite} target="_blank" rel="noopener noreferrer" className="text-[#0B8E8D] ml-1 hover:underline truncate">{t.tournamentWebsite?.replace(/^(https?:\/\/)?(www\.)?/, '')}</a></p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-[#0B8E8D]/20"><h3 className="text-sm font-semibold text-[#06324F] mb-1">{t.aboutSection}</h3><p className="text-xs text-gray-600">{t.aboutApp}</p></div>
                            {/* QR Code */}
                            <div className="mt-3 pt-2 border-t border-[#0B8E8D]/20 text-center">
                                <p className="text-xs text-gray-500 mb-2">{t.scanQR || 'Naskenujte QR kód'}</p>
                                <img
                                    src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://rvl-2025-26.netlify.app/"
                                    alt="QR Code"
                                    className="mx-auto w-20 h-20 rounded shadow-sm"
                                />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Основной контент */}
                <main className="flex-1 p-0 md:p-6 pb-20 md:pb-6 overflow-y-auto">
                    {view === 'matches' && renderMatches()}
                    {view === 'groups' && renderGroups()}
                    {view === 'league' && renderLeagueStandings()}

                    {/* Инфо-блок (Mobile) */}
                    <div className="md:hidden p-4 mx-4 mt-4 mb-24 bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 rounded-lg shadow-sm border border-[#0B8E8D]/20">
                        <h3 className="text-sm font-semibold text-[#06324F] mb-2">{t.tournamentInfo}</h3>
                        <div className="text-xs text-gray-700 space-y-2">
                            <p className="flex items-center"><FaCalendarAlt className="mr-2 text-[#FDD80F]" /><span className="font-semibold mr-1">{t.dateLabel}:</span> {t.tournamentDate}</p>
                            <p className="flex items-start"><FaMapMarkerAlt className="mr-2 text-[#0B8E8D] mt-0.5 flex-shrink-0" /><div><span className="font-semibold mr-1">{t.addressLabel}:</span> {t.tournamentAddress} <span className="ml-2 space-x-2"><a href="https://maps.app.goo.gl/6jAwW9cVsyf11EEg6" target="_blank" rel="noopener noreferrer" className="text-[#0B8E8D] hover:underline text-xs">[Google]</a><a href="https://mapy.com/s/lobalakeru" target="_blank" rel="noopener noreferrer" className="text-[#0B8E8D] hover:underline text-xs">[Mapy.cz]</a></span></div></p>
                            <p className="flex items-center"><FaLink className="mr-2 text-[#06324F]" /><span className="font-semibold mr-1">{t.websiteLabel}:</span><a href={t.tournamentWebsite} target="_blank" rel="noopener noreferrer" className="text-[#0B8E8D] ml-1 hover:underline truncate">{t.tournamentWebsite?.replace(/^(https?:\/\/)?(www\.)?/, '')}</a></p>
                        </div>
                        {/* Селектор турнира (Mobile) */}
                        <div className="mt-3 pt-2 border-t border-[#0B8E8D]/20">
                            <label className="block text-xs font-semibold text-[#06324F] mb-2">
                                <FaTrophy className="inline mr-2 text-[#FDD80F]" />
                                {t.selectTournament || 'Turnaj'}
                            </label>
                            <select
                                value={currentTournament}
                                onChange={(e) => setCurrentTournament(e.target.value)}
                                className="w-full p-2 text-sm rounded border border-[#0B8E8D]/30 bg-white focus:ring-2 focus:ring-[#0B8E8D]"
                            >
                                {Object.values(TOURNAMENTS).map(tour => (
                                    <option key={tour.id} value={tour.id} disabled={tour.status === 'upcoming'}>
                                        {tour.name} ({tour.date}) {tour.status === 'active' ? '🟢' : tour.status === 'completed' ? '✅' : '🔜'}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex space-x-1 mt-3 pt-2 border-t border-[#0B8E8D]/20">{Object.keys(languageNames).filter(lang => translations[lang]).map(lang => (<button key={lang} onClick={() => changeLanguage(lang)} className={`px-2 py-1 text-xs rounded transition-colors duration-150 ${language === lang ? 'bg-[#0B8E8D] text-white shadow-sm font-semibold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} title={languageNames[lang]}>{lang.toUpperCase()}</button>))}</div>
                    </div>
                </main>

                {/* Нижняя навигация (Mobile) */}
                <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-3 flex justify-around md:hidden z-30 border-t border-gray-200">
                    <button onClick={() => setView('matches')} className={`p-3 flex flex-col items-center transition-colors duration-150 ${view === 'matches' ? 'text-[#0B8E8D] font-semibold' : 'text-gray-600 hover:text-[#0B8E8D]'}`}><FaVolleyballBall className="text-2xl mb-1" /><span className="text-sm">{t.matches}</span></button>
                    <button onClick={() => setView('groups')} className={`p-3 flex flex-col items-center transition-colors duration-150 ${view === 'groups' ? 'text-[#0B8E8D] font-semibold' : 'text-gray-600 hover:text-[#0B8E8D]'}`}><FaUsers className="text-2xl mb-1" /><span className="text-sm">{t.groups}</span></button>
                    <button onClick={() => setView('league')} className={`p-3 flex flex-col items-center transition-colors duration-150 ${view === 'league' ? 'text-[#FDD80F] font-semibold' : 'text-gray-600 hover:text-[#FDD80F]'}`}><FaChartBar className="text-2xl mb-1 text-[#FDD80F]" /><span className="text-sm">{t.leagueShort || 'Liga'}</span></button>
                    <button onClick={() => setShowRules(true)} className={`p-3 flex flex-col items-center text-gray-600 hover:text-[#0B8E8D] transition-colors duration-150`}><FaGlobe className="text-2xl mb-1 text-[#FDD80F]" /><span className="text-sm">{t.rules}</span></button>
                </nav>
            </div>

            {/* Модальные окна */}
            {showRules && renderRulesModal()}
            {view === 'matchDetail' && renderMatchDetail()}
        </>
    );
}

export default App;
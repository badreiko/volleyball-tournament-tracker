import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { FaVolleyballBall, FaUsers, FaChartBar, FaGlobe, FaSpinner, FaCalendarAlt, FaMapMarkerAlt, FaLink, FaTrophy } from 'react-icons/fa';
import { translations, languageNames } from './translations';
import { saveData, subscribeToData, getTournamentPath, GLOBAL_PATHS } from './firebase';
import { initialTeams, initialMatches, TOURNAMENTS } from './constants';
import { isSetCompleted, sortTeamsByRank } from './utils';
import MatchesView from './components/MatchesView';
import GroupsView from './components/GroupsView';
import MatchDetailModal from './components/MatchDetailModal';
import RulesModal from './components/RulesModal';
import LeagueStandings from './components/LeagueStandings';
import Sidebar from './components/Sidebar';

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
    const [currentTournament, setCurrentTournament] = useState('winter'); // Текущий выбранный турнир

    // Получаем объект перевода для текущего языка
    const t = translations[language] || translations['cs'];

    // --- Эффект для загрузки данных из Firebase (подписка на изменения) ---
    useEffect(() => {
        const unsubscribers = [];
        setIsLoading(true);

        const teamsPath = getTournamentPath(currentTournament, 'teams');
        const matchesPath = getTournamentPath(currentTournament, 'matches');
        const settingsPath = getTournamentPath(currentTournament, 'settings');

        unsubscribers.push(
            subscribeToData(teamsPath, (data) => {
                if (data) {
                    const teamsArray = Array.isArray(data) ? data : Object.values(data);
                    setTeams(teamsArray);
                } else {
                    setTeams(initialTeams);
                    saveData(teamsPath, initialTeams);
                }
            })
        );

        unsubscribers.push(
            subscribeToData(matchesPath, (data) => {
                isUpdatingFromFirebase.current = true;

                if (data) {
                    const matchesArray = Array.isArray(data) ? data : Object.values(data);
                    let needsMigration = false;

                    const mergedMatches = initialMatches.map(initialMatch => {
                        const loadedMatchData = matchesArray.find(lm => lm.id === initialMatch.id);
                        if (loadedMatchData) {
                            // ПРОВЕРКА: Если в базе нет новых полей, помечаем, что нужна миграция
                            if (loadedMatchData.baseIsSwapped === undefined || !loadedMatchData.set1History) {
                                needsMigration = true;
                            }
                            return { ...initialMatch, ...loadedMatchData };
                        }
                        return initialMatch;
                    });

                    setMatches(mergedMatches);
                    
                    // Если данные в базе устарели (нет новых полей), принудительно сохраняем новую структуру
                    if (needsMigration) {
                        console.log("Migrating matches data to new structure...");
                        saveData(matchesPath, mergedMatches);
                    }
                } else {
                    setMatches(initialMatches);
                    saveData(matchesPath, initialMatches);
                }
                setIsLoading(false);
            })
        );

        unsubscribers.push(
            subscribeToData(settingsPath, (data) => {
                if (data) {
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

        unsubscribers.push(
            subscribeToData(GLOBAL_PATHS.language, (data) => {
                if (data) {
                    setLanguage(data);
                }
            })
        );

        return () => {
            unsubscribers.forEach(unsub => {
                if (typeof unsub === 'function') unsub();
            });
        };
    }, [currentTournament]);

    const isInitialLoad = React.useRef(true);
    const isUpdatingFromFirebase = React.useRef(false);

    const saveMatchesRef = React.useRef(null);
    useEffect(() => {
        if (isInitialLoad.current || isUpdatingFromFirebase.current) {
            isUpdatingFromFirebase.current = false;
            return;
        }

        if (saveMatchesRef.current) clearTimeout(saveMatchesRef.current);

        setIsSaving(true);

        saveMatchesRef.current = setTimeout(async () => {
            try {
                await saveData(getTournamentPath(currentTournament, 'matches'), matches);
                setIsSaving(false);
            } catch (error) {
                console.error('Error saving matches:', error);
                setIsSaving(false);
            }
        }, 1000);

        return () => {
            if (saveMatchesRef.current) {
                clearTimeout(saveMatchesRef.current);
            }
        };
    }, [matches, currentTournament]);

    useEffect(() => {
        if (isInitialLoad.current) return;
        const timer = setTimeout(() => {
            saveData(getTournamentPath(currentTournament, 'teams'), teams);
        }, 500);
        return () => clearTimeout(timer);
    }, [teams, currentTournament]);

    useEffect(() => {
        if (isInitialLoad.current) return;
        saveData(getTournamentPath(currentTournament, 'settings'), tournamentSettings);
    }, [tournamentSettings, currentTournament]);

    useEffect(() => {
        if (isInitialLoad.current) return;
        saveData(GLOBAL_PATHS.language, language);
    }, [language]);

    useEffect(() => {
        if (!isLoading) {
            isInitialLoad.current = false;
        }
    }, [isLoading]);

    const matchesRef = React.useRef(matches);
    useEffect(() => {
        matchesRef.current = matches;
    }, [matches]);

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (saveMatchesRef.current) {
                clearTimeout(saveMatchesRef.current);
            }
            if (!isInitialLoad.current) {
                saveData(getTournamentPath(currentTournament, 'matches'), matchesRef.current);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            handleBeforeUnload();
        };
    }, [currentTournament]);

    const recalculateAllTeamStats = useCallback((currentMatches) => {
        setTeams(prevTeams => {
            let calculatedTeams = initialTeams.map(initialTeam => ({
                ...initialTeam,
                points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0, ballsWon: 0, ballsLost: 0
            }));

            const completedGroupMatches = currentMatches.filter(m =>
                m.round === 'group' &&
                (m.status === 'completed' || m.status === 'completed_by_points' || m.winner !== null) &&
                m.team1 && m.team2
            );

            completedGroupMatches.forEach(match => {
                const team1Index = calculatedTeams.findIndex(t => t.code === match.team1);
                const team2Index = calculatedTeams.findIndex(t => t.code === match.team2);
                if (team1Index === -1 || team2Index === -1) return;

                let team1 = { ...calculatedTeams[team1Index] };
                let team2 = { ...calculatedTeams[team2Index] };
                let team1SetsWonCount = 0;
                let team2SetsWonCount = 0;

                if (isSetCompleted(match.set1Team1, match.set1Team2, false, false, tournamentSettings.groupSetPointLimit, tournamentSettings.groupWinDifference)) {
                    match.set1Team1 > match.set1Team2 ? team1SetsWonCount++ : team2SetsWonCount++;
                }
                if (isSetCompleted(match.set2Team1, match.set2Team2, false, false, tournamentSettings.groupSetPointLimit, tournamentSettings.groupWinDifference)) {
                    match.set2Team1 > match.set2Team2 ? team1SetsWonCount++ : team2SetsWonCount++;
                }
                const wasTie = team1SetsWonCount === 1 && team2SetsWonCount === 1;
                if (wasTie && match.status !== 'completed_by_points' && isSetCompleted(match.set3Team1, match.set3Team2, false, true, tournamentSettings.groupSetPointLimit, tournamentSettings.groupWinDifference)) {
                    match.set3Team1 > match.set3Team2 ? team1SetsWonCount++ : team2SetsWonCount++;
                }

                if (match.winner === team1.code) {
                    team1.points += (team1SetsWonCount === 2 && team2SetsWonCount === 0) ? 3 : 2;
                    team2.points += (team1SetsWonCount === 2 && team2SetsWonCount === 0) ? 0 : 1;
                    team1.wins++; team2.losses++;
                } else if (match.winner === team2.code) {
                    team2.points += (team2SetsWonCount === 2 && team1SetsWonCount === 0) ? 3 : 2;
                    team1.points += (team2SetsWonCount === 2 && team1SetsWonCount === 0) ? 0 : 1;
                    team2.wins++; team1.losses++;
                }

                team1.setsWon += team1SetsWonCount; team1.setsLost += team2SetsWonCount;
                team2.setsWon += team2SetsWonCount; team2.setsLost += team1SetsWonCount;

                const team1Balls = (match.set1Team1 || 0) + (match.set2Team1 || 0) + (match.set3Team1 || 0);
                const team2Balls = (match.set1Team2 || 0) + (match.set2Team2 || 0) + (match.set3Team2 || 0);
                team1.ballsWon += team1Balls; team1.ballsLost += team2Balls;
                team2.ballsWon += team2Balls; team2.ballsLost += team1Balls;

                calculatedTeams[team1Index] = team1;
                calculatedTeams[team2Index] = team2;
            });
            if (JSON.stringify(calculatedTeams) === JSON.stringify(prevTeams)) {
                return prevTeams;
            }
            return calculatedTeams;
        });
    }, [tournamentSettings.groupSetPointLimit, tournamentSettings.groupWinDifference]);

    const updatePlayoffTeams = useCallback(() => {
        setMatches(prevMatches => {
            const completedGroupMatches = prevMatches.filter(m =>
                m.round === 'group' &&
                (m.status === 'completed' || m.status === 'completed_by_points')
            );
            const completedGroupMatchesCount = completedGroupMatches.length;
            const requiredMatchesBeforePlayoff = 10;

            let changed = false;

            if (completedGroupMatchesCount < requiredMatchesBeforePlayoff) {
                const resetMatches = prevMatches.map(match => {
                    if (match.round !== 'group' && (match.team1 !== null || match.team2 !== null || match.status !== 'waiting')) {
                        changed = true;
                        return {
                            ...match,
                            team1: null,
                            team2: null,
                            refereeTeamCode: null,
                            status: 'waiting',
                            set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null
                        };
                    }
                    return match;
                });
                return changed ? resetMatches : prevMatches;
            }

            const groupLetters = ['A', 'B'];
            const groupRankings = {};
            groupLetters.forEach(group => {
                const teamsInGroup = teams.filter(t => t.group === group);
                groupRankings[group] = sortTeamsByRank(teamsInGroup);
            });
            const getRankedTeamCode = (group, rank) => groupRankings[group]?.[rank - 1]?.code || null;

            const updatedMatchesArray = prevMatches.map(match => {
                if (match.round === 'group') return match;

                const currentTeam1 = match.team1;
                const currentTeam2 = match.team2;
                const currentStatus = match.status;
                const currentReferee = match.refereeTeamCode;

                let newTeam1Code = null;
                let newTeam2Code = null;

                switch (match.id) {
                    case 'F-1A-1B': newTeam1Code = getRankedTeamCode('A', 1); newTeam2Code = getRankedTeamCode('B', 1); break;
                    case 'F3-2A-2B': newTeam1Code = getRankedTeamCode('A', 2); newTeam2Code = getRankedTeamCode('B', 2); break;
                    case 'F5-3A-3B': newTeam1Code = getRankedTeamCode('A', 3); newTeam2Code = getRankedTeamCode('B', 3); break;
                    default: return match;
                }

                const teamsDetermined = !!(newTeam1Code && newTeam2Code);
                const newStatus = teamsDetermined ? 'not_started' : 'waiting';
                const teamsChanged = currentTeam1 !== newTeam1Code || currentTeam2 !== newTeam2Code;
                const statusChanged = currentStatus !== newStatus;
                const newRefereeCode = teamsChanged ? null : currentReferee;
                const refereeMaybeChanged = currentReferee !== newRefereeCode;

                if (teamsChanged || statusChanged || refereeMaybeChanged) {
                    if (!changed) changed = true;
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
                return match;
            });

            return changed ? updatedMatchesArray : prevMatches;
        });
    }, [teams, setMatches]);

    const updateMatchScore = useCallback((matchId, set, team, scoreStr) => {
        const score = parseInt(scoreStr);

        setMatches(prevMatches =>
            prevMatches.map(m => {
                if (m.id === matchId) {
                    const isPlayoff = m.round !== 'group';
                    const isFinal = m.round === 'final' || m.round === 'third_place' || m.round === 'fifth_place';
                    const setPointLimit = isPlayoff ? tournamentSettings.playoffSetPointLimit : tournamentSettings.groupSetPointLimit;

                    let maxScore;
                    if (set === 3) {
                        maxScore = isFinal ? 30 : 10;
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

    const checkAllMatchesStatus = useCallback(() => {
        setMatches(prevMatches => {
            let needsUpdate = false;
            const updatedMatches = prevMatches.map(match => {
                if (match.status === 'waiting') return match;
                const { set1Team1, set1Team2, set2Team1, set2Team2, set3Team1, set3Team2 } = match;
                const allScoresZero = !(set1Team1 > 0 || set1Team2 > 0 || set2Team1 > 0 || set2Team2 > 0 || set3Team1 > 0 || set3Team2 > 0);

                if (allScoresZero && match.status !== 'not_started' && match.status !== 'waiting') {
                    needsUpdate = true;
                    return { ...match, status: match.team1 && match.team2 ? 'not_started' : 'waiting', winner: null };
                }
                if (allScoresZero && (match.status === 'not_started' || match.status === 'waiting')) {
                    return match;
                }

                const isFinal = match.round === 'final' || match.round === 'third_place' || match.round === 'fifth_place';
                const isPlayoff = match.round !== 'group';
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
                            else { 
                                if (set3Completed) { newStatus = 'completed'; newWinner = (set3Team1 > set3Team2) ? match.team1 : match.team2; }
                                else if ((set3Team1 ?? 0) > 0 || (set3Team2 ?? 0) > 0) { newStatus = 'in_progress'; newWinner = null; }
                                else { newStatus = 'tie_needs_tiebreak'; newWinner = null; }
                            }
                        } else { 
                            if (set3Completed) { newStatus = 'completed'; newWinner = (set3Team1 > set3Team2) ? match.team1 : match.team2; }
                            else if ((set3Team1 ?? 0) > 0 || (set3Team2 ?? 0) > 0) { newStatus = 'in_progress'; newWinner = null; }
                            else { newStatus = 'tie_needs_tiebreak'; newWinner = null; }
                        }
                    }
                } else if (!allScoresZero) { 
                    newStatus = 'in_progress'; newWinner = null;
                } else { 
                    newStatus = match.team1 && match.team2 ? 'not_started' : 'waiting'; newWinner = null;
                }

                if (newStatus !== match.status || newWinner !== match.winner) {
                    needsUpdate = true; return { ...match, status: newStatus, winner: newWinner };
                }
                return match;
            });
            return needsUpdate ? updatedMatches : prevMatches;
        });
    }, [tournamentSettings.useTotalPointsForTie, tournamentSettings.groupSetPointLimit, tournamentSettings.groupWinDifference, tournamentSettings.playoffSetPointLimit, tournamentSettings.playoffWinDifference, setMatches]);

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
                ? (matchToReset.team1 && matchToReset.team2 ? 'not_started' : 'waiting') 
                : 'not_started';

            const refereeToKeep = matchToReset.round !== 'group'
                ? matchToReset.refereeTeamCode 
                : (initialMatch?.refereeTeamCode || matchToReset.refereeTeamCode);

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
        setSelectedMatch(null);
        setView('matches');
    }, [setMatches, setSelectedMatch, setView]);

    const updateMatchDetails = useCallback((matchId, field, value) => {
        setMatches(prevMatches =>
            prevMatches.map(m => {
                if (m.id === matchId) {
                    return { ...m, [field]: value !== undefined ? value : null };
                }
                return m;
            })
        );
    }, [setMatches]);

    useEffect(() => {
        checkAllMatchesStatus();
    }, [matches, tournamentSettings.useTotalPointsForTie, checkAllMatchesStatus]);

    useEffect(() => {
        recalculateAllTeamStats(matches);
    }, [matches, recalculateAllTeamStats]);

    useEffect(() => {
        updatePlayoffTeams();
    }, [teams, matches, updatePlayoffTeams]);

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
            {isSaving && (
                <div className="fixed top-2 right-2 z-50 bg-[#0B8E8D] text-white px-3 py-1 rounded-full text-sm flex items-center shadow-lg">
                    <FaSpinner className="animate-spin mr-2" />
                    {t.saving || 'Сохранение...'}
                </div>
            )}
            <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
                <Sidebar 
                    t={t} 
                    view={view} 
                    setView={setView} 
                    setShowRules={setShowRules}
                    currentTournament={currentTournament}
                    setCurrentTournament={setCurrentTournament}
                    language={language}
                    changeLanguage={changeLanguage}
                    languageNames={languageNames}
                    translations={translations}
                />

                <main className="flex-1 p-0 md:p-6 pb-20 md:pb-6 overflow-y-auto">
                    {view === 'matches' && (
                        <MatchesView 
                            matches={matches} 
                            teams={teams} 
                            t={t} 
                            setView={setView} 
                            setSelectedMatch={setSelectedMatch} 
                            tournamentSettings={tournamentSettings} 
                        />
                    )}
                    {view === 'groups' && <GroupsView teams={teams} t={t} />}
                    {view === 'league' && <LeagueStandings teams={teams} t={t} />}

                    <div className="md:hidden p-4 mx-4 mt-4 mb-24 bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 rounded-lg shadow-sm border border-[#0B8E8D]/20">
                        <h3 className="text-sm font-semibold text-[#06324F] mb-2">{t.tournamentInfo}</h3>
                        <div className="text-xs text-gray-700 space-y-2">
                            <p className="flex items-center"><FaCalendarAlt className="mr-2 text-[#FDD80F]" /><span className="font-semibold mr-1">{t.dateLabel}:</span> {t.tournamentDate}</p>
                            <p className="flex items-start"><FaMapMarkerAlt className="mr-2 text-[#0B8E8D] mt-0.5 flex-shrink-0" /><div><span className="font-semibold mr-1">{t.addressLabel}:</span> {t.tournamentAddress} <span className="ml-2 space-x-2"><a href="https://maps.app.goo.gl/6jAwW9cVsyf11EEg6" target="_blank" rel="noopener noreferrer" className="text-[#0B8E8D] hover:underline text-xs">[Google]</a><a href="https://mapy.com/s/lobalakeru" target="_blank" rel="noopener noreferrer" className="text-[#0B8E8D] hover:underline text-xs">[Mapy.cz]</a></span></div></p>
                            <p className="flex items-center"><FaLink className="mr-2 text-[#06324F]" /><span className="font-semibold mr-1">{t.websiteLabel}:</span><a href={t.tournamentWebsite} target="_blank" rel="noopener noreferrer" className="text-[#0B8E8D] ml-1 hover:underline truncate">{t.tournamentWebsite?.replace(/^(https?:\/\/)?(www\.)?/, '')}</a></p>
                        </div>
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

                <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-3 flex justify-around md:hidden z-30 border-t border-gray-200">
                    <button onClick={() => setView('matches')} className={`p-3 flex flex-col items-center transition-colors duration-150 ${view === 'matches' ? 'text-[#0B8E8D] font-semibold' : 'text-gray-600 hover:text-[#0B8E8D]'}`}><FaVolleyballBall className="text-2xl mb-1" /><span className="text-sm">{t.matches}</span></button>
                    <button onClick={() => setView('groups')} className={`p-3 flex flex-col items-center transition-colors duration-150 ${view === 'groups' ? 'text-[#0B8E8D] font-semibold' : 'text-gray-600 hover:text-[#0B8E8D]'}`}><FaUsers className="text-2xl mb-1" /><span className="text-sm">{t.groups}</span></button>
                    <button onClick={() => setView('league')} className={`p-3 flex flex-col items-center transition-colors duration-150 ${view === 'league' ? 'text-[#FDD80F] font-semibold' : 'text-gray-600 hover:text-[#FDD80F]'}`}><FaChartBar className="text-2xl mb-1 text-[#FDD80F]" /><span className="text-sm">{t.leagueShort || 'Liga'}</span></button>
                    <button onClick={() => setShowRules(true)} className={`p-3 flex flex-col items-center text-gray-600 hover:text-[#0B8E8D] transition-colors duration-150`}><FaGlobe className="text-2xl mb-1 text-[#FDD80F]" /><span className="text-sm">{t.rules}</span></button>
                </nav>
            </div>

            {showRules && (
                <RulesModal 
                    t={t} 
                    language={language} 
                    changeLanguage={changeLanguage} 
                    onClose={() => setShowRules(false)}
                    tournamentSettings={tournamentSettings}
                    setTournamentSettings={setTournamentSettings}
                    languageNames={languageNames}
                    translations={translations}
                />
            )}
            {view === 'matchDetail' && selectedMatch && (
                <MatchDetailModal 
                    match={selectedMatch}
                    matches={matches}
                    teams={teams}
                    t={t}
                    onClose={() => { setView('matches'); setSelectedMatch(null); }}
                    onUpdateScore={updateMatchScore}
                    onUpdateDetails={updateMatchDetails}
                    onResetMatch={resetMatch}
                    tournamentSettings={tournamentSettings}
                    isSaving={isSaving}
                />
            )}
        </>
    );
}

export default App;
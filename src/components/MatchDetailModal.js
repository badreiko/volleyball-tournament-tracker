import React, { useState, useEffect, useRef } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaBullhorn, FaSpinner, FaCheck, FaExchangeAlt, FaUndo, FaVolleyballBall, FaUsers, FaChartBar, FaTrophy, FaExclamationTriangle, FaRegClock, FaPlus, FaMinus, FaTv, FaListAlt, FaHistory } from 'react-icons/fa';
import { isSetCompleted } from '../utils';

const MatchDetailModal = ({ 
    match, 
    matches, 
    teams, 
    t, 
    onClose, 
    onUpdateScore, 
    onUpdateDetails, 
    onResetMatch, 
    tournamentSettings,
    isSaving 
}) => {
    const [isSwapped, setIsSwapped] = useState(false);
    const [mode, setMode] = useState('live'); // 'edit' | 'live'
    const [activeSet, setActiveSet] = useState(1);
    const [scoringHistory, setScoringHistory] = useState([]);
    
    // Find the live match object from the matches array to ensure we have the latest data
    const currentMatchData = matches.find(m => m.id === match.id) || match;
    
    const team1 = teams.find(t => t.code === currentMatchData.team1) || { name: t.tbd };
    const team2 = teams.find(t => t.code === currentMatchData.team2) || { name: t.tbd };
    const currentRefereeTeam = teams.find(t => t.code === currentMatchData.refereeTeamCode);
    const refereeName = currentRefereeTeam?.name || (currentMatchData.refereeTeamCode ? `(${t.refereeTBD || '???'})` : `(${t.selectRefereePlaceholder || 'Не назначен'})`);

    const currentRound = currentMatchData.round || 'unknown';
    const availableReferees = teams.filter(t => t.code !== currentMatchData.team1 && t.code !== currentMatchData.team2);

    // Auto-detect active set on load
    useEffect(() => {
        const { set1Team1, set1Team2, set2Team1, set2Team2 } = currentMatchData;
        const isPlayoff = currentRound !== 'group';
        const setLimit = isPlayoff ? tournamentSettings.playoffSetPointLimit : tournamentSettings.groupSetPointLimit;
        const winDiff = isPlayoff ? tournamentSettings.playoffWinDifference : tournamentSettings.groupWinDifference;

        const set1Done = isSetCompleted(set1Team1, set1Team2, false, false, setLimit, winDiff);
        const set2Done = isSetCompleted(set2Team1, set2Team2, false, false, setLimit, winDiff);

        if (!set1Done) setActiveSet(1);
        else if (!set2Done) setActiveSet(2);
        else setActiveSet(3);
    }, [currentMatchData.id]);

    // Reset history when set changes
    useEffect(() => {
        setScoringHistory([]);
    }, [activeSet, currentMatchData.id]);

    const handleScoreChange = (set, team, delta) => {
        // Determine current score
        let currentScore = 0;
        const isTeam1 = team === 'team1';
        
        if (set === 1) currentScore = isTeam1 ? (currentMatchData.set1Team1 || 0) : (currentMatchData.set1Team2 || 0);
        else if (set === 2) currentScore = isTeam1 ? (currentMatchData.set2Team1 || 0) : (currentMatchData.set2Team2 || 0);
        else if (set === 3) currentScore = isTeam1 ? (currentMatchData.set3Team1 || 0) : (currentMatchData.set3Team2 || 0);

        const newScore = Math.max(0, currentScore + delta);
        
        // Update history for point increase
        if (delta > 0) {
            setScoringHistory(prev => [...prev, { team, score: newScore }]);
        } else if (delta < 0) {
            // Remove last event for this team if decreasing
            setScoringHistory(prev => {
                const newHistory = [...prev];
                for (let i = newHistory.length - 1; i >= 0; i--) {
                    if (newHistory[i].team === team) {
                        newHistory.splice(i, 1);
                        break;
                    }
                }
                return newHistory;
            });
        }

        onUpdateScore(currentMatchData.id, set, team, newScore.toString());
    };

    let roundClass = 'px-3 py-1 rounded-full text-sm font-semibold inline-block mb-3'; 
    let roundIcon; 
    const roundText = t.roundNames?.[currentRound] || currentRound; 

    if (currentRound === 'group') { roundClass += ' bg-[#C1CBA7]/50 text-[#06324F]'; roundIcon = <FaUsers className="mr-2" />; } 
    else if (currentRound === 'quarterfinal') { roundClass += ' bg-[#0B8E8D]/20 text-[#0B8E8D]'; roundIcon = <FaChartBar className="mr-2" />; } 
    else if (currentRound === 'semifinal') { roundClass += ' bg-[#06324F]/20 text-[#06324F]'; roundIcon = <FaChartBar className="mr-2" />; } 
    else if (currentRound === 'third_place') { roundClass += ' bg-orange-100 text-orange-700'; roundIcon = <FaTrophy className="mr-2" />; } 
    else if (currentRound === 'final') { roundClass += ' bg-[#FDD80F]/20 text-[#FDD80F]/90'; roundIcon = <FaTrophy className="mr-2" />; } 
    else { roundClass += ' bg-gray-200 text-gray-700'; roundIcon = <FaVolleyballBall className="mr-2" />; }

    let statusClass = 'px-3 py-1 rounded-full text-sm font-semibold inline-block ml-2'; 
    let statusIcon; 
    const currentStatus = currentMatchData.status || 'unknown'; 
    const statusText = t.statusNames?.[currentStatus] || currentStatus; 

    if (currentStatus === 'completed') { statusClass += ' bg-green-100 text-green-800'; statusIcon = <FaCheck className="mr-2" />; } 
    else if (currentStatus === 'completed_by_points') { statusClass += ' bg-blue-100 text-blue-800'; statusIcon = <FaCheck className="mr-2" />; } 
    else if (currentStatus === 'tie_needs_tiebreak') { statusClass += ' bg-red-100 text-red-800'; statusIcon = <FaExclamationTriangle className="mr-2" />; } 
    else if (currentStatus === 'in_progress') { statusClass += ' bg-yellow-100 text-yellow-800'; statusIcon = <FaRegClock className="mr-2 animate-spin" style={{ animationDuration: '2s' }} />; } 
    else if (currentStatus === 'waiting') { statusClass += ' bg-gray-100 text-gray-500'; statusIcon = <FaRegClock className="mr-2" />; } 
    else { statusClass += ' bg-gray-100 text-gray-800'; statusIcon = <FaRegClock className="mr-2" />; }

    const isFinal = currentRound === 'final' || currentRound === 'third_place' || currentRound === 'fifth_place'; 
    const isPlayoff = currentRound !== 'group'; 
    const setLimit = isPlayoff ? tournamentSettings.playoffSetPointLimit : tournamentSettings.groupSetPointLimit; 
    const winDiff = isPlayoff ? tournamentSettings.playoffWinDifference : tournamentSettings.groupWinDifference; 
    
    const set1Completed = isSetCompleted(currentMatchData.set1Team1, currentMatchData.set1Team2, false, false, setLimit, winDiff); 
    const set2Completed = isSetCompleted(currentMatchData.set2Team1, currentMatchData.set2Team2, false, false, setLimit, winDiff); 
    const isTieSituation = set1Completed && set2Completed && (currentMatchData.set1Team1 > currentMatchData.set1Team2 !== currentMatchData.set2Team1 > currentMatchData.set2Team2); 
    const showThirdSetInput = isFinal || currentStatus === 'tie_needs_tiebreak' || isTieSituation || (currentMatchData.set3Team1 ?? 0) > 0 || (currentMatchData.set3Team2 ?? 0) > 0; 
    const isThirdSetTiebreak = showThirdSetInput && (isFinal || currentStatus === 'tie_needs_tiebreak' || isTieSituation); 
    const tiebreakScoreLimit = isFinal ? 15 : 5;
    
    const maxScoreRegularSet = (setLimit || 25) + 15;
    const maxScoreTiebreak = isFinal ? 30 : 10;

    // Helper to get score for active set for display
    const getActiveSetScore = (teamCode) => {
        const isTeam1 = teamCode === 'team1';
        if (activeSet === 1) return isTeam1 ? (currentMatchData.set1Team1 || 0) : (currentMatchData.set1Team2 || 0);
        if (activeSet === 2) return isTeam1 ? (currentMatchData.set2Team1 || 0) : (currentMatchData.set2Team2 || 0);
        if (activeSet === 3) return isTeam1 ? (currentMatchData.set3Team1 || 0) : (currentMatchData.set3Team2 || 0);
        return 0;
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center p-4 z-[70] backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#0B8E8D] to-[#06324F] p-4 text-white shrink-0">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold">{t.matchDetail}</h2>
                            {isSaving && <FaSpinner className="animate-spin text-sm" />}
                        </div>
                        <button onClick={onClose} className="text-white hover:text-red-200 text-2xl leading-none">&times;</button>
                    </div>
                    {/* View Toggle */}
                    <div className="flex bg-black/20 p-1 rounded-lg">
                        <button 
                            onClick={() => setMode('live')}
                            className={`flex-1 flex items-center justify-center py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'live' ? 'bg-white text-[#0B8E8D] shadow-sm' : 'text-white/80 hover:bg-white/10'}`}
                        >
                            <FaTv className="mr-2" /> Live
                        </button>
                        <button 
                            onClick={() => setMode('edit')}
                            className={`flex-1 flex items-center justify-center py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'edit' ? 'bg-white text-[#0B8E8D] shadow-sm' : 'text-white/80 hover:bg-white/10'}`}
                        >
                            <FaListAlt className="mr-2" /> {t.edit || 'Протокол'}
                        </button>
                    </div>
                </div>

                <div className="p-4 overflow-y-auto flex-1">
                    {/* Common Info */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className={roundClass}><span className="flex items-center">{roundIcon}{roundText}</span></span>
                        <span className={statusClass}><span className="flex items-center">{statusIcon}{statusText}</span></span>
                    </div>

                    {/* LIVE MODE */}
                    {mode === 'live' && (
                        <div className="space-y-6">
                            {/* Set Selector */}
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3].map(setNum => (
                                    <button
                                        key={setNum}
                                        onClick={() => setActiveSet(setNum)}
                                        disabled={setNum === 3 && !showThirdSetInput}
                                        className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
                                            activeSet === setNum 
                                                ? 'bg-[#0B8E8D] text-white shadow-md transform scale-105' 
                                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                        } ${setNum === 3 && !showThirdSetInput ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {setNum === 3 && isFinal ? t.set3 : (setNum === 3 ? t.tiebreak : `${t.set || 'Set'} ${setNum}`)}
                                    </button>
                                ))}
                            </div>

                            {/* Live Score Board */}
                            <div className="flex flex-col gap-4">
                                {/* Team 1 Block */}
                                <div className={`rounded-xl p-4 transition-all border-2 ${isSwapped ? 'order-3' : 'order-1'} ${getActiveSetScore('team1') > getActiveSetScore('team2') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-transparent'}`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="font-bold text-lg text-[#06324F] truncate max-w-[70%]">{team1.name}</div>
                                        {scoringHistory[scoringHistory.length - 1]?.team === 'team1' && (
                                            <span className="bg-yellow-400 text-[#06324F] text-[10px] px-2 py-0.5 rounded-full animate-pulse font-bold tracking-wider">СЕРВИС</span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <button 
                                            onClick={() => handleScoreChange(activeSet, 'team1', -1)}
                                            className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 active:scale-95 transition-all"
                                        >
                                            <FaMinus />
                                        </button>
                                        <div className="text-6xl font-bold text-[#06324F] font-mono w-24 text-center">
                                            {getActiveSetScore('team1')}
                                        </div>
                                        <button 
                                            onClick={() => handleScoreChange(activeSet, 'team1', 1)}
                                            className="w-16 h-16 flex items-center justify-center rounded-full bg-[#0B8E8D] text-white shadow-lg hover:bg-[#097b7a] active:scale-95 transition-all"
                                        >
                                            <FaPlus className="text-2xl" />
                                        </button>
                                    </div>
                                </div>

                                {/* VS Divider */}
                                <div className="text-center text-gray-400 font-bold order-2">VS</div>

                                {/* Team 2 Block */}
                                <div className={`rounded-xl p-4 transition-all border-2 ${isSwapped ? 'order-1' : 'order-3'} ${getActiveSetScore('team2') > getActiveSetScore('team1') ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-transparent'}`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="font-bold text-lg text-[#06324F] truncate max-w-[70%]">{team2.name}</div>
                                        {scoringHistory[scoringHistory.length - 1]?.team === 'team2' && (
                                            <span className="bg-yellow-400 text-[#06324F] text-[10px] px-2 py-0.5 rounded-full animate-pulse font-bold tracking-wider">СЕРВИС</span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <button 
                                            onClick={() => handleScoreChange(activeSet, 'team2', -1)}
                                            className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 active:scale-95 transition-all"
                                        >
                                            <FaMinus />
                                        </button>
                                        <div className="text-6xl font-bold text-[#06324F] font-mono w-24 text-center">
                                            {getActiveSetScore('team2')}
                                        </div>
                                        <button 
                                            onClick={() => handleScoreChange(activeSet, 'team2', 1)}
                                            className="w-16 h-16 flex items-center justify-center rounded-full bg-[#0B8E8D] text-white shadow-lg hover:bg-[#097b7a] active:scale-95 transition-all"
                                        >
                                            <FaPlus className="text-2xl" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Swap Sides Button (Live Mode) */}
                            <div className="flex justify-center mt-2">
                                <button
                                    onClick={() => setIsSwapped(!isSwapped)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                                >
                                    <FaExchangeAlt /> {t.swapTeams || 'Поменять стороны'}
                                </button>
                            </div>

                            {/* Scoring History Grid */}
                            <div className="mt-4 bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                                <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center justify-between">
                                    <div className="text-xs font-bold text-gray-500 flex items-center gap-2 uppercase tracking-wider">
                                        <FaHistory /> {t.scoreHistory || 'История сета'}
                                    </div>
                                    <div className="text-[10px] text-gray-400 font-medium">Сет {activeSet}</div>
                                </div>
                                <div className="overflow-x-auto p-2">
                                    <div className="flex min-h-[50px] items-start">
                                        <div className="flex flex-col shrink-0 mr-2 border-r border-gray-100 pr-2">
                                            <div className="h-6 flex items-center text-[10px] font-bold text-gray-400 uppercase w-12 truncate">{isSwapped ? team2.name : team1.name}</div>
                                            <div className="h-6 flex items-center text-[10px] font-bold text-gray-400 uppercase w-12 truncate">{isSwapped ? team1.name : team2.name}</div>
                                        </div>
                                        
                                        <div className="flex gap-1">
                                            {scoringHistory.length === 0 ? (
                                                <div className="h-12 flex items-center text-xs text-gray-300 italic px-4">Нет данных</div>
                                            ) : (
                                                scoringHistory.map((event, idx) => {
                                                    const isTopRow = isSwapped ? event.team === 'team2' : event.team === 'team1';
                                                    return (
                                                        <div key={idx} className="flex flex-col gap-1 shrink-0 w-6">
                                                            <div className={`h-6 flex items-center justify-center text-[10px] font-bold rounded-sm transition-all ${isTopRow ? 'bg-[#0B8E8D] text-white shadow-sm' : 'bg-gray-50 text-transparent border border-gray-100'}`}>
                                                                {isTopRow ? event.score : ''}
                                                            </div>
                                                            <div className={`h-6 flex items-center justify-center text-[10px] font-bold rounded-sm transition-all ${!isTopRow ? 'bg-[#0B8E8D] text-white shadow-sm' : 'bg-gray-50 text-transparent border border-gray-100'}`}>
                                                                {!isTopRow ? event.score : ''}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* EDIT MODE (Classic) */}
                    {mode === 'edit' && (
                        <div className="space-y-4">
                            {/* Match Details (Time, Court, Referee) */}
                            <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                        <FaCalendarAlt className="mr-2 text-indigo-500" /> {t.time || 'Время'}:
                                    </label>
                                    <input
                                        type="time"
                                        value={currentMatchData.time || ''}
                                        onChange={(e) => onUpdateDetails(currentMatchData.id, 'time', e.target.value)}
                                        className="p-2 border border-gray-300 rounded-lg text-center font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                        <FaMapMarkerAlt className="mr-2 text-[#0B8E8D]" /> {t.court || 'Корт'}:
                                    </label>
                                    <select
                                        value={currentMatchData.court || 1}
                                        onChange={(e) => onUpdateDetails(currentMatchData.id, 'court', parseInt(e.target.value))}
                                        className="p-2 border border-gray-300 rounded-lg font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                    </select>
                                </div>
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                        <FaBullhorn className={`mr-2 ${!currentMatchData.refereeTeamCode ? 'text-red-400' : 'text-gray-400'}`} /> {t.referee || 'Судья'}:
                                    </label>
                                    <select
                                        value={currentMatchData.refereeTeamCode || ""}
                                        onChange={(e) => onUpdateDetails(currentMatchData.id, 'refereeTeamCode', e.target.value)}
                                        className={`p-2 border rounded-lg font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-w-[150px] ${!currentMatchData.refereeTeamCode ? 'border-red-300' : 'border-gray-300'}`}
                                    >
                                        <option value="">{t.selectRefereePlaceholder || '--'}</option>
                                        {availableReferees.map(team => (
                                            <option key={team.code} value={team.code}>{team.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Teams Header */}
                            <div className="bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div className="text-center w-5/12">
                                        <div className="text-lg font-bold text-indigo-800">{isSwapped ? team2.name : team1.name}</div>
                                    </div>
                                    <div className="text-center w-2/12">
                                        <button onClick={() => setIsSwapped(!isSwapped)} className="p-2 bg-[#0B8E8D] text-white rounded-full hover:bg-[#06324F] shadow-md"><FaExchangeAlt /></button>
                                    </div>
                                    <div className="text-center w-5/12">
                                        <div className="text-lg font-bold text-indigo-800">{isSwapped ? team1.name : team2.name}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Scores Inputs */}
                            <div className="space-y-4">
                                {[1, 2].map(setNum => (
                                    <div key={setNum} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{t[`set${setNum}`]}</label>
                                        <div className="flex items-center justify-between">
                                            <input type="number" min="0" max={maxScoreRegularSet} value={isSwapped ? (currentMatchData[`set${setNum}Team2`] ?? 0) : (currentMatchData[`set${setNum}Team1`] ?? 0)} onChange={(e) => onUpdateScore(currentMatchData.id, setNum, isSwapped ? 'team2' : 'team1', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500" />
                                            <span className="text-gray-400 text-xl font-bold">:</span>
                                            <input type="number" min="0" max={maxScoreRegularSet} value={isSwapped ? (currentMatchData[`set${setNum}Team1`] ?? 0) : (currentMatchData[`set${setNum}Team2`] ?? 0)} onChange={(e) => onUpdateScore(currentMatchData.id, setNum, isSwapped ? 'team1' : 'team2', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500" />
                                        </div>
                                    </div>
                                ))}
                                
                                {showThirdSetInput && (
                                    <div className={`bg-white p-4 rounded-lg shadow-sm border ${currentStatus === 'tie_needs_tiebreak' ? 'border-red-300' : 'border-gray-200'}`}>
                                        <label className={`block text-sm font-medium ${currentStatus === 'tie_needs_tiebreak' ? 'text-red-700' : 'text-gray-700'} mb-2`}>{isFinal ? t.set3 : t.tiebreak}</label>
                                        <div className="flex items-center justify-between">
                                            <input type="number" min="0" max={maxScoreTiebreak} value={isSwapped ? (currentMatchData.set3Team2 ?? 0) : (currentMatchData.set3Team1 ?? 0)} onChange={(e) => onUpdateScore(currentMatchData.id, 3, isSwapped ? 'team2' : 'team1', e.target.value)} className={`w-20 p-2 border rounded-lg text-center font-bold text-lg focus:ring-2 ${currentStatus === 'tie_needs_tiebreak' ? 'border-red-300' : 'border-gray-300 focus:ring-indigo-500'}`} />
                                            <span className="text-gray-400 text-xl font-bold">:</span>
                                            <input type="number" min="0" max={maxScoreTiebreak} value={isSwapped ? (currentMatchData.set3Team1 ?? 0) : (currentMatchData.set3Team2 ?? 0)} onChange={(e) => onUpdateScore(currentMatchData.id, 3, isSwapped ? 'team1' : 'team2', e.target.value)} className={`w-20 p-2 border rounded-lg text-center font-bold text-lg focus:ring-2 ${currentStatus === 'tie_needs_tiebreak' ? 'border-red-300' : 'border-gray-300 focus:ring-indigo-500'}`} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between shrink-0">
                    <button onClick={() => onResetMatch(currentMatchData.id)} className="text-red-600 hover:text-red-800 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors">
                        <FaUndo /> <span className="hidden sm:inline">{t.resetMatch || 'Сбросить'}</span>
                    </button>
                    <button onClick={onClose} className="bg-[#0B8E8D] text-white px-6 py-2 rounded-lg hover:opacity-90 shadow-md flex items-center gap-2">
                        <FaCheck /> {t.close || 'Закрыть'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MatchDetailModal;

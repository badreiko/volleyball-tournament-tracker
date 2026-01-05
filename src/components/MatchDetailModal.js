import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaBullhorn, FaSpinner, FaCheck, FaExchangeAlt, FaUndo, FaVolleyballBall, FaUsers, FaTrophy, FaPlus, FaMinus, FaHistory } from 'react-icons/fa';
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
    const [activeSet, setActiveSet] = useState(1);
    const [scoringHistory, setScoringHistory] = useState([]);
    
    const currentMatchData = matches.find(m => m.id === match.id) || match;
    const team1 = teams.find(t => t.code === currentMatchData.team1) || { name: t.tbd };
    const team2 = teams.find(t => t.code === currentMatchData.team2) || { name: t.tbd };
    const currentRefereeTeam = teams.find(t => t.code === currentMatchData.refereeTeamCode);
    const refereeName = currentRefereeTeam?.name || (currentMatchData.refereeTeamCode ? `(${t.refereeTBD || '???'})` : `(${t.selectRefereePlaceholder || 'Не назначен'})`);

    const currentRound = currentMatchData.round || 'unknown';

    // Авто-определение активного сета при открытии
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

    useEffect(() => {
        setScoringHistory([]);
    }, [activeSet, currentMatchData.id]);

    const handleScoreChange = (set, team, delta) => {
        const currentScore = currentMatchData[`set${set}${team === 'team1' ? 'Team1' : 'Team2'}`] || 0;
        const newScore = Math.max(0, currentScore + delta);
        
        if (delta > 0) {
            setScoringHistory(prev => [...prev, { team, score: newScore }]);
        } else if (delta < 0) {
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

    const isFinal = currentRound === 'final' || currentRound === 'third_place' || currentRound === 'fifth_place'; 
    const showThirdSet = isFinal || currentMatchData.status === 'tie_needs_tiebreak' || ((currentMatchData.set1Team1 > 0 || currentMatchData.set1Team2 > 0) && (currentMatchData.set2Team1 > 0 || currentMatchData.set2Team2 > 0)) || (currentMatchData.set3Team1 ?? 0) > 0 || (currentMatchData.set3Team2 ?? 0) > 0;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-end md:items-center justify-center p-0 md:p-4 z-[70] backdrop-blur-sm">
            <div className="bg-white rounded-t-2xl md:rounded-xl shadow-2xl p-0 w-full max-w-lg overflow-hidden flex flex-col max-h-[95vh]">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#0B8E8D] to-[#06324F] p-4 text-white shrink-0 flex justify-between items-center shadow-lg">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg md:text-xl font-bold">{t.matchDetail}</h2>
                        {isSaving && <FaSpinner className="animate-spin text-sm" />}
                    </div>
                    <button onClick={onClose} className="text-white hover:text-red-200 text-3xl p-1">&times;</button>
                </div>

                <div className="p-4 overflow-y-auto flex-1 space-y-5">
                    {/* 1. Настройки (Адаптивная сетка) */}
                    <div className="bg-gray-50 p-3 rounded-xl space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="bg-[#C1CBA7]/50 text-[#06324F] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                {t.roundNames?.[currentRound] || currentRound}
                            </span>
                            <div className="flex items-center text-[11px] font-bold text-gray-500 uppercase">
                                <FaBullhorn className="mr-1 text-gray-400" /> {refereeName}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-indigo-500 text-sm" />
                                <input type="time" value={currentMatchData.time || ''} onChange={(e) => onUpdateDetails(currentMatchData.id, 'time', e.target.value)} className="bg-white border rounded px-2 py-1 text-xs w-full focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-[#0B8E8D] text-sm" />
                                <select value={currentMatchData.court || 1} onChange={(e) => onUpdateDetails(currentMatchData.id, 'court', parseInt(e.target.value))} className="bg-white border rounded px-2 py-1 text-xs w-full focus:ring-2 focus:ring-[#0B8E8D] outline-none">
                                    <option value={1}>Корт 1</option><option value={2}>Корт 2</option><option value={3}>Корт 3</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 2. Переключатель сетов (Крупные табы) */}
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {[1, 2, 3].map(setNum => {
                            if (setNum === 3 && !showThirdSet) return null;
                            const isActive = activeSet === setNum;
                            const s1 = currentMatchData[`set${setNum}Team1`] || 0;
                            const s2 = currentMatchData[`set${setNum}Team2`] || 0;
                            return (
                                <button key={setNum} onClick={() => setActiveSet(setNum)}
                                    className={`flex-1 min-w-[90px] flex flex-col items-center p-2 rounded-xl border-2 transition-all ${isActive ? 'border-[#0B8E8D] bg-[#0B8E8D]/5 shadow-md' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase mb-1">{setNum === 3 ? (isFinal ? 'Сет 3' : 'Тайбрейк') : `Сет ${setNum}`}</span>
                                    <span className={`text-lg font-black ${isActive ? 'text-[#06324F]' : 'text-gray-500'}`}>{s1}:{s2}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* 3. LIVE Управление (Touch-friendly) */}
                    <div className="space-y-3">
                        {[team1, team2].map((team, idx) => {
                            const teamKey = idx === 0 ? 'team1' : 'team2';
                            const isSideSwapped = (idx === 0 && isSwapped) || (idx === 1 && !isSwapped);
                            const score = currentMatchData[`set${activeSet}${teamKey === 'team1' ? 'Team1' : 'Team2'}`] || 0;
                            const otherScore = currentMatchData[`set${activeSet}${teamKey === 'team1' ? 'Team2' : 'Team1'}`] || 0;
                            return (
                                <div key={teamKey} className={`flex items-center p-3 md:p-4 rounded-2xl border-2 transition-all ${isSideSwapped ? 'order-3' : 'order-1'} ${score > otherScore ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100 shadow-sm'}`}>
                                    <div className="flex-1 min-w-0 pr-2">
                                        <div className="font-bold text-sm md:text-base text-[#06324F] leading-tight mb-1">{team.name}</div>
                                        {scoringHistory[scoringHistory.length - 1]?.team === teamKey && 
                                            <span className="bg-orange-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full animate-pulse uppercase tracking-tighter">Подача</span>
                                        }
                                    </div>
                                    <div className="flex items-center gap-3 md:gap-5">
                                        <button onClick={() => handleScoreChange(activeSet, teamKey, -1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 text-red-500 active:bg-red-500 active:text-white transition-colors"><FaMinus /></button>
                                        <div className="text-5xl md:text-6xl font-black text-[#06324F] font-mono w-14 md:w-16 text-center select-none">{score}</div>
                                        <button onClick={() => handleScoreChange(activeSet, teamKey, 1)} className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-[#0B8E8D] text-white shadow-lg active:scale-90 active:bg-[#06324F] transition-all"><FaPlus className="text-2xl" /></button>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="order-2 flex justify-center py-1">
                            <button onClick={() => setIsSwapped(!isSwapped)} className="bg-gray-100 text-gray-500 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-gray-200 active:bg-gray-300 transition-all">
                                <FaExchangeAlt className={isSwapped ? 'rotate-180 transition-transform' : ''} /> {t.swapTeams || 'Смена сторон'}
                            </button>
                        </div>
                    </div>

                    {/* 4. Хроника (Горизонтальный скролл) */}
                    <div className="pt-2 border-t border-dashed">
                        <div className="flex items-center gap-3">
                            <div className="text-[10px] font-black text-gray-400 uppercase shrink-0 flex flex-col items-center">
                                <FaHistory className="mb-1" /> Хроника
                            </div>
                            <div className="flex gap-1 overflow-x-auto no-scrollbar py-2">
                                {scoringHistory.map((event, idx) => {
                                    const isTop = (event.team === 'team1' && !isSwapped) || (event.team === 'team2' && isSwapped);
                                    return (
                                        <div key={idx} className="w-6 h-10 flex flex-col gap-0.5 shrink-0">
                                            <div className={`flex-1 rounded-sm text-[9px] font-bold flex items-center justify-center ${isTop ? 'bg-[#0B8E8D] text-white shadow-sm' : 'bg-gray-100 text-gray-200 border border-gray-50'}`}>{event.score}</div>
                                            <div className={`flex-1 rounded-sm text-[9px] font-bold flex items-center justify-center ${!isTop ? 'bg-[#0B8E8D] text-white shadow-sm' : 'bg-gray-100 text-gray-200 border border-gray-50'}`}>{event.score}</div>
                                        </div>
                                    );
                                })}
                                {scoringHistory.length === 0 && <span className="text-[10px] text-gray-300 italic py-2">Счёт 0:0...</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer (Липкий подвал) */}
                <div className="p-4 border-t bg-gray-50 flex items-center justify-between gap-4 shrink-0">
                    <button onClick={() => onResetMatch(currentMatchData.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                        <FaUndo className="text-[10px]" /> {t.resetMatch || 'Сброс'}
                    </button>
                    <button onClick={onClose} className="flex-1 bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white py-4 rounded-xl hover:opacity-90 shadow-xl flex items-center justify-center gap-2 font-black text-sm md:text-base tracking-wide active:scale-[0.98] transition-all">
                        <FaCheck /> {t.close || 'Готово'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MatchDetailModal;
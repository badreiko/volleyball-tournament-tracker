import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaBullhorn, FaSpinner, FaCheck, FaExchangeAlt, FaUndo, FaVolleyballBall, FaUsers, FaPlus, FaMinus, FaHistory } from 'react-icons/fa';
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
    
    // Фильтр судей: все команды, кроме тех, что играют
    const availableReferees = teams.filter(tm => tm.code !== currentMatchData.team1 && tm.code !== currentMatchData.team2);
    const currentRound = currentMatchData.round || 'unknown';

    // Авто-определение активного сета
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

    const handleScoreChange = (set, teamKey, delta) => {
        const currentScore = currentMatchData[`set${set}${teamKey === 'team1' ? 'Team1' : 'Team2'}`] || 0;
        const newScore = Math.max(0, currentScore + delta);
        
        if (delta > 0) {
            setScoringHistory(prev => [...prev, { team: teamKey, score: newScore }]);
        } else {
            setScoringHistory(prev => {
                const newHistory = [...prev];
                for (let i = newHistory.length - 1; i >= 0; i--) {
                    if (newHistory[i].team === teamKey) {
                        newHistory.splice(i, 1);
                        break;
                    }
                }
                return newHistory;
            });
        }
        onUpdateScore(currentMatchData.id, set, teamKey, newScore.toString());
    };

    const isFinalMatch = currentRound === 'final' || currentRound === 'third_place' || currentRound === 'fifth_place'; 
    const showThirdSet = isFinalMatch || currentMatchData.status === 'tie_needs_tiebreak' || ((currentMatchData.set1Team1 > 0 || currentMatchData.set1Team2 > 0) && (currentMatchData.set2Team1 > 0 || currentMatchData.set2Team2 > 0)) || (currentMatchData.set3Team1 ?? 0) > 0 || (currentMatchData.set3Team2 ?? 0) > 0;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center p-2 md:p-4 z-[70] backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-lg overflow-hidden flex flex-col max-h-[95vh]">
                
                {/* Header */}
                <div className="bg-[#06324F] p-4 text-white shrink-0 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <FaVolleyballBall className="text-[#0B8E8D]" />
                        <h2 className="text-lg font-bold">{t.matchDetail}</h2>
                        {isSaving && <FaSpinner className="animate-spin text-sm" />}
                    </div>
                    <button onClick={onClose} className="text-white hover:text-red-200 text-3xl leading-none">&times;</button>
                </div>

                <div className="p-4 overflow-y-auto flex-1 space-y-6">
                    
                    {/* 1. Основные настройки */}
                    <div className="grid grid-cols-1 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between border-b pb-2">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.roundNames?.[currentRound] || currentRound}</span>
                            <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-indigo-500" />
                                <input type="time" value={currentMatchData.time || ''} onChange={(e) => onUpdateDetails(currentMatchData.id, 'time', e.target.value)} className="text-sm font-bold border-none bg-transparent" />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">{t.referee}</label>
                                <select 
                                    value={currentMatchData.refereeTeamCode || ""} 
                                    onChange={(e) => onUpdateDetails(currentMatchData.id, 'refereeTeamCode', e.target.value)}
                                    className="w-full p-2 border rounded bg-white font-medium focus:ring-2 focus:ring-[#0B8E8D]"
                                >
                                    <option value="">{t.selectRefereePlaceholder || '-- Выберите судью --'}</option>
                                    {availableReferees.map(tm => <option key={tm.code} value={tm.code}>{tm.name}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">{t.court}</label>
                                <select 
                                    value={currentMatchData.court || 1} 
                                    onChange={(e) => onUpdateDetails(currentMatchData.id, 'court', parseInt(e.target.value))}
                                    className="w-full p-2 border rounded bg-white font-medium focus:ring-2 focus:ring-[#0B8E8D]"
                                >
                                    <option value={1}>Корт 1</option><option value={2}>Корт 2</option><option value={3}>Корт 3</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 2. Выбор сета */}
                    <div className="flex gap-2 justify-center">
                        {[1, 2, 3].map(setNum => {
                            if (setNum === 3 && !showThirdSet) return null;
                            const isActive = activeSet === setNum;
                            const s1 = currentMatchData[`set${setNum}Team1`] || 0;
                            const s2 = currentMatchData[`set${setNum}Team2`] || 0;
                            return (
                                <button key={setNum} onClick={() => setActiveSet(setNum)}
                                    className={`flex-1 flex flex-col items-center p-3 rounded-xl border-2 transition-all ${isActive ? 'border-[#0B8E8D] bg-white shadow-lg scale-105' : 'border-gray-100 bg-gray-50 opacity-50'}`}>
                                    <span className="text-[10px] font-black text-gray-400 uppercase mb-1">{setNum === 3 ? (isFinalMatch ? 'Сет 3' : 'ТБ') : `Сет ${setNum}`}</span>
                                    <span className="text-xl font-black text-[#06324F]">{s1}:{s2}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* 3. Управление (Симметричное) */}
                    <div className="flex flex-col gap-4">
                        {[0, 1].map(idx => {
                            const actualIdx = isSwapped ? (idx === 0 ? 1 : 0) : idx;
                            const team = actualIdx === 0 ? team1 : team2;
                            const teamKey = actualIdx === 0 ? 'team1' : 'team2';
                            const score = currentMatchData[`set${activeSet}${teamKey === 'team1' ? 'Team1' : 'Team2'}`] || 0;
                            const otherScore = currentMatchData[`set${activeSet}${teamKey === 'team1' ? 'Team2' : 'Team1'}`] || 0;
                            
                            return (
                                <div key={teamKey} className={`p-4 rounded-2xl border-2 transition-all ${score > otherScore ? 'bg-green-50 border-green-200 shadow-md' : 'bg-white border-gray-100'}`}>
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="font-black text-[#06324F] truncate text-base">{team.name}</div>
                                        {scoringHistory[scoringHistory.length - 1]?.team === teamKey && 
                                            <span className="bg-yellow-400 text-[#06324F] text-[10px] font-black px-2 py-0.5 rounded uppercase animate-pulse">Подача</span>
                                        }
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <button onClick={() => handleScoreChange(activeSet, teamKey, -1)} className="w-14 h-14 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90 text-2xl font-bold">
                                            <FaMinus />
                                        </button>
                                        <div className="text-6xl font-black text-[#06324F] font-mono tracking-tighter w-24 text-center select-none">{score}</div>
                                        <button onClick={() => handleScoreChange(activeSet, teamKey, 1)} className="w-14 h-14 flex items-center justify-center rounded-xl bg-[#0B8E8D] text-white hover:bg-[#06324F] transition-all shadow-md active:scale-90 text-2xl font-bold">
                                            <FaPlus />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        
                        <div className="flex justify-center">
                            <button onClick={() => setIsSwapped(!isSwapped)} className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-[#0B8E8D] uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full">
                                <FaExchangeAlt className={isSwapped ? 'rotate-180 transition-transform' : ''} /> {t.swapTeams || 'Смена сторон'}
                            </button>
                        </div>
                    </div>

                    {/* 4. Хроника */}
                    <div className="pt-4 border-t-2 border-dashed border-gray-100 overflow-x-auto no-scrollbar">
                        <div className="flex items-center gap-4 min-w-max">
                            <div className="text-[10px] font-black text-gray-300 uppercase shrink-0"><FaHistory className="inline mr-1" /> Хроника</div>
                            <div className="flex gap-1.5">
                                {scoringHistory.map((event, idx) => {
                                    const isT1 = event.team === 'team1';
                                    const isUp = (isT1 && !isSwapped) || (!isT1 && isSwapped);
                                    return (
                                        <div key={idx} className="w-7 h-12 flex flex-col gap-1 shrink-0">
                                            <div className={`flex-1 rounded flex items-center justify-center text-[10px] font-black ${isUp ? 'bg-[#0B8E8D] text-white shadow-sm' : 'bg-gray-100 text-gray-300'}`}>{isUp ? event.score : ''}</div>
                                            <div className={`flex-1 rounded flex items-center justify-center text-[10px] font-black ${!isUp ? 'bg-[#0B8E8D] text-white shadow-sm' : 'bg-gray-100 text-gray-300'}`}>{!isUp ? event.score : ''}</div>
                                        </div>
                                    );
                                })}
                                {scoringHistory.length === 0 && <span className="text-[11px] text-gray-300 font-bold uppercase tracking-wider italic px-4">Счёт не открыт...</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t flex gap-4 shrink-0">
                    <button onClick={() => onResetMatch(currentMatchData.id)} className="px-4 py-2 text-red-500 text-xs font-black uppercase hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
                        <FaUndo /> {t.resetMatch || 'Сброс'}
                    </button>
                    <button onClick={onClose} className="flex-1 bg-[#0B8E8D] text-white py-4 rounded-xl hover:bg-[#06324F] shadow-lg flex items-center justify-center gap-3 font-black text-base uppercase tracking-widest active:scale-95 transition-all">
                        <FaCheck /> {t.close || 'Готово'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MatchDetailModal;

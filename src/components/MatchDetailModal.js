import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaBullhorn, FaSpinner, FaCheck, FaExchangeAlt, FaUndo, FaVolleyballBall, FaPlus, FaMinus, FaHistory } from 'react-icons/fa';
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
    
    const availableReferees = teams.filter(tm => tm.code !== currentMatchData.team1 && tm.code !== currentMatchData.team2);
    const currentRound = currentMatchData.round || 'unknown';

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

    const TeamScoreBlock = ({ teamKey, team }) => {
        const score = currentMatchData[`set${activeSet}${teamKey === 'team1' ? 'Team1' : 'Team2'}`] || 0;
        const isServing = scoringHistory[scoringHistory.length - 1]?.team === teamKey;
        
        return (
            <div className="flex flex-col items-center flex-1 min-w-0">
                <div className={`text-[10px] font-black uppercase mb-1 h-4 flex items-center ${isServing ? 'text-orange-500 animate-pulse' : 'text-gray-400'}`}>
                    {isServing ? 'Подача' : ''}
                </div>
                <div className="text-xs font-bold text-[#06324F] text-center mb-3 h-8 flex items-center justify-center line-clamp-2 px-1 leading-tight">
                    {team.name}
                </div>
                <div className="flex flex-col items-center gap-2">
                    <button onClick={() => handleScoreChange(activeSet, teamKey, 1)} className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl bg-[#0B8E8D] text-white shadow-md active:scale-90 text-xl">
                        <FaPlus />
                    </button>
                    <div className="text-4xl md:text-5xl font-black text-[#06324F] font-mono py-1 select-none">
                        {score}
                    </div>
                    <button onClick={() => handleScoreChange(activeSet, teamKey, -1)} className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 hover:text-red-500 active:scale-90 text-sm">
                        <FaMinus />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center p-2 md:p-4 z-[70] backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-md overflow-hidden flex flex-col max-h-[95vh]">
                
                {/* Header */}
                <div className="bg-[#06324F] p-3 text-white shrink-0 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <FaVolleyballBall className="text-[#0B8E8D] text-sm" />
                        <h2 className="text-sm font-bold truncate max-w-[200px]">{t.matchDetail}</h2>
                        {isSaving && <FaSpinner className="animate-spin text-[10px]" />}
                    </div>
                    <button onClick={onClose} className="text-white hover:text-red-200 text-2xl leading-none px-2">&times;</button>
                </div>

                <div className="p-4 overflow-y-auto flex-1 space-y-5">
                    
                    {/* 1. Настройки (ТЕПЕРЬ ВВЕРХУ) */}
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                            <span className="bg-[#C1CBA7]/50 text-[#06324F] px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                                {t.roundNames?.[currentRound] || currentRound}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] font-bold">
                                <FaCalendarAlt className="text-indigo-500" />
                                <input type="time" value={currentMatchData.time || ''} onChange={(e) => onUpdateDetails(currentMatchData.id, 'time', e.target.value)} className="bg-transparent border-none outline-none w-14 p-0 text-[#06324F]" />
                                <span className="text-gray-300">|</span>
                                <FaMapMarkerAlt className="text-[#0B8E8D]" />
                                <select value={currentMatchData.court || 1} onChange={(e) => onUpdateDetails(currentMatchData.id, 'court', parseInt(e.target.value))} className="bg-transparent border-none outline-none p-0 text-[#06324F]">
                                    <option value={1}>К1</option><option value={2}>К2</option><option value={3}>К3</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Судья</label>
                            <select value={currentMatchData.refereeTeamCode || ""} onChange={(e) => onUpdateDetails(currentMatchData.id, 'refereeTeamCode', e.target.value)} className="w-full p-1.5 border rounded bg-white text-xs font-bold text-[#06324F] focus:ring-1 focus:ring-[#0B8E8D] outline-none">
                                <option value="">-- Выберите судью --</option>
                                {availableReferees.map(tm => <option key={tm.code} value={tm.code}>{tm.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* 2. Селектор сетов */}
                    <div className="flex gap-1.5 justify-center">
                        {[1, 2, 3].map(setNum => {
                            if (setNum === 3 && !showThirdSet) return null;
                            const isActive = activeSet === setNum;
                            const s1 = currentMatchData[`set${setNum}Team1`] || 0;
                            const s2 = currentMatchData[`set${setNum}Team2`] || 0;
                            return (
                                <button key={setNum} onClick={() => setActiveSet(setNum)}
                                    className={`flex flex-col items-center px-3 py-1.5 rounded-lg border-2 transition-all min-w-[70px] ${isActive ? 'border-[#0B8E8D] bg-white shadow-sm' : 'border-transparent bg-gray-50 opacity-50'}`}>
                                    <span className="text-[8px] font-black text-gray-400 uppercase">{setNum === 3 ? (isFinalMatch ? 'Сет 3' : 'ТБ') : `Сет ${setNum}`}</span>
                                    <span className="text-sm font-black text-[#06324F]">{s1}:{s2}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* 3. LIVE Табло */}
                    <div className="bg-white rounded-2xl p-4 border-2 border-gray-50 shadow-sm relative overflow-hidden">
                        <div className="flex items-start justify-between gap-2">
                            <TeamScoreBlock teamKey={isSwapped ? 'team2' : 'team1'} team={isSwapped ? team2 : team1} />
                            
                            <div className="flex flex-col items-center justify-center pt-12 self-stretch">
                                <div className="text-gray-200 font-black text-xl mb-4">:</div>
                                <button onClick={() => setIsSwapped(!isSwapped)} className="p-2 text-gray-400 hover:text-[#0B8E8D] bg-gray-50 rounded-full shadow-inner border border-gray-100">
                                    <FaExchangeAlt className={`text-[10px] ${isSwapped ? 'rotate-180' : ''} transition-transform`} />
                                </button>
                            </div>

                            <TeamScoreBlock teamKey={isSwapped ? 'team1' : 'team2'} team={isSwapped ? team1 : team2} />
                        </div>
                    </div>

                    {/* 4. Хроника */}
                    <div className="pt-2 overflow-x-auto no-scrollbar">
                        <div className="flex items-center gap-3">
                            <div className="text-[9px] font-black text-gray-300 uppercase shrink-0"><FaHistory /></div>
                            <div className="flex gap-1">
                                {scoringHistory.map((event, idx) => {
                                    const isLeft = (event.team === 'team1' && !isSwapped) || (event.team === 'team2' && isSwapped);
                                    return (
                                        <div key={idx} className="w-5 h-8 flex flex-col gap-0.5 shrink-0">
                                            <div className={`flex-1 rounded-sm text-[8px] font-black flex items-center justify-center ${isLeft ? 'bg-[#0B8E8D] text-white shadow-sm' : 'bg-gray-50 text-gray-300'}`}>{isLeft ? event.score : ''}</div>
                                            <div className={`flex-1 rounded-sm text-[8px] font-black flex items-center justify-center ${!isLeft ? 'bg-[#0B8E8D] text-white shadow-sm' : 'bg-gray-50 text-gray-300'}`}>{!isLeft ? event.score : ''}</div>
                                        </div>
                                    );
                                })}
                                {scoringHistory.length === 0 && <span className="text-[9px] text-gray-300 uppercase italic">Начните игру...</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3 bg-gray-50 border-t flex gap-3 shrink-0">
                    <button onClick={() => onResetMatch(currentMatchData.id)} className="p-2 text-red-400 hover:text-red-600 transition-colors" title="Сброс матча">
                        <FaUndo className="text-xs" />
                    </button>
                    <button onClick={onClose} className="flex-1 bg-[#0B8E8D] text-white py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
                        <FaCheck /> {t.close || 'Готово'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MatchDetailModal;

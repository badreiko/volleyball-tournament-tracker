import React, { useState, useEffect, useRef } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaBullhorn, FaSpinner, FaCheck, FaExchangeAlt, FaUndo, FaVolleyballBall, FaPlus, FaMinus, FaHistory } from 'react-icons/fa';
import { isSetCompleted } from '../utils';
import TimePickerModal from './TimePickerModal';

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
    const [activeSet, setActiveSet] = useState(1);
    const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);    
    // Получаем живые данные матча из Firebase через пропс matches
    const currentMatchData = matches.find(m => m.id === match.id) || match;
    
    const team1 = teams.find(t => t.code === currentMatchData.team1) || { name: t.tbd };
    const team2 = teams.find(t => t.code === currentMatchData.team2) || { name: t.tbd };
    
    const availableReferees = teams.filter(tm => tm.code !== currentMatchData.team1 && tm.code !== currentMatchData.team2);
    const currentRound = currentMatchData.round || 'unknown';
    const isFinalMatch = currentRound === 'final' || currentRound === 'third_place' || currentRound === 'fifth_place'; 

    // Стороны теперь зависят от глобального состояния baseIsSwapped из Firebase
    const baseIsSwapped = currentMatchData.baseIsSwapped || false;
    
    // Ротация: в четных сетах (2-й) стороны инвертируются относительно базовых
    const isCurrentlySwapped = activeSet % 2 === 0 ? !baseIsSwapped : baseIsSwapped;

    // История теперь берется из Firebase для конкретного сета
    const currentSetHistory = currentMatchData[`set${activeSet}History`] || [];

    const lastAutoSetRef = useRef(0);

    // === УМНАЯ ЛОГИКА АВТО-ПЕРЕКЛЮЧЕНИЯ СЕТОВ ===
    useEffect(() => {
        const { set1Team1, set1Team2, set2Team1, set2Team2 } = currentMatchData;
        const isPlayoff = currentRound !== 'group';
        const setLimit = isPlayoff ? tournamentSettings.playoffSetPointLimit : tournamentSettings.groupSetPointLimit;
        const winDiff = isPlayoff ? tournamentSettings.playoffWinDifference : tournamentSettings.groupWinDifference;

        const set1Done = isSetCompleted(set1Team1, set1Team2, false, false, setLimit, winDiff);
        const set2Done = isSetCompleted(set2Team1, set2Team2, false, false, setLimit, winDiff);
        const needsThirdSet = isFinalMatch || (set1Done && set2Done && (set1Team1 > set1Team2) !== (set2Team1 > set2Team2));
        
        let autoTargetSet = 1;
        if (set1Done) autoTargetSet = 2;
        if (set1Done && set2Done && needsThirdSet) autoTargetSet = 3;

        if (autoTargetSet > lastAutoSetRef.current) {
            setActiveSet(autoTargetSet);
            lastAutoSetRef.current = autoTargetSet;
        }
    }, [
        currentMatchData.set1Team1, currentMatchData.set1Team2, 
        currentMatchData.set2Team1, currentMatchData.set2Team2, 
        currentRound, tournamentSettings, isFinalMatch
    ]);

    const handleScoreChange = (set, teamKey, delta) => {
        const currentScore = currentMatchData[`set${set}${teamKey === 'team1' ? 'Team1' : 'Team2'}`] || 0;
        const newScore = Math.max(0, currentScore + delta);
        
        // Обновляем историю в Firebase
        let newHistory = [...currentSetHistory];
        if (delta > 0) {
            newHistory.push({ team: teamKey, score: newScore });
        } else {
            // Удаляем последнее взятое очко этой команды
            for (let i = newHistory.length - 1; i >= 0; i--) {
                if (newHistory[i].team === teamKey) {
                    newHistory.splice(i, 1);
                    break;
                }
            }
        }
        
        // Сохраняем и счет, и историю в Firebase
        onUpdateScore(currentMatchData.id, set, teamKey, newScore.toString());
        onUpdateDetails(currentMatchData.id, `set${set}History`, newHistory);
    };

    const toggleSides = () => {
        // Меняем базовое положение сторон для всего матча и сохраняем в Firebase
        onUpdateDetails(currentMatchData.id, 'baseIsSwapped', !baseIsSwapped);
    };

    const showThirdSet = isFinalMatch || currentMatchData.status === 'tie_needs_tiebreak' || ((currentMatchData.set1Team1 > 0 || currentMatchData.set1Team2 > 0) && (currentMatchData.set2Team1 > 0 || currentMatchData.set2Team2 > 0)) || (currentMatchData.set3Team1 ?? 0) || (currentMatchData.set3Team2 ?? 0);

    const TeamScoreBlock = ({ teamKey, team }) => {
        const score = currentMatchData[`set${activeSet}${teamKey === 'team1' ? 'Team1' : 'Team2'}`] || 0;
        const otherScore = currentMatchData[`set${activeSet}${teamKey === 'team1' ? 'Team2' : 'Team1'}`] || 0;
        const isServing = currentSetHistory[currentSetHistory.length - 1]?.team === teamKey;
        
        return (
            <div className="flex flex-col items-center flex-1 min-w-0 px-1">
                <div className={`text-[10px] font-black uppercase mb-1 h-4 ${isServing ? 'text-orange-500 animate-pulse' : 'text-transparent'}`}>
                    Подача
                </div>
                <div className="text-xs font-black text-[#06324F] text-center mb-4 h-10 flex items-center justify-center leading-tight px-1 uppercase tracking-tight">
                    {team.name}
                </div>
                <div className="flex flex-col items-center gap-3">
                    <button onClick={() => handleScoreChange(activeSet, teamKey, 1)} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#0B8E8D] text-white shadow-lg active:scale-95 transition-all">
                        <FaPlus className="text-2xl" />
                    </button>
                    <div className="text-5xl font-black text-[#06324F] font-mono select-none">
                        {score}
                    </div>
                    <button onClick={() => handleScoreChange(activeSet, teamKey, -1)} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gray-100 text-gray-400 active:scale-95 active:bg-red-50 active:text-red-500 transition-all">
                        <FaMinus className="text-xl" />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center p-2 md:p-4 z-[70] backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-md overflow-hidden flex flex-col max-h-[98vh]">
                
                <div className="bg-[#06324F] p-4 text-white shrink-0 flex justify-between items-center shadow-md">
                    <div className="flex items-center gap-2">
                        <FaVolleyballBall className="text-[#0B8E8D]" />
                        <h2 className="text-base font-bold uppercase tracking-tight">{t.matchDetail}</h2>
                        {isSaving && <FaSpinner className="animate-spin text-xs" />}
                    </div>
                    <button onClick={onClose} className="text-white hover:text-red-200 text-3xl leading-none">&times;</button>
                </div>

                <div className="p-4 overflow-y-auto flex-1 space-y-6">
                    
                    {/* Настройки */}
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-4 shadow-inner text-[#06324F]">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Время</label>
                                <button 
                                    onClick={() => setIsTimePickerOpen(true)}
                                    className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-2.5 shadow-sm text-sm hover:border-[#0B8E8D] transition-colors"
                                >
                                    <FaCalendarAlt className="text-indigo-500" />
                                    <span className="font-bold text-[#06324F]">{currentMatchData.time || '00:00'}</span>
                                </button>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Корт</label>
                                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-2.5 shadow-sm">
                                    <FaMapMarkerAlt className="text-[#0B8E8D]" />
                                    <select value={currentMatchData.court || 1} onChange={(e) => onUpdateDetails(currentMatchData.id, 'court', parseInt(e.target.value))} className="w-full bg-transparent outline-none font-bold">
                                        <option value={1}>Корт 1</option><option value={2}>Корт 2</option><option value={3}>Корт 3</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Судья</label>
                            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-2.5 shadow-sm">
                                <FaBullhorn className="text-gray-400" />
                                <select value={currentMatchData.refereeTeamCode || ""} onChange={(e) => onUpdateDetails(currentMatchData.id, 'refereeTeamCode', e.target.value)} className="w-full bg-transparent outline-none font-bold">
                                    <option value="">-- Выберите судью --</option>
                                    {availableReferees.map(tm => <option key={tm.code} value={tm.code}>{tm.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Навигация по сетам */}
                    <div className="flex gap-2 justify-center">
                        {[1, 2, 3].map(setNum => {
                            if (setNum === 3 && !showThirdSet) return null;
                            const isActive = activeSet === setNum;
                            const s1 = currentMatchData[`set${setNum}Team1`] || 0;
                            const s2 = currentMatchData[`set${setNum}Team2`] || 0;
                            return (
                                <button key={setNum} onClick={() => setActiveSet(setNum)}
                                    className={`flex-1 flex flex-col items-center px-4 py-2 rounded-xl border-2 transition-all min-w-[80px] ${isActive ? 'border-[#0B8E8D] bg-white shadow-md scale-105' : 'border-transparent bg-gray-100 opacity-50'}`}>
                                    <span className="text-[9px] font-black text-gray-400 uppercase mb-1">{setNum === 3 ? 'ТБ' : `Сет ${setNum}`}</span>
                                    <span className="text-base font-black text-[#06324F]">{s1}:{s2}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* LIVE Табло */}
                    <div className="flex items-start justify-between gap-2 py-2">
                        <TeamScoreBlock 
                            teamKey={isCurrentlySwapped ? 'team2' : 'team1'} 
                            team={isCurrentlySwapped ? team2 : team1} 
                        />
                        
                        <div className="flex flex-col items-center justify-center self-stretch pt-16">
                            <div className="text-gray-200 font-black text-2xl mb-6">:</div>
                            <button onClick={toggleSides} title="Поменять стороны для всего матча" className="p-3 text-gray-400 hover:text-[#0B8E8D] bg-gray-50 rounded-full border border-gray-100 shadow-sm active:rotate-180 transition-all duration-300">
                                <FaExchangeAlt className="text-sm" />
                            </button>
                        </div>

                        <TeamScoreBlock 
                            teamKey={isCurrentlySwapped ? 'team1' : 'team2'} 
                            team={isCurrentlySwapped ? team1 : team2} 
                        />
                    </div>

                    {/* Хроника */}
                    <div className="pt-4 border-t border-dashed border-gray-200 overflow-x-auto no-scrollbar">
                        <div className="flex items-center gap-4">
                            <div className="text-[9px] font-black text-gray-300 uppercase shrink-0"><FaHistory /></div>
                            <div className="flex gap-1">
                                {currentSetHistory.map((event, idx) => {
                                    const isLeft = (event.team === 'team1' && !isCurrentlySwapped) || (event.team === 'team2' && isCurrentlySwapped);
                                    return (
                                        <div key={idx} className="w-6 h-10 flex flex-col gap-0.5 shrink-0">
                                            <div className={`flex-1 rounded flex items-center justify-center text-[10px] font-black ${isLeft ? 'bg-[#0B8E8D] text-white shadow-sm' : 'bg-gray-50 text-gray-300'}`}>{isLeft ? event.score : ''}</div>
                                            <div className={`flex-1 rounded flex items-center justify-center text-[10px] font-black ${!isLeft ? 'bg-[#0B8E8D] text-white shadow-sm' : 'bg-gray-50 text-gray-300'}`}>{!isLeft ? event.score : ''}</div>
                                        </div>
                                    );
                                })}
                                {currentSetHistory.length === 0 && <span className="text-[10px] text-gray-300 italic">Сет начат...</span>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-100 border-t flex gap-4 shrink-0">
                    <button onClick={() => onResetMatch(currentMatchData.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        <FaUndo />
                    </button>
                    <button onClick={onClose} className="flex-1 bg-[#06324F] text-white py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 font-black text-sm uppercase tracking-widest active:scale-95 transition-all">
                        <FaCheck /> {t.close || 'Готово'}
                    </button>
                </div>
            </div>

            {/* Модалка выбора времени */}
            <TimePickerModal 
                isOpen={isTimePickerOpen}
                onClose={() => setIsTimePickerOpen(false)}
                currentTime={currentMatchData.time}
                onSave={(newTime) => onUpdateDetails(currentMatchData.id, 'time', newTime)}
            />
        </div>
    );
};

export default MatchDetailModal;

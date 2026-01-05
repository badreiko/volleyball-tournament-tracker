import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaBullhorn, FaSpinner, FaCheck, FaExchangeAlt, FaUndo, FaVolleyballBall, FaUsers, FaChartBar, FaTrophy, FaExclamationTriangle, FaRegClock, FaPlus, FaMinus, FaHistory } from 'react-icons/fa';
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
    
    // Получаем живые данные матча
    const currentMatchData = matches.find(m => m.id === match.id) || match;
    
    const team1 = teams.find(t => t.code === currentMatchData.team1) || { name: t.tbd };
    const team2 = teams.find(t => t.code === currentMatchData.team2) || { name: t.tbd };
    const currentRefereeTeam = teams.find(t => t.code === currentMatchData.refereeTeamCode);
    const refereeName = currentRefereeTeam?.name || (currentMatchData.refereeTeamCode ? `(${t.refereeTBD || '???'})` : `(${t.selectRefereePlaceholder || 'Не назначен'})`);

    const currentRound = currentMatchData.round || 'unknown';
    const availableReferees = teams.filter(t => t.code !== currentMatchData.team1 && t.code !== currentMatchData.team2);

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

    // Сброс локальной истории при смене активного сета
    useEffect(() => {
        setScoringHistory([]);
    }, [activeSet, currentMatchData.id]);

    const handleScoreChange = (set, team, delta) => {
        let currentScore = 0;
        const isTeam1 = team === 'team1';
        
        if (set === 1) currentScore = isTeam1 ? (currentMatchData.set1Team1 || 0) : (currentMatchData.set1Team2 || 0);
        else if (set === 2) currentScore = isTeam1 ? (currentMatchData.set2Team1 || 0) : (currentMatchData.set2Team2 || 0);
        else if (set === 3) currentScore = isTeam1 ? (currentMatchData.set3Team1 || 0) : (currentMatchData.set3Team2 || 0);

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

    const getActiveSetScore = (teamCode) => {
        const isTeam1 = teamCode === 'team1';
        if (activeSet === 1) return isTeam1 ? (currentMatchData.set1Team1 || 0) : (currentMatchData.set1Team2 || 0);
        if (activeSet === 2) return isTeam1 ? (currentMatchData.set2Team1 || 0) : (currentMatchData.set2Team2 || 0);
        if (activeSet === 3) return isTeam1 ? (currentMatchData.set3Team1 || 0) : (currentMatchData.set3Team2 || 0);
        return 0;
    };

    const isFinal = currentRound === 'final' || currentRound === 'third_place' || currentRound === 'fifth_place'; 
    const isPlayoff = currentRound !== 'group'; 
    const setLimit = isPlayoff ? tournamentSettings.playoffSetPointLimit : tournamentSettings.groupSetPointLimit; 
    const winDiff = isPlayoff ? tournamentSettings.playoffWinDifference : tournamentSettings.groupWinDifference; 
    const showThirdSetInput = isFinal || currentMatchData.status === 'tie_needs_tiebreak' || ((currentMatchData.set1Team1 > 0 || currentMatchData.set1Team2 > 0) && (currentMatchData.set2Team1 > 0 || currentMatchData.set2Team2 > 0)) || (currentMatchData.set3Team1 ?? 0) > 0 || (currentMatchData.set3Team2 ?? 0) > 0;

    let roundClass = 'px-3 py-1 rounded-full text-xs font-semibold inline-block'; 
    let roundIcon; 
    const roundText = t.roundNames?.[currentRound] || currentRound; 
    if (currentRound === 'group') { roundClass += ' bg-[#C1CBA7]/50 text-[#06324F]'; roundIcon = <FaUsers className="mr-1" />; } 
    else if (currentRound === 'final') { roundClass += ' bg-[#FDD80F]/20 text-[#FDD80F]/90'; roundIcon = <FaTrophy className="mr-1" />; }
    else { roundClass += ' bg-gray-200 text-gray-700'; roundIcon = <FaVolleyballBall className="mr-1" />; }

    let statusClass = 'px-3 py-1 rounded-full text-xs font-semibold inline-block ml-2'; 
    const statusText = t.statusNames?.[currentMatchData.status] || currentMatchData.status;
    if (currentMatchData.status === 'completed') statusClass += ' bg-green-100 text-green-800';
    else if (currentMatchData.status === 'in_progress') statusClass += ' bg-yellow-100 text-yellow-800';
    else statusClass += ' bg-gray-100 text-gray-500';

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center p-2 md:p-4 z-[70] backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-2xl overflow-hidden flex flex-col max-h-[98vh]">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#0B8E8D] to-[#06324F] p-4 text-white shrink-0">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold">{t.matchDetail}</h2>
                            {isSaving && <FaSpinner className="animate-spin text-sm" />}
                        </div>
                        <button onClick={onClose} className="text-white hover:text-red-200 text-2xl leading-none">&times;</button>
                    </div>
                </div>

                <div className="p-4 overflow-y-auto flex-1 space-y-6">
                    {/* 1. Настройки матча */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className={roundClass}><span className="flex items-center">{roundIcon}{roundText}</span></span>
                                <span className={statusClass}>{statusText}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                <FaBullhorn className="mr-2 text-gray-400" />
                                <span className="font-semibold mr-1">{t.referee}:</span> {refereeName}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center text-sm font-medium text-gray-700">
                                    <FaCalendarAlt className="mr-2 text-indigo-500" /> {t.time}:
                                </div>
                                <input type="time" value={currentMatchData.time || ''} onChange={(e) => onUpdateDetails(currentMatchData.id, 'time', e.target.value)} className="p-1 text-sm border rounded" />
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center text-sm font-medium text-gray-700">
                                    <FaMapMarkerAlt className="mr-2 text-[#0B8E8D]" /> {t.court}:
                                </div>
                                <select value={currentMatchData.court || 1} onChange={(e) => onUpdateDetails(currentMatchData.id, 'court', parseInt(e.target.value))} className="p-1 text-sm border rounded">
                                    <option value={1}>1</option><option value={2}>2</option><option value={3}>3</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 2. LIVE УПРАВЛЕНИЕ (Центральный блок) */}
                    <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-4">
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3].map(setNum => (
                                <button key={setNum} onClick={() => setActiveSet(setNum)} disabled={setNum === 3 && !showThirdSetInput}
                                    className={`px-4 py-1 rounded-full font-bold text-xs transition-all ${activeSet === setNum ? 'bg-[#0B8E8D] text-white shadow-md' : 'bg-white text-gray-500 border'} ${setNum === 3 && !showThirdSetInput ? 'opacity-30' : ''}`}>
                                    {setNum === 3 ? (isFinal ? t.set3 : t.tiebreak) : `${t.set || 'Сет'} ${setNum}`}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3">
                            {[team1, team2].map((team, idx) => {
                                const teamKey = idx === 0 ? 'team1' : 'team2';
                                const isSideSwapped = (idx === 0 && isSwapped) || (idx === 1 && !isSwapped);
                                return (
                                    <div key={teamKey} className={`flex items-center justify-between p-3 rounded-lg bg-white border shadow-sm ${isSideSwapped ? 'order-3' : 'order-1'} ${getActiveSetScore(teamKey) > getActiveSetScore(teamKey === 'team1' ? 'team2' : 'team1') ? 'border-green-200 ring-1 ring-green-100' : 'border-gray-100'}`}>
                                        <div className="flex-1 min-w-0 pr-2">
                                            <div className="font-bold text-sm text-[#06324F] truncate">{team.name}</div>
                                            {scoringHistory[scoringHistory.length - 1]?.team === teamKey && <span className="text-[9px] font-bold text-orange-500 animate-pulse uppercase">Подача</span>}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => handleScoreChange(activeSet, teamKey, -1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500"><FaMinus className="text-xs" /></button>
                                            <div className="text-4xl font-black text-[#06324F] font-mono w-12 text-center">{getActiveSetScore(teamKey)}</div>
                                            <button onClick={() => handleScoreChange(activeSet, teamKey, 1)} className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0B8E8D] text-white shadow-md hover:bg-[#097b7a] active:scale-90"><FaPlus className="text-xl" /></button>
                                        </div>
                                    </div>
                                );
                            })}
                            <button onClick={() => setIsSwapped(!isSwapped)} className="order-2 self-center p-1.5 text-gray-400 hover:text-[#0B8E8D] transition-colors"><FaExchangeAlt className="text-sm" /></button>
                        </div>

                        {/* История сета */}
                        <div className="overflow-x-auto py-2 border-t border-dashed">
                            <div className="flex items-center gap-2 min-h-[40px]">
                                <div className="text-[9px] font-bold text-gray-400 uppercase w-10 shrink-0 pr-1 border-r">Хроника</div>
                                <div className="flex gap-1">
                                    {scoringHistory.map((event, idx) => (
                                        <div key={idx} className={`w-5 h-8 flex flex-col gap-0.5 shrink-0`}>
                                            <div className={`flex-1 rounded-sm text-[9px] font-bold flex items-center justify-center ${(event.team === 'team1' && !isSwapped) || (event.team === 'team2' && isSwapped) ? 'bg-[#0B8E8D] text-white' : 'bg-gray-100 text-transparent'}`}>{event.score}</div>
                                            <div className={`flex-1 rounded-sm text-[9px] font-bold flex items-center justify-center ${(event.team === 'team2' && !isSwapped) || (event.team === 'team1' && isSwapped) ? 'bg-[#0B8E8D] text-white' : 'bg-gray-100 text-transparent'}`}>{event.score}</div>
                                        </div>
                                    ))}
                                    {scoringHistory.length === 0 && <span className="text-[10px] text-gray-300 italic">Начните ввод очков...</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. ИТОГОВЫЙ ПРОТОКОЛ (Все сеты) */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 px-1"><FaListAlt className="text-[#0B8E8D]" /> {t.scores || 'Итоговый протокол'}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[1, 2, 3].map(setNum => {
                                if (setNum === 3 && !showThirdSetInput) return null;
                                return (
                                    <div key={setNum} className={`p-3 rounded-lg border bg-white ${activeSet === setNum ? 'border-[#0B8E8D] ring-1 ring-[#0B8E8D]/20' : 'border-gray-100'}`}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase">{setNum === 3 ? (isFinal ? 'Сет 3' : 'Тайбрейк') : `Сет ${setNum}`}</span>
                                            <button onClick={() => setActiveSet(setNum)} className="text-[9px] text-[#0B8E8D] hover:underline">Выбрать</button>
                                        </div>
                                        <div className="flex items-center justify-center gap-2">
                                            <input type="number" min="0" value={currentMatchData[`set${setNum}Team1`] ?? 0} onChange={(e) => onUpdateScore(currentMatchData.id, setNum, 'team1', e.target.value)} className="w-10 p-1 text-center font-bold border rounded bg-gray-50" />
                                            <span className="text-gray-300 font-bold">:</span>
                                            <input type="number" min="0" value={currentMatchData[`set${setNum}Team2`] ?? 0} onChange={(e) => onUpdateScore(currentMatchData.id, setNum, 'team2', e.target.value)} className="w-10 p-1 text-center font-bold border rounded bg-gray-50" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 flex justify-between shrink-0">
                    <button onClick={() => onResetMatch(currentMatchData.id)} className="text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors">
                        <FaUndo /> {t.resetMatch || 'Сброс'}
                    </button>
                    <button onClick={onClose} className="bg-[#0B8E8D] text-white px-8 py-2 rounded-lg hover:opacity-90 shadow-md flex items-center gap-2 font-bold">
                        <FaCheck /> {t.close || 'Готово'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Вспомогательная иконка для списка
const FaListAlt = (props) => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}><path d="M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-48 352H96V128h320v256zm-192-64h128v32H224v-32zm0-64h128v32H224v-32zm0-64h128v32H224v-32z"></path></svg>;

export default MatchDetailModal;
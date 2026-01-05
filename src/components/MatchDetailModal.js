import React, { useState } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaBullhorn, FaSpinner, FaCheck, FaExchangeAlt, FaUndo, FaVolleyballBall, FaUsers, FaChartBar, FaTrophy, FaExclamationTriangle, FaRegClock } from 'react-icons/fa';
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

    const currentMatchData = match;
    const team1 = teams.find(t => t.code === currentMatchData.team1) || { name: t.tbd };
    const team2 = teams.find(t => t.code === currentMatchData.team2) || { name: t.tbd };
    const currentRefereeTeam = teams.find(t => t.code === currentMatchData.refereeTeamCode);
    const refereeName = currentRefereeTeam?.name || (currentMatchData.refereeTeamCode ? `(${t.refereeTBD || '???'})` : `(${t.selectRefereePlaceholder || 'Не назначен'})`);

    const currentRound = currentMatchData.round || 'unknown';
    const isPlayoffMatch = currentRound !== 'group';
    const availableReferees = teams.filter(t => t.code !== currentMatchData.team1 && t.code !== currentMatchData.team2);

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

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center p-4 z-[70] backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-lg overflow-hidden">
                <div className="bg-gradient-to-r from-[#0B8E8D] to-[#06324F] p-6 text-white">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold">{t.matchDetail}</h2>
                            {isSaving && (
                                <div className="flex items-center gap-2 text-sm">
                                    <FaSpinner className="animate-spin" />
                                    <span>{t.saving || 'Сохранение...'}</span>
                                </div>
                            )}
                            {!isSaving && (
                                <div className="flex items-center gap-1 text-sm text-green-300">
                                    <FaCheck className="text-xs" />
                                    <span>{t.saved || 'Сохранено'}</span>
                                </div>
                            )}
                        </div>
                        <button onClick={onClose} className="text-white hover:text-red-200 transition-colors duration-150 text-3xl leading-none">&times;</button>
                    </div>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    <div className="flex flex-wrap justify-between items-start mb-6 gap-y-2">
                        <div className="flex items-center flex-wrap gap-2">
                            <span className={roundClass}><span className="flex items-center">{roundIcon}{roundText}</span></span>
                            <span className={statusClass}><span className="flex items-center">{statusIcon}{statusText}</span></span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg space-y-3 w-full">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <FaCalendarAlt className="mr-2 text-indigo-500" />
                                    {t.time || 'Время'}:
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
                                    <FaMapMarkerAlt className="mr-2 text-[#0B8E8D]" />
                                    {t.court || 'Корт'}:
                                </label>
                                <select
                                    value={currentMatchData.court || 1}
                                    onChange={(e) => onUpdateDetails(currentMatchData.id, 'court', parseInt(e.target.value))}
                                    className="p-2 border border-gray-300 rounded-lg font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value={1}>{t.court || 'Корт'} 1</option>
                                    <option value={2}>{t.court || 'Корт'} 2</option>
                                    <option value={3}>{t.court || 'Корт'} 3</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                    <FaBullhorn className={`mr-2 ${!currentMatchData.refereeTeamCode ? 'text-red-400' : 'text-gray-400'}`} />
                                    {t.referee || 'Судья'}:
                                </label>
                                <select
                                    value={currentMatchData.refereeTeamCode || ""}
                                    onChange={(e) => onUpdateDetails(currentMatchData.id, 'refereeTeamCode', e.target.value)}
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
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.set1}</label>
                            <div className="flex items-center justify-between">
                                <input type="number" min="0" max={maxScoreRegularSet} value={isSwapped ? (currentMatchData.set1Team2 ?? 0) : (currentMatchData.set1Team1 ?? 0)} onChange={(e) => onUpdateScore(currentMatchData.id, 1, isSwapped ? 'team2' : 'team1', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                <span className="text-gray-400 text-xl font-bold">:</span>
                                <input type="number" min="0" max={maxScoreRegularSet} value={isSwapped ? (currentMatchData.set1Team1 ?? 0) : (currentMatchData.set1Team2 ?? 0)} onChange={(e) => onUpdateScore(currentMatchData.id, 1, isSwapped ? 'team1' : 'team2', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.set2}</label>
                            <div className="flex items-center justify-between">
                                <input type="number" min="0" max={maxScoreRegularSet} value={isSwapped ? (currentMatchData.set2Team2 ?? 0) : (currentMatchData.set2Team1 ?? 0)} onChange={(e) => onUpdateScore(currentMatchData.id, 2, isSwapped ? 'team2' : 'team1', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                <span className="text-gray-400 text-xl font-bold">:</span>
                                <input type="number" min="0" max={maxScoreRegularSet} value={isSwapped ? (currentMatchData.set2Team1 ?? 0) : (currentMatchData.set2Team2 ?? 0)} onChange={(e) => onUpdateScore(currentMatchData.id, 2, isSwapped ? 'team1' : 'team2', e.target.value)} className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                        </div>
                        {showThirdSetInput && (
                            <div className={`bg-white p-4 rounded-lg shadow-sm border ${currentStatus === 'tie_needs_tiebreak' ? 'border-red-300' : 'border-gray-200'}`}>
                                <label className={`block text-sm font-medium ${currentStatus === 'tie_needs_tiebreak' ? 'text-red-700' : 'text-gray-700'} mb-2`}>{isFinal ? t.set3 : t.tiebreak}{isThirdSetTiebreak && ` (${isFinal ? (t.finalTiebreakCondition || 'до 15') : (t.tiebreak_condition || 'до 5')})`}</label>
                                <div className="flex items-center justify-between">
                                    <input type="number" min="0" max={maxScoreTiebreak} value={isSwapped ? (currentMatchData.set3Team2 ?? 0) : (currentMatchData.set3Team1 ?? 0)} onChange={(e) => onUpdateScore(currentMatchData.id, 3, isSwapped ? 'team2' : 'team1', e.target.value)} className={`w-20 p-2 border rounded-lg text-center font-bold text-lg focus:ring-2 ${currentStatus === 'tie_needs_tiebreak' ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`} />
                                    <span className="text-gray-400 text-xl font-bold">:</span>
                                    <input type="number" min="0" max={maxScoreTiebreak} value={isSwapped ? (currentMatchData.set3Team1 ?? 0) : (currentMatchData.set3Team2 ?? 0)} onChange={(e) => onUpdateScore(currentMatchData.id, 3, isSwapped ? 'team1' : 'team2', e.target.value)} className={`w-20 p-2 border rounded-lg text-center font-bold text-lg focus:ring-2 ${currentStatus === 'tie_needs_tiebreak' ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'}`} />
                                </div>
                                {currentStatus === 'tie_needs_tiebreak' && !isFinal && <p className="text-xs text-red-600 mt-2">{t.tiebreakInfo || `Введите счет тай-брейка (до ${tiebreakScoreLimit}, разница 2).`}</p>}
                                {isFinal && showThirdSetInput && <p className="text-xs text-gray-500 mt-2">{t.finalTiebreakInfo || `Третий сет финала играется до ${tiebreakScoreLimit} (разница 2).`}</p>}
                            </div>
                        )}
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                        <button onClick={() => onResetMatch(currentMatchData.id)} className="w-full sm:w-auto bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-all duration-200 shadow-sm border border-red-200 flex items-center justify-center text-sm" title={t.resetMatchTooltip || "Сбросить счет и статус матча к начальным"}> <FaUndo className="mr-2" /> {t.resetMatch || 'Сбросить'} </button>
                        <button onClick={onClose} className="w-full sm:w-auto bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white py-2 px-4 rounded-lg hover:opacity-90 transition-all duration-200 shadow-md flex items-center justify-center text-sm"> <FaCheck className="mr-2" /> {t.close || 'Закрыть'} </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MatchDetailModal;

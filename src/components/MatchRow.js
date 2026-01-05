import React from 'react';
import { FaCheck, FaExclamationTriangle, FaRegClock, FaBullhorn, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { isSetCompleted } from '../utils';

const MatchRow = React.memo(({ match, teams, t, onRowClick, tournamentSettings }) => {
    const team1 = teams.find(tm => tm.code === match.team1);
    const team2 = teams.find(tm => tm.code === match.team2);
    const refereeTeam = teams.find(tm => tm.code === match.refereeTeamCode);
    const team1Name = team1?.name || (match.round !== 'group' && match.team1 ? `...` : t.tbd);
    const team2Name = team2?.name || (match.round !== 'group' && match.team2 ? `...` : t.tbd);
    const refereeName = refereeTeam?.name || (match.refereeTeamCode ? `(${t.refereeTBD || '???'})` : (match.round !== 'group' ? `(${t.selectRefereePlaceholder || 'Не назначен'})` : (t.refereeTBD || '???')));

    const currentStatus = match.status || 'unknown';
    const statusText = t.statusNames?.[currentStatus] || currentStatus;

    let statusIcon, statusClass;
    if (currentStatus === 'completed') {
        statusIcon = <FaCheck className="text-green-500" />;
        statusClass = 'text-green-600';
    } else if (currentStatus === 'completed_by_points') {
        statusIcon = <FaCheck className="text-blue-500" />;
        statusClass = 'text-blue-600';
    } else if (currentStatus === 'tie_needs_tiebreak') {
        statusIcon = <FaExclamationTriangle className="text-red-500" />;
        statusClass = 'text-red-600';
    } else if (currentStatus === 'in_progress') {
        statusIcon = <FaRegClock className="text-yellow-600 animate-spin" style={{ animationDuration: '2s' }} />;
        statusClass = 'text-yellow-700';
    } else {
        statusIcon = <FaRegClock className="text-gray-400" />;
        statusClass = 'text-gray-500';
    }

    const currentRound = match.round || 'unknown';
    const roundText = t.roundNames?.[currentRound] || currentRound;
    
    let roundClass = 'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider inline-block';
    if (currentRound === 'group') roundClass += ' bg-[#C1CBA7]/30 text-[#06324F]';
    else if (currentRound === 'final') roundClass += ' bg-[#FDD80F]/30 text-[#06324F]';
    else roundClass += ' bg-gray-100 text-gray-600';

    const isPlayoff = currentRound !== 'group';
    const setLimit = isPlayoff ? tournamentSettings.playoffSetPointLimit : tournamentSettings.groupSetPointLimit;
    const winDiff = isPlayoff ? tournamentSettings.playoffWinDifference : tournamentSettings.groupWinDifference;

    const set1Completed = isSetCompleted(match.set1Team1, match.set1Team2, false, false, setLimit, winDiff);
    const set2Completed = isSetCompleted(match.set2Team1, match.set2Team2, false, false, setLimit, winDiff);
    const team1SetWins = (set1Completed && match.set1Team1 > match.set1Team2 ? 1 : 0) + (set2Completed && match.set2Team1 > match.set2Team2 ? 1 : 0);
    const team2SetWins = (set1Completed && match.set1Team1 < match.set1Team2 ? 1 : 0) + (set2Completed && match.set2Team1 < match.set2Team2 ? 1 : 0);
    const showThirdSet = currentRound === 'final' || currentStatus === 'tie_needs_tiebreak' || (set1Completed && set2Completed && team1SetWins === 1 && team2SetWins === 1) || (match.set3Team1 ?? 0) > 0 || (match.set3Team2 ?? 0) > 0;

    const canOpenDetail = !!(match.team1 && match.team2);
    const isTeam1Winner = match.winner && team1 && match.winner === team1.code;
    const isTeam2Winner = match.winner && team2 && match.winner === team2.code;

    return (
        <>
            {/* Desktop View (Row) */}
            <tr className={`hidden md:table-row border-b transition-colors duration-150 ease-in-out ${canOpenDetail ? 'hover:bg-[#0B8E8D]/5 cursor-pointer' : 'opacity-70'}`} onClick={canOpenDetail ? () => onRowClick(match) : undefined}>
                <td className="p-3 text-sm"><span className={roundClass}>{roundText}</span></td>
                <td className="p-3 text-sm font-medium">
                    <span className={isTeam1Winner ? 'font-bold text-indigo-800 underline decoration-2 decoration-[#0B8E8D]' : ''}>{team1Name}</span>
                    <span className="text-gray-300 mx-2 text-xs">VS</span>
                    <span className={isTeam2Winner ? 'font-bold text-indigo-800 underline decoration-2 decoration-[#0B8E8D]' : ''}>{team2Name}</span>
                </td>
                <td className="p-3 text-sm text-center font-bold text-gray-600">{match.court}</td>
                <td className="p-3 text-sm text-center font-mono text-[#06324F]">{match.time}</td>
                <td className="p-3 text-[11px] text-gray-500 max-w-[120px] truncate" title={refereeName}>{refereeName}</td>
                <td className="p-3 text-sm font-black text-center text-[#06324F]">{match.set1Team1 ?? 0}:{match.set1Team2 ?? 0}</td>
                <td className="p-3 text-sm font-black text-center text-[#06324F]">{match.set2Team1 ?? 0}:{match.set2Team2 ?? 0}</td>
                <td className={`p-3 text-sm font-black text-center ${!showThirdSet ? 'text-gray-200' : 'text-[#06324F]'}`}>{showThirdSet ? `${match.set3Team1 ?? 0}:${match.set3Team2 ?? 0}` : '-'}</td>
                <td className={`p-3 text-xs font-bold ${statusClass}`}>
                    <div className="flex items-center gap-1.5">{statusIcon} {statusText}</div>
                </td>
            </tr>

            {/* Mobile View (Card) */}
            <div 
                className={`md:hidden bg-white mb-3 rounded-2xl border-2 transition-all p-4 active:scale-[0.98] ${canOpenDetail ? 'border-gray-100 shadow-sm' : 'border-gray-50 opacity-60'} ${currentStatus === 'in_progress' ? 'border-[#0B8E8D]/30 ring-4 ring-[#0B8E8D]/5' : ''}`}
                onClick={canOpenDetail ? () => onRowClick(match) : undefined}
            >
                {/* Top Row: Meta Info */}
                <div className="flex justify-between items-start mb-3">
                    <span className={roundClass}>{roundText}</span>
                    <div className="flex gap-3">
                        <div className="flex items-center text-[11px] font-bold text-gray-400">
                            <FaMapMarkerAlt className="mr-1 text-[#0B8E8D]" /> К{match.court}
                        </div>
                        <div className="flex items-center text-[11px] font-bold text-[#06324F]">
                            <FaCalendarAlt className="mr-1 text-indigo-500" /> {match.time}
                        </div>
                    </div>
                </div>

                {/* Middle: Teams and Scores */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 space-y-2">
                        <div className={`text-sm font-bold truncate ${isTeam1Winner ? 'text-indigo-800 underline decoration-2 decoration-[#0B8E8D]' : 'text-[#06324F]'}`}>
                            {team1Name}
                        </div>
                        <div className={`text-sm font-bold truncate ${isTeam2Winner ? 'text-indigo-800 underline decoration-2 decoration-[#0B8E8D]' : 'text-[#06324F]'}`}>
                            {team2Name}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0 bg-gray-50 px-3 py-2 rounded-xl">
                        <div className="flex flex-col items-center">
                            <span className="text-[8px] font-black text-gray-400 uppercase">С1</span>
                            <span className="text-xs font-black text-[#06324F]">{match.set1Team1 ?? 0}:{match.set1Team2 ?? 0}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-[8px] font-black text-gray-400 uppercase">С2</span>
                            <span className="text-xs font-black text-[#06324F]">{match.set2Team1 ?? 0}:{match.set2Team2 ?? 0}</span>
                        </div>
                        {showThirdSet && (
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] font-black text-orange-400 uppercase">ТБ</span>
                                <span className="text-xs font-black text-orange-600">{match.set3Team1 ?? 0}:{match.set3Team2 ?? 0}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom: Referee and Status */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase">
                        <FaBullhorn className="mr-1.5" /> {refereeName}
                    </div>
                    <div className={`text-[10px] font-black uppercase flex items-center gap-1.5 ${statusClass}`}>
                        {statusIcon} {statusText}
                    </div>
                </div>
            </div>
        </>
    );
});

export default MatchRow;
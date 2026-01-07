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
    const tiebreakLimit = isPlayoff ? tournamentSettings.playoffTiebreakLimit : tournamentSettings.groupTiebreakLimit;

    const set1Completed = isSetCompleted(match.set1Team1, match.set1Team2, false, false, setLimit, winDiff);
    const set2Completed = isSetCompleted(match.set2Team1, match.set2Team2, false, false, setLimit, winDiff);
    const set3Completed = (match.set3Team1 > 0 || match.set3Team2 > 0) && isSetCompleted(match.set3Team1, match.set3Team2, currentRound === 'final', currentRound !== 'final', setLimit, winDiff, tiebreakLimit);

    const team1SetWins = (set1Completed && match.set1Team1 > match.set1Team2 ? 1 : 0) +
        (set2Completed && match.set2Team1 > match.set2Team2 ? 1 : 0) +
        (set3Completed && match.set3Team1 > match.set3Team2 ? 1 : 0);

    const team2SetWins = (set1Completed && match.set1Team1 < match.set1Team2 ? 1 : 0) +
        (set2Completed && match.set2Team1 < match.set2Team2 ? 1 : 0) +
        (set3Completed && match.set3Team1 < match.set3Team2 ? 1 : 0);

    const showThirdSet = currentRound === 'final' || currentStatus === 'tie_needs_tiebreak' || (set1Completed && set2Completed && (match.set1Team1 > match.set1Team2) !== (match.set2Team1 > match.set2Team2)) || (match.set3Team1 ?? 0) > 0 || (match.set3Team2 ?? 0) > 0;

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
                    <span className="text-gray-300 mx-2 text-xs">{t.vs || 'VS'}</span>
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
                className={`md:hidden bg-white mb-4 rounded-2xl border-2 transition-all p-4 active:scale-[0.98] shadow-sm ${canOpenDetail ? 'border-gray-100' : 'border-gray-50 opacity-60'} ${currentStatus === 'in_progress' ? 'border-[#0B8E8D]/30 ring-4 ring-[#0B8E8D]/5' : ''}`}
                onClick={canOpenDetail ? () => onRowClick(match) : undefined}
            >
                {/* Header: Meta Info */}
                <div className="flex justify-between items-center mb-3 border-b border-gray-50 pb-2">
                    <span className={roundClass}>{roundText}</span>
                    <div className="flex gap-3 text-[10px] font-black uppercase">
                        <span className="flex items-center text-gray-400"><FaMapMarkerAlt className="mr-1 text-[#0B8E8D]" />{t.courtShort || 'К'}{match.court}</span>
                        <span className="flex items-center text-[#06324F]"><FaCalendarAlt className="mr-1 text-indigo-500" /> {match.time}</span>
                    </div>
                </div>

                {/* Body: Scoreboard Style (GRID Layout) */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    {/* Team 1 */}
                    <div className="min-w-0">
                        <div className={`text-[11px] md:text-xs font-black uppercase leading-tight line-clamp-2 text-right ${isTeam1Winner ? 'text-indigo-800 underline decoration-2 decoration-[#0B8E8D]' : 'text-[#06324F]'}`}>
                            {team1Name}
                        </div>
                    </div>

                    {/* Central Score Block */}
                    <div className="flex flex-col items-center px-3 border-x border-gray-50">
                        <div className="text-2xl font-black text-[#06324F] leading-none mb-1">
                            {team1SetWins}:{team2SetWins}
                        </div>
                        {/* Small Set Details */}
                        <div className="flex gap-1 text-[8px] font-bold text-gray-400 whitespace-nowrap">
                            <span>{match.set1Team1}:{match.set1Team2}</span>
                            <span className="text-gray-200">|</span>
                            <span>{match.set2Team1}:{match.set2Team2}</span>
                            {showThirdSet && (
                                <>
                                    <span className="text-gray-200">|</span>
                                    <span className="text-orange-400">{match.set3Team1}:{match.set3Team2}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Team 2 */}
                    <div className="min-w-0">
                        <div className={`text-[11px] md:text-xs font-black uppercase leading-tight line-clamp-2 text-left ${isTeam2Winner ? 'text-indigo-800 underline decoration-2 decoration-[#0B8E8D]' : 'text-[#06324F]'}`}>
                            {team2Name}
                        </div>
                    </div>
                </div>

                {/* Footer: Referee & Status */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center text-[9px] font-bold text-gray-400 uppercase">
                        <FaBullhorn className="mr-1 text-gray-300" /> {refereeName}
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
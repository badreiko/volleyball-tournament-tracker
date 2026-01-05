import React from 'react';
import { FaCheck, FaExclamationTriangle, FaRegClock, FaBullhorn } from 'react-icons/fa';
import { isSetCompleted } from '../utils';

const MatchRow = React.memo(({ match, teams, t, onRowClick, tournamentSettings }) => {
    const team1 = teams.find(tm => tm.code === match.team1);
    const team2 = teams.find(tm => tm.code === match.team2);
    const refereeTeam = teams.find(tm => tm.code === match.refereeTeamCode);
    const team1Name = team1?.name || (match.round !== 'group' && match.team1 ? `...` : t.tbd);
    const team2Name = team2?.name || (match.round !== 'group' && match.team2 ? `...` : t.tbd);
    const refereeName = refereeTeam?.name || (match.refereeTeamCode ? `(${t.refereeTBD || '???'})` : (match.round !== 'group' ? `(${t.selectRefereePlaceholder || 'Не назначен'})` : (t.refereeTBD || '???')));

    let statusIcon, statusClass, statusText;
    const currentStatus = match.status || 'unknown';
    statusText = t.statusNames?.[currentStatus] || currentStatus;

    if (currentStatus === 'completed') {
        statusIcon = <FaCheck className="mr-1 text-green-500" />;
        statusClass = 'text-green-600 font-semibold';
    } else if (currentStatus === 'completed_by_points') {
        statusIcon = <FaCheck className="mr-1 text-blue-500" />;
        statusClass = 'text-blue-600 font-semibold';
    } else if (currentStatus === 'tie_needs_tiebreak') {
        statusIcon = <FaExclamationTriangle className="mr-1 text-red-500" />;
        statusClass = 'text-red-600 font-semibold';
    } else if (currentStatus === 'in_progress') {
        statusIcon = <FaRegClock className="mr-1 text-yellow-600 animate-spin" style={{ animationDuration: '2s' }} />;
        statusClass = 'text-yellow-700 font-semibold';
    } else if (currentStatus === 'waiting') {
        statusIcon = <FaRegClock className="mr-1 text-gray-400" />;
        statusClass = 'text-gray-500';
    } else {
        statusIcon = <FaRegClock className="mr-1 text-gray-500" />;
        statusClass = 'text-gray-600';
    }

    let roundClass = 'px-2 py-1 rounded text-xs font-semibold inline-block';
    const currentRound = match.round || 'unknown';
    const roundText = t.roundNames?.[currentRound] || currentRound;

    if (currentRound === 'group') { roundClass += ' bg-[#C1CBA7]/50 text-[#06324F]'; }
    else if (currentRound === 'quarterfinal') { roundClass += ' bg-[#0B8E8D]/20 text-[#0B8E8D]'; }
    else if (currentRound === 'semifinal') { roundClass += ' bg-[#06324F]/20 text-[#06324F]'; }
    else if (currentRound === 'third_place') { roundClass += ' bg-orange-100 text-orange-700'; }
    else if (currentRound === 'final') { roundClass += ' bg-[#FDD80F]/20 text-[#FDD80F]/90'; }
    else { roundClass += ' bg-gray-200 text-gray-700'; }

    const isFinal = currentRound === 'final' || currentRound === 'third_place' || currentRound === 'fifth_place';
    const isPlayoff = currentRound !== 'group';
    const setLimit = isPlayoff ? tournamentSettings.playoffSetPointLimit : tournamentSettings.groupSetPointLimit;
    const winDiff = isPlayoff ? tournamentSettings.playoffWinDifference : tournamentSettings.groupWinDifference;

    const set1Completed = isSetCompleted(match.set1Team1, match.set1Team2, false, false, setLimit, winDiff);
    const set2Completed = isSetCompleted(match.set2Team1, match.set2Team2, false, false, setLimit, winDiff);
    
    const team1SetWins = (set1Completed && match.set1Team1 > match.set1Team2 ? 1 : 0) + (set2Completed && match.set2Team1 > match.set2Team2 ? 1 : 0);
    const team2SetWins = (set1Completed && match.set1Team1 < match.set1Team2 ? 1 : 0) + (set2Completed && match.set2Team1 < match.set2Team2 ? 1 : 0);
    
    const showThirdSet = isFinal || currentStatus === 'tie_needs_tiebreak' || (set1Completed && set2Completed && team1SetWins === 1 && team2SetWins === 1) || (match.set3Team1 ?? 0) > 0 || (match.set3Team2 ?? 0) > 0;
    
    const canOpenDetail = !!(match.team1 && match.team2);
    const isTeam1Winner = match.winner && team1 && match.winner === team1.code;
    const isTeam2Winner = match.winner && team2 && match.winner === team2.code;

    return (
        <tr className={`border-b transition-colors duration-150 ease-in-out ${canOpenDetail ? 'hover:bg-[#0B8E8D]/10 cursor-pointer' : 'opacity-70 cursor-not-allowed'}`} onClick={canOpenDetail ? () => onRowClick(match) : undefined}>
            <td className="p-2 text-sm md:text-base"><span className={roundClass}>{roundText}</span></td>
            <td className="p-2 text-sm md:text-base font-medium">
                <span className={isTeam1Winner ? 'font-bold text-indigo-800' : ''}>{team1Name}</span>
                <span className="text-gray-400 mx-1">vs</span>
                <span className={isTeam2Winner ? 'font-bold text-indigo-800' : ''}>{team2Name}</span>
            </td>
            <td className="p-2 text-sm md:text-base text-center">{match.court}</td>
            <td className="p-2 text-sm md:text-base text-gray-700 text-center"><div className="flex items-center justify-center"><FaRegClock className="mr-1 text-indigo-500" />{match.time}</div></td>
            <td className="p-2 text-sm md:text-base text-gray-600">
                <div className="flex items-center">
                    <FaBullhorn className={`mr-1 ${match.round !== 'group' && !match.refereeTeamCode ? 'text-red-400 animate-pulse' : 'text-gray-400'} flex-shrink-0`} title={match.round !== 'group' && !match.refereeTeamCode ? t.refereeNotAssignedTooltip || 'Судья не назначен!' : ''} />
                    <span className={match.round !== 'group' && !match.refereeTeamCode ? 'text-red-600' : ''}>{refereeName}</span>
                </div>
            </td>
            <td className="p-2 text-sm md:text-base font-bold text-center">{match.set1Team1 ?? 0}-{match.set1Team2 ?? 0}</td>
            <td className="p-2 text-sm md:text-base font-bold text-center">{match.set2Team1 ?? 0}-{match.set2Team2 ?? 0}</td>
            <td className={`p-2 text-sm md:text-base font-bold text-center ${!showThirdSet ? 'text-gray-400' : ''}`}>{showThirdSet ? `${match.set3Team1 ?? 0}-${match.set3Team2 ?? 0}` : '-'}</td>
            <td className={`p-2 text-sm md:text-base ${statusClass}`}><div className="flex items-center">{statusIcon}{statusText}</div></td>
        </tr>
    );
});

export default MatchRow;

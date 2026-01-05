import React from 'react';
import { FaUsers, FaTable, FaTrophy } from 'react-icons/fa';
import { sortTeamsByRank } from '../utils';

const GroupsView = ({ teams, t }) => {
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center"><FaUsers className="mr-3 text-indigo-600" /><span>{t.groups}</span></h2>
            {teams.length === 0 && <p className="text-center p-4">{t.noTeams || 'Команды не найдены.'}</p>}
            {teams.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['A', 'B'].map(group => {
                        const groupColors = { 'A': { bg: 'from-[#C1CBA7] to-[#0B8E8D]', lightBg: 'from-[#C1CBA7]/20 to-[#0B8E8D]/10', text: 'text-blue-700', border: 'border-blue-200' }, 'B': { bg: 'from-[#06324F] to-[#0B8E8D]', lightBg: 'from-[#06324F]/10 to-[#0B8E8D]/10', text: 'text-purple-700', border: 'border-purple-200' }, 'C': { bg: 'from-[#FDD80F] to-[#0B8E8D]', lightBg: 'from-[#FDD80F]/10 to-[#0B8E8D]/10', text: 'text-green-700', border: 'border-green-200' } };
                        const colors = groupColors[group] || groupColors['A'];
                        const groupTeams = teams.filter(tm => tm.group === group);
                        const sortedGroupTeams = sortTeamsByRank(groupTeams);
                        return (
                            <div key={group} className={`bg-gradient-to-r ${colors.lightBg} rounded-xl shadow-lg overflow-hidden`}>
                                <div className={`bg-gradient-to-r ${colors.bg} p-4 text-white`}><h3 className="text-xl font-bold flex items-center"><FaTable className="mr-2" /> {t.group} {group}</h3></div>
                                <div className="p-2 md:p-4 overflow-x-auto">
                                    {groupTeams.length === 0 ? <p className="text-center text-gray-500 py-4">{t.noTeamsInGroup || 'Нет команд'}</p> : (
                                        <>
                                            {/* Desktop Table */}
                                            <table className="hidden md:table min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="p-3 text-left text-base font-semibold text-gray-700">{t.team}</th>
                                                        <th className="p-3 text-center text-base font-semibold text-gray-700">{t.points}</th>
                                                        <th className="p-3 text-center text-base font-semibold text-gray-700" title={t.winsLosses || 'Победы/Поражения'}>{t.winsLossesShort || 'В/П'}</th>
                                                        <th className="p-3 text-center text-base font-semibold text-gray-700" title={t.sets || 'Сеты'}>{t.setsShort || 'С'}</th>
                                                        <th className="p-3 text-center text-base font-semibold text-gray-700" title={t.setsDifference || 'Разница сетов'}>{t.setsDiffShort || 'Р'}</th>
                                                        <th className="p-3 text-center text-base font-semibold text-gray-700" title={t.balls || 'Balls'}>{t.ballsShort || 'B'}</th>
                                                        <th className="p-3 text-center text-base font-semibold text-gray-700" title={t.ballsDifference || 'Разница мячей'}>{t.ballsDiffShort || 'РМ'}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sortedGroupTeams.map((team, index) => {
                                                        const rank = index + 1; let rowClass = `border-b ${colors.border} hover:bg-gray-50 transition-colors duration-150`; let rankIcon = null;
                                                        if (rank === 1) { rowClass += ' bg-green-50 font-bold'; rankIcon = <FaTrophy className="inline mr-2 text-yellow-500" />; } else if (rank === 2) { rowClass += ' bg-green-50'; rankIcon = <FaTrophy className="inline mr-2 text-gray-400" />; } else if (rank === 3 && (group === 'A' || group === 'B' || group === 'C')) { rankIcon = <FaTrophy className="inline mr-2 text-orange-400" />; }
                                                        return (
                                                            <tr key={team.code} className={rowClass}>
                                                                <td className="p-3 text-base">{rankIcon}{team.name}</td>
                                                                <td className="p-3 text-base text-center"><span className="inline-flex w-8 h-8 rounded-full bg-[#0B8E8D]/20 text-[#06324F] font-bold items-center justify-center">{team.points || 0}</span></td>
                                                                <td className="p-3 text-base text-center">{team.wins || 0}/{team.losses || 0}</td>
                                                                <td className="p-3 text-base text-center"><span className="font-semibold text-green-600">{team.setsWon || 0}</span><span className="mx-1 text-gray-400">:</span><span className="font-semibold text-red-600">{team.setsLost || 0}</span></td>
                                                                <td className={`p-3 text-base text-center font-semibold ${(team.setsWon - team.setsLost) > 0 ? 'text-green-700' : (team.setsWon - team.setsLost) < 0 ? 'text-red-700' : 'text-gray-600'}`}>{(team.setsWon - team.setsLost) > 0 ? '+' : ''}{team.setsWon - team.setsLost || 0}</td>
                                                                <td className="p-3 text-base text-center"><span className="text-green-600">{team.ballsWon || 0}</span><span className="mx-1 text-gray-400">:</span><span className="text-red-600">{team.ballsLost || 0}</span></td>
                                                                <td className={`p-3 text-base text-center font-semibold ${((team.ballsWon || 0) - (team.ballsLost || 0)) > 0 ? 'text-green-700' : ((team.ballsWon || 0) - (team.ballsLost || 0)) < 0 ? 'text-red-700' : 'text-gray-600'}`}>{((team.ballsWon || 0) - (team.ballsLost || 0)) > 0 ? '+' : ''}{(team.ballsWon || 0) - (team.ballsLost || 0)}</td>
                                                            </tr>);
                                                    })}
                                                </tbody>
                                            </table>

                                            {/* Mobile Table - 2 rows per team */}
                                            <table className="md:hidden w-full bg-white shadow-sm rounded-lg overflow-hidden text-xs">
                                                <tbody>
                                                    {sortedGroupTeams.map((team, index) => {
                                                        const rank = index + 1;
                                                        let rankIcon = null;
                                                        let bgClass = '';
                                                        if (rank === 1) { bgClass = 'bg-green-50'; rankIcon = <FaTrophy className="inline mr-1 text-yellow-500 text-[10px]" />; }
                                                        else if (rank === 2) { bgClass = 'bg-green-50/50'; rankIcon = <FaTrophy className="inline mr-1 text-gray-400 text-[10px]" />; }
                                                        else if (rank === 3) { rankIcon = <FaTrophy className="inline mr-1 text-orange-400 text-[10px]" />; }

                                                        const setsDiff = (team.setsWon || 0) - (team.setsLost || 0);
                                                        const ballsDiff = (team.ballsWon || 0) - (team.ballsLost || 0);

                                                        return (
                                                            <React.Fragment key={team.code}>
                                                                {/* Row 1: Team name + Points */}
                                                                <tr className={`${bgClass} border-b border-gray-100`}>
                                                                    <td colSpan="6" className="px-2 pt-2 pb-1">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="font-bold text-[#06324F] text-sm flex items-center">
                                                                                {rankIcon}
                                                                                <span className="text-gray-400 mr-1">{rank}.</span>
                                                                                {team.name}
                                                                            </span>
                                                                            <span className="inline-flex w-7 h-7 rounded-full bg-[#0B8E8D] text-white font-black text-sm items-center justify-center shadow-sm">
                                                                                {team.points || 0}
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                {/* Row 2: Stats */}
                                                                <tr className={`${bgClass} ${index < sortedGroupTeams.length - 1 ? 'border-b-4 border-gray-200' : ''}`}>
                                                                    <td className="px-2 pb-2 pt-0" colSpan="6">
                                                                        <div className="flex justify-between items-center text-[10px] text-gray-600 gap-1">
                                                                            <div className="flex items-center gap-0.5">
                                                                                <span className="font-bold text-gray-400">{t.winsLossesShort || 'В/П'}:</span>
                                                                                <span className="font-semibold">{team.wins || 0}/{team.losses || 0}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-0.5">
                                                                                <span className="font-bold text-gray-400">{t.setsShort || 'С'}:</span>
                                                                                <span className="text-green-600 font-semibold">{team.setsWon || 0}</span>
                                                                                <span className="text-gray-300">:</span>
                                                                                <span className="text-red-600 font-semibold">{team.setsLost || 0}</span>
                                                                                <span className={`font-bold ${setsDiff > 0 ? 'text-green-700' : setsDiff < 0 ? 'text-red-700' : 'text-gray-500'}`}>
                                                                                    ({setsDiff > 0 ? '+' : ''}{setsDiff})
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex items-center gap-0.5">
                                                                                <span className="font-bold text-gray-400">{t.ballsShort || 'М'}:</span>
                                                                                <span className="text-green-600 font-semibold">{team.ballsWon || 0}</span>
                                                                                <span className="text-gray-300">:</span>
                                                                                <span className="text-red-600 font-semibold">{team.ballsLost || 0}</span>
                                                                                <span className={`font-bold ${ballsDiff > 0 ? 'text-green-700' : ballsDiff < 0 ? 'text-red-700' : 'text-gray-500'}`}>
                                                                                    ({ballsDiff > 0 ? '+' : ''}{ballsDiff})
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </React.Fragment>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </>
                                    )}
                                </div>
                            </div>);
                    })}
                </div>)}
        </div>);
};

export default GroupsView;

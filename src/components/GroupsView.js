import React from 'react';
import { FaUsers, FaTable, FaTrophy } from 'react-icons/fa';
import { sortTeamsByRank } from '../utils';

const GroupsView = ({ teams, t }) => {
    return (
        <div className="p-2 md:p-4">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-indigo-700 flex items-center">
                <FaUsers className="mr-2 md:mr-3 text-indigo-600" />
                <span>{t.groups}</span>
            </h2>
            {teams.length === 0 && <p className="text-center p-4">{t.noTeams || 'Команды не найдены.'}</p>}
            {teams.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {['A', 'B'].map(group => {
                        const groupColors = {
                            'A': { bg: 'from-[#C1CBA7] to-[#0B8E8D]', lightBg: 'from-[#C1CBA7]/20 to-[#0B8E8D]/10', border: 'border-blue-200' },
                            'B': { bg: 'from-[#06324F] to-[#0B8E8D]', lightBg: 'from-[#06324F]/10 to-[#0B8E8D]/10', border: 'border-purple-200' }
                        };
                        const colors = groupColors[group] || groupColors['A'];
                        const groupTeams = teams.filter(tm => tm.group === group);
                        const sortedGroupTeams = sortTeamsByRank(groupTeams);

                        return (
                            <div key={group} className={`bg-gradient-to-r ${colors.lightBg} rounded-xl shadow-lg overflow-hidden`}>
                                <div className={`bg-gradient-to-r ${colors.bg} p-3 md:p-4 text-white`}>
                                    <h3 className="text-lg md:text-xl font-bold flex items-center">
                                        <FaTable className="mr-2" /> {t.group} {group}
                                    </h3>
                                </div>
                                <div className="p-2 md:p-4">
                                    {groupTeams.length === 0 ? (
                                        <p className="text-center text-gray-500 py-4">{t.noTeamsInGroup || 'Нет команд'}</p>
                                    ) : (
                                        <>
                                            {/* Desktop Table */}
                                            <div className="hidden md:block overflow-x-auto">
                                                <table className="w-full bg-white shadow-sm rounded-lg overflow-hidden">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="p-3 text-left font-semibold text-gray-700">{t.team}</th>
                                                            <th className="p-3 text-center font-semibold text-gray-700">{t.points}</th>
                                                            <th className="p-3 text-center font-semibold text-gray-700">{t.winsLossesShort || 'В/П'}</th>
                                                            <th className="p-3 text-center font-semibold text-gray-700">{t.setsShort || 'С'}</th>
                                                            <th className="p-3 text-center font-semibold text-gray-700">{t.setsDiffShort || 'РС'}</th>
                                                            <th className="p-3 text-center font-semibold text-gray-700">{t.ballsShort || 'М'}</th>
                                                            <th className="p-3 text-center font-semibold text-gray-700">{t.ballsDiffShort || 'РМ'}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {sortedGroupTeams.map((team, index) => {
                                                            const rank = index + 1;
                                                            let rowClass = `border-b ${colors.border} hover:bg-gray-50`;
                                                            let rankIcon = null;
                                                            if (rank === 1) { rowClass += ' bg-green-50 font-bold'; rankIcon = <FaTrophy className="inline mr-2 text-yellow-500" />; }
                                                            else if (rank === 2) { rowClass += ' bg-green-50'; rankIcon = <FaTrophy className="inline mr-2 text-gray-400" />; }
                                                            else if (rank === 3) { rankIcon = <FaTrophy className="inline mr-2 text-orange-400" />; }

                                                            const setsDiff = (team.setsWon || 0) - (team.setsLost || 0);
                                                            const ballsDiff = (team.ballsWon || 0) - (team.ballsLost || 0);

                                                            return (
                                                                <tr key={team.code} className={rowClass}>
                                                                    <td className="p-3">{rankIcon}{team.name}</td>
                                                                    <td className="p-3 text-center">
                                                                        <span className="inline-flex w-8 h-8 rounded-full bg-[#0B8E8D]/20 text-[#06324F] font-bold items-center justify-center">
                                                                            {team.points || 0}
                                                                        </span>
                                                                    </td>
                                                                    <td className="p-3 text-center">{team.wins || 0}/{team.losses || 0}</td>
                                                                    <td className="p-3 text-center">
                                                                        <span className="text-green-600">{team.setsWon || 0}</span>:<span className="text-red-600">{team.setsLost || 0}</span>
                                                                    </td>
                                                                    <td className={`p-3 text-center font-semibold ${setsDiff > 0 ? 'text-green-700' : setsDiff < 0 ? 'text-red-700' : 'text-gray-600'}`}>
                                                                        {setsDiff > 0 ? '+' : ''}{setsDiff}
                                                                    </td>
                                                                    <td className="p-3 text-center">
                                                                        <span className="text-green-600">{team.ballsWon || 0}</span>:<span className="text-red-600">{team.ballsLost || 0}</span>
                                                                    </td>
                                                                    <td className={`p-3 text-center font-semibold ${ballsDiff > 0 ? 'text-green-700' : ballsDiff < 0 ? 'text-red-700' : 'text-gray-600'}`}>
                                                                        {ballsDiff > 0 ? '+' : ''}{ballsDiff}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Mobile: Simple 2-row layout per team */}
                                            <div className="md:hidden space-y-2">
                                                {sortedGroupTeams.map((team, index) => {
                                                    const rank = index + 1;
                                                    let bgClass = 'bg-white';
                                                    let rankIcon = null;
                                                    if (rank === 1) { bgClass = 'bg-green-50'; rankIcon = <FaTrophy className="text-yellow-500 text-xs" />; }
                                                    else if (rank === 2) { bgClass = 'bg-green-50/60'; rankIcon = <FaTrophy className="text-gray-400 text-xs" />; }
                                                    else if (rank === 3) { rankIcon = <FaTrophy className="text-orange-400 text-xs" />; }

                                                    const setsDiff = (team.setsWon || 0) - (team.setsLost || 0);
                                                    const ballsDiff = (team.ballsWon || 0) - (team.ballsLost || 0);

                                                    return (
                                                        <div key={team.code} className={`${bgClass} rounded-lg p-2 shadow-sm border border-gray-100`}>
                                                            {/* Row 1: Team name + Points */}
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div className="flex items-center gap-1 min-w-0 flex-1">
                                                                    {rankIcon}
                                                                    <span className="text-gray-400 text-xs font-bold">{rank}.</span>
                                                                    <span className="font-bold text-[#06324F] text-sm truncate">{team.name}</span>
                                                                </div>
                                                                <span className="w-8 h-8 rounded-full bg-[#0B8E8D] text-white font-black text-sm flex items-center justify-center shadow flex-shrink-0 ml-2">
                                                                    {team.points || 0}
                                                                </span>
                                                            </div>
                                                            {/* Row 2: Stats */}
                                                            <div className="flex justify-between text-[11px] text-gray-600 bg-gray-50 rounded px-2 py-1">
                                                                <div>
                                                                    <span className="text-gray-400 font-semibold">{t.winsLossesShort || 'В/П'}: </span>
                                                                    <span className="font-bold">{team.wins || 0}/{team.losses || 0}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-400 font-semibold">{t.setsShort || 'С'}: </span>
                                                                    <span className="text-green-600 font-bold">{team.setsWon || 0}</span>
                                                                    <span>:</span>
                                                                    <span className="text-red-600 font-bold">{team.setsLost || 0}</span>
                                                                    <span className={`ml-1 font-bold ${setsDiff > 0 ? 'text-green-700' : setsDiff < 0 ? 'text-red-700' : ''}`}>
                                                                        ({setsDiff > 0 ? '+' : ''}{setsDiff})
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-400 font-semibold">{t.ballsShort || 'М'}: </span>
                                                                    <span className={`font-bold ${ballsDiff > 0 ? 'text-green-700' : ballsDiff < 0 ? 'text-red-700' : ''}`}>
                                                                        {ballsDiff > 0 ? '+' : ''}{ballsDiff}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default GroupsView;

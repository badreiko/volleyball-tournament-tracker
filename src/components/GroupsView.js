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
                                <div className="p-4 overflow-x-auto">
                                    {groupTeams.length === 0 ? <p className="text-center text-gray-500 py-4">{t.noTeamsInGroup || 'Нет команд'}</p> : (
                                        <table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="p-3 text-left text-sm md:text-base font-semibold text-gray-700">{t.team}</th>
                                                    <th className="p-3 text-center text-sm md:text-base font-semibold text-gray-700">{t.points}</th>
                                                    <th className="p-3 text-center text-sm md:text-base font-semibold text-gray-700" title={t.winsLosses || 'Победы/Поражения'}>{t.winsLossesShort || 'В/П'}</th>
                                                    <th className="p-3 text-center text-sm md:text-base font-semibold text-gray-700" title={t.sets || 'Сеты'}>{t.setsShort || 'С'}</th>
                                                    <th className="p-3 text-center text-sm md:text-base font-semibold text-gray-700" title={t.setsDifference || 'Разница сетов'}>{t.setsDiffShort || 'Р'}</th>
                                                    <th className="p-3 text-center text-sm md:text-base font-semibold text-gray-700" title={t.balls || 'Balls'}>{t.ballsShort || 'B'}</th>
                                                    <th className="p-3 text-center text-sm md:text-base font-semibold text-gray-700" title={t.ballsDifference || 'Разница мячей'}>{t.ballsDiffShort || 'РМ'}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sortedGroupTeams.map((team, index) => {
                                                    const rank = index + 1; let rowClass = `border-b ${colors.border} hover:bg-gray-50 transition-colors duration-150`; let rankIcon = null;
                                                    if (rank === 1) { rowClass += ' bg-green-50 font-bold'; rankIcon = <FaTrophy className="inline mr-2 text-yellow-500" />; } else if (rank === 2) { rowClass += ' bg-green-50'; rankIcon = <FaTrophy className="inline mr-2 text-gray-400" />; } else if (rank === 3 && (group === 'A' || group === 'B' || group === 'C')) { rankIcon = <FaTrophy className="inline mr-2 text-orange-400" />; }
                                                    return (
                                                        <tr key={team.code} className={rowClass}>
                                                            <td className="p-3 text-sm md:text-base">{rankIcon}{team.name}</td>
                                                            <td className="p-3 text-sm md:text-base text-center"><span className="inline-block w-8 h-8 rounded-full bg-[#0B8E8D]/20 text-[#06324F] font-bold flex items-center justify-center">{team.points || 0}</span></td>
                                                            <td className="p-3 text-sm md:text-base text-center">{team.wins || 0}/{team.losses || 0}</td>
                                                            <td className="p-3 text-sm md:text-base text-center"><span className="font-semibold text-green-600">{team.setsWon || 0}</span><span className="mx-1 text-gray-400">:</span><span className="font-semibold text-red-600">{team.setsLost || 0}</span></td>
                                                            <td className={`p-3 text-sm md:text-base text-center font-semibold ${(team.setsWon - team.setsLost) > 0 ? 'text-green-700' : (team.setsWon - team.setsLost) < 0 ? 'text-red-700' : 'text-gray-600'}`}>{(team.setsWon - team.setsLost) > 0 ? '+' : ''}{team.setsWon - team.setsLost || 0}</td>
                                                            <td className="p-3 text-sm md:text-base text-center"><span className="text-green-600">{team.ballsWon || 0}</span><span className="mx-1 text-gray-400">:</span><span className="text-red-600">{team.ballsLost || 0}</span></td>
                                                            <td className={`p-3 text-sm md:text-base text-center font-semibold ${((team.ballsWon || 0) - (team.ballsLost || 0)) > 0 ? 'text-green-700' : ((team.ballsWon || 0) - (team.ballsLost || 0)) < 0 ? 'text-red-700' : 'text-gray-600'}`}>{((team.ballsWon || 0) - (team.ballsLost || 0)) > 0 ? '+' : ''}{(team.ballsWon || 0) - (team.ballsLost || 0)}</td>
                                                        </tr>);
                                                })}
                                            </tbody>
                                        </table>)}
                                    {groupTeams.length > 0 && (
                                        <div className="mt-3 px-2 text-xs md:text-sm text-gray-600 border-t border-gray-200 pt-2">
                                            <div className="flex flex-wrap gap-x-3 gap-y-1">
                                                <span><strong>{t.winsLossesShort || 'В/П'}:</strong> {t.winsLosses || 'Победы/Поражения'}</span>
                                                <span><strong>{t.setsShort || 'С'}:</strong> {t.sets || 'Сеты'}</span>
                                                <span><strong>{t.setsDiffShort || 'Р'}:</strong> {t.setsDifference || 'Разница сетов'}</span>
                                                <span><strong>{t.ballsShort || 'М'}:</strong> {t.balls || 'Мячи'}</span>
                                                <span><strong>{t.ballsDiffShort || 'РМ'}:</strong> {t.ballsDifference || 'Разница мячей'}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>);
                    })}
                </div>)}
        </div>);
};

export default GroupsView;

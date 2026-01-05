import React from 'react';
import { FaTrophy } from 'react-icons/fa';
import { AUTUMN_STANDINGS, LEAGUE_SEASON, TOURNAMENTS } from '../constants';

const LeagueStandings = ({ teams, t }) => {
    // Рассчитываем накопительные очки лиги
    const leagueData = {};

    // Добавляем очки из осеннего турнира
    AUTUMN_STANDINGS.forEach(team => {
        const normalizedName = team.name.toLowerCase().replace(/\s+/g, ' ').trim();
        leagueData[normalizedName] = {
            name: team.name,
            autumn: team.leaguePoints,
            winter: 0,
            spring: 0,
            total: team.leaguePoints
        };
    });

    // Добавляем очки из зимнего турнира (текущий)
    teams.forEach(team => {
        const normalizedName = team.name.toLowerCase().replace(/\s+/g, ' ').trim();
        if (!leagueData[normalizedName]) {
            leagueData[normalizedName] = {
                name: team.name,
                autumn: 0,
                winter: 0,
                spring: 0,
                total: 0
            };
        }
        leagueData[normalizedName].winter = team.points || 0;
        leagueData[normalizedName].total = (leagueData[normalizedName].autumn || 0) + (team.points || 0);
        leagueData[normalizedName].name = team.name; // Используем актуальное имя
    });

    // Сортируем по накопительным очкам
    const sortedLeague = Object.values(leagueData).sort((a, b) => b.total - a.total);

    return (
        <div className="p-4 md:p-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-[#FDD80F]/30">
                <h2 className="text-xl font-bold text-[#06324F] mb-4 flex items-center">
                    <FaTrophy className="mr-3 text-[#FDD80F]" />
                    {t.leagueStandings || 'Průběžné pořadí ligy'} RVL {LEAGUE_SEASON}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                    {t.leagueCumulativeInfo || 'Součet bodů ze všech turnajů sezóny.'}
                </p>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gradient-to-r from-[#FDD80F]/20 to-[#0B8E8D]/10">
                            <tr>
                                <th className="p-3 text-left text-sm font-semibold text-[#06324F]">#</th>
                                <th className="p-3 text-left text-sm font-semibold text-[#06324F]">{t.team || 'Tým'}</th>
                                <th className="p-3 text-center text-sm font-semibold text-gray-600" title={TOURNAMENTS.autumn.name}>🍂</th>
                                <th className="p-3 text-center text-sm font-semibold text-gray-600" title={TOURNAMENTS.winter.name}>❄️</th>
                                <th className="p-3 text-center text-sm font-semibold text-gray-600" title={TOURNAMENTS.spring.name}>🌸</th>
                                <th className="p-3 text-center text-sm font-bold text-[#06324F]">{t.total || 'Celkem'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedLeague.map((team, index) => {
                                const rank = index + 1;
                                let rowClass = 'border-b border-gray-100 hover:bg-gray-50';
                                let rankIcon = null;
                                if (rank === 1) { rowClass += ' bg-yellow-50 font-bold'; rankIcon = <FaTrophy className="inline text-yellow-500" />; }
                                else if (rank === 2) { rowClass += ' bg-gray-50'; rankIcon = <FaTrophy className="inline text-gray-400" />; }
                                else if (rank === 3) { rankIcon = <FaTrophy className="inline text-orange-400" />; }

                                return (
                                    <tr key={team.name} className={rowClass}>
                                        <td className="p-3 text-sm">{rankIcon || rank}.</td>
                                        <td className="p-3 text-sm font-medium">{team.name}</td>
                                        <td className="p-3 text-center text-sm text-gray-600">{team.autumn || '-'}</td>
                                        <td className="p-3 text-center text-sm text-blue-600 font-medium">{team.winter || '-'}</td>
                                        <td className="p-3 text-center text-sm text-gray-400">-</td>
                                        <td className="p-3 text-center text-lg font-bold text-[#06324F]">{team.total}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                    <p>🍂 {TOURNAMENTS.autumn.name} ({TOURNAMENTS.autumn.date}) - ✅ {t.completed || 'Dokončeno'}</p>
                    <p>❄️ {TOURNAMENTS.winter.name} ({TOURNAMENTS.winter.date}) - 🟢 {t.active || 'Aktivní'}</p>
                    <p>🌸 {TOURNAMENTS.spring.name} ({TOURNAMENTS.spring.date}) - 🔜 {t.upcoming || 'Připravuje se'}</p>
                </div>
            </div>
        </div>
    );
};

export default LeagueStandings;

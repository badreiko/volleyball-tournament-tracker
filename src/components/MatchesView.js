import React from 'react';
import { FaVolleyballBall } from 'react-icons/fa';
import MatchRow from './MatchRow';

const MatchesView = ({ matches, teams, t, setView, setSelectedMatch, tournamentSettings }) => {
    const sortedMatches = [...matches].sort((a, b) => {
        const timeA = a.time || "99:99";
        const timeB = b.time || "99:99";
        const timeCompare = timeA.localeCompare(timeB);
        if (timeCompare !== 0) return timeCompare;
        return (a.court || 99) - (b.court || 99);
    });

    const handleRowClick = (match) => {
        setView('matchDetail');
        setSelectedMatch(match);
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-indigo-700 flex items-center px-1">
                    <FaVolleyballBall className="mr-3 text-indigo-600" />
                    <span>{t.matches}</span>
                </h2>
            </div>
            
            {matches.length === 0 && <p className="text-center p-4">{t.noMatches || 'Матчи не найдены.'}</p>}
            
            {matches.length > 0 && (
                <div className="md:bg-gradient-to-r md:from-[#C1CBA7] md:to-[#0B8E8D]/10 md:p-6 md:rounded-xl md:shadow-lg">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                            <thead className="bg-[#06324F] text-white">
                                <tr>
                                    <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider">{t.round}</th>
                                    <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider">{t.match}</th>
                                    <th className="py-3 px-4 text-center text-xs font-bold uppercase tracking-wider">{t.court}</th>
                                    <th className="py-3 px-4 text-center text-xs font-bold uppercase tracking-wider">{t.time}</th>
                                    <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider">{t.referee}</th>
                                    <th className="py-3 px-4 text-center text-xs font-bold uppercase tracking-wider">{t.set1}</th>
                                    <th className="py-3 px-4 text-center text-xs font-bold uppercase tracking-wider">{t.set2}</th>
                                    <th className="py-3 px-4 text-center text-xs font-bold uppercase tracking-wider">{t.set3}</th>
                                    <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider">{t.status}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedMatches.map(match => (
                                    <MatchRow 
                                        key={match.id} 
                                        match={match} 
                                        teams={teams} 
                                        t={t} 
                                        onRowClick={handleRowClick}
                                        tournamentSettings={tournamentSettings} 
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile List (only cards) */}
                    <div className="md:hidden">
                        {sortedMatches.map(match => (
                            <MatchRow 
                                key={match.id} 
                                match={match} 
                                teams={teams} 
                                t={t} 
                                onRowClick={handleRowClick}
                                tournamentSettings={tournamentSettings} 
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MatchesView;
import React from 'react';
import { FaVolleyballBall, FaTrophy, FaCalendarAlt, FaMapMarkerAlt, FaLink, FaUsers, FaChartBar, FaGlobe } from 'react-icons/fa';
import { TOURNAMENTS } from '../constants';

const Sidebar = ({
    t,
    view,
    setView,
    setShowRules,
    currentTournament,
    setCurrentTournament,
    language,
    changeLanguage,
    languageNames,
    translations
}) => {
    return (
        <aside className="w-full md:w-64 bg-white shadow-md md:h-screen md:sticky md:top-0 z-40 border-b md:border-b-0 md:border-r border-gray-200 shrink-0">
            {/* Шапка Sidebar */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h1 className="text-xl font-bold text-[#06324F] flex items-center"><FaVolleyballBall className="mr-2 text-[#0B8E8D]" /> {t.appName || 'RVL Scoreboard'}</h1>
                <div className="hidden md:flex flex-wrap gap-1 max-w-[100px]">{Object.keys(languageNames).filter(lang => translations[lang]).map(lang => (<button key={lang} onClick={() => changeLanguage(lang)} className={`px-2 py-1 text-xs rounded transition-colors duration-150 ${language === lang ? 'bg-[#0B8E8D] text-white shadow-sm font-semibold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} title={languageNames[lang]}>{lang.toUpperCase()}</button>))}</div>
            </div>
            {/* Навигация Sidebar */}
            <div className="p-4 space-y-2">
                {/* Селектор турнира */}
                <div className="mb-4 p-3 bg-gradient-to-r from-[#FDD80F]/20 to-[#0B8E8D]/10 rounded-lg border border-[#FDD80F]/30">
                    <label className="block text-xs font-semibold text-[#06324F] mb-2">
                        <FaTrophy className="inline mr-2 text-[#FDD80F]" />
                        {t.selectTournament || 'Turnaj'}
                    </label>
                    <select
                        value={currentTournament}
                        onChange={(e) => setCurrentTournament(e.target.value)}
                        className="w-full p-2 text-sm rounded border border-[#0B8E8D]/30 bg-white focus:ring-2 focus:ring-[#0B8E8D] focus:border-[#0B8E8D]"
                    >
                        {Object.values(TOURNAMENTS).map(t => (
                            <option key={t.id} value={t.id} disabled={t.status === 'upcoming'}>
                                {t.name} ({t.date}) {t.status === 'active' ? '🟢' : t.status === 'completed' ? '✅' : '🔜'}
                            </option>
                        ))}
                    </select>
                </div>

                <button onClick={() => setView('matches')} className={`flex items-center w-full text-left p-3 rounded-lg transition-all duration-200 ${view === 'matches' ? 'bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white shadow-md' : 'hover:bg-[#0B8E8D]/10 text-gray-700'}`}><FaVolleyballBall className="mr-3" /> {t.matches}</button>
                <button onClick={() => setView('groups')} className={`flex items-center w-full text-left p-3 rounded-lg transition-all duration-200 ${view === 'groups' ? 'bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white shadow-md' : 'hover:bg-[#0B8E8D]/10 text-gray-700'}`}><FaUsers className="mr-3" /> {t.groups}</button>
                <button onClick={() => setView('league')} className={`flex items-center w-full text-left p-3 rounded-lg transition-all duration-200 ${view === 'league' ? 'bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white shadow-md' : 'hover:bg-[#0B8E8D]/10 text-gray-700'}`}><FaTrophy className="mr-3 text-[#FDD80F]" /> {t.leagueStandings || 'Pořadí ligy'}</button>
                <button onClick={() => setShowRules(true)} className="flex items-center w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-[#0B8E8D]/10 text-gray-700 mt-2"><FaGlobe className="mr-3 text-[#FDD80F]" /> {t.rules}</button>
            </div>
            {/* Инфо-блок в Sidebar */}
            <div className="md:absolute md:bottom-0 md:left-0 md:right-0 p-4 hidden md:block">
                <div className="bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 p-4 rounded-lg shadow-sm border border-[#0B8E8D]/20">
                    <h3 className="text-sm font-semibold text-[#06324F] mb-2">{t.tournamentInfo}</h3>
                    <div className="text-xs text-gray-700 space-y-2">
                        <p className="flex items-center"><FaCalendarAlt className="mr-2 text-[#FDD80F]" /><span className="font-semibold mr-1">{t.dateLabel}:</span> {t.tournamentDate}</p>
                        <p className="flex items-start"><FaMapMarkerAlt className="mr-2 text-[#0B8E8D] mt-0.5 flex-shrink-0" /><div><span className="font-semibold mr-1">{t.addressLabel}:</span> {t.tournamentAddress} <span className="ml-2 space-x-2"><a href="https://maps.app.goo.gl/6jAwW9cVsyf11EEg6" target="_blank" rel="noopener noreferrer" className="text-[#0B8E8D] hover:underline text-xs">[Google]</a><a href="https://mapy.com/s/lobalakeru" target="_blank" rel="noopener noreferrer" className="text-[#0B8E8D] hover:underline text-xs">[Mapy.cz]</a></span></div></p>
                        <p className="flex items-center"><FaLink className="mr-2 text-[#06324F]" /><span className="font-semibold mr-1">{t.websiteLabel}:</span><a href={t.tournamentWebsite} target="_blank" rel="noopener noreferrer" className="text-[#0B8E8D] ml-1 hover:underline truncate">{t.tournamentWebsite?.replace(/^(https?:\/\/)?(www\.)?/, '')}</a></p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-[#0B8E8D]/20"><h3 className="text-sm font-semibold text-[#06324F] mb-1">{t.aboutSection}</h3><p className="text-xs text-gray-600">{t.aboutApp}</p></div>
                    {/* QR Code */}
                    <div className="mt-3 pt-2 border-t border-[#0B8E8D]/20 text-center">
                        <p className="text-xs text-gray-500 mb-2">{t.scanQR || 'Naskenujte QR kód'}</p>
                        <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://rvl-2025-26.netlify.app/"
                            alt="QR Code"
                            className="mx-auto w-20 h-20 rounded shadow-sm"
                        />
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

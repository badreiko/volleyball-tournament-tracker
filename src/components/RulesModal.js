import React from 'react';
import { FaGlobe, FaCheck } from 'react-icons/fa';

const RulesModal = ({ 
    t, 
    language, 
    changeLanguage, 
    onClose, 
    tournamentSettings, 
    setTournamentSettings, 
    languageNames, 
    translations 
}) => {
    
    const handleSettingsChange = (newSettingValue) => {
        const newSettings = { ...tournamentSettings, useTotalPointsForTie: newSettingValue };
        setTournamentSettings(newSettings);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-start justify-center p-4 z-[60] backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-4xl my-8 overflow-hidden">
                <div className="bg-gradient-to-r from-[#0B8E8D] to-[#06324F] p-6 text-white sticky top-0 z-10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold flex items-center"><FaGlobe className="mr-2" />{t.rules}</h2>
                        <div className="flex items-center space-x-2">
                            {Object.keys(languageNames).filter(lang => translations[lang]).map(lang => (<button key={lang} onClick={() => changeLanguage(lang)} className={`px-2 py-1 text-xs rounded transition-colors duration-150 ${language === lang ? 'bg-white text-[#0B8E8D] shadow-sm font-semibold' : 'bg-[#0B8E8D]/80 text-white hover:bg-[#0B8E8D]/90'}`} title={languageNames[lang]}>{lang.toUpperCase()}</button>))}
                            <button onClick={onClose} className="text-white hover:text-[#FDD80F] transition-colors ml-4" title={t.close}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                    </div>
                </div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
                        <h4 className="text-lg font-semibold text-[#06324F] mb-3">{t.tieRules?.settingsTitle || "Настройки определения победителя (при 1:1 по сетам)"}</h4>
                        <div className="flex items-center space-x-3"><input type="checkbox" id="useTotalPointsForTie" checked={tournamentSettings.useTotalPointsForTie} onChange={(e) => handleSettingsChange(e.target.checked)} className="h-5 w-5 rounded text-[#0B8E8D] focus:ring-2 focus:ring-[#0B8E8D]/50 border-gray-300 cursor-pointer" /><label htmlFor="useTotalPointsForTie" className="text-gray-700 select-none cursor-pointer">{t.tieRules?.usePointsOption || "Учитывать общее кол-во очков в 2 сетах"}</label></div>
                        <p className="text-xs text-gray-500 mt-2">{tournamentSettings.useTotalPointsForTie ? (t.tieRules?.usePointsOptionDescription || "Если счет 1:1, выигрывает команда с большим кол-вом очков за 2 сета. При равенстве очков играется тай-брейк до 5.") : (t.tieRules?.useTiebreakOptionDescription || "Если счет 1:1, всегда играется тай-брейк до 5.")} ({t.scoreDifferenceLabel || "Разница в 2 очка"})</p>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h5 className="text-sm font-bold text-[#06324F] mb-3 flex items-center">
                                <span className="bg-[#C1CBA7]/50 px-2 py-1 rounded mr-2">Skupina</span>
                                {t.groupMatchSettings || "Групповые матчи"}
                            </h5>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">{t.setPointsLabel || "Очков в сете"}</label>
                                    <input
                                        type="number" min="10" max="25"
                                        value={tournamentSettings.groupSetPointLimit || 20}
                                        onChange={(e) => setTournamentSettings({ ...tournamentSettings, groupSetPointLimit: Math.min(25, Math.max(10, parseInt(e.target.value) || 20)) })}
                                        className="w-full p-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8E8D]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">{t.winDifferenceLabel || "Разница для победы"}</label>
                                    <select
                                        value={tournamentSettings.groupWinDifference || 1}
                                        onChange={(e) => setTournamentSettings({ ...tournamentSettings, groupWinDifference: parseInt(e.target.value) })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8E8D]"
                                    >
                                        <option value={1}>1 {t.point || "очко"}</option>
                                        <option value={2}>2 {t.points || "очка"}</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h5 className="text-sm font-bold text-[#06324F] mb-3 flex items-center">
                                <span className="bg-[#FDD80F]/30 px-2 py-1 rounded mr-2">Play-off</span>
                                {t.playoffMatchSettings || "Плей-офф / Финалы"}
                            </h5>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">{t.setPointsLabel || "Очков в сете"}</label>
                                    <input
                                        type="number" min="15" max="25"
                                        value={tournamentSettings.playoffSetPointLimit || 25}
                                        onChange={(e) => setTournamentSettings({ ...tournamentSettings, playoffSetPointLimit: Math.min(25, Math.max(15, parseInt(e.target.value) || 25)) })}
                                        className="w-full p-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD80F]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">{t.winDifferenceLabel || "Разница для победы"}</label>
                                    <select
                                        value={tournamentSettings.playoffWinDifference || 2}
                                        onChange={(e) => setTournamentSettings({ ...tournamentSettings, playoffWinDifference: parseInt(e.target.value) })}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FDD80F]"
                                    >
                                        <option value={1}>1 {t.point || "очко"}</option>
                                        <option value={2}>2 {t.points || "очка"}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-8 bg-gradient-to-r from-[#C1CBA7]/30 to-[#0B8E8D]/10 p-6 rounded-xl shadow-md border border-[#0B8E8D]/20">
                        <h3 className="text-xl font-bold text-[#06324F] mb-4">{t.tieRules?.title || "Правила определения победителя (при 1:1 по сетам)"}</h3>
                        <div className="space-y-4"><div className={`p-4 rounded-lg shadow-sm border transition-all duration-300 ${tournamentSettings.useTotalPointsForTie ? 'bg-white border-green-300 ring-2 ring-green-200' : 'bg-gray-100 border-gray-200 opacity-70'}`}><h4 className="text-lg font-semibold text-[#0B8E8D] mb-2 flex items-center">{tournamentSettings.useTotalPointsForTie && <FaCheck className="text-green-500 mr-2" />} {t.tieRules?.option1 || "Вариант 1: По очкам"}</h4><p className="text-gray-700 text-sm">{t.tieRules?.option1Description || "Побеждает команда, набравшая больше очков в сумме за 2 сета. Если очков поровну, играется тай-брейк до 5 очков (разница 2)."}</p></div><div className={`p-4 rounded-lg shadow-sm border transition-all duration-300 ${!tournamentSettings.useTotalPointsForTie ? 'bg-white border-green-300 ring-2 ring-green-200' : 'bg-gray-100 border-gray-200 opacity-70'}`}><h4 className="text-lg font-semibold text-[#0B8E8D] mb-2 flex items-center">{!tournamentSettings.useTotalPointsForTie && <FaCheck className="text-green-500 mr-2" />} {t.tieRules?.option2 || "Вариант 2: Всегда тай-брейк"}</h4><p className="text-gray-700 text-sm">{t.tieRules?.option2Description || "Всегда играется тай-брейк до 5 очков (разница 2)."}</p></div></div>
                    </div>
                    <div className="prose prose-sm max-w-none mt-6"><h3 className="text-xl font-bold text-[#06324F] mb-4">{t.generalRulesTitle || "Общие правила турнира"}</h3><div className="whitespace-pre-wrap font-sans text-sm text-gray-800 bg-gray-50 p-4 rounded border border-gray-200">{t.tournamentRules || "Здесь будут общие правила турнира..."}</div></div>
                </div>
                <div className="p-4 border-t border-gray-200 bg-gray-50 sticky bottom-0"><button onClick={onClose} className="w-full py-2 bg-gradient-to-r from-[#0B8E8D] to-[#06324F] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center shadow-md"><FaCheck className="mr-2" /> {t.hideRules || "Закрыть правила"}</button></div>
            </div>
        </div>
    );
};

export default RulesModal;

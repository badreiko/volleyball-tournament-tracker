import React, { useState, useEffect } from 'react';
import './App.css';
import { FaVolleyballBall, FaUsers, FaTrophy, FaRegClock, FaCheck, FaGlobe, FaExclamationTriangle, FaCalendarAlt, FaTable, FaChartBar } from 'react-icons/fa';
import { translations, languageNames } from './translations';

// Начальные данные команд
const initialTeams = [
  { code: 'A1', name: 'Zlatý jádro Kladno', group: 'A', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0 },
  { code: 'A2', name: 'Spořilov Praha', group: 'A', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0 },
  { code: 'A3', name: 'Lážo Plážo Děčín', group: 'A', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0 },
  { code: 'B1', name: 'Všude zdejší Slaný', group: 'B', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0 },
  { code: 'B2', name: 'Sokol Benešov', group: 'B', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0 },
  { code: 'B3', name: 'Kaliči Teplice', group: 'B', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0 },
  { code: 'C1', name: 'DREAM TEAM Pardubice', group: 'C', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0 },
  { code: 'C2', name: 'UB Mongolsko', group: 'C', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0 },
  { code: 'C3', name: 'GNA Praha', group: 'C', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0 },
  { code: 'C4', name: 'Bon Team Trutnov', group: 'C', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0 },
];

// Начальные данные матчей
const initialMatches = [
  // Групповой этап - Группа A
  { id: 'A1-A2', court: 1, time: '09:00', team1: 'A1', team2: 'A2', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  { id: 'A2-A3', court: 1, time: '09:40', team1: 'A2', team2: 'A3', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  { id: 'A1-A3', court: 1, time: '10:20', team1: 'A1', team2: 'A3', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  
  // Групповой этап - Группа B
  { id: 'B1-B2', court: 2, time: '09:00', team1: 'B1', team2: 'B2', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  { id: 'B2-B3', court: 2, time: '09:40', team1: 'B2', team2: 'B3', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  { id: 'B1-B3', court: 2, time: '10:20', team1: 'B1', team2: 'B3', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  
  // Групповой этап - Группа C
  { id: 'C1-C2', court: 3, time: '09:00', team1: 'C1', team2: 'C2', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  { id: 'C3-C4', court: 3, time: '09:40', team1: 'C3', team2: 'C4', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  { id: 'C1-C3', court: 3, time: '10:20', team1: 'C1', team2: 'C3', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  { id: 'C2-C4', court: 3, time: '11:00', team1: 'C2', team2: 'C4', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  { id: 'C1-C4', court: 3, time: '11:40', team1: 'C1', team2: 'C4', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  { id: 'C2-C3', court: 3, time: '12:20', team1: 'C2', team2: 'C3', group: 'C', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group' },
  
  // Четвертьфиналы
  { id: 'QF-1A-2B', court: 1, time: '13:00', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'quarterfinal' },
  { id: 'QF-1B-2A', court: 2, time: '13:00', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'quarterfinal' },
  { id: 'QF-1C-WC', court: 1, time: '13:40', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'quarterfinal' },
  { id: 'QF-2C-3B', court: 2, time: '13:40', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'quarterfinal' },
  
  // Полуфиналы
  { id: 'SF-W1-W3', court: 1, time: '14:20', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'semifinal' },
  { id: 'SF-W2-W4', court: 2, time: '14:20', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'semifinal' },
  
  // Матч за 3-е место
  { id: 'F3-L1-L2', court: 2, time: '15:00', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'third_place' },
  
  // Финал
  { id: 'F-W1-W2', court: 1, time: '15:00', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'final' }
];

function App() {
  const [teams, setTeams] = useState(() => JSON.parse(localStorage.getItem('teams')) || initialTeams);
  const [matches, setMatches] = useState(() => JSON.parse(localStorage.getItem('matches')) || initialMatches);
  const [view, setView] = useState('matches'); // matches, groups, matchDetail
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'ru');
  
  // Получение текущих переводов
  const t = translations[language];

  // Сохранение данных в localStorage
  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
    localStorage.setItem('matches', JSON.stringify(matches));
    localStorage.setItem('language', language);
  }, [teams, matches, language]);

  // Обновление счета матча
  const updateMatchScore = (matchId, set, team, score) => {
    setMatches(prevMatches => {
      const updatedMatches = prevMatches.map(match => {
        if (match.id === matchId) {
          const updatedMatch = { ...match };
          updatedMatch[`set${set}${team === 'team1' ? 'Team1' : 'Team2'}`] = parseInt(score) || 0;
          if ((set === 2 && match.round !== 'final') || (set === 3 && match.round === 'final')) {
            const { set1Team1, set1Team2, set2Team1, set2Team2, set3Team1, set3Team2 } = updatedMatch;
            let team1Sets = (set1Team1 > set1Team2 ? 1 : 0) + (set2Team1 > set2Team2 ? 1 : 0) + (set3Team1 > set3Team2 ? 1 : 0);
            let team2Sets = (set1Team2 > set1Team1 ? 1 : 0) + (set2Team2 > set2Team1 ? 1 : 0) + (set3Team2 > set3Team1 ? 1 : 0);
            if (team1Sets === 2) { updatedMatch.winner = match.team1; updatedMatch.status = 'completed'; }
            else if (team2Sets === 2) { updatedMatch.winner = match.team2; updatedMatch.status = 'completed'; }
            else if (team1Sets === 1 && team2Sets === 1 && match.round !== 'final') updatedMatch.status = 'tie';
            if (updatedMatch.status === 'completed' || updatedMatch.status === 'tie') updateTeamStats(updatedMatch);
          }
          return updatedMatch;
        }
        return match;
      });
      updatePlayoffTeams(updatedMatches);
      return updatedMatches;
    });
  };

  // Обновление статистики команд
  const updateTeamStats = (match) => {
    setTeams(prevTeams => prevTeams.map(team => {
      if (team.code === match.team1 || team.code === match.team2) {
        const isTeam1 = team.code === match.team1;
        const setsWon = isTeam1 ? (match.set1Team1 > match.set1Team2 ? 1 : 0) + (match.set2Team1 > match.set2Team2 ? 1 : 0) : 
                                  (match.set1Team2 > match.set1Team1 ? 1 : 0) + (match.set2Team2 > match.set2Team1 ? 1 : 0);
        const points = match.winner === team.code ? 3 : match.status === 'tie' ? (setsWon === 1 ? 2 : 1) : 0;
        return { 
          ...team, 
          points: team.points + points, 
          wins: match.winner === team.code ? team.wins + 1 : team.wins, 
          losses: match.winner && match.winner !== team.code ? team.losses + 1 : team.losses, 
          setsWon: team.setsWon + setsWon, 
          setsLost: team.setsLost + (2 - setsWon) 
        };
      }
      return team;
    }));
  };

  // Обновление плей-офф
  const updatePlayoffTeams = (updatedMatches) => {
    const groupRankings = {};
    ['A', 'B', 'C'].forEach(group => {
      groupRankings[group] = teams.filter(t => t.group === group).sort((a, b) => b.points - a.points || b.setsWon - a.setsWon);
    });
    
    // Находим лучшую третью команду (wildcard)
    const thirdPlaceTeams = [
      groupRankings['A'][2],
      groupRankings['B'][2],
      groupRankings['C'][2]
    ].filter(Boolean).sort((a, b) => b.points - a.points || b.setsWon - a.setsWon);
    const wildcard = thirdPlaceTeams[0]?.code;
    
    setMatches(prevMatches => prevMatches.map(match => {
      if (match.round === 'quarterfinal') {
        const updatedMatch = { ...match };
        
        // Заполняем четвертьфиналы
        if (match.id === 'QF-1A-2B') { 
          updatedMatch.team1 = groupRankings['A'][0]?.code; 
          updatedMatch.team2 = groupRankings['B'][1]?.code; 
        }
        else if (match.id === 'QF-1B-2A') { 
          updatedMatch.team1 = groupRankings['B'][0]?.code; 
          updatedMatch.team2 = groupRankings['A'][1]?.code; 
        }
        else if (match.id === 'QF-1C-WC') { 
          updatedMatch.team1 = groupRankings['C'][0]?.code; 
          updatedMatch.team2 = wildcard; 
        }
        else if (match.id === 'QF-2C-3B') { 
          updatedMatch.team1 = groupRankings['C'][1]?.code; 
          updatedMatch.team2 = groupRankings['B'][2]?.code; 
        }
        
        // Если обе команды определены, меняем статус на 'not_started'
        if (updatedMatch.team1 && updatedMatch.team2) {
          updatedMatch.status = 'not_started';
        }
        
        return updatedMatch;
      }
      
      // Заполняем полуфиналы на основе результатов четвертьфиналов
      if (match.round === 'semifinal') {
        const updatedMatch = { ...match };
        const completedQuarterfinals = updatedMatches.filter(m => m.round === 'quarterfinal' && m.status === 'completed');
        
        if (match.id === 'SF-W1-W3') {
          const qf1 = completedQuarterfinals.find(m => m.id === 'QF-1A-2B');
          const qf3 = completedQuarterfinals.find(m => m.id === 'QF-1C-WC');
          if (qf1?.winner) updatedMatch.team1 = qf1.winner;
          if (qf3?.winner) updatedMatch.team2 = qf3.winner;
        }
        else if (match.id === 'SF-W2-W4') {
          const qf2 = completedQuarterfinals.find(m => m.id === 'QF-1B-2A');
          const qf4 = completedQuarterfinals.find(m => m.id === 'QF-2C-3B');
          if (qf2?.winner) updatedMatch.team1 = qf2.winner;
          if (qf4?.winner) updatedMatch.team2 = qf4.winner;
        }
        
        // Если обе команды определены, меняем статус на 'not_started'
        if (updatedMatch.team1 && updatedMatch.team2) {
          updatedMatch.status = 'not_started';
        }
        
        return updatedMatch;
      }
      
      // Заполняем финал и матч за 3-е место на основе результатов полуфиналов
      if (match.round === 'final' || match.round === 'third_place') {
        const updatedMatch = { ...match };
        const completedSemifinals = updatedMatches.filter(m => m.round === 'semifinal' && m.status === 'completed');
        
        if (match.round === 'final' && match.id === 'F-W1-W2') {
          const sf1 = completedSemifinals.find(m => m.id === 'SF-W1-W3');
          const sf2 = completedSemifinals.find(m => m.id === 'SF-W2-W4');
          if (sf1?.winner) updatedMatch.team1 = sf1.winner;
          if (sf2?.winner) updatedMatch.team2 = sf2.winner;
        }
        else if (match.round === 'third_place' && match.id === 'F3-L1-L2') {
          const sf1 = completedSemifinals.find(m => m.id === 'SF-W1-W3');
          const sf2 = completedSemifinals.find(m => m.id === 'SF-W2-W4');
          
          // Проигравшие в полуфиналах
          if (sf1?.status === 'completed') {
            const loser = sf1.winner === sf1.team1 ? sf1.team2 : sf1.team1;
            updatedMatch.team1 = loser;
          }
          if (sf2?.status === 'completed') {
            const loser = sf2.winner === sf2.team1 ? sf2.team2 : sf2.team1;
            updatedMatch.team2 = loser;
          }
        }
        
        // Если обе команды определены, меняем статус на 'not_started'
        if (updatedMatch.team1 && updatedMatch.team2) {
          updatedMatch.status = 'not_started';
        }
        
        return updatedMatch;
      }
      
      return match;
    }));
  };

  // Переключение языка
  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  // Рендер матчей
  const renderMatches = () => (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center">
        <FaVolleyballBall className="mr-3 text-indigo-600" /> 
        <span>{t.matches}</span>
      </h2>
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl shadow-lg">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <tr>
              <th className="py-3 px-4 text-left text-sm md:text-base">{t.round}</th>
              <th className="py-3 px-4 text-left text-sm md:text-base">{t.match}</th>
              <th className="py-3 px-4 text-left text-sm md:text-base">{t.court}</th>
              <th className="py-3 px-4 text-left text-sm md:text-base">{t.time}</th>
              <th className="py-3 px-4 text-left text-sm md:text-base">{t.set1}</th>
              <th className="py-3 px-4 text-left text-sm md:text-base">{t.set2}</th>
              <th className="py-3 px-4 text-left text-sm md:text-base">{t.set3}</th>
              <th className="py-3 px-4 text-left text-sm md:text-base">{t.status}</th>
            </tr>
          </thead>
          <tbody>
            {matches.map(match => {
              const team1 = teams.find(t => t.code === match.team1) || { name: match.round === 'group' ? 'TBD' : `1-е ${match.id.split('-')[1]}` };
              const team2 = teams.find(t => t.code === match.team2) || { name: match.round === 'group' ? 'TBD' : `1-е ${match.id.split('-')[2]}` };
              
              // Определяем стили для статуса матча
              let statusIcon, statusClass;
              if (match.status === 'completed') {
                statusIcon = <FaCheck className="mr-1 text-green-500" />;
                statusClass = 'text-green-600 font-semibold';
              } else if (match.status === 'tie') {
                statusIcon = <FaExclamationTriangle className="mr-1 text-orange-500" />;
                statusClass = 'text-orange-600 font-semibold';
              } else {
                statusIcon = <FaRegClock className="mr-1 text-gray-500" />;
                statusClass = 'text-gray-600';
              }
              
              // Определяем стили для раунда
              let roundClass = 'px-2 py-1 rounded text-xs font-semibold';
              if (match.round === 'group') {
                roundClass += ' bg-blue-100 text-blue-800';
              } else if (match.round === 'quarterfinal') {
                roundClass += ' bg-indigo-100 text-indigo-800';
              } else if (match.round === 'semifinal') {
                roundClass += ' bg-purple-100 text-purple-800';
              } else if (match.round === 'final') {
                roundClass += ' bg-red-100 text-red-800';
              }
              
              return (
                <tr key={match.id} className="border-b hover:bg-indigo-50 transition-colors duration-150 ease-in-out cursor-pointer" 
                    onClick={() => { setView('matchDetail'); setSelectedMatch(match); }}>
                  <td className="p-3 text-sm md:text-base">
                    <span className={roundClass}>{t.roundNames[match.round]}</span>
                  </td>
                  <td className="p-3 text-sm md:text-base font-medium">{team1.name} <span className="text-gray-400">vs</span> {team2.name}</td>
                  <td className="p-3 text-sm md:text-base">{t.court} {match.court}</td>
                  <td className="p-3 text-sm md:text-base text-gray-700">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-indigo-500" />
                      {match.time}
                    </div>
                  </td>
                  <td className="p-3 text-sm md:text-base font-bold">{match.set1Team1} - {match.set1Team2}</td>
                  <td className="p-3 text-sm md:text-base font-bold">{match.set2Team1} - {match.set2Team2}</td>
                  <td className="p-3 text-sm md:text-base font-bold">{match.round === 'final' ? `${match.set3Team1} - ${match.set3Team2}` : '-'}</td>
                  <td className={`p-3 text-sm md:text-base ${statusClass}`}>
                    <div className="flex items-center">
                      {statusIcon}
                      {t.statusNames[match.status]}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Рендер групп
  const renderGroups = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center">
        <FaUsers className="mr-3 text-indigo-600" /> 
        <span>{t.groups}</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['A', 'B', 'C'].map(group => {
          // Выбираем цвета для каждой группы
          const groupColors = {
            'A': {
              bg: 'from-blue-500 to-blue-700',
              lightBg: 'from-blue-50 to-indigo-50',
              text: 'text-blue-700',
              border: 'border-blue-200'
            },
            'B': {
              bg: 'from-purple-500 to-purple-700',
              lightBg: 'from-purple-50 to-indigo-50',
              text: 'text-purple-700',
              border: 'border-purple-200'
            },
            'C': {
              bg: 'from-green-500 to-green-700',
              lightBg: 'from-green-50 to-indigo-50',
              text: 'text-green-700',
              border: 'border-green-200'
            }
          };
          
          const colors = groupColors[group];
          
          return (
            <div key={group} className={`bg-gradient-to-r ${colors.lightBg} rounded-xl shadow-lg overflow-hidden`}>
              <div className={`bg-gradient-to-r ${colors.bg} p-4 text-white`}>
                <h3 className="text-xl font-bold flex items-center">
                  <FaTable className="mr-2" /> {t.group} {group}
                </h3>
              </div>
              <div className="p-4">
                <table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left text-sm md:text-base font-semibold text-gray-700">Команда</th>
                      <th className="p-3 text-center text-sm md:text-base font-semibold text-gray-700">Очки</th>
                      <th className="p-3 text-center text-sm md:text-base font-semibold text-gray-700">П/П</th>
                      <th className="p-3 text-center text-sm md:text-base font-semibold text-gray-700">Сеты</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.filter(t => t.group === group)
                      .sort((a, b) => b.points - a.points || (b.setsWon - b.setsLost) - (a.setsWon - a.setsLost))
                      .map((team, index) => (
                        <tr key={team.code} className={`${index === 0 ? 'bg-yellow-50' : ''} border-b ${colors.border} hover:bg-gray-50 transition-colors duration-150`}>
                          <td className="p-3 text-sm md:text-base font-medium">
                            {index === 0 && <FaTrophy className="inline mr-2 text-yellow-500" />}
                            {team.name}
                          </td>
                          <td className="p-3 text-sm md:text-base text-center">
                            <span className="inline-block w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center">
                              {team.points}
                            </span>
                          </td>
                          <td className="p-3 text-sm md:text-base text-center">{team.wins}/{team.losses}</td>
                          <td className="p-3 text-sm md:text-base text-center">
                            <span className="font-semibold text-green-600">{team.setsWon}</span>
                            <span className="mx-1">:</span>
                            <span className="font-semibold text-red-600">{team.setsLost}</span>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Рендер деталей матча
  const renderMatchDetail = () => {
    if (!selectedMatch) return null;
    const team1 = teams.find(t => t.code === selectedMatch.team1) || { name: 'TBD' };
    const team2 = teams.find(t => t.code === selectedMatch.team2) || { name: 'TBD' };
    
    // Определяем стили для раунда
    let roundClass = 'px-3 py-1 rounded-full text-sm font-semibold inline-block mb-3';
    let roundIcon;
    if (selectedMatch.round === 'group') {
      roundClass += ' bg-blue-100 text-blue-800';
      roundIcon = <FaUsers className="mr-2" />;
    } else if (selectedMatch.round === 'quarterfinal') {
      roundClass += ' bg-indigo-100 text-indigo-800';
      roundIcon = <FaChartBar className="mr-2" />;
    } else if (selectedMatch.round === 'semifinal') {
      roundClass += ' bg-purple-100 text-purple-800';
      roundIcon = <FaChartBar className="mr-2" />;
    } else if (selectedMatch.round === 'final') {
      roundClass += ' bg-red-100 text-red-800';
      roundIcon = <FaTrophy className="mr-2" />;
    }
    
    // Определяем стили для статуса
    let statusClass = 'px-3 py-1 rounded-full text-sm font-semibold inline-block ml-2';
    let statusIcon;
    if (selectedMatch.status === 'completed') {
      statusClass += ' bg-green-100 text-green-800';
      statusIcon = <FaCheck className="mr-2" />;
    } else if (selectedMatch.status === 'tie') {
      statusClass += ' bg-orange-100 text-orange-800';
      statusIcon = <FaExclamationTriangle className="mr-2" />;
    } else {
      statusClass += ' bg-gray-100 text-gray-800';
      statusIcon = <FaRegClock className="mr-2" />;
    }
    
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-lg overflow-hidden">
          {/* Шапка */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Редактирование матча</h2>
              <button 
                onClick={() => setView('matches')} 
                className="text-white hover:text-red-200 transition-colors duration-150"
              >
                ✕
              </button>
            </div>
          </div>
          
          {/* Содержимое */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <span className={roundClass}>
                  <span className="flex items-center">
                    {roundIcon}
                    {selectedMatch.round}
                  </span>
                </span>
                <span className={statusClass}>
                  <span className="flex items-center">
                    {statusIcon}
                    {selectedMatch.status}
                  </span>
                </span>
              </div>
              <div className="text-gray-600 flex items-center">
                <FaCalendarAlt className="mr-2 text-indigo-500" />
                {selectedMatch.time}
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <div className="text-center w-5/12">
                  <div className="text-lg font-bold text-indigo-800">{team1.name}</div>
                </div>
                <div className="text-center w-2/12">
                  <div className="text-xl font-bold text-gray-600">vs</div>
                </div>
                <div className="text-center w-5/12">
                  <div className="text-lg font-bold text-indigo-800">{team2.name}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.set1}</label>
                <div className="flex items-center justify-between">
                  <input 
                    type="number" 
                    value={selectedMatch.set1Team1} 
                    onChange={(e) => updateMatchScore(selectedMatch.id, 1, 'team1', e.target.value)} 
                    className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  />
                  <span className="text-gray-400 text-xl font-bold">:</span>
                  <input 
                    type="number" 
                    value={selectedMatch.set1Team2} 
                    onChange={(e) => updateMatchScore(selectedMatch.id, 1, 'team2', e.target.value)} 
                    className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.set2}</label>
                <div className="flex items-center justify-between">
                  <input 
                    type="number" 
                    value={selectedMatch.set2Team1} 
                    onChange={(e) => updateMatchScore(selectedMatch.id, 2, 'team1', e.target.value)} 
                    className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  />
                  <span className="text-gray-400 text-xl font-bold">:</span>
                  <input 
                    type="number" 
                    value={selectedMatch.set2Team2} 
                    onChange={(e) => updateMatchScore(selectedMatch.id, 2, 'team2', e.target.value)} 
                    className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  />
                </div>
              </div>
              
              {selectedMatch.round === 'final' && (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.set3}</label>
                  <div className="flex items-center justify-between">
                    <input 
                      type="number" 
                      value={selectedMatch.set3Team1} 
                      onChange={(e) => updateMatchScore(selectedMatch.id, 3, 'team1', e.target.value)} 
                      className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    />
                    <span className="text-gray-400 text-xl font-bold">:</span>
                    <input 
                      type="number" 
                      value={selectedMatch.set3Team2} 
                      onChange={(e) => updateMatchScore(selectedMatch.id, 3, 'team2', e.target.value)} 
                      className="w-20 p-2 border border-gray-300 rounded-lg text-center font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setView('matches')} 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex flex-col">
      {/* Шапка */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-xl md:text-2xl font-bold flex items-center">
          <FaVolleyballBall className="mr-3 animate-spin-slow" /> 
          {t.appTitle}
        </h1>
        <div className="flex items-center space-x-2">
          <FaGlobe className="text-white" />
          <select 
            value={language} 
            onChange={(e) => changeLanguage(e.target.value)}
            className="bg-transparent text-white border border-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white"
          >
            {Object.keys(languageNames).map(lang => (
              <option key={lang} value={lang} className="bg-indigo-700 text-white">
                {languageNames[lang]}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Основной контент */}
      <main className="flex-1 md:ml-64 p-2">
        {view === 'matches' && renderMatches()}
        {view === 'groups' && renderGroups()}
        {view === 'matchDetail' && renderMatchDetail()}
      </main>

      {/* Боковое меню для десктопов */}
      <aside className="hidden md:block w-64 bg-white shadow-xl p-6 fixed top-16 bottom-0 left-0 z-10">
        <div className="space-y-2">
          <button 
            onClick={() => setView('matches')} 
            className={`flex items-center w-full text-left p-3 rounded-lg transition-all duration-200 ${view === 'matches' 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
              : 'hover:bg-indigo-50 text-gray-700'}`}
          >
            <FaVolleyballBall className="mr-3" /> {t.matches}
          </button>
          <button 
            onClick={() => setView('groups')} 
            className={`flex items-center w-full text-left p-3 rounded-lg transition-all duration-200 ${view === 'groups' 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
              : 'hover:bg-indigo-50 text-gray-700'}`}
          >
            <FaUsers className="mr-3" /> {t.groups}
          </button>
        </div>
        
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg shadow-sm border border-indigo-100">
            <h3 className="text-sm font-semibold text-indigo-700 mb-2">{t.aboutSection}</h3>
            <p className="text-xs text-gray-600">{t.aboutApp}</p>
          </div>
        </div>
      </aside>

      {/* Нижняя навигация для мобильных */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-3 flex justify-around md:hidden z-10">
        <button 
          onClick={() => setView('matches')} 
          className={`p-2 flex flex-col items-center ${view === 'matches' ? 'text-indigo-600 font-semibold' : 'text-gray-600'}`}
        >
          <FaVolleyballBall className="text-xl mb-1" />
          <span className="text-xs">{t.matches}</span>
        </button>
        <button 
          onClick={() => setView('groups')} 
          className={`p-2 flex flex-col items-center ${view === 'groups' ? 'text-indigo-600 font-semibold' : 'text-gray-600'}`}
        >
          <FaUsers className="text-xl mb-1" />
          <span className="text-xs">{t.groups}</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
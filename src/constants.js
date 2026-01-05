export const LEAGUE_SEASON = '2025-26';

export const TOURNAMENTS = {
    autumn: {
        id: 'autumn',
        name: 'Podzimní',
        nameRu: 'Осенний',
        nameUk: 'Осінній',
        date: '2.11.2025',
        status: 'completed'
    },
    winter: {
        id: 'winter',
        name: 'Zimní',
        nameRu: 'Зимний',
        nameUk: 'Зимовий',
        date: '11.1.2026',
        status: 'active'
    },
    spring: {
        id: 'spring',
        name: 'Jarní',
        nameRu: 'Весенний',
        nameUk: 'Весняний',
        date: '7.3.2026',
        status: 'upcoming'
    },
    finals: {
        id: 'finals',
        name: 'Finále',
        nameRu: 'Финал',
        nameUk: 'Фінал',
        date: '19.4.2026',
        status: 'upcoming'
    }
};

export const AUTUMN_STANDINGS = [
    { name: 'Lážo plážo Děčín', leaguePoints: 10 },
    { name: 'Sokol Benešov', leaguePoints: 8 },
    { name: 'Kondor Slaný', leaguePoints: 6 },
    { name: 'Dvojka Za Praha', leaguePoints: 5 },
    { name: 'Zlatý jádro Kladno', leaguePoints: 4 },
    { name: 'Spořilov Praha', leaguePoints: 3 },
    { name: 'Všude zdejší Tuchlovice', leaguePoints: 2 },
    { name: 'Karpaty Liberec', leaguePoints: 1 },
];

export const initialTeams = [
    { code: 'A1', name: 'Lážo Plážo Děčín', group: 'A', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0, ballsWon: 0, ballsLost: 0 },
    { code: 'A2', name: 'Zlatý jádro Kladno', group: 'A', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0, ballsWon: 0, ballsLost: 0 },
    { code: 'A3', name: 'Spořilov Praha', group: 'A', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0, ballsWon: 0, ballsLost: 0 },
    { code: 'A4', name: 'Dobrá Parta Plzeň', group: 'A', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0, ballsWon: 0, ballsLost: 0 },
    { code: 'A5', name: 'Prajd Pardubice', group: 'A', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0, ballsWon: 0, ballsLost: 0 },
    { code: 'B1', name: 'Sokol Benešov', group: 'B', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0, ballsWon: 0, ballsLost: 0 },
    { code: 'B2', name: 'Kondor Slaný', group: 'B', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0, ballsWon: 0, ballsLost: 0 },
    { code: 'B3', name: 'Všude zdejší Tuchlovice', group: 'B', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0, ballsWon: 0, ballsLost: 0 },
    { code: 'B4', name: 'UB Mongolsko', group: 'B', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0, ballsWon: 0, ballsLost: 0 },
    { code: 'B5', name: 'Dream team Praha', group: 'B', points: 0, wins: 0, losses: 0, setsWon: 0, setsLost: 0, ballsWon: 0, ballsLost: 0 },
];

export const initialMatches = [
    // === РАУНД 1 (09:00) ===
    { id: 'A1-A2', court: 1, time: '09:00', team1: 'A1', team2: 'A2', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A5', refereeRule: null },
    { id: 'A3-A4', court: 2, time: '09:00', team1: 'A3', team2: 'A4', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B5', refereeRule: null },
    { id: 'B1-B2', court: 3, time: '09:00', team1: 'B1', team2: 'B2', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B5', refereeRule: null },

    // === РАУНД 2 (09:30) ===
    { id: 'A1-A3', court: 1, time: '09:30', team1: 'A1', team2: 'A3', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A4', refereeRule: null },
    { id: 'A2-A5', court: 2, time: '09:30', team1: 'A2', team2: 'A5', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B4', refereeRule: null },
    { id: 'B3-B4', court: 3, time: '09:30', team1: 'B3', team2: 'B4', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B5', refereeRule: null },

    // === РАУНД 3 (10:00) ===
    { id: 'A1-A4', court: 1, time: '10:00', team1: 'A1', team2: 'A4', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A2', refereeRule: null },
    { id: 'A3-A5', court: 2, time: '10:00', team1: 'A3', team2: 'A5', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B2', refereeRule: null },
    { id: 'B1-B3', court: 3, time: '10:00', team1: 'B1', team2: 'B3', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B4', refereeRule: null },

    // === РАУНД 4 (10:30) ===
    { id: 'A1-A5', court: 1, time: '10:30', team1: 'A1', team2: 'A5', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A3', refereeRule: null },
    { id: 'A2-A4', court: 2, time: '10:30', team1: 'A2', team2: 'A4', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B3', refereeRule: null },
    { id: 'B2-B5', court: 3, time: '10:30', team1: 'B2', team2: 'B5', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B1', refereeRule: null },

    // === РАУНД 5 (11:00) ===
    { id: 'A2-A3', court: 1, time: '11:00', team1: 'A2', team2: 'A3', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A1', refereeRule: null },
    { id: 'A4-A5', court: 2, time: '11:00', team1: 'A4', team2: 'A5', group: 'A', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B1', refereeRule: null },
    { id: 'B1-B4', court: 3, time: '11:00', team1: 'B1', team2: 'B4', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'B5', refereeRule: null },

    // === РАУНД 6 (11:30) ===
    { id: 'B1-B5', court: 1, time: '11:30', team1: 'B1', team2: 'B5', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A1', refereeRule: null },
    { id: 'B2-B3', court: 2, time: '11:30', team1: 'B2', team2: 'B3', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A2', refereeRule: null },

    // === РАУНД 7 (12:00) ===
    { id: 'B2-B4', court: 1, time: '12:00', team1: 'B2', team2: 'B4', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A3', refereeRule: null },
    { id: 'B3-B5', court: 2, time: '12:00', team1: 'B3', team2: 'B5', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A4', refereeRule: null },

    // === РАУНД 8 (12:30) ===
    { id: 'B4-B5', court: 1, time: '12:30', team1: 'B4', team2: 'B5', group: 'B', set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'not_started', round: 'group', refereeTeamCode: 'A5', refereeRule: null },

    // === ФИНАЛЫ (13:00) ===
    { id: 'F-1A-1B', court: 1, time: '13:00', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'final', refereeTeamCode: null, refereeRule: null },
    { id: 'F3-2A-2B', court: 2, time: '13:00', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'third_place', refereeTeamCode: null, refereeRule: null },
    { id: 'F5-3A-3B', court: 3, time: '13:00', team1: null, team2: null, group: null, set1Team1: 0, set1Team2: 0, set2Team1: 0, set2Team2: 0, set3Team1: 0, set3Team2: 0, winner: null, status: 'waiting', round: 'fifth_place', refereeTeamCode: null, refereeRule: null }
];

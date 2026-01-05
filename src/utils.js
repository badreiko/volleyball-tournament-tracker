export const validateScore = (score, isFinalSet, isTiebreak) => {
    const validated = Math.max(0, score); // Только > 0
    return validated;
};

export const isSetCompleted = (team1Score, team2Score, isFinalSet, isTiebreak, setPointLimit = 25, winDifference = 2) => {
    const score1 = team1Score ?? 0;
    const score2 = team2Score ?? 0;

    // Тай-брейк группы (до 5, первый достигший побеждает БЕЗ разницы)
    if (isTiebreak && !isFinalSet) {
        return score1 === 5 || score2 === 5;
    }

    // Тай-брейк финала (до 15, разница 2)
    if (isTiebreak && isFinalSet) {
        return (score1 >= 15 || score2 >= 15) && Math.abs(score1 - score2) >= 2;
    }

    // Обычный сет: setPointLimit + разница winDifference
    // winDifference берется из настроек (groupWinDifference или playoffWinDifference)
    return (score1 >= setPointLimit || score2 >= setPointLimit) &&
        Math.abs(score1 - score2) >= winDifference;
};

// Приоритет: 1) Очки, 2) Разница сетов, 3) Выигранные сеты, 4) Разница мячей, 5) По имени
export const sortTeamsByRank = (teamsToSort) => {
    if (!teamsToSort || teamsToSort.length === 0) return [];
    return [...teamsToSort].sort((a, b) =>
        (b.points || 0) - (a.points || 0) ||
        ((b.setsWon || 0) - (b.setsLost || 0)) - ((a.setsWon || 0) - (a.setsLost || 0)) ||
        (b.setsWon || 0) - (a.setsWon || 0) ||
        ((b.ballsWon || 0) - (b.ballsLost || 0)) - ((a.ballsWon || 0) - (a.ballsLost || 0)) ||
        (b.ballsWon || 0) - (a.ballsWon || 0) ||
        a.name.localeCompare(b.name) // По имени для окончательного разрешения ничьих
    );
};

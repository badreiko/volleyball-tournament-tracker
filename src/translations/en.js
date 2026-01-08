/**
 * English translations for the Volleyball Tournament Tracker
 */
export const en = {
  appTitle: 'RVL Volleyball Tournament',
  aboutApp: 'RVL Tournament - an application for tracking volleyball match results and tournament standings.',
  matches: 'Matches',
  groups: 'Groups',
  round: 'Round',
  match: 'Match',
  court: 'Court',
  time: 'Time',
  set1: 'Set 1',
  set2: 'Set 2',
  set3: 'Set 3',
  status: 'Status',
  team: 'Team',
  points: 'Points',
  wins: 'Wins',
  losses: 'Losses',
  sets: 'Sets',
  close: 'Close',
  save: 'Save',
  matchDetail: 'Match Details',
  tiebreak: 'Tiebreak',
  group: 'Group',
  aboutSection: 'About the App',
  tournamentDate: '6.4.2025',
  tournamentAddress: 'Václava Mouchy 2045, Slaný',
  tournamentWebsite: 'https://rvl.hala-slany.cz/',
  tournamentInfo: 'Tournament Information',
  addressLabel: 'Hall Address:',
  websiteLabel: 'Website:',
  dateLabel: 'Date:',
  rules: 'Tournament Rules',
  showRules: 'Show Rules',
  hideRules: 'Hide Rules',
  tournamentRules: `10 teams are registered.
Teams are divided into 2 main groups. They play a round-robin system.

Group A
Kondor Slaný
Zlatý jádro Kladno
Prajd Pardubice
Dobrá Parta Plzeň
UB Mongolsko

Group B
Sokol Benešov
Spořilov Praha
Všude zdejší Tuchlovice
AVA Praha
Dream team Praha

Match Rules
Each match is played to 2 winning sets. The first two sets are played to 25 points each (when the 25th point is reached, the set ends; a 2-point victory margin is not required). In case of a 1:1 tie, a 3rd set (tiebreak) is played to 5 points. Reaching the 5th point ends this set.

Points for match:
Win   2 : 0 … 3 points
Win   2 : 1 … 2 points
Loss  1 : 2 … 1 point
Loss  0 : 2 … 0 points

Points earned in a match determine the ranking in the table (A / B). In case of equal points, the number of won sets decides. In case of equal sets — the greater number of won balls.
In the group stage, each team plays 4 matches.

Final Phase
The top 3 teams from each group advance to the final phase, where they compete for 1st-2nd, 3rd-4th, and 5th-6th places.
All these matches are played the same way as group matches — 2 winning sets, with a possible third set (tiebreak) to 5 points.

Referee and Secretary
Referee and secretary functions are performed by teams not currently playing, according to the schedule. The referee's decision is final. (Reminder: this is a tournament for amateur players.)
The secretary records the match result on a simple form, which is handed to the organizers after the match.

Additional Information
RVL Website: https://rvl.hala-slany.cz/
There is a sports bar in the hall with a wide selection of drinks and food.
Location info: https://hala-slany.cz/`,
  roundNames: {
    group: 'Group Stage',
    quarterfinal: 'Quarterfinal',
    semifinal: 'Semifinal',
    third_place: '3rd Place Match',
    final: 'Final'
  },
  statusNames: {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    completed: 'Completed',
    waiting: 'Waiting',
    completed_by_points: 'Win by Points'
  },
  tieRules: {
    title: 'Rules for 1:1 Set Score',
    option1: 'By Total Points',
    option1Description: 'The team with the higher total points in two sets is considered the winner. If the total points are equal, a tiebreak is played.',
    option2: 'Always with Tiebreak',
    option2Description: 'When the score is 1:1 in sets, a tiebreak is always played to determine the winner.',
    currentRule: 'For this tournament, the following rule is used:',
    settingsTitle: 'Settings for determining winner (at 1:1 sets)',
    usePointsOption: 'Use total points from 2 sets',
    usePointsOptionDescription: 'If 1:1, the team with more total points wins. If equal, a tiebreak is played.',
    useTiebreakOptionDescription: 'If 1:1, a tiebreak is always played.'
  },
  referee: 'Referee',
  secretary: 'Secretary',
  refereeAssignment: 'Referee Assignment',
  noRefereeAssigned: 'No referee assigned',
  refereeInstructions: 'Referees are assigned from teams not currently playing',
  refereeDecisionFinal: 'Referee decision is final',
  assignReferee: 'Assign Referee',
  assignSecretary: 'Assign Secretary',
  assignedReferees: 'Assigned Referees',

  // New keys for Live mode and TimePicker
  edit: 'Protocol',
  scoreHistory: 'Set history',
  scoreHistoryEmpty: 'Set started...',
  service: 'SERVICE',
  apply: 'Apply',
  hours: 'Hours',
  minutesShort: 'Min',
  timeStart: 'Start time',
  reset: 'Reset',
  set: 'Set',
  scores: 'Final protocol',
  scanQR: 'Scan QR code',
  shareApp: 'Share app',
  saving: 'Saving...',
  saved: 'Saved',
  swapTeams: 'Swap sides',
  resetMatch: 'Reset',
  selectTournament: 'Tournament',
  leagueStandings: 'League Standings',
  leagueShort: 'League',
  total: 'Total',
  completed: 'Completed',
  active: 'Active',
  upcoming: 'Upcoming',

  // App name
  appName: 'RVL Scoreboard',

  // Missing keys
  vs: 'VS',
  courtShort: 'C',
  tiebreakShort: 'TB',
  playoffLabel: 'Playoff',
  noMatches: 'No matches found.',
  noTeams: 'No teams found.',
  noTeamsInGroup: 'No teams in group',
  loading: 'Loading...',

  // Table headers
  winsLosses: 'Wins/Losses',
  winsLossesShort: 'W/L',
  setsShort: 'S',
  setsDifference: 'Sets difference',
  setsDiffShort: 'SD',
  balls: 'Balls',
  ballsShort: 'B',
  ballsDifference: 'Balls difference',
  ballsDiffShort: 'BD',

  // Match settings
  groupMatchSettings: 'Group matches',
  playoffMatchSettings: 'Playoff / Finals',
  setPointsLabel: 'Points per set',
  tiebreakPointsLabel: 'Tiebreak to',
  winDifferenceLabel: 'Win difference',
  point: 'point',
  scoreDifferenceLabel: '2-point difference',
  generalRulesTitle: 'General tournament rules',

  // Other
  tbd: 'TBD',
  refereeTBD: 'Referee TBD',
  selectRefereePlaceholder: '--',
  unknown: 'Unknown',
};

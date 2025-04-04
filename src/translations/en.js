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
  tournamentRules: `Team Division and Playing System
One of the goals of the Regional Volleyball League is for teams of comparable playing level to compete with each other. Our tournament playing system is adapted to this. In our spring tournament, teams will be divided into two groups according to their current position in the competition and RVL rules.

Group I.
Kaliči Teplice
Spořilov Praha
Zlatý jádro Kladno
Sokol Benešov
Všude zdejší Slaný
Lážo Plážo Děčín

Group II.
UB Mongolsko
GNA Praha
Bon Team Trutnov
DREAM TEAM Pardubice



Group Stage

Teams from Group I are divided into two playing groups A and B as follows:

Group A
Lážo Plážo Děčín
Spořilov Praha
Zlatý jádro Kladno

Group B
Kaliči Teplice
Sokol Benešov
Všude zdejší Slaný

Teams in the group will play matches against each other. This will determine the order in groups A and B.

Group II. (hereinafter referred to as C)
Four teams in group C will play matches against each other. Each team will play 3 matches. These matches will determine the order in group C.

Each match in the group stage is played to 2 sets to 25 points. When the 25th point is reached, the set ends (2-point victory is not required). In case of a 1:1 tie and equal point ratio in both sets, a 3rd set (tiebreak) is played to 5 points. Reaching the 5th point ends this set.

Points for match:
Win 2:0 ... 3 points
Win 1:1 ... 2 points
Loss 1:1 ... 1 point
Loss 0:2 ... 0 points

Points earned in a match determine the order in the table (A/B/C). In case of equal points, the number of won sets decides. In case of equal number of sets - greater number of won points.

Playoff Phase
The 2 best teams from Group II. (C) and all teams from Group I. (A and B) advance to the playoff phase.
In the quarterfinals teams meet as follows: 1A - 1C, 1B - 2C, 2A - 3B, 3A - 2B
Winners of QF matches advance to SF. Winners of SF advance to Final
Each match in the playoff phase is played to 2 sets to 25 points. When the 25th point is reached, the set ends (2-point victory is not required). In case of a 1:1 tie a 3rd set (tiebreak) is played to 5 points. Reaching the 5th point ends this set.

Tournament Final
At the end of the tournament, the SF winners compete for the overall tournament winner. This match is played to 2 winning sets, with a possible deciding third set played to 15 points.
The final match determines both the first prize winner (Molten ball) and the right to participate in the final part of the RVL tournament on April 27, where the winners of each individual RVL tournament have the right to compete.

Referee and Secretary
The referee and secretary functions are performed by teams that are not currently playing, according to the specified schedule. The referee's decision is final. (We remind that this is a tournament for amateur players.)
Secretary records the match result on a simple form, which is handed over to the organizers' table after the match ends.`,
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
    option1Description: 'The team with the higher total points in two sets is considered the winner (with "win 1:1" status). The team with fewer points receives "loss 1:1" status. If the total points are equal, a tiebreak to 5 points is played.',
    option2: 'Always with Tiebreak',
    option2Description: 'When the score is 1:1 in sets, regardless of the number of points scored, a tiebreak to 5 points is always played to determine the winner.',
    currentRule: 'For this tournament, the following rule is used:'
  }
};

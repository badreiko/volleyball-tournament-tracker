// Český překlad
export const cs = {
  appTitle: 'RVL Volejbalový Turnaj',
  aboutApp: 'RVL Turnaj - aplikace pro sledování výsledků volejbalových zápasů a turnajové tabulky.',
  matches: 'Zápasy',
  groups: 'Skupiny',
  round: 'Kolo',
  match: 'Zápas',
  court: 'Kurt',
  time: 'Čas',
  set1: 'Set 1',
  set2: 'Set 2',
  set3: 'Set 3',
  status: 'Stav',
  team: 'Tým',
  points: 'Body',
  wins: 'Výhry',
  losses: 'Prohry',
  sets: 'Sety',
  close: 'Zavřít',
  save: 'Uložit', // Může být neaktuální, pokud je ukládání automatické
  matchDetail: 'Detail zápasu',
  tiebreak: 'Tiebreak',
  group: 'Skupina',
  aboutSection: 'O aplikaci',
  tournamentDate: '11.1.2026',
  tournamentAddress: 'Václava Mouchy 2045, Slaný',
  tournamentWebsite: 'https://rvl.hala-slany.cz/',
  tournamentInfo: 'Informace o turnaji',
  addressLabel: 'Adresa haly:',
  websiteLabel: 'Webové stránky:',
  dateLabel: 'Datum:',
  rules: 'Pravidla turnaje',
  showRules: 'Zobrazit pravidla',
  hideRules: 'Skrýt pravidla',
  // tournamentRules - обновлено для зимнего турнира 11.1.2026
  tournamentRules: `Rozdělení do skupin

Přihlášené týmy jsou rozděleny do dvou skupin:

Skupina A
Lážo Plážo Děčín
Zlatý jádro Kladno
Spořilov Praha
Dobrá Parta Plzeň
Prajd Pardubice

Skupina B
Sokol Benešov
Kondor Slaný
Všude zdejší Tuchlovice
UB Mongolsko
Dream team Praha


Časový harmonogram na neděli 11.1.:

08:00 – 08:30    Příjezd a registrace (účastnický poplatek 1000 Kč)
08:30 – 08:55    Rozcvičení
09:00                   Zahájení
09:05 – 15:45     Zápasy (hrajeme na 3 hřištích současně)
15:50 – 15:55     Vyhlášení výsledků a předání cen


Organizace turnaje
Základní kola se odehrají ve dvou 5-členných skupinách, každý s každým. Celkem tedy na každý tým čekají 4 zápasy.
První 3 týmy každé skupiny pak ještě odehrají vzájemný zápas o celkové 1.- 2.,  3.- 4. a 5.- 6. místo v turnaji.

Pravidla zápasů
Každý zápas ve skupinové fázi se hraje na 2 sety do 25 bodů. Při dosažení 25. bodu je konec setu (výhra o 2 body tedy není nutná). V případě nerozhodného stavu 1:1 a stejném poměru míčů v obou setech se hraje 3.set (tiebreak) do 5 bodů. Dosažením 5.bodu tento set končí.

Bodování zápasu:
Výhra   2 : 0 … 3 body
Výhra   1 : 1 … 2 body
Prohra 1 : 1 … 1 bod
Prohra 0 : 2 … 0 bodů

Získané body v zápasu určí pořadí v tabulce. V případě rovnosti bodů rozhoduje počet vítězných setů. V případě stejného počtu setů pak více vítězných míčů.

Finále turnaje
Finálový zápas o 1.-2. místo se hraje na 2 vítězné sety, přičemž případný rozhodující třetí set se hraje do 15 bodů.

Rozhodčí a zapisovatel
Funkci rozhodčího a zapisovatele obsazují vždy týmy, které aktuálně nehrají, dle uvedeného rozpisu. Rozhodnutí rozhodčího je konečné. (Připomínáme, že se jedná o turnaj amatérských hráčů.)

Další informace
Webové stránky RVL: https://rvl.hala-slany.cz/
V hale je k dispozici sportbar s širokým výběrem nápojů a jídel.
Info o lokalitě: https://hala-slany.cz/`,


  // --- Добавленные/Обновленные ключи ---
  tbd: 'Bude určeno', // Команда "Будет определено"
  winner: 'Vítěz',
  winsLossesShort: 'V/P', // Коротко: Výhry/Prohry
  setsShort: 'S', // Коротко: Sety
  setsDiffShort: 'RS', // Коротко: Rozdíl setů
  tiebreak_condition: 'do 5', // Условие тайбрейка

  generalRulesTitle: "Obecná pravidla", // Заголовок для общих правил

  roundNames: {
    group: 'Skupinová fáze',
    final: 'Zápas o 1.-2. místo',
    third_place: 'Zápas o 3.-4. místo',
    fifth_place: 'Zápas o 5.-6. místo',
    unknown: 'Neznámé'
  },
  statusNames: {
    not_started: 'Nezahájený', // Изменено для согласованности
    in_progress: 'Probíhá',
    completed: 'Dokončený',
    waiting: 'Čeká se',
    completed_by_points: 'Výhra na body', // Изменено для точности
    tie_needs_tiebreak: 'Nutný tiebreak', // Статус для ничьи 1:1 при опр. правилах
    unknown: 'Neznámý' // Добавлено на случай неопределенного статуса
  },
  tieRules: {
    title: 'Pravidla při stavu 1:1 na sety', // Исправлено "setů" на "na sety" для лучшей грамматики
    option1: 'Podle celkového počtu bodů',
    option1Description: 'Tým, který získal více celkových bodů v obou setech, je vítězem. Tým s menším počtem bodů prohrává. Pokud je celkový počet bodů stejný, hraje se tiebreak do 5 bodů.',
    option2: 'Vždy s tiebreakem',
    option2Description: 'Při stavu 1:1 na sety se bez ohledu na počet získaných bodů vždy hraje tiebreak do 5 bodů pro určení vítěze.',
    currentRule: 'Pro tento turnaj se používá pravidlo:', // Может быть уже не нужно
    settingsTitle: "Nastavení pravidel (1:1)", // Заголовок для настроек в модальном окне
    usePointsOption: "Použít celkový počet bodů", // Текст для чекбокса
    usePointsOptionDescription: "Pokud zaškrtnuto, při 1:1 vyhrává tým s více body ze 2 setů. Při rovnosti bodů se hraje tiebreak.", // Описание для опции "по очкам"
    useTiebreakOptionDescription: "Pokud nezaškrtnuto, při stavu 1:1 na sety se vždy hraje tiebreak.", // Описание для опции "всегда тайбрейк"
  },
  referee: 'Rozhodčí',
  secretary: 'Zapisovatel',
  refereeAssignment: 'Přidělení rozhodčích',
  noRefereeAssigned: 'Není přidělen rozhodčí',
  refereeInstructions: 'Rozhodčí jsou přidělováni z týmů, které právě nehrají',
  refereeDecisionFinal: 'Rozhodnutí rozhodčího je konečné',
  assignReferee: 'Přidělit rozhodčího',
  assignSecretary: 'Přidělit zapisovatele',
  assignedReferees: 'Přidělení rozhodčí',

  // Новые ключи для мячей (míčů)
  balls: 'Míče',
  ballsShort: 'M',
  ballsDifference: 'Rozdíl míčů',
  ballsDiffShort: 'RM',

  // Смена сторон
  swapTeams: 'Prohodit strany',

  // Сброс матча
  resetMatch: 'Resetovat',
  resetMatchTooltip: 'Resetovat skóre a stav zápasu',

  // Плейсхолдер для арбітра
  selectRefereePlaceholder: '-- Není přidělen --',
  refereeTBD: 'Nepřiřazeno',
  refereeNotAssignedTooltip: 'Rozhodčí nebyl přidělen!',

  // Информация о тайбрейке
  finalTiebreakCondition: 'do 15',
  tiebreakInfo: 'Zadejte skóre tiebreaku (do 5, rozdíl 2).',
  finalTiebreakInfo: 'Třetí set finále se hraje do 15 bodů (rozdíl 2).',

  // Турниры и лига
  selectTournament: 'Turnaj',
  leagueStandings: 'Pořadí ligy',
  leagueCumulativeInfo: 'Součet bodů ze všech turnajů sezóny.',
  total: 'Celkem',
  completed: 'Dokončeno',
  active: 'Aktivní',
  upcoming: 'Připravuje se',
};
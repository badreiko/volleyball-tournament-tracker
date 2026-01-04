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
  // tournamentRules оставлен без изменений, т.к. предоставленный текст детален
  tournamentRules: `Rozdělení do skupiny a hrací systém
Jedním z cílů Regionální volejbalové ligy je to, aby se vzájemně utkávaly týmy srovnatelné herní úrovně. Tomu je přizpůsoben herní systém našich turnajů. V rámci našeho jarního turnaje budou tedy týmy rozděleny do dvou výkonnostních skupin, dle aktuálního pořadí v soutěži a pravidel RVL

Skupina I.
Kaliči Teplice
Spořilov Praha
Zlatý jádro Kladno
Sokol Benešov
Všude zdejší Slaný
Lážo Plážo Děčín

Skupina II.
UB Mongolsko
GNA Praha
Bon Team Trutnov
DREAM TEAM Pardubice


Skupinová fáze

Týmy ze skupiny I. jsou rozděleny do dvou herních skupin A a B takto:

Skupina A
Lážo Plážo Děčín
Spořilov Praha
Zlatý jádro Kladno

Skupina B
Kaliči Teplice
Sokol Benešov
Všude zdejší Slaný

Týmy ve skupině sehrají zápasy každý s každým. Tím se určí pořadí ve skupině A a B.

Skupina II. (dále pracovně označována jako C)
Čtyři týmy ve skupině C sehraje zápasy každý s každým. Celkem tedy 3 zápasy pro každý tým. Tyto zápasy určí pořadí ve skupině C.

Každý zápas ve skupinové fázi se hraje na 2 sety do 25 bodů.  Při dosažení 25. bodu je konec setu (výhra o 2 body tedy není nutná). V případě nerozhodného stavu 1:1 a stejném poměru míčů v obou setech se hraje 3.set (tiebreak) do 5 bodů. Dosažením 5.bodu tento set končí.

Bodování zápasu:
Výhra   2 : 0 … 3 body
Výhra   1 : 1 … 2 body
Prohra 1 : 1 … 1 bod
Prohra 0 : 2 … 0 bodů

Získané body v zápasu  určí pořadí v tabulce (A / B / C). V případě rovnosti bodů rozhoduje počet vítězných setů. V případě stejného počtu setů pak více vítězných míčů.
Play-off fáze
Do playoff fáze postupují 2 nejlepší týmy ze skupiny II. (C) a všechna týmy ze skupiny I. (A a B).
Ve čtvrtfinále se utkají týmy takto: 1A – 1C, 1B – 2C, 2A – 3B, 3A – 2B
Vítězové QF zápasů postupují do SF. Vítězové SF postupují do Finále
Každý zápas v playoff fázi se hraje na 2 sety do 25 bodů.  Při dosažení 25. bodu je konec setu (výhra o 2 body tedy není nutná). V případě nerozhodného stavu 1:1 se hraje 3.set (tiebreak) do 5 bodů. Dosažením 5.bodu tento set končí.

Finále turnaje
Na závěr  turnaje se utkají vítězové SF o celkového vítěze turnaje. Tento zápas se hraje na 2 vítězné sety, přičemž případný rozhodující třetí set se hraje do 15 bodů.
Finálový zápas rozhodne jak o držiteli první ceny (míč Molten) tak i o právu postupu do finálové části turnaje RVL 27.dubna, kde mají právo nastoupit  vítězové každého z dílčích turnajů RVL.


Rozhodčí a zapisovatel
Funkci rozhodčího a zapisovatele obsazují vždy týmy, které aktuálně nehrají, dle uvedeného rozpisu.  Rozhodnutí  rozhodčího je konečné.  (Připomínáme, že se jedná o turnaj amatérských hráčů.)
Zapisovatel zaznamenává výsledek utkání na jednoduchý formulář, který po skončení zápasu předá ke stolku organizátorů.`,

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
};
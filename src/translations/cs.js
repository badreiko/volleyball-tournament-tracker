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
  save: 'Uložit',
  matchDetail: 'Detail zápasu',
  tiebreak: 'Tiebreak',
  group: 'Skupina',
  aboutSection: 'O aplikaci',
  tournamentDate: '6.4.2025',
  tournamentAddress: 'Václava Mouchy 2045, Slaný',
  tournamentWebsite: 'https://rvl.hala-slany.cz/',
  tournamentInfo: 'Informace o turnaji',
  addressLabel: 'Adresa haly:',
  websiteLabel: 'Webové stránky:',
  dateLabel: 'Datum:',
  rules: 'Pravidla turnaje',
  showRules: 'Zobrazit pravidla',
  hideRules: 'Skrýt pravidla',
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
Výhra 	2 : 0 … 3 body
Výhra 	1 : 1 … 2 body
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
  roundNames: {
    group: 'Skupinová fáze',
    quarterfinal: 'Čtvrtfinále',
    semifinal: 'Semifinále',
    third_place: 'Zápas o 3. místo',
    final: 'Finále'
  },
  statusNames: {
    not_started: 'Nespustený',
    in_progress: 'Probíhá',
    completed: 'Dokončený',
    waiting: 'Čeká se',
    completed_by_points: 'Výhra podle bodů'
  },
  tieRules: {
    title: 'Pravidla při stavu 1:1 setů',
    option1: 'Podle celkového počtu bodů',
    option1Description: 'Tým, který získal více celkových bodů v obou setech, je považován za vítěze (s stavem "výhra 1:1"). Tým s menším počtem bodů získává stav "prohra 1:1". Pokud je celkový počet bodů stejný, hraje se tiebreak do 5 bodů.',
    option2: 'Vždy s tiebreakem',
    option2Description: 'Při stavu 1:1 setů se nezávisle na počtu získaných bodů vždy hraje tiebreak do 5 bodů pro určení vítěze.',
    currentRule: 'Pro tento turnaj se používá pravidlo:'
  }
};

export const teams = {
  // Group A
  mexico: { id: 'mexico', name: 'México', flag: '🇲🇽', group: 'A' },
  germany: { id: 'germany', name: 'Alemania', flag: '🇩🇪', group: 'A' },
  japan: { id: 'japan', name: 'Japón', flag: '🇯🇵', group: 'A' },
  egypt: { id: 'egypt', name: 'Egipto', flag: '🇪🇬', group: 'A' },
  // Group B
  usa: { id: 'usa', name: 'Estados Unidos', flag: '🇺🇸', group: 'B' },
  england: { id: 'england', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'B' },
  senegal: { id: 'senegal', name: 'Senegal', flag: '🇸🇳', group: 'B' },
  australia: { id: 'australia', name: 'Australia', flag: '🇦🇺', group: 'B' },
  // Group C
  argentina: { id: 'argentina', name: 'Argentina', flag: '🇦🇷', group: 'C' },
  netherlands: { id: 'netherlands', name: 'Países Bajos', flag: '🇳🇱', group: 'C' },
  south_korea: { id: 'south_korea', name: 'Corea del Sur', flag: '🇰🇷', group: 'C' },
  morocco: { id: 'morocco', name: 'Marruecos', flag: '🇲🇦', group: 'C' },
  // Group D
  france: { id: 'france', name: 'Francia', flag: '🇫🇷', group: 'D' },
  uruguay: { id: 'uruguay', name: 'Uruguay', flag: '🇺🇾', group: 'D' },
  croatia: { id: 'croatia', name: 'Croacia', flag: '🇭🇷', group: 'D' },
  nigeria: { id: 'nigeria', name: 'Nigeria', flag: '🇳🇬', group: 'D' },
  // Group E
  spain: { id: 'spain', name: 'España', flag: '🇪🇸', group: 'E' },
  colombia: { id: 'colombia', name: 'Colombia', flag: '🇨🇴', group: 'E' },
  serbia: { id: 'serbia', name: 'Serbia', flag: '🇷🇸', group: 'E' },
  iran: { id: 'iran', name: 'Irán', flag: '🇮🇷', group: 'E' },
  // Group F
  brazil: { id: 'brazil', name: 'Brasil', flag: '🇧🇷', group: 'F' },
  portugal: { id: 'portugal', name: 'Portugal', flag: '🇵🇹', group: 'F' },
  switzerland: { id: 'switzerland', name: 'Suiza', flag: '🇨🇭', group: 'F' },
  canada: { id: 'canada', name: 'Canadá', flag: '🇨🇦', group: 'F' },
  // Group G
  italy: { id: 'italy', name: 'Italia', flag: '🇮🇹', group: 'G' },
  belgium: { id: 'belgium', name: 'Bélgica', flag: '🇧🇪', group: 'G' },
  ghana: { id: 'ghana', name: 'Ghana', flag: '🇬🇭', group: 'G' },
  ecuador: { id: 'ecuador', name: 'Ecuador', flag: '🇪🇨', group: 'G' },
  // Group H
  colombia_duplicate: { id: 'colombia_duplicate', name: 'Colombia B', flag: '🇨🇴', group: 'H' }, // Fixed below
};

// Update group H teams properly
teams.colombia.group = 'E'; // Just in case
teams.denmark = { id: 'denmark', name: 'Dinamarca', flag: '🇩🇰', group: 'H' };
teams.chile = { id: 'chile', name: 'Chile', flag: '🇨🇱', group: 'H' };
teams.saudi_arabia = { id: 'saudi_arabia', name: 'Arabia Saudita', flag: '🇸🇦', group: 'H' };
teams.poland = { id: 'poland', name: 'Polonia', flag: '🇵🇱', group: 'H' };

delete teams.colombia_duplicate;

// Generate realistic standings with points, goals, etc.
export const standingsData = {
  A: [
    { team: teams.germany, p: 3, w: 2, d: 1, l: 0, gf: 6, ga: 2, gd: 4, pts: 7 },
    { team: teams.mexico, p: 3, w: 2, d: 0, l: 1, gf: 4, ga: 3, gd: 1, pts: 6 },
    { team: teams.japan, p: 3, w: 1, d: 1, l: 1, gf: 3, ga: 3, gd: 0, pts: 4 },
    { team: teams.egypt, p: 3, w: 0, d: 0, l: 3, gf: 1, ga: 6, gd: -5, pts: 0 },
  ],
  B: [
    { team: teams.england, p: 3, w: 3, d: 0, l: 0, gf: 8, ga: 1, gd: 7, pts: 9 },
    { team: teams.usa, p: 3, w: 1, d: 1, l: 1, gf: 3, ga: 4, gd: -1, pts: 4 },
    { team: teams.senegal, p: 3, w: 1, d: 0, l: 2, gf: 2, ga: 5, gd: -3, pts: 3 },
    { team: teams.australia, p: 3, w: 0, d: 1, l: 2, gf: 2, ga: 5, gd: -3, pts: 1 },
  ],
  C: [
    { team: teams.argentina, p: 3, w: 2, d: 1, l: 0, gf: 5, ga: 1, gd: 4, pts: 7 },
    { team: teams.netherlands, p: 3, w: 2, d: 0, l: 1, gf: 4, ga: 2, gd: 2, pts: 6 },
    { team: teams.morocco, p: 3, w: 1, d: 1, l: 1, gf: 2, ga: 2, gd: 0, pts: 4 },
    { team: teams.south_korea, p: 3, w: 0, d: 0, l: 3, gf: 0, ga: 6, gd: -6, pts: 0 },
  ],
  D: [
    { team: teams.france, p: 3, w: 3, d: 0, l: 0, gf: 7, ga: 2, gd: 5, pts: 9 },
    { team: teams.uruguay, p: 3, w: 2, d: 0, l: 1, gf: 4, ga: 3, gd: 1, pts: 6 },
    { team: teams.croatia, p: 3, w: 0, d: 1, l: 2, gf: 2, ga: 5, gd: -3, pts: 1 },
    { team: teams.nigeria, p: 3, w: 0, d: 1, l: 2, gf: 1, ga: 4, gd: -3, pts: 1 },
  ],
  E: [
    { team: teams.colombia, p: 3, w: 2, d: 1, l: 0, gf: 5, ga: 2, gd: 3, pts: 7 },
    { team: teams.spain, p: 3, w: 1, d: 2, l: 0, gf: 4, ga: 3, gd: 1, pts: 5 },
    { team: teams.serbia, p: 3, w: 1, d: 0, l: 2, gf: 3, ga: 4, gd: -1, pts: 3 },
    { team: teams.iran, p: 3, w: 0, d: 1, l: 2, gf: 1, ga: 4, gd: -3, pts: 1 },
  ],
  F: [
    { team: teams.brazil, p: 3, w: 2, d: 1, l: 0, gf: 6, ga: 1, gd: 5, pts: 7 },
    { team: teams.portugal, p: 3, w: 2, d: 0, l: 1, gf: 5, ga: 3, gd: 2, pts: 6 },
    { team: teams.switzerland, p: 3, w: 1, d: 1, l: 1, gf: 2, ga: 2, gd: 0, pts: 4 },
    { team: teams.canada, p: 3, w: 0, d: 0, l: 3, gf: 1, ga: 8, gd: -7, pts: 0 },
  ],
  G: [
    { team: teams.italy, p: 3, w: 2, d: 1, l: 0, gf: 4, ga: 1, gd: 3, pts: 7 },
    { team: teams.belgium, p: 3, w: 2, d: 0, l: 1, gf: 5, ga: 2, gd: 3, pts: 6 },
    { team: teams.ecuador, p: 3, w: 1, d: 1, l: 1, gf: 3, ga: 3, gd: 0, pts: 4 },
    { team: teams.ghana, p: 3, w: 0, d: 0, l: 3, gf: 1, ga: 7, gd: -6, pts: 0 },
  ],
  H: [
    { team: teams.denmark, p: 3, w: 2, d: 1, l: 0, gf: 4, ga: 2, gd: 2, pts: 7 },
    { team: teams.chile, p: 3, w: 1, d: 2, l: 0, gf: 3, ga: 2, gd: 1, pts: 5 },
    { team: teams.poland, p: 3, w: 1, d: 0, l: 2, gf: 2, ga: 3, gd: -1, pts: 3 },
    { team: teams.saudi_arabia, p: 3, w: 0, d: 1, l: 2, gf: 1, ga: 3, gd: -2, pts: 1 },
  ]
};

export const matchesData = [
  // Past matches
  { id: 1, date: '2026-06-11T12:00:00Z', status: 'finished', home: teams.mexico, away: teams.germany, scoreHome: 1, scoreAway: 1, group: 'A' },
  { id: 2, date: '2026-06-11T15:00:00Z', status: 'finished', home: teams.usa, away: teams.england, scoreHome: 0, scoreAway: 2, group: 'B' },
  { id: 3, date: '2026-06-12T12:00:00Z', status: 'finished', home: teams.argentina, away: teams.netherlands, scoreHome: 2, scoreAway: 1, group: 'C' },
  { id: 4, date: '2026-06-12T15:00:00Z', status: 'finished', home: teams.colombia, away: teams.spain, scoreHome: 1, scoreAway: 1, group: 'E' },
  { id: 5, date: '2026-06-13T12:00:00Z', status: 'finished', home: teams.brazil, away: teams.portugal, scoreHome: 3, scoreAway: 1, group: 'F' },
  { id: 6, date: '2026-06-13T15:00:00Z', status: 'finished', home: teams.france, away: teams.uruguay, scoreHome: 2, scoreAway: 0, group: 'D' },
  { id: 7, date: '2026-06-14T12:00:00Z', status: 'finished', home: teams.colombia, away: teams.serbia, scoreHome: 2, scoreAway: 0, group: 'E' },
  // Upcoming matches (Round of 16 simulated)
  { id: 8, date: '2026-06-27T10:00:00Z', status: 'upcoming', home: standingsData.A[0].team, away: standingsData.B[1].team, stage: 'Round of 16' },
  { id: 9, date: '2026-06-27T14:00:00Z', status: 'upcoming', home: standingsData.C[0].team, away: standingsData.D[1].team, stage: 'Round of 16' },
  { id: 10, date: '2026-06-28T10:00:00Z', status: 'upcoming', home: standingsData.D[0].team, away: standingsData.C[1].team, stage: 'Round of 16' },
  { id: 11, date: '2026-06-28T14:00:00Z', status: 'upcoming', home: standingsData.B[0].team, away: standingsData.A[1].team, stage: 'Round of 16' },
  { id: 12, date: '2026-06-29T10:00:00Z', status: 'upcoming', home: standingsData.E[0].team, away: standingsData.F[1].team, stage: 'Round of 16' },
  { id: 13, date: '2026-06-29T14:00:00Z', status: 'upcoming', home: standingsData.G[0].team, away: standingsData.H[1].team, stage: 'Round of 16' },
  { id: 14, date: '2026-06-30T10:00:00Z', status: 'upcoming', home: standingsData.F[0].team, away: standingsData.E[1].team, stage: 'Round of 16' },
  { id: 15, date: '2026-06-30T14:00:00Z', status: 'upcoming', home: standingsData.H[0].team, away: standingsData.G[1].team, stage: 'Round of 16' },
];

export const topScorers = [
  { id: 1, name: 'L. Díaz', team: teams.colombia, goals: 4, assists: 1 },
  { id: 2, name: 'K. Mbappé', team: teams.france, goals: 4, assists: 0 },
  { id: 3, name: 'H. Kane', team: teams.england, goals: 3, assists: 2 },
  { id: 4, name: 'V. Júnior', team: teams.brazil, goals: 3, assists: 1 },
  { id: 5, name: 'L. Messi', team: teams.argentina, goals: 2, assists: 3 },
  { id: 6, name: 'J. Musiala', team: teams.germany, goals: 2, assists: 1 },
];

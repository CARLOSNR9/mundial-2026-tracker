export const teams = {
  // Group A
  mexico: { id: 'mexico', name: 'México', flag: '🇲🇽', group: 'A' },
  south_korea: { id: 'south_korea', name: 'Corea del Sur', flag: '🇰🇷', group: 'A' },
  czechia: { id: 'czechia', name: 'República Checa', flag: '🇨🇿', group: 'A' },
  south_africa: { id: 'south_africa', name: 'Sudáfrica', flag: '🇿🇦', group: 'A' },
  // Group B
  canada: { id: 'canada', name: 'Canadá', flag: '🇨🇦', group: 'B' },
  switzerland: { id: 'switzerland', name: 'Suiza', flag: '🇨🇭', group: 'B' },
  bosnia: { id: 'bosnia', name: 'Bosnia y Her.', flag: '🇧🇦', group: 'B' },
  qatar: { id: 'qatar', name: 'Qatar', flag: '🇶🇦', group: 'B' },
  // Group C
  brazil: { id: 'brazil', name: 'Brasil', flag: '🇧🇷', group: 'C' },
  morocco: { id: 'morocco', name: 'Marruecos', flag: '🇲🇦', group: 'C' },
  scotland: { id: 'scotland', name: 'Escocia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C' },
  haiti: { id: 'haiti', name: 'Haití', flag: '🇭🇹', group: 'C' },
  // Group D
  usa: { id: 'usa', name: 'Estados Unidos', flag: '🇺🇸', group: 'D' },
  australia: { id: 'australia', name: 'Australia', flag: '🇦🇺', group: 'D' },
  paraguay: { id: 'paraguay', name: 'Paraguay', flag: '🇵🇾', group: 'D' },
  turkiye: { id: 'turkiye', name: 'Turquía', flag: '🇹🇷', group: 'D' },
  // Group E
  germany: { id: 'germany', name: 'Alemania', flag: '🇩🇪', group: 'E' },
  ivory_coast: { id: 'ivory_coast', name: 'Costa de Marfil', flag: '🇨🇮', group: 'E' },
  ecuador: { id: 'ecuador', name: 'Ecuador', flag: '🇪🇨', group: 'E' },
  curacao: { id: 'curacao', name: 'Curazao', flag: '🇨🇼', group: 'E' },
  // Group F
  netherlands: { id: 'netherlands', name: 'Países Bajos', flag: '🇳🇱', group: 'F' },
  japan: { id: 'japan', name: 'Japón', flag: '🇯🇵', group: 'F' },
  sweden: { id: 'sweden', name: 'Suecia', flag: '🇸🇪', group: 'F' },
  tunisia: { id: 'tunisia', name: 'Túnez', flag: '🇹🇳', group: 'F' },
  // Group G
  egypt: { id: 'egypt', name: 'Egipto', flag: '🇪🇬', group: 'G' },
  iran: { id: 'iran', name: 'Irán', flag: '🇮🇷', group: 'G' },
  belgium: { id: 'belgium', name: 'Bélgica', flag: '🇧🇪', group: 'G' },
  new_zealand: { id: 'new_zealand', name: 'Nueva Zelanda', flag: '🇳🇿', group: 'G' },
  // Group H
  spain: { id: 'spain', name: 'España', flag: '🇪🇸', group: 'H' },
  uruguay: { id: 'uruguay', name: 'Uruguay', flag: '🇺🇾', group: 'H' },
  cape_verde: { id: 'cape_verde', name: 'Cabo Verde', flag: '🇨🇻', group: 'H' },
  saudi_arabia: { id: 'saudi_arabia', name: 'Arabia Saudita', flag: '🇸🇦', group: 'H' },
  // Group I
  france: { id: 'france', name: 'Francia', flag: '🇫🇷', group: 'I' },
  norway: { id: 'norway', name: 'Noruega', flag: '🇳🇴', group: 'I' },
  senegal: { id: 'senegal', name: 'Senegal', flag: '🇸🇳', group: 'I' },
  iraq: { id: 'iraq', name: 'Irak', flag: '🇮🇶', group: 'I' },
  // Group J
  argentina: { id: 'argentina', name: 'Argentina', flag: '🇦🇷', group: 'J' },
  austria: { id: 'austria', name: 'Austria', flag: '🇦🇹', group: 'J' },
  algeria: { id: 'algeria', name: 'Argelia', flag: '🇩🇿', group: 'J' },
  jordan: { id: 'jordan', name: 'Jordania', flag: '🇯🇴', group: 'J' },
  // Group K
  colombia: { id: 'colombia', name: 'Colombia', flag: '🇨🇴', group: 'K' },
  portugal: { id: 'portugal', name: 'Portugal', flag: '🇵🇹', group: 'K' },
  dr_congo: { id: 'dr_congo', name: 'RD Congo', flag: '🇨🇩', group: 'K' },
  uzbekistan: { id: 'uzbekistan', name: 'Uzbekistán', flag: '🇺🇿', group: 'K' },
  // Group L
  england: { id: 'england', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L' },
  ghana: { id: 'ghana', name: 'Ghana', flag: '🇬🇭', group: 'L' },
  croatia: { id: 'croatia', name: 'Croacia', flag: '🇭🇷', group: 'L' },
  panama: { id: 'panama', name: 'Panamá', flag: '🇵🇦', group: 'L' },
};

// Real Standings as of June 23, 2026 (Extrapolated to fill games)
export const standingsData = {
  A: [
    { team: teams.mexico, p: 2, w: 2, d: 0, l: 0, gf: 3, ga: 0, gd: 3, pts: 6 },
    { team: teams.south_korea, p: 2, w: 1, d: 0, l: 1, gf: 2, ga: 2, gd: 0, pts: 3 },
    { team: teams.czechia, p: 2, w: 0, d: 1, l: 1, gf: 2, ga: 3, gd: -1, pts: 1 },
    { team: teams.south_africa, p: 2, w: 0, d: 1, l: 1, gf: 1, ga: 3, gd: -2, pts: 1 },
  ],
  B: [
    { team: teams.canada, p: 2, w: 1, d: 1, l: 0, gf: 7, ga: 1, gd: 6, pts: 4 },
    { team: teams.switzerland, p: 2, w: 1, d: 1, l: 0, gf: 5, ga: 2, gd: 3, pts: 4 },
    { team: teams.bosnia, p: 2, w: 0, d: 1, l: 1, gf: 2, ga: 5, gd: -3, pts: 1 },
    { team: teams.qatar, p: 2, w: 0, d: 1, l: 1, gf: 1, ga: 7, gd: -6, pts: 1 },
  ],
  C: [
    { team: teams.brazil, p: 2, w: 1, d: 1, l: 0, gf: 4, ga: 1, gd: 3, pts: 4 },
    { team: teams.morocco, p: 2, w: 1, d: 1, l: 0, gf: 2, ga: 1, gd: 1, pts: 4 },
    { team: teams.scotland, p: 2, w: 1, d: 0, l: 1, gf: 1, ga: 1, gd: 0, pts: 3 },
    { team: teams.haiti, p: 2, w: 0, d: 0, l: 2, gf: 0, ga: 4, gd: -4, pts: 0 },
  ],
  D: [
    { team: teams.usa, p: 2, w: 2, d: 0, l: 0, gf: 6, ga: 1, gd: 5, pts: 6 },
    { team: teams.australia, p: 2, w: 1, d: 0, l: 1, gf: 2, ga: 2, gd: 0, pts: 3 },
    { team: teams.paraguay, p: 2, w: 1, d: 0, l: 1, gf: 2, ga: 4, gd: -2, pts: 3 },
    { team: teams.turkiye, p: 2, w: 0, d: 0, l: 2, gf: 0, ga: 3, gd: -3, pts: 0 },
  ],
  E: [
    { team: teams.germany, p: 2, w: 2, d: 0, l: 0, gf: 9, ga: 2, gd: 7, pts: 6 },
    { team: teams.ivory_coast, p: 2, w: 1, d: 0, l: 1, gf: 2, ga: 2, gd: 0, pts: 3 },
    { team: teams.ecuador, p: 2, w: 0, d: 1, l: 1, gf: 0, ga: 1, gd: -1, pts: 1 },
    { team: teams.curacao, p: 2, w: 0, d: 1, l: 1, gf: 1, ga: 7, gd: -6, pts: 1 },
  ],
  F: [
    { team: teams.netherlands, p: 2, w: 1, d: 1, l: 0, gf: 7, ga: 3, gd: 4, pts: 4 },
    { team: teams.japan, p: 2, w: 1, d: 1, l: 0, gf: 6, ga: 2, gd: 4, pts: 4 },
    { team: teams.sweden, p: 2, w: 1, d: 0, l: 1, gf: 6, ga: 6, gd: 0, pts: 3 },
    { team: teams.tunisia, p: 2, w: 0, d: 0, l: 2, gf: 1, ga: 9, gd: -8, pts: 0 },
  ],
  G: [
    { team: teams.egypt, p: 2, w: 1, d: 1, l: 0, gf: 4, ga: 2, gd: 2, pts: 4 },
    { team: teams.iran, p: 2, w: 0, d: 2, l: 0, gf: 2, ga: 2, gd: 0, pts: 2 },
    { team: teams.belgium, p: 2, w: 0, d: 2, l: 0, gf: 1, ga: 1, gd: 0, pts: 2 },
    { team: teams.new_zealand, p: 2, w: 0, d: 1, l: 1, gf: 3, ga: 5, gd: -2, pts: 1 },
  ],
  H: [
    { team: teams.spain, p: 2, w: 1, d: 1, l: 0, gf: 4, ga: 0, gd: 4, pts: 4 },
    { team: teams.uruguay, p: 2, w: 0, d: 2, l: 0, gf: 3, ga: 3, gd: 0, pts: 2 },
    { team: teams.cape_verde, p: 2, w: 0, d: 2, l: 0, gf: 2, ga: 2, gd: 0, pts: 2 },
    { team: teams.saudi_arabia, p: 2, w: 0, d: 1, l: 1, gf: 1, ga: 5, gd: -4, pts: 1 },
  ],
  I: [
    { team: teams.france, p: 2, w: 2, d: 0, l: 0, gf: 6, ga: 1, gd: 5, pts: 6 },
    { team: teams.norway, p: 2, w: 2, d: 0, l: 0, gf: 7, ga: 3, gd: 4, pts: 6 },
    { team: teams.senegal, p: 2, w: 0, d: 0, l: 2, gf: 3, ga: 6, gd: -3, pts: 0 },
    { team: teams.iraq, p: 2, w: 0, d: 0, l: 2, gf: 1, ga: 7, gd: -6, pts: 0 },
  ],
  J: [
    { team: teams.argentina, p: 2, w: 2, d: 0, l: 0, gf: 5, ga: 0, gd: 5, pts: 6 },
    { team: teams.austria, p: 2, w: 1, d: 0, l: 1, gf: 3, ga: 3, gd: 0, pts: 3 },
    { team: teams.algeria, p: 2, w: 1, d: 0, l: 1, gf: 2, ga: 4, gd: -2, pts: 3 },
    { team: teams.jordan, p: 2, w: 0, d: 0, l: 2, gf: 2, ga: 5, gd: -3, pts: 0 },
  ],
  K: [
    { team: teams.portugal, p: 2, w: 1, d: 1, l: 0, gf: 6, ga: 1, gd: 5, pts: 4 },
    { team: teams.colombia, p: 1, w: 1, d: 0, l: 0, gf: 3, ga: 1, gd: 2, pts: 3 },
    { team: teams.dr_congo, p: 1, w: 0, d: 1, l: 0, gf: 1, ga: 1, gd: 0, pts: 1 },
    { team: teams.uzbekistan, p: 2, w: 0, d: 0, l: 2, gf: 1, ga: 8, gd: -7, pts: 0 },
  ],
  L: [
    { team: teams.england, p: 2, w: 1, d: 1, l: 0, gf: 4, ga: 2, gd: 2, pts: 4 },
    { team: teams.ghana, p: 2, w: 1, d: 1, l: 0, gf: 1, ga: 0, gd: 1, pts: 4 },
    { team: teams.panama, p: 2, w: 0, d: 1, l: 1, gf: 0, ga: 1, gd: -1, pts: 1 },
    { team: teams.croatia, p: 2, w: 0, d: 1, l: 1, gf: 2, ga: 4, gd: -2, pts: 1 },
  ],
};

export const matchesData = [
  // Past matches
  { id: 1, date: '2026-06-11T12:00:00Z', status: 'finished', home: teams.mexico, away: teams.czechia, scoreHome: 2, scoreAway: 0, group: 'A' },
  { id: 2, date: '2026-06-12T15:00:00Z', status: 'finished', home: teams.usa, away: teams.turkiye, scoreHome: 3, scoreAway: 0, group: 'D' },
  { id: 3, date: '2026-06-13T12:00:00Z', status: 'finished', home: teams.argentina, away: teams.panama, scoreHome: 3, scoreAway: 1, group: 'I' },
  { id: 4, date: '2026-06-14T15:00:00Z', status: 'finished', home: teams.france, away: teams.chile, scoreHome: 2, scoreAway: 0, group: 'J' },
  { id: 5, date: '2026-06-15T12:00:00Z', status: 'finished', home: teams.colombia, away: teams.dr_congo, scoreHome: 2, scoreAway: 0, group: 'K' },
  { id: 6, date: '2026-06-16T15:00:00Z', status: 'finished', home: teams.england, away: teams.norway, scoreHome: 2, scoreAway: 1, group: 'L' },
  { id: 7, date: '2026-06-20T12:00:00Z', status: 'finished', home: teams.argentina, away: teams.algeria, scoreHome: 2, scoreAway: 0, group: 'I' },
  { id: 8, date: '2026-06-21T15:00:00Z', status: 'finished', home: teams.germany, away: teams.ecuador, scoreHome: 3, scoreAway: 1, group: 'E' },
  // Upcoming matches (Round of 32 simulated)
  { id: 9, date: '2026-06-28T10:00:00Z', status: 'upcoming', home: standingsData.A[0].team, away: standingsData.B[2].team, stage: '16avos' },
  { id: 10, date: '2026-06-28T14:00:00Z', status: 'upcoming', home: standingsData.B[0].team, away: standingsData.C[1].team, stage: '16avos' },
  { id: 11, date: '2026-06-29T10:00:00Z', status: 'upcoming', home: standingsData.C[0].team, away: standingsData.D[1].team, stage: '16avos' },
  { id: 12, date: '2026-06-29T14:00:00Z', status: 'upcoming', home: standingsData.D[0].team, away: standingsData.E[2].team, stage: '16avos' },
  { id: 13, date: '2026-06-30T10:00:00Z', status: 'upcoming', home: standingsData.E[0].team, away: standingsData.F[1].team, stage: '16avos' },
  { id: 14, date: '2026-06-30T14:00:00Z', status: 'upcoming', home: standingsData.F[0].team, away: standingsData.G[1].team, stage: '16avos' },
  { id: 15, date: '2026-07-01T10:00:00Z', status: 'upcoming', home: standingsData.G[0].team, away: standingsData.H[2].team, stage: '16avos' },
  { id: 16, date: '2026-07-01T14:00:00Z', status: 'upcoming', home: standingsData.H[0].team, away: standingsData.I[1].team, stage: '16avos' },
];

export const topScorers = [
  { id: 1, name: 'L. Messi', team: teams.argentina, goals: 5, assists: 2 },
  { id: 2, name: 'K. Mbappé', team: teams.france, goals: 4, assists: 1 },
  { id: 3, name: 'E. Haaland', team: teams.norway, goals: 4, assists: 0 },
  { id: 4, name: 'J. David', team: teams.canada, goals: 3, assists: 1 },
  { id: 5, name: 'D. Undav', team: teams.germany, goals: 3, assists: 0 },
  { id: 6, name: 'L. Díaz', team: teams.colombia, goals: 2, assists: 2 },
  { id: 7, name: 'H. Kane', team: teams.england, goals: 2, assists: 1 },
  { id: 8, name: 'V. Júnior', team: teams.brazil, goals: 2, assists: 1 },
];

import React, { createContext, useState, useEffect } from 'react';
import { matchesData as initialMatches, teams } from '../data/mockData';
import { supabase } from '../supabaseClient';

export const DataContext = createContext();

const calculateStandings = (matchesList) => {
  // Initialize standings object with all 12 groups
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  const standings = {};
  
  // Create an initial entry for every team based on the 'teams' object
  const teamStats = {};
  Object.values(teams).forEach(team => {
    teamStats[team.id] = {
      team: team,
      p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0
    };
  });

  // Process all finished matches to calculate stats
  matchesList.forEach(match => {
    if (match.status === 'finished' && match.group) {
      const hId = match.home.id;
      const aId = match.away.id;
      const sh = match.scoreHome;
      const sa = match.scoreAway;

      if (!teamStats[hId]) teamStats[hId] = { team: match.home, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
      if (!teamStats[aId]) teamStats[aId] = { team: match.away, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };

      teamStats[hId].p += 1;
      teamStats[aId].p += 1;
      teamStats[hId].gf += sh;
      teamStats[hId].ga += sa;
      teamStats[aId].gf += sa;
      teamStats[aId].ga += sh;

      if (sh > sa) {
        teamStats[hId].w += 1;
        teamStats[hId].pts += 3;
        teamStats[aId].l += 1;
      } else if (sh < sa) {
        teamStats[aId].w += 1;
        teamStats[aId].pts += 3;
        teamStats[hId].l += 1;
      } else {
        teamStats[hId].d += 1;
        teamStats[hId].pts += 1;
        teamStats[aId].d += 1;
        teamStats[aId].pts += 1;
      }
      
      teamStats[hId].gd = teamStats[hId].gf - teamStats[hId].ga;
      teamStats[aId].gd = teamStats[aId].gf - teamStats[aId].ga;
    }
  });

  // Group teams and sort
  groups.forEach(group => {
    const groupTeams = Object.values(teamStats).filter(t => t.team.group === group);
    // Sort logic: pts, gd, gf
    groupTeams.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.gf - a.gf;
    });
    standings[group] = groupTeams;
  });

  return standings;
};

const allocateThirdPlaces = (qualifiedThirds) => {
  const thirdPlaceSlots = {
    '1A': ['C', 'E', 'F', 'H', 'I'],
    '1B': ['E', 'F', 'G', 'I', 'J'],
    '1D': ['B', 'E', 'F', 'I', 'J'],
    '1E': ['D', 'C', 'F', 'A', 'B'], // Prioritiza a D (Paraguay) antes que B (Bosnia)
    '1G': ['A', 'E', 'H', 'I', 'J'],
    '1I': ['F', 'C', 'G', 'H', 'D'], // Prioritiza a F (Suecia)
    '1K': ['E', 'D', 'I', 'J', 'L'], // Ajustado para balancear
    '1L': ['H', 'E', 'I', 'J', 'K']  // Ajustado para balancear
  };
  
  const groups = qualifiedThirds.map(t => t.team.group);
  const slots = Object.keys(thirdPlaceSlots);
  let finalAssignment = null;

  const backtrack = (slotIndex, currentAssignment) => {
    if (finalAssignment) return;
    if (slotIndex === slots.length) {
      finalAssignment = { ...currentAssignment.mapping };
      return;
    }

    const currentSlot = slots[slotIndex];
    const allowedGroups = thirdPlaceSlots[currentSlot];

    for (let i = 0; i < allowedGroups.length; i++) {
      const g = allowedGroups[i];
      if (groups.includes(g) && !currentAssignment.used.has(g)) {
        currentAssignment.used.add(g);
        currentAssignment.mapping[currentSlot] = qualifiedThirds.find(t => t.team.group === g);
        backtrack(slotIndex + 1, currentAssignment);
        currentAssignment.used.delete(g);
        delete currentAssignment.mapping[currentSlot];
      }
    }
  };

  backtrack(0, { mapping: {}, used: new Set() });

  if (!finalAssignment) {
    finalAssignment = {};
    qualifiedThirds.forEach((t, idx) => {
      if (slots[idx]) finalAssignment[slots[idx]] = t;
    });
  }

  return finalAssignment;
};

const calculateBracket16 = (standings) => {
  const allThirdPlaces = Object.values(standings).map(group => group[2]).filter(Boolean);
  
  const bestThirds = [...allThirdPlaces].sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return (a.team.name || '').localeCompare(b.team.name || '');
  }).slice(0, 8);

  const thirdAssignments = allocateThirdPlaces(bestThirds);

  const getTeam = (group, pos) => {
    if (!standings[group] || !standings[group][pos - 1] || !standings[group][pos - 1].team) return { name: `TBD ${pos}${group}`, flag: '❓' };
    return standings[group][pos - 1].team;
  };

  const getThirdTeam = (slot) => {
    if (thirdAssignments[slot] && thirdAssignments[slot].team) return thirdAssignments[slot].team;
    return { name: `TBD 3rd`, flag: '❓' };
  };

  const matchups = [
    // Lado Izquierdo
    { id: 76, home: getTeam('E', 1), away: getThirdTeam('1E'), label: '1E vs 3 A/B/C/D/F', date: 'Lun 29 Jun 15:30 hrs.', stadium: 'Gillette Stadium, Boston' },
    { id: 81, home: getTeam('I', 1), away: getThirdTeam('1I'), label: '1I vs 3 C/D/F/G/H', date: 'Mar 30 Jun 16:00 hrs.', stadium: 'MetLife Stadium, NY/NJ' },
    { id: 73, home: getTeam('A', 2), away: getTeam('B', 2), label: '2A vs 2B', date: 'Dom 28 Jun 14:00 hrs.', stadium: 'SoFi Stadium, Los Ángeles' },
    { id: 80, home: getTeam('F', 1), away: getTeam('C', 2), label: '1F vs 2C', date: 'Lun 29 Jun 20:00 hrs.', stadium: 'Estadio BBVA, Monterrey' },
    { id: 84, home: getTeam('K', 2), away: getTeam('L', 2), label: '2K vs 2L', date: 'Jue 2 Jul 18:00 hrs.', stadium: 'BMO Field, Toronto' },
    { id: 86, home: getTeam('H', 1), away: getTeam('J', 2), label: '1H vs 2J', date: 'Jue 2 Jul 14:00 hrs.', stadium: 'SoFi Stadium, Los Ángeles' },
    { id: 85, home: getTeam('D', 1), away: getThirdTeam('1D'), label: '1D vs 3 B/E/F/I/J', date: 'Mié 1 Jul 19:00 hrs.', stadium: "Levi's Stadium, SF" },
    { id: 77, home: getTeam('G', 1), away: getThirdTeam('1G'), label: '1G vs 3 A/E/H/I/J', date: 'Mié 1 Jul 15:00 hrs.', stadium: 'Lumen Field, Seattle' },
    
    // Lado Derecho
    { id: 75, home: getTeam('C', 1), away: getTeam('F', 2), label: '1C vs 2F', date: 'Lun 29 Jun 12:00 hrs.', stadium: 'NRG Stadium, Houston' },
    { id: 82, home: getTeam('E', 2), away: getTeam('I', 2), label: '2E vs 2I', date: 'Mar 30 Jun 12:00 hrs.', stadium: 'AT&T Stadium, Dallas' },
    { id: 74, home: getTeam('A', 1), away: getThirdTeam('1A'), label: '1A vs 3 C/E/F/H/I', date: 'Mar 30 Jun 20:00 hrs.', stadium: 'Estadio Azteca, CDMX' },
    { id: 87, home: getTeam('L', 1), away: getThirdTeam('1L'), label: '1L vs 3 E/H/I/J/K', date: 'Mié 1 Jul 11:00 hrs.', stadium: 'Mercedes-Benz Stadium, Atlanta' },
    { id: 88, home: getTeam('J', 1), away: getTeam('H', 2), label: '1J vs 2H', date: 'Vie 3 Jul 17:00 hrs.', stadium: 'Hard Rock Stadium, Miami' },
    { id: 78, home: getTeam('D', 2), away: getTeam('G', 2), label: '2D vs 2G', date: 'Vie 3 Jul 13:00 hrs.', stadium: 'AT&T Stadium, Dallas' },
    { id: 79, home: getTeam('B', 1), away: getThirdTeam('1B'), label: '1B vs 3 E/F/G/I/J', date: 'Jue 2 Jul 22:00 hrs.', stadium: 'BC Place, Vancouver' },
    { id: 83, home: getTeam('K', 1), away: getThirdTeam('1K'), label: '1K vs 3 D/E/I/J/L', date: 'Vie 3 Jul 20:30 hrs.', stadium: 'Arrowhead, Kansas City' },
  ];

  return matchups;
};

export const DataProvider = ({ children }) => {
  const [matches, setMatches] = useState(initialMatches);
  const [standings, setStandings] = useState({});
  const [bracket16, setBracket16] = useState([]);
  const [bracket8, setBracket8] = useState([]);
  const [bracket4, setBracket4] = useState([]);
  const [bracket2, setBracket2] = useState([]);
  const [bracket1, setBracket1] = useState([]);
  const [dbData, setDbData] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const { data, error } = await supabase
          .from('matches')
          .select('*');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setDbData(data);
          setMatches(prevMatches => {
            return prevMatches.map(m => {
              const dbMatch = data.find(dm => dm.id === m.id);
              if (dbMatch && dbMatch.score_home !== null && dbMatch.score_away !== null) {
                return {
                  ...m,
                  scoreHome: dbMatch.score_home,
                  scoreAway: dbMatch.score_away,
                  status: dbMatch.status || 'finished'
                };
              }
              return m;
            });
          });
        }
      } catch (error) {
        console.error("Error fetching matches from Supabase:", error.message);
      }
    };
    
    fetchMatches();
  }, []);

  useEffect(() => {
    // Recalculate standings when matches change
    const newStandings = calculateStandings(matches);
    setStandings(newStandings);

    if (Object.keys(newStandings).length === 12) {
      let b16 = calculateBracket16(newStandings);
      // Merge with database data if available
      if (dbData && dbData.length > 0) {
        b16 = b16.map(m => {
          const dbMatch = dbData.find(dm => dm.id === m.id);
          if (dbMatch && dbMatch.score_home !== null && dbMatch.score_away !== null) {
            return {
              ...m,
              scoreHome: dbMatch.score_home,
              scoreAway: dbMatch.score_away,
              status: dbMatch.status || 'finished'
            };
          }
          return m;
        });
      }
      setBracket16(b16);
    }
  }, [matches, dbData]);

  useEffect(() => {
    if (bracket16.length === 0) return;

    const getWinner = (match) => {
      if (!match || match.status !== 'finished' || match.scoreHome === undefined || match.scoreHome === null) {
        return { name: 'Por definir', flag: '❓' };
      }
      if (match.scoreHome > match.scoreAway) return match.home;
      if (match.scoreAway > match.scoreHome) return match.away;
      return match.home; // Fallback for ties for now
    };

    const findMatch = (bracket, id) => bracket.find(m => m.id === id);

    // Helpers to merge dbData
    const mergeDb = (matchesArray) => {
      if (!dbData || dbData.length === 0) return matchesArray;
      return matchesArray.map(m => {
        const dbMatch = dbData.find(dm => dm.id === m.id);
        if (dbMatch && dbMatch.score_home !== null && dbMatch.score_away !== null) {
          return {
            ...m,
            scoreHome: dbMatch.score_home,
            scoreAway: dbMatch.score_away,
            status: dbMatch.status || 'finished'
          };
        }
        return m;
      });
    };

    // Calculate Octavos (bracket8)
    const b8 = mergeDb([
      // Lado Izquierdo
      { id: 89, home: getWinner(findMatch(bracket16, 76)), away: getWinner(findMatch(bracket16, 81)), label: 'Octavos 1', date: 'Sáb 4 Jul 11:00 hrs.', stadium: 'Lincoln Financial Field, Filadelfia' },
      { id: 90, home: getWinner(findMatch(bracket16, 73)), away: getWinner(findMatch(bracket16, 80)), label: 'Octavos 2', date: 'Sáb 4 Jul 19:30 hrs.', stadium: 'NRG Stadium, Houston' },
      { id: 91, home: getWinner(findMatch(bracket16, 84)), away: getWinner(findMatch(bracket16, 86)), label: 'Octavos 3', date: 'Dom 5 Jul 15:00 hrs.', stadium: 'MetLife Stadium, NY/NJ' },
      { id: 92, home: getWinner(findMatch(bracket16, 85)), away: getWinner(findMatch(bracket16, 77)), label: 'Octavos 4', date: 'Dom 5 Jul 20:00 hrs.', stadium: 'Estadio Azteca, CDMX' },
      // Lado Derecho
      { id: 93, home: getWinner(findMatch(bracket16, 75)), away: getWinner(findMatch(bracket16, 82)), label: 'Octavos 5', date: 'Lun 6 Jul 16:00 hrs.', stadium: 'AT&T Stadium, Dallas' },
      { id: 94, home: getWinner(findMatch(bracket16, 74)), away: getWinner(findMatch(bracket16, 87)), label: 'Octavos 6', date: 'Lun 6 Jul 20:30 hrs.', stadium: 'Lumen Field, Seattle' },
      { id: 95, home: getWinner(findMatch(bracket16, 88)), away: getWinner(findMatch(bracket16, 78)), label: 'Octavos 7', date: 'Mar 7 Jul 18:00 hrs.', stadium: 'Mercedes-Benz Stadium, Atlanta' },
      { id: 96, home: getWinner(findMatch(bracket16, 79)), away: getWinner(findMatch(bracket16, 83)), label: 'Octavos 8', date: 'Mar 7 Jul 21:00 hrs.', stadium: 'Gillette Stadium, Boston' }
    ]);
    setBracket8(b8);

    // Calculate Cuartos (bracket4)
    const b4 = mergeDb([
      // Lado Izquierdo
      { id: 97, home: getWinner(findMatch(b8, 89)), away: getWinner(findMatch(b8, 90)), label: 'Cuartos 1', date: 'Jue 9 Jul 19:30 hrs.', stadium: 'Gillette Stadium, Boston' },
      { id: 98, home: getWinner(findMatch(b8, 91)), away: getWinner(findMatch(b8, 92)), label: 'Cuartos 2', date: 'Vie 10 Jul 20:00 hrs.', stadium: 'SoFi Stadium, Los Ángeles' },
      // Lado Derecho
      { id: 99, home: getWinner(findMatch(b8, 93)), away: getWinner(findMatch(b8, 94)), label: 'Cuartos 3', date: 'Sáb 11 Jul 15:00 hrs.', stadium: 'Hard Rock Stadium, Miami' },
      { id: 100, home: getWinner(findMatch(b8, 95)), away: getWinner(findMatch(b8, 96)), label: 'Cuartos 4', date: 'Sáb 11 Jul 20:00 hrs.', stadium: 'Arrowhead, Kansas City' }
    ]);
    setBracket4(b4);

    // Calculate Semis (bracket2)
    const b2 = mergeDb([
      // Lado Izquierdo
      { id: 101, home: getWinner(findMatch(b4, 97)), away: getWinner(findMatch(b4, 98)), label: 'Semifinal 1', date: 'Mar 14 Jul 20:00 hrs.', stadium: 'AT&T Stadium, Dallas' },
      // Lado Derecho
      { id: 102, home: getWinner(findMatch(b4, 99)), away: getWinner(findMatch(b4, 100)), label: 'Semifinal 2', date: 'Mié 15 Jul 20:00 hrs.', stadium: 'Mercedes-Benz Stadium, Atlanta' }
    ]);
    setBracket2(b2);

    // Calculate Final (bracket1)
    const b1 = mergeDb([
      { id: 104, home: getWinner(findMatch(b2, 101)), away: getWinner(findMatch(b2, 102)), label: 'Gran Final', date: 'Dom 19 Jul 12:00 hrs.', stadium: 'MetLife Stadium, NY/NJ' }
    ]);
    setBracket1(b1);

  }, [bracket16, dbData]);

  const updateMatch = async (matchId, scoreHome, scoreAway) => {
    const home = parseInt(scoreHome) || 0;
    const away = parseInt(scoreAway) || 0;

    // Actualización local
    if (matchId <= 72) {
      setMatches(prev => prev.map(m => 
        m.id === matchId 
          ? { ...m, scoreHome: home, scoreAway: away, status: 'finished' }
          : m
      ));
    } else if (matchId <= 88) {
      setBracket16(prev => prev.map(m => 
        m.id === matchId 
          ? { ...m, scoreHome: home, scoreAway: away, status: 'finished' }
          : m
      ));
    }
    
    if (matchId > 72) {
      // Update dbData to keep it in sync for re-renders and advanced brackets
      setDbData(prev => {
        const exists = prev.find(dm => dm.id === matchId);
        if (exists) {
          return prev.map(dm => dm.id === matchId ? { ...dm, score_home: home, score_away: away, status: 'finished' } : dm);
        }
        return [...prev, { id: matchId, score_home: home, score_away: away, status: 'finished' }];
      });
    }

    // Sincronizar con Supabase
    try {
      const { error } = await supabase
        .from('matches')
        .upsert({ 
          id: matchId, 
          score_home: home, 
          score_away: away, 
          status: 'finished' 
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error updating match in Supabase:", error.message);
    }
  };

  return (
    <DataContext.Provider value={{ matches, standings, bracket16, bracket8, bracket4, bracket2, bracket1, updateMatch }}>
      {Object.keys(standings).length > 0 ? children : null}
    </DataContext.Provider>
  );
};

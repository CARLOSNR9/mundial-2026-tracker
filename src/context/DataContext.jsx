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
    '1E': ['A', 'B', 'C', 'D', 'F'],
    '1G': ['A', 'E', 'H', 'I', 'J'],
    '1I': ['C', 'D', 'F', 'G', 'H'],
    '1K': ['D', 'E', 'I', 'J', 'L'],
    '1L': ['E', 'H', 'I', 'J', 'K']
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

    for (let i = 0; i < groups.length; i++) {
      const g = groups[i];
      if (!currentAssignment.used.has(g) && allowedGroups.includes(g)) {
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
    { id: 73, home: getTeam('A', 2), away: getTeam('B', 2), label: '2A vs 2B', date: 'Dom 28 Jun 2:00 p.m.', stadium: 'SoFi Stadium, Los Ángeles' },
    { id: 75, home: getTeam('C', 1), away: getTeam('F', 2), label: '1C vs 2F', date: 'Lun 29 Jun 8:00 p.m.', stadium: 'NRG Stadium, Houston' },
    { id: 74, home: getTeam('A', 1), away: getThirdTeam('1A'), label: '1A vs 3 C/E/F/H/I', date: 'Mar 30 Jun 8:00 p.m.', stadium: 'Estadio Azteca, CDMX' },
    { id: 77, home: getTeam('G', 1), away: getThirdTeam('1G'), label: '1G vs 3 A/E/H/I/J', date: 'Mie 1 Jul 8:00 p.m.', stadium: 'Lumen Field, Seattle' },
    { id: 83, home: getTeam('K', 1), away: getThirdTeam('1K'), label: '1K vs 3 D/E/I/J/L', date: 'Vie 3 Jul 4:00 p.m.', stadium: 'Arrowhead, Kansas City' },
    { id: 84, home: getTeam('K', 2), away: getTeam('L', 2), label: '2K vs 2L', date: 'Jue 2 Jul 12:00 p.m.', stadium: 'BMO Field, Toronto' },
    { id: 81, home: getTeam('I', 1), away: getThirdTeam('1I'), label: '1I vs 3 C/D/F/G/H', date: 'Mar 30 Jun 12:00 p.m.', stadium: 'MetLife Stadium, NY/NJ' },
    { id: 82, home: getTeam('E', 2), away: getTeam('I', 2), label: '2E vs 2I', date: 'Mar 30 Jun 4:00 p.m.', stadium: 'AT&T Stadium, Dallas' },
    { id: 76, home: getTeam('E', 1), away: getThirdTeam('1E'), label: '1E vs 3 A/B/C/D/F', date: 'Lun 29 Jun 12:30 p.m.', stadium: 'Gillette Stadium, Boston' },
    { id: 78, home: getTeam('D', 2), away: getTeam('G', 2), label: '2D vs 2G', date: 'Vie 3 Jul 8:00 p.m.', stadium: 'AT&T Stadium, Dallas' },
    { id: 79, home: getTeam('B', 1), away: getThirdTeam('1B'), label: '1B vs 3 E/F/G/I/J', date: 'Jue 2 Jul 8:00 p.m.', stadium: 'BC Place, Vancouver' },
    { id: 80, home: getTeam('F', 1), away: getTeam('C', 2), label: '1F vs 2C', date: 'Lun 29 Jun 4:00 p.m.', stadium: 'Estadio BBVA, Monterrey' },
    { id: 86, home: getTeam('H', 1), away: getTeam('J', 2), label: '1H vs 2J', date: 'Jue 2 Jul 4:00 p.m.', stadium: 'SoFi Stadium, Los Ángeles' },
    { id: 88, home: getTeam('J', 1), away: getTeam('H', 2), label: '1J vs 2H', date: 'Vie 3 Jul 12:00 p.m.', stadium: 'Hard Rock Stadium, Miami' },
    { id: 85, home: getTeam('D', 1), away: getThirdTeam('1D'), label: '1D vs 3 B/E/F/I/J', date: 'Mie 1 Jul 4:00 p.m.', stadium: "Levi's Stadium, SF" },
    { id: 87, home: getTeam('L', 1), away: getThirdTeam('1L'), label: '1L vs 3 E/H/I/J/K', date: 'Mie 1 Jul 12:00 p.m.', stadium: 'Mercedes-Benz Stadium, Atlanta' },
  ];

  return matchups;
};

export const DataProvider = ({ children }) => {
  const [matches, setMatches] = useState(initialMatches);
  const [standings, setStandings] = useState({});
  const [bracket16, setBracket16] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const { data, error } = await supabase
          .from('matches')
          .select('*');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
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
      setBracket16(calculateBracket16(newStandings));
    }
  }, [matches]);

  const updateMatch = async (matchId, scoreHome, scoreAway) => {
    const home = parseInt(scoreHome) || 0;
    const away = parseInt(scoreAway) || 0;

    // Actualización local
    setMatches(prev => prev.map(m => 
      m.id === matchId 
        ? { ...m, scoreHome: home, scoreAway: away, status: 'finished' }
        : m
    ));

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
    <DataContext.Provider value={{ matches, standings, bracket16, updateMatch }}>
      {Object.keys(standings).length > 0 ? children : null}
    </DataContext.Provider>
  );
};

import React, { createContext, useState, useEffect } from 'react';
import { matchesData as initialMatches, teams } from '../data/mockData';

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

export const DataProvider = ({ children }) => {
  const [matches, setMatches] = useState(initialMatches);
  const [standings, setStandings] = useState({});

  useEffect(() => {
    // Recalculate standings when matches change
    const newStandings = calculateStandings(matches);
    setStandings(newStandings);
  }, [matches]);

  const updateMatch = (matchId, scoreHome, scoreAway) => {
    setMatches(prev => prev.map(m => 
      m.id === matchId 
        ? { ...m, scoreHome: parseInt(scoreHome) || 0, scoreAway: parseInt(scoreAway) || 0, status: 'finished' }
        : m
    ));
  };

  return (
    <DataContext.Provider value={{ matches, standings, updateMatch }}>
      {Object.keys(standings).length > 0 ? children : null}
    </DataContext.Provider>
  );
};

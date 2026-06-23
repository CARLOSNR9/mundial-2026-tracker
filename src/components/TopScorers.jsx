import React from 'react';
import { topScorers } from '../data/mockData';

const TopScorers = () => {
  // Sort by goals (descending), then assists (descending)
  const sortedScorers = [...topScorers].sort((a, b) => {
    if (b.goals !== a.goals) return b.goals - a.goals;
    return b.assists - a.assists;
  });

  return (
    <div className="animate-fade-in glass" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>Goleadores del Mundial</h2>
      </div>
      
      <div>
        {sortedScorers.map((scorer, index) => (
          <div key={scorer.id} className="scorer-item">
            <div className="scorer-rank">{index + 1}</div>
            
            <div className="scorer-info">
              <span className="flag" style={{ fontSize: '1.8rem' }}>{scorer.team.flag}</span>
              <div>
                <div className="scorer-name">{scorer.name}</div>
                <div className="scorer-team">{scorer.team.name}</div>
              </div>
            </div>
            
            <div className="scorer-stats">
              <div className="scorer-goals">{scorer.goals} Goles</div>
              <div className="scorer-assists">{scorer.assists} Asist.</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopScorers;

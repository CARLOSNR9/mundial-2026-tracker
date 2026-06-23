import React, { useState, useContext } from 'react';
import { DataContext } from '../context/DataContext';

const Standings = () => {
  const { standings } = useContext(DataContext);
  const groups = Object.keys(standings);
  const [activeGroup, setActiveGroup] = useState('A');

  // Calculate best 3rd place teams
  const allThirdPlaces = Object.values(standings).map(group => group[2]);
  
  // Sort by pts (desc), then gd (desc), then gf (desc)
  const sortedThirdPlaces = [...allThirdPlaces].sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    return b.gf - a.gf;
  });

  // Top 8 qualify
  const qualifiedThirdPlaces = sortedThirdPlaces.slice(0, 8);
  const qualifiedThirdPlaceIds = qualifiedThirdPlaces.map(row => row.team.id);

  return (
    <div className="animate-fade-in">
      <div className="tab-nav" style={{ marginBottom: '20px', paddingBottom: '10px' }}>
        {groups.map(group => (
          <button
            key={group}
            className={`nav-btn ${activeGroup === group ? 'active' : ''}`}
            onClick={() => setActiveGroup(group)}
            style={{ minWidth: '40px', padding: '8px 15px' }}
          >
            {group}
          </button>
        ))}
      </div>

      <div className="glass table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Equipo</th>
              <th>PJ</th>
              <th>G</th>
              <th>E</th>
              <th>P</th>
              <th className="hide-on-mobile">GF</th>
              <th className="hide-on-mobile">GC</th>
              <th>DG</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings[activeGroup] && standings[activeGroup].map((row, index) => {
              const isTopTwo = index < 2;
              const isQualifiedThird = index === 2 && qualifiedThirdPlaceIds.includes(row.team.id);
              
              let borderColor = 'transparent';
              if (isTopTwo) borderColor = 'var(--primary)';
              else if (isQualifiedThird) borderColor = 'var(--warning)';

              return (
                <tr key={row.team.id} style={{ borderLeft: `3px solid ${borderColor}` }}>
                  <td className="team-cell">
                    <span className="scorer-rank" style={{ fontSize: '1rem', width: '20px' }}>{index + 1}</span>
                    <span className="flag">{row.team.flag}</span>
                    <span>{row.team.name}</span>
                  </td>
                  <td>{row.p}</td>
                  <td>{row.w}</td>
                  <td>{row.d}</td>
                  <td>{row.l}</td>
                  <td className="hide-on-mobile">{row.gf}</td>
                  <td className="hide-on-mobile">{row.ga}</td>
                  <td>{row.gd > 0 ? `+${row.gd}` : row.gd}</td>
                  <td className="pts-col">{row.pts}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: 'var(--primary)', marginRight: '5px', borderRadius: '50%' }}></span>
          1º y 2º (Clasificados)
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: 'var(--warning)', marginRight: '5px', borderRadius: '50%' }}></span>
          Mejores Terceros
        </div>
      </div>
    </div>
  );
};

export default Standings;

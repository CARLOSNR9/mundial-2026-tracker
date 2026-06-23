import React, { useState } from 'react';
import { standingsData } from '../data/mockData';

const Standings = () => {
  const groups = Object.keys(standingsData);
  const [activeGroup, setActiveGroup] = useState('A');

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
            {standingsData[activeGroup].map((row, index) => (
              <tr key={row.team.id} style={{ borderLeft: index < 2 ? '3px solid var(--primary)' : '3px solid transparent' }}>
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
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: 'var(--primary)', marginRight: '5px' }}></span>
        Clasificados a 16avos de Final
      </div>
    </div>
  );
};

export default Standings;

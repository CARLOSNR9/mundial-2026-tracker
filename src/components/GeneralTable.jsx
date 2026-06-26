import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';

const GeneralTable = () => {
  const { standings } = useContext(DataContext);

  // Flatten all teams from all groups into a single array
  const allTeams = [];
  Object.values(standings).forEach(group => {
    group.forEach(teamStats => {
      allTeams.push(teamStats);
    });
  });

  // Sort by pts (desc), then gd (desc), then gf (desc)
  const sortedTeams = [...allTeams].sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    return b.gf - a.gf;
  });

  return (
    <div className="animate-fade-in">
      <h3 style={{ marginBottom: '15px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
        Tabla General del Mundial (1 al 48)
      </h3>
      <div className="glass table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
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
            {sortedTeams.map((row, index) => {
              // Highlight top 1 and bottom 1 maybe, or just plain display
              let borderColor = 'transparent';
              if (index === 0) borderColor = 'var(--primary)'; // Best team
              if (index === sortedTeams.length - 1) borderColor = 'var(--danger)'; // Worst team

              return (
                <tr key={row.team.id} style={{ borderLeft: `3px solid ${borderColor}` }}>
                  <td className="scorer-rank" style={{ width: '30px' }}>{index + 1}</td>
                  <td className="team-cell">
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
          Mejor equipo
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: 'var(--danger)', marginRight: '5px', borderRadius: '50%' }}></span>
          Peor equipo
        </div>
      </div>
    </div>
  );
};

export default GeneralTable;

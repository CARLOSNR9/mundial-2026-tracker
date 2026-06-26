import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';

const BracketSimulator = () => {
  const { bracket16, standings } = useContext(DataContext);

  if (!bracket16 || bracket16.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Calculando 16avos de final...</div>;
  }

  const leftSide = bracket16.slice(0, 8);
  const rightSide = bracket16.slice(8, 16);

  const isGroupFinished = (groupLetter) => {
    if (!groupLetter || !standings[groupLetter]) return false;
    return standings[groupLetter].every(t => t.p === 3);
  };

  const isAllFinished = Object.keys(standings).length === 12 && 
                        Object.keys(standings).every(g => isGroupFinished(g));

  const MatchNode = ({ match }) => {
    const involvesThird = match.label.includes('3');
    
    // Un partido es fijo si:
    // 1. Ambos equipos están definidos
    // 2. Sus grupos ya terminaron
    // 3. Si involucra a un 3ro, TODOS los grupos del mundial deben haber terminado
    const isFixed = match.home?.id && match.away?.id && 
                    isGroupFinished(match.home.group) && 
                    isGroupFinished(match.away.group) &&
                    (!involvesThird || isAllFinished);

    return (
      <div className="glass bracket-match" style={{ 
        padding: '10px',
        border: isFixed ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
        boxShadow: isFixed ? '0 0 10px rgba(0, 255, 136, 0.2)' : 'none'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 'bold' }}>{match.label}</span>
            {isFixed && <span style={{ fontSize: '0.55rem', backgroundColor: 'var(--primary)', color: 'var(--bg-color)', padding: '2px 4px', borderRadius: '4px', fontWeight: 'bold' }}>FIJO</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{match.date.toUpperCase()}</span>
            {match.stadium && (
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{match.stadium.toUpperCase()}</span>
            )}
          </div>
        </div>
        <div className="team-row" style={{ marginBottom: '8px' }}>
          <div className="team-info" style={{ fontSize: '1rem', opacity: match.home?.id ? 1 : 0.5 }}>
            <span className="flag" style={{ fontSize: '1.2rem' }}>{match.home?.flag || '❓'}</span>
            <span>{match.home?.name || 'TBD'}</span>
          </div>
        </div>
        <div className="team-row">
          <div className="team-info" style={{ fontSize: '1rem', opacity: match.away?.id ? 1 : 0.5 }}>
            <span className="flag" style={{ fontSize: '1.2rem' }}>{match.away?.flag || '❓'}</span>
            <span>{match.away?.name || 'TBD'}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '5px' }}>16avos de Final Simulados</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Con el nuevo formato de 48 equipos (Top 2 + Mejores 8 Terceros)</p>
      </div>

      <div className="bracket-container" style={{ paddingBottom: '40px' }}>
        {/* Left Side */}
        <div className="bracket-round">
          {leftSide.map(match => <MatchNode key={match.id} match={match} />)}
        </div>

        {/* Center / Trophy Area placeholder */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '100px', flexDirection: 'column' }}>
          <div style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 10px rgba(255, 204, 0, 0.5))' }}>🏆</div>
          <div style={{ marginTop: '10px', color: 'var(--warning)', fontWeight: 'bold' }}>2026</div>
        </div>

        {/* Right Side */}
        <div className="bracket-round">
          {rightSide.map(match => <MatchNode key={match.id} match={match} />)}
        </div>
      </div>
    </div>
  );
};

export default BracketSimulator;

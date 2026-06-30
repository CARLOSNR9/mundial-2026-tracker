import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';

const BracketSimulator = () => {
  const { bracket16, bracket8, bracket4, bracket2, bracket1, standings } = useContext(DataContext);

  if (!bracket16 || bracket16.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Calculando cuadro...</div>;
  }

  const left16 = bracket16.slice(0, 8);
  const right16 = bracket16.slice(8, 16);
  
  const left8 = (bracket8 || []).slice(0, 4);
  const right8 = (bracket8 || []).slice(4, 8);

  const left4 = (bracket4 || []).slice(0, 2);
  const right4 = (bracket4 || []).slice(2, 4);

  const left2 = (bracket2 || []).slice(0, 1);
  const right2 = (bracket2 || []).slice(1, 2);

  const isGroupFinished = (groupLetter) => {
    if (!groupLetter || !standings[groupLetter]) return false;
    return standings[groupLetter].every(t => t.p === 3);
  };

  const isAllFinished = Object.keys(standings).length === 12 && 
                        Object.keys(standings).every(g => isGroupFinished(g));

  const MatchNode = ({ match }) => {
    if (!match) return null;
    const involvesThird = match.label?.includes('3');
    
    // Si es un partido de 16avos (id <= 88), comprobamos los grupos
    // Si es de Octavos en adelante (id > 88), comprobamos simplemente si los equipos están definidos.
    const isAdvancedBracket = match.id > 88;
    
    let isFixed = false;
    if (isAdvancedBracket) {
      isFixed = match.home?.id && match.away?.id;
    } else {
      isFixed = match.home?.id && match.away?.id && 
                isGroupFinished(match.home.group) && 
                isGroupFinished(match.away.group) &&
                (!involvesThird || isAllFinished);
    }

    return (
      <div className="glass bracket-match" style={{ 
        padding: '10px',
        border: isFixed ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
        boxShadow: isFixed ? '0 0 10px rgba(0, 255, 136, 0.2)' : 'none',
        minWidth: '220px',
        maxWidth: '250px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 'bold' }}>{match.label}</span>
            {isFixed && <span style={{ fontSize: '0.55rem', backgroundColor: 'var(--primary)', color: 'var(--bg-color)', padding: '2px 4px', borderRadius: '4px', fontWeight: 'bold' }}>FIJO</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{match.date.toUpperCase()}</span>
          </div>
        </div>
        <div className="team-row" style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="team-info" style={{ fontSize: '0.9rem', opacity: match.home?.id ? 1 : 0.5 }}>
            <span className="flag" style={{ fontSize: '1.2rem' }}>{match.home?.flag || '❓'}</span>
            <span>{match.home?.name || 'Por definir'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '5px' }}>
            {(match.penaltiesHome !== undefined && match.penaltiesHome !== null) && (
              <span style={{ fontSize: '0.8rem', color: 'var(--warning)', fontWeight: 'bold' }}>({match.penaltiesHome})</span>
            )}
            {(match.scoreHome !== undefined && match.scoreHome !== null) && (
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{match.scoreHome}</span>
            )}
          </div>
        </div>
        <div className="team-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="team-info" style={{ fontSize: '0.9rem', opacity: match.away?.id ? 1 : 0.5 }}>
            <span className="flag" style={{ fontSize: '1.2rem' }}>{match.away?.flag || '❓'}</span>
            <span>{match.away?.name || 'Por definir'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '5px' }}>
            {(match.penaltiesAway !== undefined && match.penaltiesAway !== null) && (
              <span style={{ fontSize: '0.8rem', color: 'var(--warning)', fontWeight: 'bold' }}>({match.penaltiesAway})</span>
            )}
            {(match.scoreAway !== undefined && match.scoreAway !== null) && (
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{match.scoreAway}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '5px' }}>Fases Finales del Torneo</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>El camino completo hacia la Copa del Mundo</p>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: '40px' }}>
        <div className="bracket-container" style={{ display: 'flex', minWidth: 'max-content', gap: '30px', padding: '20px', alignItems: 'stretch' }}>
          
          <div className="bracket-round" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '15px' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px' }}>16AVOS DE FINAL</div>
            {left16.map(match => <MatchNode key={match.id} match={match} />)}
          </div>

          <div className="bracket-round" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: '15px' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px' }}>OCTAVOS DE FINAL</div>
            {left8.map(match => <MatchNode key={match.id} match={match} />)}
          </div>

          <div className="bracket-round" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: '15px' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px' }}>CUARTOS DE FINAL</div>
            {left4.map(match => <MatchNode key={match.id} match={match} />)}
          </div>

          <div className="bracket-round" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: '15px' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px' }}>SEMIFINAL</div>
            {left2.map(match => <MatchNode key={match.id} match={match} />)}
          </div>

          {/* Final Area */}
          <div className="bracket-round" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '15px', alignItems: 'center' }}>
            <div style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 10px rgba(255, 204, 0, 0.5))', marginBottom: '20px' }}>🏆</div>
            <div style={{ textAlign: 'center', color: 'var(--warning)', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '10px' }}>GRAN FINAL</div>
            {(bracket1 || []).map(match => <MatchNode key={match.id} match={match} />)}
          </div>

          <div className="bracket-round" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: '15px' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px' }}>SEMIFINAL</div>
            {right2.map(match => <MatchNode key={match.id} match={match} />)}
          </div>

          <div className="bracket-round" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: '15px' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px' }}>CUARTOS DE FINAL</div>
            {right4.map(match => <MatchNode key={match.id} match={match} />)}
          </div>

          <div className="bracket-round" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: '15px' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px' }}>OCTAVOS DE FINAL</div>
            {right8.map(match => <MatchNode key={match.id} match={match} />)}
          </div>

          <div className="bracket-round" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '15px' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px' }}>16AVOS DE FINAL</div>
            {right16.map(match => <MatchNode key={match.id} match={match} />)}
          </div>

        </div>
      </div>
    </div>
  );
};

export default BracketSimulator;

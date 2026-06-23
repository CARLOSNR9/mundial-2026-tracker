import React from 'react';
import { standingsData } from '../data/mockData';

const BracketSimulator = () => {
  // Simulate Round of 16 matchups based on group standings
  // 1A vs 2B, 1C vs 2D, 1E vs 2F, 1G vs 2H
  // 1B vs 2A, 1D vs 2C, 1F vs 2E, 1H vs 2G

  const matchups = [
    { id: 1, home: standingsData.A[0].team, away: standingsData.B[1].team, label: '1A vs 2B' },
    { id: 2, home: standingsData.C[0].team, away: standingsData.D[1].team, label: '1C vs 2D' },
    { id: 3, home: standingsData.E[0].team, away: standingsData.F[1].team, label: '1E vs 2F' },
    { id: 4, home: standingsData.G[0].team, away: standingsData.H[1].team, label: '1G vs 2H' },
    { id: 5, home: standingsData.B[0].team, away: standingsData.A[1].team, label: '1B vs 2A' },
    { id: 6, home: standingsData.D[0].team, away: standingsData.C[1].team, label: '1D vs 2C' },
    { id: 7, home: standingsData.F[0].team, away: standingsData.E[1].team, label: '1F vs 2E' },
    { id: 8, home: standingsData.H[0].team, away: standingsData.G[1].team, label: '1H vs 2G' },
  ];

  const leftSide = matchups.slice(0, 4);
  const rightSide = matchups.slice(4, 8);

  const MatchNode = ({ match }) => (
    <div className="glass bracket-match">
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '5px' }}>{match.label}</div>
      <div className="team-row" style={{ marginBottom: '8px' }}>
        <div className="team-info" style={{ fontSize: '1rem' }}>
          <span className="flag" style={{ fontSize: '1.2rem' }}>{match.home.flag}</span>
          <span>{match.home.name}</span>
        </div>
      </div>
      <div className="team-row">
        <div className="team-info" style={{ fontSize: '1rem' }}>
          <span className="flag" style={{ fontSize: '1.2rem' }}>{match.away.flag}</span>
          <span>{match.away.name}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '5px' }}>Octavos de Final Simulados</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Si la fase de grupos terminara hoy</p>
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

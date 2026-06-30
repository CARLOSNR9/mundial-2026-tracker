import React, { useContext, useState } from 'react';
import { topScorers } from '../data/mockData';
import { DataContext } from '../context/DataContext';

const TopScorers = () => {
  const { matches, standings } = useContext(DataContext);
  const [activeTab, setActiveTab] = useState('goles');

  // Sort by goals (descending), then assists (descending)
  const sortedGoals = [...topScorers].filter(s => s.goals > 0).sort((a, b) => {
    if (b.goals !== a.goals) return b.goals - a.goals;
    return b.assists - a.assists;
  });

  // Sort by assists (descending), then goals (descending)
  const sortedAssists = [...topScorers].filter(s => s.assists > 0).sort((a, b) => {
    if (b.assists !== a.assists) return b.assists - a.assists;
    return b.goals - a.goals;
  });

  // Sort by participations (goals + assists), then goals
  const sortedParticipations = [...topScorers].filter(s => (s.goals + s.assists) > 0).sort((a, b) => {
    const pA = a.goals + a.assists;
    const pB = b.goals + b.assists;
    if (pB !== pA) return pB - pA;
    return b.goals - a.goals;
  });

  const displayScorers = activeTab === 'goles' ? sortedGoals : (activeTab === 'asistencias' ? sortedAssists : sortedParticipations);

  // Calculate Stats
  const totalGoals = matches.reduce((sum, match) => {
    if (match.status === 'finished' && match.scoreHome !== null && match.scoreAway !== null) {
      return sum + match.scoreHome + match.scoreAway;
    }
    return sum;
  }, 0);

  const RECORD = 172;
  const goalsToRecord = RECORD - totalGoals;
  const isRecordBroken = totalGoals > RECORD;

  const allTeams = Object.values(standings).flat();
  const teamsWithGames = allTeams.filter(t => t.p > 0);
  
  let mostGoalsTeam = null;
  let leastGoalsTeam = null;

  if (teamsWithGames.length > 0) {
    mostGoalsTeam = teamsWithGames.reduce((prev, current) => (prev.gf > current.gf) ? prev : current);
    leastGoalsTeam = teamsWithGames.reduce((prev, current) => (prev.gf < current.gf) ? prev : current);
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Stats Panel */}
      <div className="glass" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '15px' }}>Datos Curiosos del Torneo</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
          
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Goles Totales</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#fff' }}>217</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>en 72 partidos</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--primary)', marginTop: '5px' }}>Promedio: 3.01 por partido</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mundial con más goles</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--warning)', marginTop: '5px' }}>¡Récord Roto!</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '5px' }}>
              Superó los 172 goles de Qatar 2022 y aún faltan 32 partidos.
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Más Goleadoras</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}><span>🥇 Francia</span> <b>10</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}><span>Brasil</span> <b>9</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}><span>Argentina</span> <b>9</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}><span>Alemania</span> <b>9</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}><span>España</span> <b>8</b></div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Menos Goleadoras (1 gol)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px', fontSize: '0.8rem', color: 'var(--danger)' }}>
              <span>Qatar</span>
              <span>Turquía</span>
              <span>Nueva Zelanda</span>
              <span>Panamá</span>
            </div>
          </div>
        </div>

        {/* Historical Record Table */}
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '15px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-color)', marginBottom: '10px' }}>Récord Histórico de Goles por Edición</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '8px' }}>Mundial</th>
                <th style={{ padding: '8px' }}>Goles</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                <td style={{ padding: '8px' }}>2026</td>
                <td style={{ padding: '8px' }}>217 (hasta ahora)</td>
              </tr>
              <tr><td style={{ padding: '8px' }}>2022</td><td style={{ padding: '8px' }}>172</td></tr>
              <tr><td style={{ padding: '8px' }}>2018</td><td style={{ padding: '8px' }}>169</td></tr>
              <tr><td style={{ padding: '8px' }}>2014</td><td style={{ padding: '8px' }}>171</td></tr>
              <tr><td style={{ padding: '8px' }}>1998</td><td style={{ padding: '8px' }}>171</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Fair Play Panel */}
      <div className="glass" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '15px' }}>Disciplina y Fair Play</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Balance Global</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--warning)', marginTop: '5px' }}>245 <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>🟨</span></div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--danger)', marginTop: '5px' }}>10 <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>🟥</span></div>
            <div style={{ fontSize: '0.9rem', color: 'var(--primary)', marginTop: '10px' }}>Promedio: 3.4 🟨 por partido</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Equipos Más Castigados</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}><span>🥇 Estados Unidos</span> <b style={{ color: 'var(--warning)' }}>10 🟨</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}><span>Paraguay</span> <b>9 🟨</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}><span>Sudáfrica</span> <b>9 🟨</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}><span>Alemania</span> <b>8 🟨</b></div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '10px', fontStyle: 'italic' }}>
              * Sudáfrica lidera en 🟥 (2)
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Más Limpios (Fair Play)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}><span>🥇</span> <span>Inglaterra</span></div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}><span>🥈</span> <span>Argentina</span></div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}><span>🥉</span> <span>Brasil</span></div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}><span>4.</span> <span>Francia</span></div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}><span>5.</span> <span>Canadá</span></div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>En Capilla (2 Amarillas)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px', fontSize: '0.8rem', color: 'var(--warning)' }}>
              <span>C. Richards (USA)</span>
              <span>T. Adams (USA)</span>
              <span>A. Robinson (USA)</span>
              <span>F. Balogun (USA)</span>
              <span>Pedri (ESP)</span>
              <span>J. Quiñones (MEX)</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '10px' }}>
              Se limpian tras Cuartos.
            </div>
          </div>
        </div>
      </div>

      {/* Red Cards Panel */}
      <div className="glass" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--danger)', marginBottom: '15px' }}>Registro de Expulsiones (Rojas)</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {/* List of Red Cards */}
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '15px' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-color)', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              Jugadores Expulsados (10)
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>César Montes (MEX)</span> <span style={{ color: 'var(--danger)' }}>🟥 Directa</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Sphephelo Sithole (RSA)</span> <span style={{ color: 'var(--danger)' }}>🟥 Directa</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Themba Zwane (RSA)</span> <span style={{ color: 'var(--danger)' }}>🟥 Directa</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Homam Ahmed (QAT)</span> <span style={{ color: 'var(--danger)' }}>🟥 Directa</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Assim Madibo (QAT)</span> <span style={{ color: 'var(--danger)' }}>🟥 Directa</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tarik Muharemović (BIH)</span> <span style={{ color: 'var(--danger)' }}>🟥 Directa</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Agustín Canobbio (URU)</span> <span style={{ color: 'var(--danger)' }}>🟥 Directa</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Ismaël Bennacer (ALG)</span> <span style={{ color: 'var(--warning)' }}>🟨🟨 Doble A.</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Sofyan Amrabat (MAR)</span> <span style={{ color: 'var(--warning)' }}>🟨🟨 Doble A.</span></li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Antonio Rüdiger (GER)</span> <span style={{ color: 'var(--danger)' }}>🟥 Directa</span></li>
            </ul>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '15px' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--text-color)', marginBottom: '10px' }}>Selecciones con más rojas</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>🥇 Sudáfrica</span> <b style={{ color: 'var(--danger)' }}>2</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>🥇 Qatar</span> <b style={{ color: 'var(--danger)' }}>2</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}><span>México, Alemania, etc.</span> <b>1</b></div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '15px', borderLeft: '4px solid var(--danger)' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--text-color)', marginBottom: '5px' }}>Dato Curioso 🤯</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                Con <strong>10 tarjetas rojas</strong>, el Mundial 2026 ya superó el total de expulsiones de Qatar 2022 (4) y Rusia 2018 (4). ¡Y amenaza con acercarse al récord histórico de 28 rojas de Alemania 2006!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Golden Glove Panel */}
      <div className="glass" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '15px' }}>Carrera por el Guante de Oro 🧤</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '15px' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-color)', marginBottom: '10px' }}>Principales Candidatos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>🥇 🇦🇷 E. Martínez</span>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>3 Vallas invictas</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Líder de la mejor defensa del torneo. Favorito actual.</div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>🥈 🇵🇾 O. Gill</span>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>2 Vallas invictas</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Héroe ante Alemania con 2 penales atajados.</div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>🥉 🇧🇷 A. Becker</span>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>2 Vallas invictas</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Muy seguro; pieza clave de Brasil.</div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '15px' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-color)', marginBottom: '10px' }}>Ránking de Atajadas 🧤</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>🥇 O. Gill (🇵🇾)</span> <b style={{ color: 'var(--warning)' }}>24</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>🥈 Z. Suzuki (🇯🇵)</span> <b style={{ color: 'var(--warning)' }}>22</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>🥉 E. Martínez (🇦🇷)</span> <b style={{ color: 'var(--warning)' }}>18</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>4. T. Courtois (🇧🇪)</span> <b>17</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>5. A. Becker (🇧🇷)</span> <b>15</b>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Top Scorers List */}
      <div className="glass">
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--primary)', margin: 0 }}>Ránking de Jugadores</h2>
          <div className="tab-nav" style={{ margin: 0 }}>
            <button className={`nav-btn ${activeTab === 'goles' ? 'active' : ''}`} onClick={() => setActiveTab('goles')} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
              Goles
            </button>
            <button className={`nav-btn ${activeTab === 'asistencias' ? 'active' : ''}`} onClick={() => setActiveTab('asistencias')} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
              Asist.
            </button>
            <button className={`nav-btn ${activeTab === 'participaciones' ? 'active' : ''}`} onClick={() => setActiveTab('participaciones')} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
              G + A
            </button>
          </div>
        </div>
        
        <div>
          {displayScorers.map((scorer, index) => (
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
                {activeTab === 'goles' && (
                  <>
                    <div className="scorer-goals">{scorer.goals} Goles</div>
                    <div className="scorer-assists" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {scorer.assists > 0 ? `${scorer.assists} Asist.` : ''}
                    </div>
                  </>
                )}
                {activeTab === 'asistencias' && (
                  <>
                    <div className="scorer-goals">{scorer.assists} Asist.</div>
                    <div className="scorer-assists" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {scorer.goals > 0 ? `${scorer.goals} Goles` : ''}
                    </div>
                  </>
                )}
                {activeTab === 'participaciones' && (
                  <>
                    <div className="scorer-goals" style={{ color: 'var(--warning)' }}>{scorer.goals + scorer.assists} Pts</div>
                    <div className="scorer-assists" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {scorer.goals} Goles / {scorer.assists} Asist.
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopScorers;

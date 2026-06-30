import React, { useState, useContext, useEffect, useRef } from 'react';
import { DataContext } from '../context/DataContext';
import { teams } from '../data/mockData';

const TeamSearch = () => {
  const { setSelectedTeamId } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const wrapperRef = useRef(null);

  const teamList = Object.values(teams);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const filteredTeams = teamList.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectTeam = (teamId) => {
    setSelectedTeamId(teamId);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', margin: '15px auto', width: '90%', maxWidth: '400px', zIndex: 100 }}>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.7 }}>🔍</span>
        <input 
          type="text" 
          placeholder="Buscar selección..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          style={{
            width: '100%',
            padding: '12px 15px 12px 40px',
            borderRadius: '25px',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(0,0,0,0.5)',
            color: 'var(--text-color)',
            fontSize: '1rem',
            outline: 'none',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}
        />
      </div>

      {isDropdownOpen && searchTerm.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '5px',
          background: 'rgba(20, 25, 40, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          overflow: 'hidden',
          maxHeight: '250px',
          overflowY: 'auto',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
        }}>
          {filteredTeams.length > 0 ? (
            filteredTeams.map(team => (
              <div 
                key={team.id}
                onClick={() => handleSelectTeam(team.id)}
                style={{
                  padding: '12px 15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '1.5rem' }}>{team.flag}</span>
                <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{team.name}</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Grupo {team.group}</span>
              </div>
            ))
          ) : (
            <div style={{ padding: '15px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No se encontraron selecciones.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamSearch;

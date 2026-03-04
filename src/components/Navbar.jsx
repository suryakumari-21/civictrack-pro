import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const s = {
  nav:{position:'sticky',top:0,zIndex:100,background:'rgba(10,14,26,.92)',backdropFilter:'blur(12px)',borderBottom:'1px solid #1e2d42',padding:'0 24px',display:'flex',alignItems:'center',justifyContent:'space-between',height:60},
  brand:{fontSize:'1.2rem',fontWeight:800,color:'#00d4aa',letterSpacing:'-.5px'},
  brandSpan:{color:'#e2e8f0'},
  right:{display:'flex',alignItems:'center',gap:12},
  badge:{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.7rem',background:'#1a2332',border:'1px solid #1e2d42',padding:'3px 10px',borderRadius:20},
  name:{fontSize:'.85rem',color:'#64748b'},
  btn:{background:'transparent',border:'1px solid #1e2d42',color:'#64748b',padding:'6px 14px',borderRadius:8,cursor:'pointer',fontSize:'.8rem',transition:'all .2s'}
};

export default function Navbar() {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    toast.success('Signed out');
    navigate('/');
  };

  return (
    <nav style={s.nav}>
      <div style={s.brand}>Civic<span style={s.brandSpan}>Track</span></div>
      <div style={s.right}>
        <span style={{...s.badge, color: userRole==='admin'?'#f59e0b':'#00d4aa'}}>
          {userRole?.toUpperCase()}
        </span>
        <span style={s.name}>{currentUser?.name}</span>
        <button style={s.btn} onClick={logout}
          onMouseEnter={e=>{e.target.style.borderColor='#ef4444';e.target.style.color='#ef4444'}}
          onMouseLeave={e=>{e.target.style.borderColor='#1e2d42';e.target.style.color='#64748b'}}>
          Sign Out
        </button>
      </div>
    </nav>
  );
}

import React from 'react';

const colors = { total:'#0ea5e9', pending:'#f59e0b', inprogress:'#00d4aa', resolved:'#10b981' };

export default function StatCard({ label, value, type }) {
  return (
    <div style={{background:'#111827',border:'1px solid #1e2d42',borderRadius:14,padding:'18px 20px'}}>
      <div style={{fontSize:'2rem',fontWeight:800,fontFamily:"'IBM Plex Mono',monospace",color:colors[type]||'#e2e8f0'}}>{value}</div>
      <div style={{fontSize:'.75rem',color:'#64748b',marginTop:4,textTransform:'uppercase',letterSpacing:'.5px'}}>{label}</div>
    </div>
  );
}

import React from 'react';

const map = {
  pending:    { label:'⏳ Pending',     bg:'rgba(245,158,11,.15)',  color:'#f59e0b', border:'rgba(245,158,11,.3)' },
  inprogress: { label:'🔄 In Progress', bg:'rgba(0,212,170,.12)',   color:'#00d4aa', border:'rgba(0,212,170,.3)'  },
  resolved:   { label:'✅ Resolved',    bg:'rgba(16,185,129,.12)',  color:'#10b981', border:'rgba(16,185,129,.3)' },
};

export default function StatusBadge({ status }) {
  const m = map[status] || map.pending;
  return (
    <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:'.7rem',fontWeight:500,padding:'4px 12px',borderRadius:20,background:m.bg,color:m.color,border:`1px solid ${m.border}`,whiteSpace:'nowrap'}}>
      {m.label}
    </span>
  );
}

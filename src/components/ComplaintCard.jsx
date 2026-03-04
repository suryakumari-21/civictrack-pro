import React, { useState } from 'react';
import { doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import StatusBadge from './StatusBadge';
import toast from 'react-hot-toast';

const btn = (extra={}) => ({background:'#1a2332',border:'1px solid #1e2d42',color:'#e2e8f0',padding:'7px 14px',borderRadius:8,cursor:'pointer',fontSize:'.78rem',fontWeight:600,transition:'all .2s',...extra});

export default function ComplaintCard({ complaint, onThreadOpen, isAdmin }) {
  const { id, title, category, location, description, status, adminNote, userName, createdAt } = complaint;
  const [note, setNote]     = useState(adminNote || '');
  const [saving, setSaving] = useState(false);
  const { currentUser }     = useAuth();

  const filed = createdAt?.toDate
    ? createdAt.toDate().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})
    : 'Just now';

  const updateStatus = async (newStatus) => {
    await updateDoc(doc(db,'complaints',id), { status:newStatus, updatedAt:serverTimestamp() });
    toast.success(`Status updated to ${newStatus}`);
  };

  const saveNote = async () => {
    setSaving(true);
    await updateDoc(doc(db,'complaints',id), { adminNote:note, updatedAt:serverTimestamp() });
    setSaving(false);
    toast.success('Note saved!');
  };

  const deleteComplaint = async () => {
    if (!window.confirm('Delete this complaint permanently?')) return;
    await deleteDoc(doc(db,'complaints',id));
    toast.success('Complaint deleted');
  };

  return (
    <div style={{background:'#111827',border:'1px solid #1e2d42',borderRadius:14,padding:'20px 22px',marginBottom:14,animation:'fadeUp .3s ease'}}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12,flexWrap:'wrap'}}>
        <div>
          <div style={{fontWeight:700,fontSize:'1rem'}}>{title}</div>
          <div style={{fontSize:'.75rem',color:'#64748b',marginTop:3,fontFamily:"'IBM Plex Mono',monospace"}}>
            {isAdmin && <span style={{color:'#0ea5e9'}}>👤 {userName} · </span>}
            📍 {location} · 📅 {filed}
          </div>
        </div>
        <StatusBadge status={status}/>
      </div>

      <div style={{marginTop:12,fontSize:'.88rem',color:'#94a3b8',lineHeight:1.6}}>{description}</div>
      <span style={{display:'inline-block',marginTop:8,background:'#1a2332',border:'1px solid #1e2d42',fontSize:'.72rem',padding:'3px 10px',borderRadius:6,color:'#64748b',fontFamily:"'IBM Plex Mono',monospace"}}>{category}</span>

      {isAdmin && (
        <div style={{display:'flex',gap:8,marginTop:12}}>
          <input value={note} onChange={e=>setNote(e.target.value)}
            placeholder="Add admin note visible to citizen..."
            style={{flex:1,background:'#1a2332',border:'1px solid #1e2d42',color:'#e2e8f0',padding:'8px 12px',borderRadius:8,fontSize:'.82rem',outline:'none'}}/>
          <button onClick={saveNote} style={btn()}>{saving?'Saving...':'Save Note'}</button>
        </div>
      )}

      {!isAdmin && adminNote && (
        <div style={{marginTop:10,fontSize:'.8rem',background:'rgba(0,212,170,.07)',borderLeft:'3px solid #00d4aa',padding:'8px 12px',borderRadius:'0 8px 8px 0',color:'#94a3b8'}}>
          <strong>🏛 Admin Note:</strong> {adminNote}
        </div>
      )}

      <div style={{marginTop:14,display:'flex',gap:10,flexWrap:'wrap'}}>
        <button onClick={()=>onThreadOpen(complaint)} style={btn({borderColor:'rgba(14,165,233,.3)',color:'#0ea5e9'})}>💬 Discussion</button>
        {isAdmin && status !== 'inprogress' && <button onClick={()=>updateStatus('inprogress')} style={btn({borderColor:'rgba(0,212,170,.4)',color:'#00d4aa'})}>🔄 In Progress</button>}
        {isAdmin && status !== 'resolved'   && <button onClick={()=>updateStatus('resolved')}   style={btn({borderColor:'rgba(16,185,129,.4)',color:'#10b981'})}>✅ Resolved</button>}
        {isAdmin && status !== 'pending'    && <button onClick={()=>updateStatus('pending')}    style={btn()}>↩ Reopen</button>}
        {isAdmin && <button onClick={deleteComplaint} style={btn({borderColor:'rgba(239,68,68,.3)',color:'#ef4444'})}>🗑 Delete</button>}
      </div>
    </div>
  );
}

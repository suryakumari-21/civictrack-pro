import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

export default function ThreadModal({ complaint, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText]         = useState('');
  const { currentUser, userRole } = useAuth();
  const bottomRef = useRef();

  useEffect(() => {
    const q = query(
      collection(db,'threads'),
      where('complaintId','==',complaint.id),
      orderBy('createdAt','asc')
    );
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d=>({id:d.id,...d.data()})));
      setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:'smooth'}),100);
    });
    return unsub;
  }, [complaint.id]);

  const send = async () => {
    if (!text.trim()) return;
    await addDoc(collection(db,'threads'), {
      complaintId: complaint.id,
      text: text.trim(),
      authorName: currentUser.name,
      authorRole: userRole,
      createdAt: serverTimestamp()
    });
    setText('');
  };

  return (
    <div style={{position:'fixed',inset:0,zIndex:200,background:'rgba(0,0,0,.75)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{background:'#111827',border:'1px solid #1e2d42',borderRadius:20,width:'100%',maxWidth:580,maxHeight:'90vh',overflow:'hidden',display:'flex',flexDirection:'column'}}>

        <div style={{padding:'20px 24px',borderBottom:'1px solid #1e2d42',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <h3 style={{fontSize:'1rem',fontWeight:700}}>{complaint.title}</h3>
            <p style={{fontSize:'.75rem',color:'#64748b',marginTop:2}}>{complaint.category} · {complaint.location}</p>
          </div>
          <button onClick={onClose} style={{background:'none',border:'none',color:'#64748b',fontSize:'1.4rem',cursor:'pointer'}}>✕</button>
        </div>

        <div style={{flex:1,overflowY:'auto',padding:'20px 24px',display:'flex',flexDirection:'column',gap:12}}>
          {messages.length === 0 && (
            <div style={{textAlign:'center',padding:'40px 20px',color:'#64748b'}}>
              <div style={{fontSize:'2.5rem',marginBottom:8,opacity:.4}}>💬</div>
              <p style={{fontSize:'.9rem'}}>No messages yet. Start the discussion!</p>
            </div>
          )}
          {messages.map(m => {
            const time = m.createdAt?.toDate ? m.createdAt.toDate().toLocaleString('en-IN') : 'Just now';
            return (
              <div key={m.id} style={{background:'#1a2332',border:'1px solid #1e2d42',borderRadius:10,padding:'12px 14px'}}>
                <div style={{fontSize:'.75rem',fontWeight:700,color:m.authorRole==='admin'?'#f59e0b':'#00d4aa',fontFamily:"'IBM Plex Mono',monospace",marginBottom:4}}>
                  {m.authorRole==='admin'?'🏛 ':'👤 '}{m.authorName} <span style={{color:'#64748b',fontWeight:400}}>[{m.authorRole}]</span>
                </div>
                <div style={{fontSize:'.85rem',lineHeight:1.5}}>{m.text}</div>
                <div style={{fontSize:'.7rem',color:'#64748b',marginTop:5,fontFamily:"'IBM Plex Mono',monospace"}}>{time}</div>
              </div>
            );
          })}
          <div ref={bottomRef}/>
        </div>

        <div style={{padding:'16px 24px',borderTop:'1px solid #1e2d42',display:'flex',gap:10}}>
          <input value={text} onChange={e=>setText(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&send()}
            placeholder="Add a comment..."
            style={{flex:1,background:'#1a2332',border:'1px solid #1e2d42',color:'#e2e8f0',padding:'10px 14px',borderRadius:10,fontSize:'.88rem',outline:'none'}}/>
          <button onClick={send} style={{background:'#00d4aa',color:'#000',border:'none',padding:'10px 18px',borderRadius:10,cursor:'pointer',fontWeight:700,fontSize:'.85rem'}}>Send</button>
        </div>
      </div>
    </div>
  );
}

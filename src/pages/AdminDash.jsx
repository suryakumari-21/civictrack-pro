import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import ComplaintCard from '../components/ComplaintCard';
import ThreadModal from '../components/ThreadModal';

export default function AdminDash() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter]         = useState('all');
  const [search, setSearch]         = useState('');
  const [thread, setThread]         = useState(null);

  useEffect(() => {
    const q = query(collection(db,'complaints'), orderBy('createdAt','desc'));
    return onSnapshot(q, snap => setComplaints(snap.docs.map(d=>({id:d.id,...d.data()}))));
  }, []);

  let shown = filter === 'all' ? complaints : complaints.filter(c=>c.status===filter);
  if (search) shown = shown.filter(c =>
    c.title?.toLowerCase().includes(search) ||
    c.userName?.toLowerCase().includes(search) ||
    c.category?.toLowerCase().includes(search) ||
    c.location?.toLowerCase().includes(search)
  );

  return (
    <div>
      <Navbar/>
      <div style={{padding:'28px 24px',maxWidth:1100,margin:'0 auto',position:'relative',zIndex:1}}>
        <div style={{marginBottom:28}}>
          <h1 style={{fontSize:'1.6rem',fontWeight:800}}>Admin Control Panel</h1>
          <p style={{color:'#64748b',fontSize:'.9rem',marginTop:4}}>Manage and update all citizen complaints across the city</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:14,marginBottom:28}}>
          <StatCard label="Total"       value={complaints.length} type="total"/>
          <StatCard label="Pending"     value={complaints.filter(c=>c.status==='pending').length} type="pending"/>
          <StatCard label="In Progress" value={complaints.filter(c=>c.status==='inprogress').length} type="inprogress"/>
          <StatCard label="Resolved"    value={complaints.filter(c=>c.status==='resolved').length} type="resolved"/>
        </div>

        <div style={{fontSize:'1rem',fontWeight:700,marginBottom:16,display:'flex',alignItems:'center',gap:8}}>
          <span style={{width:4,height:18,background:'#00d4aa',borderRadius:2,display:'inline-block'}}/>
          All Citizen Complaints
        </div>

        <div style={{display:'flex',gap:10,marginBottom:18,flexWrap:'wrap',alignItems:'center'}}>
          {['all','pending','inprogress','resolved'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{background:filter===f?'rgba(0,212,170,.07)':'#111827',border:`1px solid ${filter===f?'#00d4aa':'#1e2d42'}`,color:filter===f?'#00d4aa':'#64748b',padding:'7px 16px',borderRadius:8,cursor:'pointer',fontSize:'.78rem',fontWeight:600,fontFamily:"'Sora',sans-serif"}}>
              {f==='all'?'All':f==='inprogress'?'In Progress':f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
          <input placeholder="Search complaints..." value={search} onChange={e=>setSearch(e.target.value.toLowerCase())}
            style={{background:'#111827',border:'1px solid #1e2d42',color:'#e2e8f0',padding:'7px 14px',borderRadius:8,fontSize:'.82rem',outline:'none',width:200,fontFamily:"'Sora',sans-serif"}}/>
        </div>

        {shown.length === 0
          ? <div style={{textAlign:'center',padding:'60px 20px',color:'#64748b'}}><div style={{fontSize:'3rem',marginBottom:12,opacity:.4}}>📭</div><p>No complaints found.</p></div>
          : shown.map(c=><ComplaintCard key={c.id} complaint={c} onThreadOpen={setThread} isAdmin={true}/>)
        }
      </div>

      {thread && <ThreadModal complaint={thread} onClose={()=>setThread(null)}/>}
    </div>
  );
}

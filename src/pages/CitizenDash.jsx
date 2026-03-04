import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import ComplaintCard from '../components/ComplaintCard';
import ThreadModal from '../components/ThreadModal';
import toast from 'react-hot-toast';

const CATEGORIES = ['Roads & Infrastructure','Water Supply','Electricity','Sanitation & Waste','Public Safety','Parks & Recreation','Other'];

export default function CitizenDash() {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter]         = useState('all');
  const [thread, setThread]         = useState(null);
  const [form, setForm] = useState({ title:'', category:CATEGORIES[0], location:'', description:'' });

  useEffect(() => {
    const q = query(
      collection(db,'complaints'),
      where('userId','==',currentUser.uid),
      orderBy('createdAt','desc')
    );
    return onSnapshot(q, snap => setComplaints(snap.docs.map(d=>({id:d.id,...d.data()}))));
  }, [currentUser.uid]);

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const submit = async () => {
    if (!form.title || !form.location || !form.description) { toast.error('Fill all fields'); return; }
    await addDoc(collection(db,'complaints'), {
      ...form,
      userId: currentUser.uid,
      userName: currentUser.name,
      status: 'pending',
      adminNote: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    setForm({ title:'', category:CATEGORIES[0], location:'', description:'' });
    toast.success('Complaint submitted!');
  };

  const shown = filter === 'all' ? complaints : complaints.filter(c=>c.status===filter);
  const inp = { width:'100%',background:'#1a2332',border:'1px solid #1e2d42',color:'#e2e8f0',padding:'11px 14px',borderRadius:10,fontSize:'.9rem',outline:'none',fontFamily:"'Sora',sans-serif" };

  return (
    <div>
      <Navbar/>
      <div style={{padding:'28px 24px',maxWidth:1100,margin:'0 auto',position:'relative',zIndex:1}}>
        <div style={{marginBottom:28}}>
          <h1 style={{fontSize:'1.6rem',fontWeight:800}}>My Complaints Dashboard</h1>
          <p style={{color:'#64748b',fontSize:'.9rem',marginTop:4}}>Submit, track, and discuss your local governance issues</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:14,marginBottom:28}}>
          <StatCard label="Total Filed" value={complaints.length} type="total"/>
          <StatCard label="Pending"     value={complaints.filter(c=>c.status==='pending').length} type="pending"/>
          <StatCard label="In Progress" value={complaints.filter(c=>c.status==='inprogress').length} type="inprogress"/>
          <StatCard label="Resolved"    value={complaints.filter(c=>c.status==='resolved').length} type="resolved"/>
        </div>

        {/* Submit form */}
        <div style={{fontSize:'1rem',fontWeight:700,marginBottom:16,display:'flex',alignItems:'center',gap:8}}>
          <span style={{width:4,height:18,background:'#00d4aa',borderRadius:2,display:'inline-block'}}/>
          Submit New Complaint
        </div>
        <div style={{background:'#111827',border:'1px solid #1e2d42',borderRadius:16,padding:24,marginBottom:28}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14}}>
            <div>
              <label style={{fontSize:'.78rem',fontWeight:600,color:'#64748b',textTransform:'uppercase',letterSpacing:'.5px'}}>Title</label>
              <input style={{...inp,marginTop:6}} placeholder="e.g. Broken streetlight" value={form.title} onChange={e=>set('title',e.target.value)}/>
            </div>
            <div>
              <label style={{fontSize:'.78rem',fontWeight:600,color:'#64748b',textTransform:'uppercase',letterSpacing:'.5px'}}>Category</label>
              <select style={{...inp,marginTop:6}} value={form.category} onChange={e=>set('category',e.target.value)}>
                {CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:'.78rem',fontWeight:600,color:'#64748b',textTransform:'uppercase',letterSpacing:'.5px'}}>Location</label>
            <input style={{...inp,marginTop:6}} placeholder="Street name, area, ward number..." value={form.location} onChange={e=>set('location',e.target.value)}/>
          </div>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:'.78rem',fontWeight:600,color:'#64748b',textTransform:'uppercase',letterSpacing:'.5px'}}>Description</label>
            <textarea style={{...inp,marginTop:6,minHeight:90,resize:'vertical',lineHeight:1.5}} placeholder="Describe the problem..." value={form.description} onChange={e=>set('description',e.target.value)}/>
          </div>
          <button onClick={submit} style={{background:'#00d4aa',color:'#000',border:'none',padding:'11px 28px',borderRadius:10,fontSize:'.9rem',fontWeight:700,cursor:'pointer'}}>
            📤 Submit Complaint
          </button>
        </div>

        {/* Filters */}
        <div style={{fontSize:'1rem',fontWeight:700,marginBottom:16,display:'flex',alignItems:'center',gap:8}}>
          <span style={{width:4,height:18,background:'#00d4aa',borderRadius:2,display:'inline-block'}}/>
          My Complaints
        </div>
        <div style={{display:'flex',gap:10,marginBottom:18,flexWrap:'wrap'}}>
          {['all','pending','inprogress','resolved'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{background:filter===f?'rgba(0,212,170,.07)':'#111827',border:`1px solid ${filter===f?'#00d4aa':'#1e2d42'}`,color:filter===f?'#00d4aa':'#64748b',padding:'7px 16px',borderRadius:8,cursor:'pointer',fontSize:'.78rem',fontWeight:600,fontFamily:"'Sora',sans-serif"}}>
              {f==='all'?'All':f==='inprogress'?'In Progress':f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>

        {shown.length === 0
          ? <div style={{textAlign:'center',padding:'60px 20px',color:'#64748b'}}><div style={{fontSize:'3rem',marginBottom:12,opacity:.4}}>📭</div><p>No complaints found.</p></div>
          : shown.map(c=><ComplaintCard key={c.id} complaint={c} onThreadOpen={setThread} isAdmin={false}/>)
        }
      </div>

      {thread && <ThreadModal complaint={thread} onClose={()=>setThread(null)}/>}
    </div>
  );
}

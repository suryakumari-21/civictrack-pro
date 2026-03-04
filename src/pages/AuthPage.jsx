import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const [tab, setTab]           = useState('login');
  const [role, setRole]         = useState('citizen');
  const [form, setForm]         = useState({ name:'', email:'', password:'', adminKey:'' });
  const [loading, setLoading]   = useState(false);
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) navigate(userRole === 'admin' ? '/admin' : '/citizen');
  }, [currentUser, userRole, navigate]);

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const login = async () => {
    if (!form.email || !form.password) { toast.error('Fill all fields'); return; }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      toast.success('Welcome back!');
    } catch { toast.error('Invalid email or password'); }
    setLoading(false);
  };

  const register = async () => {
    if (!form.name || !form.email || !form.password) { toast.error('Fill all fields'); return; }
    if (form.password.length < 6) { toast.error('Password min 6 characters'); return; }
    if (role === 'admin' && form.adminKey !== 'CIVIC2024') { toast.error('Invalid admin key'); return; }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await setDoc(doc(db,'users',cred.user.uid), {
        name: form.name, email: form.email, role, uid: cred.user.uid,
        createdAt: new Date().toISOString()
      });
      toast.success('Account created!');
    } catch (e) {
      toast.error(e.code === 'auth/email-already-in-use' ? 'Email already registered' : 'Registration failed');
    }
    setLoading(false);
  };

  const inp = { width:'100%',background:'#1a2332',border:'1px solid #1e2d42',color:'#e2e8f0',padding:'11px 14px',borderRadius:10,fontSize:'.9rem',outline:'none',marginTop:6,fontFamily:"'Sora',sans-serif" };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 16px',position:'relative',zIndex:1}}>
      <div style={{background:'#111827',border:'1px solid #1e2d42',borderRadius:20,width:'100%',maxWidth:460,padding:'40px 36px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-60,right:-60,width:200,height:200,borderRadius:'50%',background:'radial-gradient(circle,rgba(0,212,170,.12),transparent 70%)',pointerEvents:'none'}}/>

        <div style={{fontSize:'2rem',fontWeight:800,color:'#00d4aa',marginBottom:4}}>
          Civic<span style={{color:'#e2e8f0'}}>Track</span>
        </div>
        <p style={{color:'#64748b',fontSize:'.85rem',marginBottom:28}}>Local Governance Transparency Portal</p>

        {/* Tabs */}
        <div style={{display:'flex',border:'1px solid #1e2d42',borderRadius:10,overflow:'hidden',marginBottom:28}}>
          {['login','register'].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:10,background:tab===t?'#00d4aa':'transparent',border:'none',color:tab===t?'#000':'#64748b',cursor:'pointer',fontFamily:"'Sora',sans-serif",fontWeight:600,fontSize:'.85rem',transition:'all .2s'}}>
              {t==='login'?'Sign In':'Register'}
            </button>
          ))}
        </div>

        {tab === 'login' && (
          <div>
            <div style={{marginBottom:18}}>
              <label style={{fontSize:'.78rem',fontWeight:600,color:'#64748b',textTransform:'uppercase',letterSpacing:'.5px'}}>Email</label>
              <input style={inp} type="email" placeholder="you@example.com" value={form.email} onChange={e=>set('email',e.target.value)}/>
            </div>
            <div style={{marginBottom:18}}>
              <label style={{fontSize:'.78rem',fontWeight:600,color:'#64748b',textTransform:'uppercase',letterSpacing:'.5px'}}>Password</label>
              <input style={inp} type="password" placeholder="••••••••" value={form.password} onChange={e=>set('password',e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()}/>
            </div>
            <button onClick={login} disabled={loading} style={{width:'100%',background:'#00d4aa',color:'#000',border:'none',padding:13,borderRadius:10,fontSize:'.95rem',fontWeight:700,cursor:'pointer',marginTop:6,fontFamily:"'Sora',sans-serif"}}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
            <p style={{fontSize:'.75rem',color:'#64748b',textAlign:'center',marginTop:16}}>Demo admin: <code style={{color:'#f59e0b'}}>admin@civic.gov / admin123</code></p>
          </div>
        )}

        {tab === 'register' && (
          <div>
            <p style={{fontSize:'.78rem',color:'#64748b',marginBottom:14}}>Choose account type:</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:18}}>
              {[{r:'citizen',icon:'👤',label:'Citizen',sub:'Submit & track'},{r:'admin',icon:'🏛️',label:'Admin',sub:'Manage complaints'}].map(({r,icon,label,sub})=>(
                <div key={r} onClick={()=>setRole(r)} style={{background:'#1a2332',border:`2px solid ${role===r?'#00d4aa':'#1e2d42'}`,borderRadius:12,padding:'14px 12px',cursor:'pointer',textAlign:'center',background:role===r?'rgba(0,212,170,.08)':'#1a2332'}}>
                  <div style={{fontSize:'1.6rem',marginBottom:6}}>{icon}</div>
                  <div style={{fontSize:'.8rem',fontWeight:600}}>{label}</div>
                  <div style={{fontSize:'.7rem',color:'#64748b',marginTop:2}}>{sub}</div>
                </div>
              ))}
            </div>
            {[{k:'name',label:'Full Name',type:'text',ph:'Your full name'},{k:'email',label:'Email',type:'email',ph:'you@example.com'},{k:'password',label:'Password',type:'password',ph:'Min 6 characters'}].map(({k,label,type,ph})=>(
              <div key={k} style={{marginBottom:18}}>
                <label style={{fontSize:'.78rem',fontWeight:600,color:'#64748b',textTransform:'uppercase',letterSpacing:'.5px'}}>{label}</label>
                <input style={inp} type={type} placeholder={ph} value={form[k]} onChange={e=>set(k,e.target.value)}/>
              </div>
            ))}
            {role==='admin' && (
              <div style={{marginBottom:18}}>
                <label style={{fontSize:'.78rem',fontWeight:600,color:'#64748b',textTransform:'uppercase',letterSpacing:'.5px'}}>Admin Access Key</label>
                <input style={inp} type="password" placeholder="Enter admin key" value={form.adminKey} onChange={e=>set('adminKey',e.target.value)}/>
                <p style={{fontSize:'.72rem',color:'#64748b',marginTop:4}}>Demo key: <code style={{color:'#f59e0b'}}>CIVIC2024</code></p>
              </div>
            )}
            <button onClick={register} disabled={loading} style={{width:'100%',background:'#00d4aa',color:'#000',border:'none',padding:13,borderRadius:10,fontSize:'.95rem',fontWeight:700,cursor:'pointer',marginTop:6,fontFamily:"'Sora',sans-serif"}}>
              {loading ? 'Creating...' : 'Create Account →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

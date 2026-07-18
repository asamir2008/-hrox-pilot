'use client';

import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import type {DemoUser} from '@/lib/demo-users';
import {loadNotifications} from '@/lib/notifications';

export default function NotificationsPage(){
  const router=useRouter();
  const [user,setUser]=useState<DemoUser|null>(null);
  const [items,setItems]=useState<any[]>([]);
  useEffect(()=>{
    const raw=localStorage.getItem('hrox-session');
    if(!raw){router.replace('/');return}
    const parsed=JSON.parse(raw) as DemoUser;
    setUser(parsed);
    loadNotifications(parsed.email).then(setItems).catch(console.error);
  },[router]);
  if(!user)return null;
  return <main className="reportPage">
    <header className="reportHeader"><div><div className="eyebrow">HROX notification center</div><h1>{user.name}</h1><p>Role-based workflow updates and assignment alerts.</p></div><div className="noPrint"><button className="demo" onClick={()=>router.push('/dashboard')}>Back to dashboard</button></div></header>
    <section className="card section"><h2>Notifications</h2>{items.length===0?<p className="sub">No notifications yet. New request, approval, assignment and report events will appear here.</p>:<div className="assignmentGrid">{items.map((n,i)=><article className="assignment" key={n.id||i}><div className="sectionHead"><div><b>{n.title}</b><p className="sub">{n.message}</p></div><span className="statusChip">{n.type}</span></div><small>{new Date(n.created_at||n.createdAt).toLocaleString()}</small></article>)}</div>}</section>
  </main>
}

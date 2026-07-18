'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { DemoUser } from '@/lib/demo-users';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('hrox-session');
    if (!raw) {
      router.replace('/');
      return;
    }
    setUser(JSON.parse(raw));
  }, [router]);

  if (!user) return null;

  const roleMessage = user.role === 'director'
    ? 'Review, edit and approve rotation plans. Monitor consolidated reports and executive KPIs.'
    : user.role === 'coordinator'
      ? 'Build rotation plans, select registered managers, monitor visits and submit consolidated reports.'
      : user.role === 'manager'
        ? 'View your assigned projects, check in, submit daily notes and complete field reports.'
        : 'Manage users, roles, projects and platform configuration.';

  return (
    <main className="shell">
      <aside className="side">
        <div className="sideBrand"><div className="mark">H</div><span>HROX</span></div>
        <nav className="nav"><a className="active">Overview</a><a>My Inbox</a><a>Rotation Plans</a><a>Field Visits</a><a>Reports</a><a>Users</a></nav>
      </aside>
      <section className="main">
        <header className="top">
          <div><div className="eyebrow">Role-based workspace</div><h1>Welcome, {user.name}</h1><p className="sub">{roleMessage}</p></div>
          <button className="demo" onClick={() => { localStorage.removeItem('hrox-session'); router.replace('/'); }}>Sign out</button>
        </header>
        <div className="cards">
          <div className="card"><small>Role</small><strong>{user.title}</strong></div>
          <div className="card"><small>Open Tasks</small><strong>{user.role === 'manager' ? '2' : '1'}</strong></div>
          <div className="card"><small>Current Cycle</small><strong>Q3 2026</strong></div>
          <div className="card"><small>Workflow Status</small><strong>Active</strong></div>
        </div>
        <div className="card" style={{marginTop:16}}><div className="eyebrow">Sprint 1 foundation</div><h2>Authentication and User Management</h2><p className="sub">This workspace now reads the signed-in user and opens the correct role context. The next implementation step adds the user directory, project registry and the Director → Coordinator planning workflow.</p></div>
      </section>
    </main>
  );
}

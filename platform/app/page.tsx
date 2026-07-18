'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { demoUsers } from '@/lib/demo-users';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function signIn(event: FormEvent) {
    event.preventDefault();
    const user = demoUsers.find(item => item.email === email.trim().toLowerCase() && item.password === password);
    if (!user) {
      setError('Invalid email or password. Select a demo account below.');
      return;
    }
    localStorage.setItem('hrox-session', JSON.stringify(user));
    router.push('/dashboard');
  }

  function selectUser(userEmail: string) {
    setEmail(userEmail);
    setPassword('Hrox2026!');
    setError('');
  }

  return (
    <main className="auth">
      <section className="brandPanel">
        <div className="mark">H</div>
        <div className="eyebrow">HR Operations Experience</div>
        <h1>Project HR Rotation & Field Operations</h1>
        <p>One controlled workflow for rotation requests, planning, director approval, field check-ins, daily notes, reports and management decisions.</p>
        <div className="flow"><span>Request</span><span>Plan</span><span>Approve</span><span>Assign</span><span>Visit</span><span>Report</span></div>
      </section>
      <section className="formPanel">
        <div className="loginCard">
          <div className="eyebrow">Secure workspace</div>
          <h2>Sign in to HROX</h2>
          <p className="sub">Each demo account opens a different role-based workspace. Supabase authentication will replace demo mode after connection.</p>
          <form onSubmit={signIn}>
            <label className="field">Email<input value={email} onChange={e => setEmail(e.target.value)} type="email" required /></label>
            <label className="field">Password<input value={password} onChange={e => setPassword(e.target.value)} type="password" required /></label>
            <button className="primary" type="submit">Sign in</button>
            <p className="error">{error}</p>
          </form>
          <div className="demoGrid">
            {demoUsers.map(user => <button className="demo" key={user.email} onClick={() => selectUser(user.email)}><b>{user.title}</b><small>{user.email}</small></button>)}
          </div>
        </div>
      </section>
    </main>
  );
}

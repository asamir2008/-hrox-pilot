'use client';
import {useMemo,useState} from 'react';
import {demoDirectory,type DirectoryUser} from '@/lib/directory';

export default function UserDirectory(){
 const [users,setUsers]=useState<DirectoryUser[]>(demoDirectory);
 const [query,setQuery]=useState('');
 const filtered=useMemo(()=>users.filter(u=>(u.name+' '+u.email+' '+u.employeeNo+' '+u.role).toLowerCase().includes(query.toLowerCase())),[users,query]);
 const toggle=(id:string)=>setUsers(users.map(u=>u.id===id?{...u,active:!u.active}:u));
 return <section className="card section"><div className="sectionHead"><div><div className="eyebrow">Registered system users</div><h2>User Directory</h2><p className="sub">Only active registered managers can be selected in rotation plans.</p></div><button className="primary actionBtn" onClick={()=>alert('User creation will use Supabase Auth after connection.')}>+ Add user</button></div><input className="comment" placeholder="Search name, email, employee number or role" value={query} onChange={e=>setQuery(e.target.value)}/><div className="tableWrap"><table><thead><tr><th>Employee</th><th>Email</th><th>Title</th><th>Department</th><th>Role</th><th>Status</th><th>Action</th></tr></thead><tbody>{filtered.map(u=><tr key={u.id}><td><b>{u.name}</b><br/><small>{u.employeeNo}</small></td><td>{u.email}</td><td>{u.title}</td><td>{u.department}</td><td><span className="statusChip">{u.role}</span></td><td>{u.active?'Active':'Inactive'}</td><td><button className="demo" onClick={()=>toggle(u.id)}>{u.active?'Disable':'Enable'}</button></td></tr>)}</tbody></table></div></section>
}

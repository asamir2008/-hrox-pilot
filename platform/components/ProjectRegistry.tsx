'use client';
import {useMemo,useState} from 'react';
import {demoProjects,type Project} from '@/lib/directory';

export default function ProjectRegistry(){
 const [projects,setProjects]=useState<Project[]>(demoProjects);
 const [query,setQuery]=useState('');
 const filtered=useMemo(()=>projects.filter(p=>(p.code+' '+p.name+' '+p.location).toLowerCase().includes(query.toLowerCase())),[projects,query]);
 const toggle=(id:string)=>setProjects(projects.map(p=>p.id===id?{...p,active:!p.active}:p));
 return <section className="card section"><div className="sectionHead"><div><div className="eyebrow">Master data</div><h2>Project Registry</h2><p className="sub">Only active projects are available when the Coordinator or Director edits a plan.</p></div><button className="primary actionBtn" onClick={()=>alert('Project creation will save to Supabase after connection.')}>+ Add project</button></div><input className="comment" placeholder="Search code, project or location" value={query} onChange={e=>setQuery(e.target.value)}/><div className="tableWrap"><table><thead><tr><th>Code</th><th>Project</th><th>Location</th><th>Status</th><th>Action</th></tr></thead><tbody>{filtered.map(p=><tr key={p.id}><td><b>{p.code}</b></td><td>{p.name}</td><td>{p.location}</td><td>{p.active?'Active':'Inactive'}</td><td><button className="demo" onClick={()=>toggle(p.id)}>{p.active?'Disable':'Enable'}</button></td></tr>)}</tbody></table></div></section>
}

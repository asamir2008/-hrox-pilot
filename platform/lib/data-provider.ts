import type { DemoUser } from './demo-users';
import type { Assignment, WorkflowState } from './workflow-store';
import { createSupabaseBrowserClient } from './supabase/client';

export type ProjectRecord={id:string;code:string;name:string;active:boolean};
export type UserRecord={id:string;name:string;email:string;role:'director'|'coordinator'|'manager'|'admin';title:string;active:boolean};

export interface DataProvider{
  mode:'demo'|'supabase';
  getCurrentUser():Promise<DemoUser|null>;
  signIn(email:string,password:string):Promise<DemoUser>;
  signOut():Promise<void>;
  listUsers():Promise<UserRecord[]>;
  listProjects():Promise<ProjectRecord[]>;
  loadWorkflow():Promise<WorkflowState>;
  saveWorkflow(state:WorkflowState):Promise<void>;
  uploadEvidence(assignmentId:string,file:File):Promise<string>;
}

const hasSupabase=Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const demoProvider:DataProvider={
  mode:'demo',
  async getCurrentUser(){const raw=localStorage.getItem('hrox-session');return raw?JSON.parse(raw):null},
  async signIn(){throw new Error('Use demo login helper in demo mode')},
  async signOut(){localStorage.removeItem('hrox-session')},
  async listUsers(){const raw=localStorage.getItem('hrox-users');return raw?JSON.parse(raw):[]},
  async listProjects(){const raw=localStorage.getItem('hrox-projects');return raw?JSON.parse(raw):[]},
  async loadWorkflow(){const raw=localStorage.getItem('hrox-platform-workflow');if(!raw)throw new Error('Workflow not initialized');return JSON.parse(raw)},
  async saveWorkflow(state){localStorage.setItem('hrox-platform-workflow',JSON.stringify(state))},
  async uploadEvidence(assignmentId,file){const key=`hrox-evidence-${assignmentId}`;const existing=JSON.parse(localStorage.getItem(key)||'[]');existing.push({name:file.name,size:file.size,type:file.type,uploadedAt:new Date().toISOString()});localStorage.setItem(key,JSON.stringify(existing));return `demo://${assignmentId}/${encodeURIComponent(file.name)}`}
};

const supabaseProvider:DataProvider={
  mode:'supabase',
  async getCurrentUser(){const supabase=createSupabaseBrowserClient();const {data:{user}}=await supabase.auth.getUser();if(!user)return null;const {data,error}=await supabase.from('profiles').select('full_name,email,role,title').eq('id',user.id).single();if(error)throw error;return {name:data.full_name,email:data.email,password:'',role:data.role,title:data.title}},
  async signIn(email,password){const supabase=createSupabaseBrowserClient();const {data,error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;const {data:profile,error:profileError}=await supabase.from('profiles').select('full_name,email,role,title').eq('id',data.user.id).single();if(profileError)throw profileError;return {name:profile.full_name,email:profile.email,password:'',role:profile.role,title:profile.title}},
  async signOut(){await createSupabaseBrowserClient().auth.signOut()},
  async listUsers(){const {data,error}=await createSupabaseBrowserClient().from('profiles').select('id,full_name,email,role,title,active').order('full_name');if(error)throw error;return (data||[]).map(x=>({id:x.id,name:x.full_name,email:x.email,role:x.role,title:x.title,active:x.active}))},
  async listProjects(){const {data,error}=await createSupabaseBrowserClient().from('projects').select('id,code,name,active').order('name');if(error)throw error;return data||[]},
  async loadWorkflow(){const supabase=createSupabaseBrowserClient();const {data:plan,error}=await supabase.from('rotation_plans').select('id,title,period,status,director_comment,rotation_assignments(*)').order('created_at',{ascending:false}).limit(1).maybeSingle();if(error)throw error;if(!plan)throw new Error('No workflow found');const assignments:Assignment[]=(plan.rotation_assignments||[]).map((x:any)=>({id:x.reference_no,project:x.project_name,managerEmail:x.manager_email,managerName:x.manager_name,startDate:x.start_date,endDate:x.end_date,status:x.status,notes:[]}));return {stage:plan.status,requestTitle:plan.title,requestPeriod:plan.period,requestInstructions:'',directorComment:plan.director_comment||'',assignments,activity:[]}},
  async saveWorkflow(state){const supabase=createSupabaseBrowserClient();const {error}=await supabase.rpc('save_demo_workflow',{payload:state});if(error)throw error},
  async uploadEvidence(assignmentId,file){const supabase=createSupabaseBrowserClient();const path=`${assignmentId}/${crypto.randomUUID()}-${file.name}`;const {error}=await supabase.storage.from('visit-evidence').upload(path,file);if(error)throw error;return path}
};

export const dataProvider:DataProvider=hasSupabase?supabaseProvider:demoProvider;

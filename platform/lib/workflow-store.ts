import type { DemoUser } from './demo-users';

export type WorkflowStage='request'|'planning'|'review'|'assigned'|'fieldwork'|'reporting'|'executive';
export type AssignmentStatus='Scheduled'|'Checked in'|'In progress'|'Report submitted'|'Completed'|'Overdue';
export type Assignment={id:string;project:string;managerEmail:string;managerName:string;startDate:string;endDate:string;status:AssignmentStatus;notes:string[]};
export type WorkflowState={stage:WorkflowStage;requestTitle:string;requestPeriod:string;requestInstructions:string;assignments:Assignment[];directorComment:string;activity:string[]};

const seed:WorkflowState={stage:'request',requestTitle:'Q3 2026 Project HR Rotation',requestPeriod:'20 Jul 2026 – 30 Sep 2026',requestInstructions:'Prepare a balanced field rotation plan covering priority projects and available HR Directors.',directorComment:'',assignments:[
{id:'A-001',project:'Mataf Expansion',managerEmail:'manager1@hrox.demo',managerName:'Omar Khaled',startDate:'2026-07-22',endDate:'2026-07-24',status:'Scheduled',notes:[]},
{id:'A-002',project:'Shamiyah Development',managerEmail:'manager2@hrox.demo',managerName:'Sara Nabil',startDate:'2026-07-25',endDate:'2026-07-27',status:'Scheduled',notes:[]},
{id:'A-003',project:'Makkah Gate',managerEmail:'manager1@hrox.demo',managerName:'Omar Khaled',startDate:'2026-08-02',endDate:'2026-08-04',status:'Scheduled',notes:[]}
],activity:['Workflow initialized']};

export function loadWorkflow():WorkflowState{if(typeof window==='undefined')return seed;const raw=localStorage.getItem('hrox-workflow');if(!raw)return seed;try{return JSON.parse(raw) as WorkflowState}catch{return seed}}
export function saveWorkflow(state:WorkflowState){localStorage.setItem('hrox-workflow',JSON.stringify(state))}
export function resetWorkflow(){localStorage.removeItem('hrox-workflow')}
export function roleLabel(user:DemoUser){return user.role==='director'?'Senior HR Director':user.role==='coordinator'?'HR Operations Coordinator':user.role==='manager'?'Assigned HR Director':'System Administrator'}

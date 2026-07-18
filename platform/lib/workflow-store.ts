import type { DemoUser } from './demo-users';

export type WorkflowStage='request'|'planning'|'review'|'assigned'|'fieldwork'|'reporting'|'executive';
export type AssignmentStatus='Scheduled'|'Checked in'|'In progress'|'Report submitted'|'Returned'|'Completed'|'Overdue';
export type Attachment={name:string;url:string;uploadedAt:string};
export type CheckIn={latitude:number;longitude:number;accuracy:number;timestamp:string};
export type Assignment={
  id:string;project:string;managerEmail:string;managerName:string;startDate:string;endDate:string;
  status:AssignmentStatus;notes:string[];attachments:Attachment[];checkIn?:CheckIn;
  reportSummary:string;coordinatorComment:string;selectedForConsolidation:boolean;
};
export type WorkflowState={stage:WorkflowStage;requestTitle:string;requestPeriod:string;requestInstructions:string;assignments:Assignment[];directorComment:string;activity:string[]};

const seed:WorkflowState={stage:'request',requestTitle:'Q3 2026 Project HR Rotation',requestPeriod:'20 Jul 2026 – 30 Sep 2026',requestInstructions:'Prepare a balanced field rotation plan covering priority projects and available HR Directors.',directorComment:'',assignments:[
{id:'A-001',project:'Mataf Expansion',managerEmail:'manager1@hrox.demo',managerName:'Omar Khaled',startDate:'2026-07-22',endDate:'2026-07-24',status:'Scheduled',notes:[],attachments:[],reportSummary:'',coordinatorComment:'',selectedForConsolidation:false},
{id:'A-002',project:'Shamiyah Development',managerEmail:'manager2@hrox.demo',managerName:'Sara Nabil',startDate:'2026-07-25',endDate:'2026-07-27',status:'Scheduled',notes:[],attachments:[],reportSummary:'',coordinatorComment:'',selectedForConsolidation:false},
{id:'A-003',project:'Makkah Gate',managerEmail:'manager1@hrox.demo',managerName:'Omar Khaled',startDate:'2026-08-02',endDate:'2026-08-04',status:'Scheduled',notes:[],attachments:[],reportSummary:'',coordinatorComment:'',selectedForConsolidation:false}
],activity:['Workflow initialized']};

function normalize(state:WorkflowState):WorkflowState{
 return {...state,assignments:state.assignments.map(a=>({...a,attachments:a.attachments||[],reportSummary:a.reportSummary||'',coordinatorComment:a.coordinatorComment||'',selectedForConsolidation:a.selectedForConsolidation||false}))};
}
export function loadWorkflow():WorkflowState{if(typeof window==='undefined')return seed;const raw=localStorage.getItem('hrox-workflow');if(!raw)return seed;try{return normalize(JSON.parse(raw) as WorkflowState)}catch{return seed}}
export function saveWorkflow(state:WorkflowState){localStorage.setItem('hrox-workflow',JSON.stringify(state))}
export function resetWorkflow(){localStorage.removeItem('hrox-workflow')}
export function roleLabel(user:DemoUser){return user.role==='director'?'Senior HR Director':user.role==='coordinator'?'HR Operations Coordinator':user.role==='manager'?'Assigned HR Director':'System Administrator'}
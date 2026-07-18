import type { DemoUser } from './demo-users';
import {isSupabaseConfigured,supabase} from './supabase/client';
import {sendNotification} from './notifications';

export type WorkflowStage='request'|'planning'|'review'|'assigned'|'fieldwork'|'reporting'|'executive';
export type AssignmentStatus='Scheduled'|'Checked in'|'In progress'|'Report submitted'|'Returned'|'Completed'|'Overdue';
export type CheckIn={latitude:number;longitude:number;accuracy:number;timestamp:string};
export type Attachment={name:string;url:string;uploadedAt:string};
export type Assignment={id:string;project:string;managerEmail:string;managerName:string;startDate:string;endDate:string;status:AssignmentStatus;notes:string[];checkIn?:CheckIn;attachments:Attachment[];reportSummary:string;coordinatorComment:string;selectedForConsolidation:boolean};
export type WorkflowState={stage:WorkflowStage;requestTitle:string;requestPeriod:string;requestInstructions:string;assignments:Assignment[];directorComment:string;activity:string[]};

const seed:WorkflowState={stage:'request',requestTitle:'Q3 2026 Project HR Rotation',requestPeriod:'20 Jul 2026 – 30 Sep 2026',requestInstructions:'Prepare a balanced field rotation plan covering priority projects and available HR Directors.',directorComment:'',assignments:[
{id:'A-001',project:'Mataf Expansion',managerEmail:'manager1@hrox.demo',managerName:'Omar Khaled',startDate:'2026-07-22',endDate:'2026-07-24',status:'Scheduled',notes:[],attachments:[],reportSummary:'',coordinatorComment:'',selectedForConsolidation:false},
{id:'A-002',project:'Shamiyah Development',managerEmail:'manager2@hrox.demo',managerName:'Sara Nabil',startDate:'2026-07-25',endDate:'2026-07-27',status:'Scheduled',notes:[],attachments:[],reportSummary:'',coordinatorComment:'',selectedForConsolidation:false},
{id:'A-003',project:'Makkah Gate',managerEmail:'manager1@hrox.demo',managerName:'Omar Khaled',startDate:'2026-08-02',endDate:'2026-08-04',status:'Scheduled',notes:[],attachments:[],reportSummary:'',coordinatorComment:'',selectedForConsolidation:false}
],activity:['Workflow initialized']};

const KEY='hrox-workflow';
export function loadWorkflow():WorkflowState{if(typeof window==='undefined')return seed;const raw=localStorage.getItem(KEY);if(!raw)return seed;try{return normalize(JSON.parse(raw) as WorkflowState)}catch{return seed}}
export function saveWorkflow(state:WorkflowState){
  const previous=loadWorkflow();
  const normalized=normalize(state);
  localStorage.setItem(KEY,JSON.stringify(normalized));
  void persistRemote(normalized);
  void dispatchDetectedNotifications(previous,normalized);
}
export function resetWorkflow(){localStorage.removeItem(KEY)}
export function roleLabel(user:DemoUser){return user.role==='director'?'Senior HR Director':user.role==='coordinator'?'HR Operations Coordinator':user.role==='manager'?'Assigned HR Director':'System Administrator'}

function normalize(state:WorkflowState):WorkflowState{return {...state,assignments:(state.assignments||[]).map(a=>({...a,notes:a.notes||[],attachments:a.attachments||[],reportSummary:a.reportSummary||'',coordinatorComment:a.coordinatorComment||'',selectedForConsolidation:Boolean(a.selectedForConsolidation)})),activity:state.activity||[]}}

async function persistRemote(state:WorkflowState){
  if(!isSupabaseConfigured)return;
  const {error}=await supabase.rpc('save_demo_workflow',{payload:state});
  if(error)console.error('HROX workflow persistence failed',error);
}

async function dispatchDetectedNotifications(previous:WorkflowState,next:WorkflowState){
  try{
    if(previous.stage!==next.stage){
      if(next.stage==='planning')await sendNotification({recipientEmail:'coordinator@hrox.demo',title:'New rotation request',message:`Prepare the plan for ${next.requestTitle}.`,type:'request',entityId:next.requestTitle});
      if(next.stage==='review')await sendNotification({recipientEmail:'director@hrox.demo',title:'Plan ready for review',message:'The Coordinator submitted the shared plan. You may edit people, projects and dates before approval.',type:'plan',entityId:next.requestTitle});
      if(previous.stage==='review'&&next.stage==='planning')await sendNotification({recipientEmail:'coordinator@hrox.demo',title:'Plan returned for changes',message:next.directorComment||'The Director returned the plan for revision.',type:'plan',entityId:next.requestTitle});
      if(next.stage==='assigned')await Promise.all([...new Set(next.assignments.map(a=>a.managerEmail))].map(email=>sendNotification({recipientEmail:email,title:'New field assignments released',message:'The rotation plan was approved. Review your assigned visits in HROX.',type:'assignment',entityId:next.requestTitle})));
      if(next.stage==='executive')await sendNotification({recipientEmail:'director@hrox.demo',title:'Consolidated report ready',message:'The Coordinator submitted selected completed reports for executive review.',type:'report',entityId:next.requestTitle});
    }
    for(const current of next.assignments){
      const old=previous.assignments.find(a=>a.id===current.id);
      if(!old||old.status===current.status)continue;
      if(current.status==='Checked in')await sendNotification({recipientEmail:'coordinator@hrox.demo',title:'Manager checked in',message:`${current.managerName} checked in for ${current.project}.`,type:'assignment',entityId:current.id});
      if(current.status==='Report submitted')await sendNotification({recipientEmail:'coordinator@hrox.demo',title:'Field report submitted',message:`${current.managerName} submitted the report for ${current.project}.`,type:'report',entityId:current.id});
      if(current.status==='Returned')await sendNotification({recipientEmail:current.managerEmail,title:'Report returned for correction',message:current.coordinatorComment||'Please revise and resubmit your field report.',type:'report',entityId:current.id});
      if(current.status==='Completed')await sendNotification({recipientEmail:current.managerEmail,title:'Report accepted',message:`Your report for ${current.project} was accepted.`,type:'report',entityId:current.id});
    }
  }catch(error){console.error('HROX notification dispatch failed',error)}
}

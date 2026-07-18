import type {DemoUser} from './demo-users';
import type {Assignment,WorkflowState,WorkflowStage} from './workflow-store';
import {dataProvider} from './data-provider';
import {sendNotification} from './notifications';

const DIRECTOR='director@hrox.demo';
const COORDINATOR='coordinator@hrox.demo';

export type WorkflowEvent=
  |'request_sent'|'plan_submitted'|'plan_returned'|'plan_approved'
  |'checked_in'|'report_submitted'|'report_returned'|'report_accepted'
  |'consolidated_submitted'|'workflow_updated';

export async function persistWorkflow(state:WorkflowState){
  await dataProvider.saveWorkflow(state);
}

export async function commitWorkflow(params:{
  state:WorkflowState;
  actor:DemoUser;
  event:WorkflowEvent;
  message:string;
  assignment?:Assignment;
  stage?:WorkflowStage;
}){
  const next:WorkflowState={
    ...params.state,
    ...(params.stage?{stage:params.stage}:{}),
    activity:[`${new Date().toLocaleString()} — ${params.message}`,...params.state.activity]
  };
  await persistWorkflow(next);
  await notifyForEvent(params.event,next,params.actor,params.assignment);
  return next;
}

async function notifyForEvent(event:WorkflowEvent,state:WorkflowState,actor:DemoUser,assignment?:Assignment){
  const common={entityId:assignment?.id||state.requestTitle};
  if(event==='request_sent')return sendNotification({...common,recipientEmail:COORDINATOR,type:'request',title:'New rotation request',message:`${actor.name} requested preparation of ${state.requestTitle}.`});
  if(event==='plan_submitted')return sendNotification({...common,recipientEmail:DIRECTOR,type:'plan',title:'Rotation plan ready for review',message:'The Coordinator submitted the shared rotation plan for review and editing.'});
  if(event==='plan_returned')return sendNotification({...common,recipientEmail:COORDINATOR,type:'plan',title:'Plan returned for changes',message:state.directorComment||'The Director returned the plan for revision.'});
  if(event==='plan_approved'){
    const recipients=[...new Set(state.assignments.map(a=>a.managerEmail))];
    await Promise.all(recipients.map(email=>sendNotification({...common,recipientEmail:email,type:'assignment',title:'New field assignment released',message:'The rotation plan was approved. Open HROX to review your assigned project visits.'})));
    return;
  }
  if(event==='checked_in'&&assignment)return sendNotification({...common,recipientEmail:COORDINATOR,type:'assignment',title:'Manager checked in',message:`${assignment.managerName} checked in for ${assignment.project}.`});
  if(event==='report_submitted'&&assignment)return sendNotification({...common,recipientEmail:COORDINATOR,type:'report',title:'Field report submitted',message:`${assignment.managerName} submitted the report for ${assignment.project}.`});
  if(event==='report_returned'&&assignment)return sendNotification({...common,recipientEmail:assignment.managerEmail,type:'report',title:'Report returned for correction',message:assignment.coordinatorComment||'Please revise and resubmit your field report.'});
  if(event==='report_accepted'&&assignment)return sendNotification({...common,recipientEmail:assignment.managerEmail,type:'report',title:'Report accepted',message:`Your report for ${assignment.project} was accepted by the Coordinator.`});
  if(event==='consolidated_submitted')return sendNotification({...common,recipientEmail:DIRECTOR,type:'report',title:'Consolidated report ready',message:'The Coordinator submitted selected completed reports for executive review.'});
}

import {createNotification} from './notifications';
import type {Assignment,WorkflowState} from './workflow-store';

export type WorkflowEvent=
  |'request_sent'
  |'plan_submitted'
  |'plan_returned'
  |'plan_approved'
  |'manager_checked_in'
  |'report_submitted'
  |'report_returned'
  |'report_accepted'
  |'consolidated_submitted';

type EventContext={
  actorName:string;
  assignment?:Assignment;
  flow:WorkflowState;
  comment?:string;
  selectedCount?:number;
};

export async function notifyWorkflowEvent(event:WorkflowEvent,context:EventContext){
  const assignment=context.assignment;
  const common={createdAt:new Date().toISOString(),read:false};
  const notifications=[] as Array<Parameters<typeof createNotification>[0]>;

  if(event==='request_sent') notifications.push({...common,recipientEmail:'coordinator@hrox.demo',title:'New rotation request',message:`${context.actorName} requested a new rotation plan: ${context.flow.requestTitle}`,link:'/dashboard'});
  if(event==='plan_submitted') notifications.push({...common,recipientEmail:'director@hrox.demo',title:'Rotation plan awaiting review',message:`${context.actorName} submitted ${context.flow.assignments.length} assignment(s) for review.`,link:'/dashboard'});
  if(event==='plan_returned') notifications.push({...common,recipientEmail:'coordinator@hrox.demo',title:'Rotation plan returned',message:context.comment||'The Director returned the rotation plan for changes.',link:'/dashboard'});
  if(event==='plan_approved'){
    const recipients=[...new Set(context.flow.assignments.map(a=>a.managerEmail))];
    recipients.forEach(recipientEmail=>notifications.push({...common,recipientEmail,title:'New field assignment released',message:'The rotation plan was approved. Open HROX to review your assigned projects and dates.',link:'/dashboard'}));
  }
  if(event==='manager_checked_in'&&assignment) notifications.push({...common,recipientEmail:'coordinator@hrox.demo',title:'Manager checked in',message:`${assignment.managerName} checked in at ${assignment.project}.`,link:'/dashboard'});
  if(event==='report_submitted'&&assignment) notifications.push({...common,recipientEmail:'coordinator@hrox.demo',title:'Field report submitted',message:`${assignment.managerName} submitted the report for ${assignment.project}.`,link:'/dashboard'});
  if(event==='report_returned'&&assignment) notifications.push({...common,recipientEmail:assignment.managerEmail,title:'Report returned for update',message:context.comment||`The report for ${assignment.project} needs changes.`,link:'/dashboard'});
  if(event==='report_accepted'&&assignment) notifications.push({...common,recipientEmail:assignment.managerEmail,title:'Report accepted',message:`The Coordinator accepted your report for ${assignment.project}.`,link:'/dashboard'});
  if(event==='consolidated_submitted') notifications.push({...common,recipientEmail:'director@hrox.demo',title:'Consolidated report ready',message:`${context.selectedCount||0} selected report(s) are ready for executive review.`,link:'/executive-report'});

  await Promise.all(notifications.map(createNotification));
}

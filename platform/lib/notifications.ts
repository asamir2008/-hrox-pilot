import {isSupabaseConfigured,supabase} from './supabase/client';

export type NotificationInput={
  recipientEmail:string;
  title:string;
  message:string;
  type:'request'|'plan'|'assignment'|'report'|'system';
  entityId?:string;
};

const DEMO_KEY='hrox-notifications';

export async function sendNotification(input:NotificationInput){
  if(!isSupabaseConfigured){
    const current=JSON.parse(localStorage.getItem(DEMO_KEY)||'[]');
    current.unshift({id:crypto.randomUUID(),...input,read:false,createdAt:new Date().toISOString()});
    localStorage.setItem(DEMO_KEY,JSON.stringify(current));
    return;
  }
  const {error}=await supabase.from('notifications').insert({
    recipient_email:input.recipientEmail,
    title:input.title,
    message:input.message,
    type:input.type,
    entity_id:input.entityId||null
  });
  if(error)throw error;
}

export async function loadNotifications(email:string){
  if(!isSupabaseConfigured){
    return JSON.parse(localStorage.getItem(DEMO_KEY)||'[]').filter((n:{recipientEmail:string})=>n.recipientEmail===email);
  }
  const {data,error}=await supabase.from('notifications').select('*').eq('recipient_email',email).order('created_at',{ascending:false});
  if(error)throw error;
  return data||[];
}

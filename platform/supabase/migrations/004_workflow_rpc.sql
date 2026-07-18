create or replace function public.save_demo_workflow(payload jsonb)
returns uuid
language plpgsql
security invoker
set search_path=public
as $$
declare
  plan_id uuid;
  item jsonb;
begin
  select id into plan_id from rotation_plans order by created_at desc limit 1;

  if plan_id is null then
    insert into rotation_plans(title,period,status,director_comment)
    values(payload->>'requestTitle',payload->>'requestPeriod',payload->>'stage',payload->>'directorComment')
    returning id into plan_id;
  else
    update rotation_plans set
      title=payload->>'requestTitle',
      period=payload->>'requestPeriod',
      status=payload->>'stage',
      director_comment=payload->>'directorComment',
      updated_at=now()
    where id=plan_id;
  end if;

  delete from rotation_assignments where plan_id=save_demo_workflow.plan_id;

  for item in select * from jsonb_array_elements(coalesce(payload->'assignments','[]'::jsonb))
  loop
    insert into rotation_assignments(
      plan_id,reference_no,project_name,manager_email,manager_name,start_date,end_date,status
    ) values(
      plan_id,
      item->>'id',
      item->>'project',
      item->>'managerEmail',
      item->>'managerName',
      nullif(item->>'startDate','')::date,
      nullif(item->>'endDate','')::date,
      item->>'status'
    );
  end loop;

  insert into audit_log(action,entity_type,entity_id,details)
  values('workflow_saved','rotation_plan',plan_id,payload);

  return plan_id;
end;
$$;

grant execute on function public.save_demo_workflow(jsonb) to authenticated;

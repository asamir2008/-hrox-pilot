insert into projects(code,name,active) values
('PRJ-001','Mataf Expansion',true),
('PRJ-002','Shamiyah Development',true),
('PRJ-003','Makkah Gate',true),
('PRJ-004','Central Utility',true),
('PRJ-005','Haram Security',true),
('PRJ-006','North Plaza',true)
on conflict (code) do update set name=excluded.name,active=excluded.active;

-- Create authentication users from Supabase Dashboard first, then update their profiles:
-- update profiles set full_name='Ahmed Al Harbi',role='director',title='Senior HR Director' where email='director@hrox.demo';
-- update profiles set full_name='Mona Hassan',role='coordinator',title='HR Operations Coordinator' where email='coordinator@hrox.demo';
-- update profiles set full_name='Omar Khaled',role='manager',title='Assigned HR Director' where email='manager1@hrox.demo';
-- update profiles set full_name='Sara Nabil',role='manager',title='Assigned HR Director' where email='manager2@hrox.demo';
-- update profiles set full_name='System Admin',role='admin',title='System Administrator' where email='admin@hrox.demo';

insert into rotation_plans(title,period,status,director_comment)
select 'Q3 2026 HR Rotation Plan','Q3 2026','request',''
where not exists(select 1 from rotation_plans);

export type DirectoryUser={id:string;name:string;email:string;employeeNo:string;role:'director'|'coordinator'|'manager'|'admin';title:string;department:string;active:boolean};
export type Project={id:string;code:string;name:string;location:string;active:boolean};

export const demoDirectory:DirectoryUser[]=[
{id:'U-001',name:'Ahmed Al Harbi',email:'director@hrox.demo',employeeNo:'HR-1001',role:'director',title:'Senior HR Director',department:'HR',active:true},
{id:'U-002',name:'Mona Hassan',email:'coordinator@hrox.demo',employeeNo:'HR-1024',role:'coordinator',title:'HR Operations Coordinator',department:'HR Operations',active:true},
{id:'U-003',name:'Omar Khaled',email:'manager1@hrox.demo',employeeNo:'HR-1107',role:'manager',title:'Assigned HR Director',department:'Project HR',active:true},
{id:'U-004',name:'Sara Nabil',email:'manager2@hrox.demo',employeeNo:'HR-1112',role:'manager',title:'Assigned HR Director',department:'Project HR',active:true},
{id:'U-005',name:'System Admin',email:'admin@hrox.demo',employeeNo:'IT-9001',role:'admin',title:'System Administrator',department:'IT',active:true}
];

export const demoProjects:Project[]=[
{id:'P-001',code:'MAT',name:'Mataf Expansion',location:'Makkah',active:true},
{id:'P-002',code:'SHM',name:'Shamiyah Development',location:'Makkah',active:true},
{id:'P-003',code:'MKG',name:'Makkah Gate',location:'Makkah',active:true},
{id:'P-004',code:'CUT',name:'Central Utility',location:'Makkah',active:true},
{id:'P-005',code:'HRS',name:'Haram Security',location:'Makkah',active:true},
{id:'P-006',code:'NPL',name:'North Plaza',location:'Makkah',active:true}
];

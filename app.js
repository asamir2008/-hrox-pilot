const roles={director:'Senior HR Director',coordinator:'HR Operations Coordinator',visitor:'Assigned HR Director',project:'Project HR Team'};
const projects=['Mataf Expansion','Shamiyah Development','Makkah Gate','Central Utility','Haram Security','North Plaza','South Service','Transport Hub','Admin Complex'];
const people=['Ahmed Hassan','Omar Khaled','Mona Ali','Yousef Adel','Sara Nabil','Khaled Emad'];
let role=localStorage.hroxRole||'director';
let state=JSON.parse(localStorage.hroxFlow||'null')||{stage:0,submitted:false,approved:false,readNotes:0,rows:projects.map((project,i)=>({project,priority
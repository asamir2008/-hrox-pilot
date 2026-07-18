export type UserRole = 'director' | 'coordinator' | 'manager' | 'admin';

export type DemoUser = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  title: string;
};

export const demoUsers: DemoUser[] = [
  { name: 'Ahmed Al Harbi', email: 'director@hrox.demo', password: 'Hrox2026!', role: 'director', title: 'Senior HR Director' },
  { name: 'Mona Hassan', email: 'coordinator@hrox.demo', password: 'Hrox2026!', role: 'coordinator', title: 'HR Operations Coordinator' },
  { name: 'Omar Khaled', email: 'manager1@hrox.demo', password: 'Hrox2026!', role: 'manager', title: 'Assigned HR Director' },
  { name: 'Sara Nabil', email: 'manager2@hrox.demo', password: 'Hrox2026!', role: 'manager', title: 'Assigned HR Director' },
  { name: 'System Admin', email: 'admin@hrox.demo', password: 'Hrox2026!', role: 'admin', title: 'System Administrator' }
];

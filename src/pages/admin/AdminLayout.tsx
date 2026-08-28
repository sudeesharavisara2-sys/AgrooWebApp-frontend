import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/prices', label: 'Prices' },
  { to: '/admin/alerts', label: 'Alerts' },
  { to: '/admin/logs', label: 'Activity Logs' },
];

const AdminLayout: React.FC = () => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-[200px_1fr]">
    <aside className="card h-fit space-y-1">
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          className={({ isActive }) =>
            `block rounded-lg px-3 py-2 text-sm font-medium ${
              isActive ? 'bg-agroo-600 text-white' : 'text-gray-600 hover:bg-agroo-50'
            }`
          }
        >
          {l.label}
        </NavLink>
      ))}
    </aside>
    <div>
      <Outlet />
    </div>
  </div>
);

export default AdminLayout;

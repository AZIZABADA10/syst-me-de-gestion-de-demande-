import React from 'react';
import { LayoutDashboard, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    {
      icon: <LayoutDashboard />,
      label: 'Tableau de Bord',
      path: '/dashboard'
    },
    {
      icon: <ClipboardList />,
      label: 'Les nouvelles Demandes',
      path: '/nouvelle-demande'
    }
  ];

  return (
    <div className="bg-white border-end h-100" style={{
      minHeight: '100vh',
      boxShadow: '4px 0 15px rgba(0, 0, 0, 0.03)'
    }}>
      {/* En-tête avec padding augmenté */}
      <div className="text-center pt-4 pb-3 px-3 mb-4">
        <div className="position-relative">
          <h2 className="mb-3 fs-5 fw-semibold text-primary">
            Système de Demandes de matériel
          </h2>
          <div className="mx-auto separator-line bg-primary opacity-25" style={{
            width: '60%',
            height: '2px',
            borderRadius: '2px'
          }} />
        </div>
      </div>

      {/* Navigation avec espacement et styles interactifs */}
      <nav className="nav flex-column px-3" style={{ paddingTop: '1rem' }}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link d-flex align-items-center py-2 px-3 rounded-2 mb-2
              transition-all duration-300
              ${window.location.pathname === item.path
                ? 'active bg-primary-light border-start border-3 border-primary'
                : 'text-muted hover-bg-light'}
            `}
            style={{
              minHeight: '45px',
              transition: 'all 0.3s ease',
            }}
          >
            {React.cloneElement(item.icon, {
              className: `me-3 ${window.location.pathname === item.path ? 'text-primary' : 'text-muted'}`,
              size: 21,
              strokeWidth: window.location.pathname === item.path ? 2.3 : 2
            })}
            <span className={`fw-medium ${window.location.pathname === item.path ? 'text-primary' : 'text-dark'}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      <style jsx>{`
        .nav-link {
          position: relative;
          overflow: hidden;
        }
        
        .nav-link::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 0;
          background-color: rgba(13, 110, 253, 0.1);
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::before {
          width: 100%;
        }
        
        .nav-link.active {
          background: rgba(13, 110, 253, 0.05) !important;
        }
        
        .nav-link:active {
          transform: scale(0.97);
        }
        
        .separator-line {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import TopHeader from '../TopHeader';
import apiService from '../services/apiService';
import { ClipboardList, CheckCircle, Clock, XCircle } from 'lucide-react';

const Dashboard = () => {
  const [requestStats, setRequestStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await apiService.getMaterialRequests();
        const data = response.data?.data || [];

        setRequests(data);
        setLoading(false);

        const stats = data.reduce((acc, request) => {
          acc.total++;
          switch (request.status) {
            case 'Approuvé': acc.approved++; break;
            case 'En attente': acc.pending++; break;
            case 'Rejeté': acc.rejected++; break;
            default: break;
          }
          return acc;
        }, { total: 0, approved: 0, pending: 0, rejected: 0 });

        setRequestStats(stats);
      } catch (error) {
        console.error('Erreur de chargement:', error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approuvé': return 'success';
      case 'Rejeté': return 'danger';
      case 'En attente': return 'warning';
      default: return 'secondary';
    }
  };

  const filteredRequests = requests.filter(request => filter === 'all' || request.status === filter);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="container-fluid p-0">
      <div className="row g-0">
        <div className={`col-lg-2 col-md-3 ${sidebarOpen ? 'd-block' : 'd-none d-md-block'}`}>
          <Sidebar />
        </div>
        
        <div className={`col-lg-10 col-md-9 ${sidebarOpen ? 'd-none' : ''}`}>
          <TopHeader onMenuClick={toggleSidebar} />
          
          <div className="container-fluid p-3 p-md-4">            
            <div className="row mb-4 g-3">
              {[ 
                { icon: <ClipboardList size={24} />, title: "Total", value: requestStats.total, color: "primary" },
                { icon: <CheckCircle size={24} />, title: "Approuvées", value: requestStats.approved, color: "success" },
                { icon: <Clock size={24} />, title: "En Attente", value: requestStats.pending, color: "warning" },
                { icon: <XCircle size={24} />, title: "Rejetées", value: requestStats.rejected, color: "danger" }
              ].map((stat, index) => (
                <div className="col-6 col-md-3" key={index}>
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body d-flex align-items-center">
                      <div className={`me-3 text-${stat.color}`}>{stat.icon}</div>
                      <div>
                        <h6 className="card-title mb-1">{stat.title}</h6>
                        <h4 className="card-text fw-bold">{stat.value}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card shadow-sm">
              <div className="card-header bg-white d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                <h5 className="card-title mb-2 mb-md-0">Historique Des Demandes</h5>
                <div className="btn-group" role="group">
                  {['all', 'Approuvé', 'En attente', 'Rejeté'].map((status) => (
                    <button 
                      key={status} 
                      className={`btn btn-sm ${filter === status ? `btn-${getStatusColor(status)}` : `btn-outline-${getStatusColor(status)}`}`}
                      onClick={() => setFilter(status)}
                    >
                      {status === 'all' ? 'Toutes' : status}
                    </button>
                  ))}
                </div>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Chargement...</span>
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Matériel</th>
                          <th>Quantité</th>
                          <th className="d-none d-md-table-cell">Justification</th>
                          <th>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRequests.map((request) => (
                          <tr key={request.id}>
                            <td>{new Date(request.created_at).toLocaleDateString()}</td>
                            <td>{request.material_name}</td>
                            <td>{request.quantity}</td>
                            <td className="d-none d-md-table-cell">{request.justification}</td>
                            <td>
                              <span className={`badge bg-${getStatusColor(request.status)}`}>
                                {request.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredRequests.length === 0 && (
                      <div className="text-center text-muted py-4">Aucune demande trouvée</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

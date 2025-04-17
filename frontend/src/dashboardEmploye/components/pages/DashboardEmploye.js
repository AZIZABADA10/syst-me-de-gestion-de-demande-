import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../Sidebar';
import TopHeader from '../TopHeader';
import apiService from '../services/apiService';
import { ClipboardList, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Badge } from 'react-bootstrap';

const Dashboard = () => {
  const [requestStats, setRequestStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'accept' ou 'reject'
  const [justification, setJustification] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

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
            case 'accepted': acc.approved++; break;
            case 'pending': acc.pending++; break;
            case 'rejected': acc.rejected++; break;
            default: break;
          }
          return acc;
        }, { total: 0, approved: 0, pending: 0, rejected: 0 });

        setRequestStats(stats);
      } catch (error) {
        console.error('Erreur de chargement:', error);
        setError(error.response?.data?.message || 'Erreur de chargement des demandes');
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const updateRequestStatus = async (id, status, extraData = {}) => {
    const originalRequests = [...requests];
    
    // Update optimiste
    setRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status, ...extraData } : req)
    );
    
    try {
      await apiService.updateMaterialRequest(id, { status, ...extraData });
      // Mise à jour des statistiques
      const newStats = { ...requestStats };
      const request = requests.find(r => r.id === id);
      if (request) {
        switch (request.status) {
          case 'accepted': newStats.approved--; break;
          case 'pending': newStats.pending--; break;
          case 'rejected': newStats.rejected--; break;
          default: break;
        }
        switch (status) {
          case 'accepted': newStats.approved++; break;
          case 'pending': newStats.pending++; break;
          case 'rejected': newStats.rejected++; break;
          default: break;
        }
        setRequestStats(newStats);
      }
    } catch (error) {
      console.error('Erreur de mise à jour:', error);
      setRequests(originalRequests);
      setError(error.response?.data?.message || 'Échec de la mise à jour');
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'accepted': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      case 'pending': return 'En attente';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'success';
      case 'rejected': return 'danger';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  const handleOpenModal = (id, mode) => {
    setSelectedRequestId(id);
    setModalMode(mode);
    setShowModal(true);
  };

  const handleSubmitModal = async () => {
    if (modalMode === 'accept') {
      await updateRequestStatus(selectedRequestId, "accepted", {
        delivery_date: deliveryDate
      });
    } else {
      await updateRequestStatus(selectedRequestId, "rejected", {
        rejection_reason: justification
      });
    }
    setShowModal(false);
    setDeliveryDate('');
    setJustification('');
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(request => 
      filter === 'all' || 
      (filter === 'accepted' && request.status === 'accepted') ||
      (filter === 'rejected' && request.status === 'rejected') ||
      (filter === 'pending' && request.status === 'pending')
    );
  }, [requests, filter]);

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
                  {['all', 'accepted', 'pending', 'rejected'].map((status) => (
                    <button 
                      key={status} 
                      className={`btn btn-sm ${filter === status ? `btn-${getStatusColor(status)}` : `btn-outline-${getStatusColor(status)}`}`}
                      onClick={() => setFilter(status)}
                    >
                      {status === 'all' ? 'Toutes' : getStatusDisplay(status)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                
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
                          <th>ID</th>
                          <th>Matériel</th>
                          <th>Quantité</th>
                          <th>Date</th>
                          <th>Statut</th>
                          <th>Date de Livraison</th>
                          <th>Motif de Rejet</th>
                          <th className="d-none d-md-table-cell">Justification</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRequests.map((request) => (
                          <tr key={request.id}>
                            <td>{request.id}</td>
                            <td>{request.material_name}</td>
                            <td>{request.quantity}</td>
                            <td>{new Date(request.created_at).toLocaleDateString()}</td>
                            <td>
                              <Badge bg={getStatusColor(request.status)}>
                                {getStatusDisplay(request.status)}
                              </Badge>
                            </td>
                            <td>
                              {request.status === 'accepted' && request.delivery_date ? (
                                new Date(request.delivery_date).toLocaleDateString()
                              ) : (
                                "-"
                              )}
                            </td>
                            <td>
                              {request.status === 'rejected' && request.rejection_reason ? (
                                request.rejection_reason
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="d-none d-md-table-cell">{request.justification || "-"}</td>
                            <td>
                              {request.status === 'pending' ? (
                                <>
                                  <button
                                    className="btn btn-sm btn-outline-success me-2"
                                    onClick={() => handleOpenModal(request.id, 'accept')}
                                  >
                                    Approuver
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleOpenModal(request.id, 'reject')}
                                  >
                                    Rejeter
                                  </button>
                                </>
                              ) : (
                                <span className="text-muted">Action effectuée</span>
                              )}
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

      {/* Modal de confirmation */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalMode === 'accept' ? 'Approuver la demande' : 'Rejeter la demande'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {modalMode === 'accept' ? (
                  <>
                    <label className="form-label">Date de livraison</label>
                    <input
                      type="date"
                      className="form-control"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <label className="form-label">Justification du refus</label>
                    <textarea
                      className="form-control"
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                    ></textarea>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Annuler
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSubmitModal}>
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import Sidebar from '../Sidebar';
import TopHeader from '../TopHeader';

const MaterialListe = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await apiService.getMaterialRequests();
        setRequests(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des demandes");
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="container-fluid p-0">
      <div className="row g-0">
        <div className={`col-lg-2 col-md-3 ${sidebarOpen ? 'd-block' : 'd-none d-md-block'}`}>
          <Sidebar />
        </div>
        
        <div className="col-lg-10 col-md-9">
          <TopHeader onMenuClick={toggleSidebar} />
          
          <div className="container-fluid p-3 p-md-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0">Nouvelle Demandes</h5>
              </div>
              <div className="card-body">
                {loading && <p>Chargement...</p>}
                {error && <div className="alert alert-danger">{error}</div>}
                {!loading && !error && (
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Demandeur</th>
                        <th>Date de Demande</th>
                        <th>Situation</th>
                        <th>Justification</th>
                        <th>Date de Livraison</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((request) => (
                        <tr key={request.id}>
                          <td>{request.user.name}</td>
                          <td>{new Date(request.created_at).toLocaleDateString()}</td>
                          <td>{request.status}</td>
                          <td>{request.justification}</td>
                          <td>{request.delivery_date ? new Date(request.delivery_date).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialListe;
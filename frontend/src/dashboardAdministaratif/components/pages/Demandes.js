

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import PropTypes from "prop-types";
import Sidebar from "../Sidebar";
import TopHeader from "../TopHeader";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../axios-client";
import { Badge } from "react-bootstrap";

const useDemandes = () => {
  const [state, setState] = useState({
    demandes: [],
    loading: true,
    error: null
  });

  const fetchDemandes = useCallback(async (signal) => {
    try {
      const response = await axiosClient.get('/demandes');
      console.log(response.data.data);
      
      setState(prev => ({
        ...prev,
        demandes: response.data.data,
        loading: false,
        error: null
      }));
    } catch (err) {
      if (!signal?.aborted) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: err.response?.data?.message || "Erreur de chargement des demandes"
        }));
      }
    }
  }, []);

  const updateDemandeStatus = useCallback(async (id, status) => {
    const originalDemandes = state.demandes;
    
    // Optimistic update
    setState(prev => ({
      ...prev,
      demandes: prev.demandes.map(d => 
        d.id === id ? {...d, status} : d
      )
    }));

    try {
      await axiosClient.put(`/demandes/${id}`, {status});
      return true;
    } catch (err) {
      // Rollback on error
      setState(prev => ({
        ...prev,
        demandes: originalDemandes,
        error: err.response?.data?.message || "Échec de la mise à jour"
      }));
      return false;
    }
  }, [state.demandes]);

  return {
    demandes: state.demandes,
    loading: state.loading,
    error: state.error,
    fetchDemandes,
    updateDemandeStatus
  };
};

const TableRow = memo(({ demande, onAccept, onReject, onDetails }) => (
  <tr>
    <td>{demande.id}</td>
    <td>{demande.material}</td>
    <td>{demande.quantity}</td>
    <td>
      {new Date(demande.created_at).toLocaleDateString()}
    </td>
    <td>
      <Badge>{demande.status}</Badge>
    </td>
    <td>
      {demande.status === 'pending' ? (
        <>
          <button
            className="btn btn-sm btn-outline-success me-2"
            onClick={() => onAccept(demande.id)}
            aria-label={`Accepter la demande ${demande.id}`}
          >
            Accepter
          </button>
          <button
            className="btn btn-sm btn-outline-danger me-2"
            onClick={() => onReject(demande.id)}
            aria-label={`Refuser la demande ${demande.id}`}
          >
            Refuser
          </button>
        </>
      ) : demande.status === 'accepted' ? (
        <button
          className="btn btn-sm btn-outline-danger me-2"
          onClick={() => onReject(demande.id)}
          aria-label={`Refuser la demande ${demande.id}`}
        >
          Refuser
        </button>
      ) : demande.status === 'rejected' ? (
        <button
          className="btn btn-sm btn-outline-success me-2"
          onClick={() => onAccept(demande.id)}
          aria-label={`Accepter la demande ${demande.id}`}
        >
          Accepter
        </button>
      ) : null}
    </td>
  </tr>
));

TableRow.propTypes = {
  demande: PropTypes.shape({
    id: PropTypes.number.isRequired,
    material_name: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    created_at: PropTypes.string.isRequired
  }).isRequired,
  onAccept: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onDetails: PropTypes.func.isRequired
};

const Demandes = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { demandes, loading, error, fetchDemandes, updateDemandeStatus } = useDemandes();

  useEffect(() => {
    const controller = new AbortController();
    fetchDemandes(controller.signal);
    return () => controller.abort();
  }, [fetchDemandes]);

  const handleAccept = useCallback(async (id) => {
    if (window.confirm("Confirmer l'acceptation de cette demande ?")) {
      await updateDemandeStatus(id, "accepted");
    }
  }, [updateDemandeStatus]);

  const handleReject = useCallback(async (id) => {
    if (window.confirm("Confirmer le refus de cette demande ?")) {
      await updateDemandeStatus(id, "rejected");
    }
  }, [updateDemandeStatus]);

  const handleDetails = useCallback(
    (id) => navigate(`/demandes/${id}`),
    [navigate]
  );

  const toggleSidebar = useCallback(
    () => setSidebarOpen(prev => !prev),
    []
  );

  const memoizedDemandes = useMemo(
    () => demandes,
    [demandes]
  );

  return (
    <div className="container-fluid p-0">
      <div className="row g-0">
        <div className={`col-lg-2 col-md-3 ${
          sidebarOpen ? "d-block" : "d-none d-md-block"
        }`}>
          <Sidebar />
        </div>

        <div className={`col-lg-10 col-md-9 ${sidebarOpen ? "d-none" : ""}`}>
          <TopHeader onMenuClick={toggleSidebar} />
          
          <div className="container-fluid p-3 p-md-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0">Gestion des Demandes</h5>
              </div>
              
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Chargement...</span>
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          {["ID", "Matériel", "Quantité", "Date", "Actions"].map(
                            (header) => (
                              <th key={header}>{header}</th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {memoizedDemandes.map((demande) => (
                          <TableRow
                            key={demande.id}
                            demande={demande}
                            onAccept={handleAccept}
                            onReject={handleReject}
                            onDetails={handleDetails}
                          />
                        ))}
                      </tbody>
                    </table>
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

export default Demandes;
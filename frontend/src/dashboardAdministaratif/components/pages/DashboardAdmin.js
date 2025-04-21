import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import TopHeader from "../TopHeader";
import apiService from "../../services/apiService";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  Archive,
} from "lucide-react";

const STATUS_LIST = ["all", "Approuvé", "En attente", "Rejeté"];

const Dashboard = () => {
  const [requestStats, setRequestStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    employees: 0,
    validators: 0,
    totalStock: 0,
    stockDetails: [],
  });

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requestsData, statisticsData] = await Promise.all([
          apiService.getMaterialRequests(),
          apiService.getStatistics(),
        ]);

        setRequests(requestsData);
        setStats(statisticsData);
        setLoading(false);

        const requestStatistics = requestsData.reduce(
          (acc, request) => {
            acc.total++;
            switch (request.status) {
              case "Approuvé":
                acc.approved++;
                break;
              case "En attente":
                acc.pending++;
                break;
              case "Rejeté":
                acc.rejected++;
                break;
              default:
                break;
            }
            return acc;
          },
          { total: 0, approved: 0, pending: 0, rejected: 0 }
        );

        setRequestStats(requestStatistics);
      } catch (error) {
        console.error("Erreur de chargement:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approuvé":
        return "success";
      case "Rejeté":
        return "danger";
      case "En attente":
        return "warning";
      default:
        return "secondary";
    }
  };

  const filteredRequests = requests.filter(
    (request) => filter === "all" || request.status === filter
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="container-fluid p-0">
      <div className="row g-0">
        <div
          className={`col-lg-2 col-md-3 ${
            sidebarOpen ? "d-block" : "d-none d-md-block"
          }`}
        >
          <Sidebar />
        </div>

        <div className="col-lg-10 col-md-9">
          <TopHeader onMenuClick={toggleSidebar} />

          <div className="container-fluid p-3 p-md-4">
            {/* Statistiques */}
            <div className="row mb-4 g-3">
              {[
                {
                  icon: <ClipboardList size={24} />,
                  title: "Total Demandes",
                  value: requestStats.total,
                  color: "primary",
                },
                {
                  icon: <CheckCircle size={24} />,
                  title: "Approuvées",
                  value: requestStats.approved,
                  color: "success",
                },
                {
                  icon: <Clock size={24} />,
                  title: "En Attente",
                  value: requestStats.pending,
                  color: "warning",
                },
                {
                  icon: <XCircle size={24} />,
                  title: "Rejetées",
                  value: requestStats.rejected,
                  color: "danger",
                },
                {
                  icon: <Users size={24} />,
                  title: "Employés",
                  value: stats.employees,
                  color: "info",
                },
                {
                  icon: <Users size={24} />,
                  title: "Validateurs",
                  value: stats.validators,
                  color: "dark",
                },
                {
                  icon: <Archive size={24} />,
                  title: "Total Matériel Stock",
                  value: stats.totalStock,
                  color: "secondary",
                },
              ].map((stat, index) => (
                <div className="col-6 col-md-3" key={index}>
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body d-flex align-items-center">
                      <div className={`me-3 text-${stat.color}`}>
                        {stat.icon}
                      </div>
                      <div>
                        <h6 className="card-title mb-1">{stat.title}</h6>
                        <h4 className="card-text fw-bold">{stat.value}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tableau des demandes */}
            <div className="card shadow-sm">
              <div className="card-header bg-white d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                <h5 className="card-title mb-2 mb-md-0">Suivi Toutes les Demandes</h5>
                <div className="btn-group" role="group">
                  {STATUS_LIST.map((status) => (
                    <button
                      key={status}
                      className={`btn btn-sm ${
                        filter === status
                          ? `btn-${getStatusColor(status)}`
                          : `btn-outline-${getStatusColor(status)}`
                      }`}
                      onClick={() => setFilter(status)}
                    >
                      {status === "all" ? "Toutes" : status}
                    </button>
                  ))}
                </div>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center py-4">
                    <div
                      className="spinner-border text-primary"
                      role="status"
                      aria-label="Chargement en cours"
                    >
                      <span className="visually-hidden">Chargement...</span>
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Demandeur</th>
                          <th>Matériel</th>
                          <th>Quantité</th>
                          <th>Date</th>
                          <th>Statut</th>
                          <th>Date de Livraison</th>
                          <th>Motif de Rejet</th>
                          <th className="d-none d-md-table-cell">Justification</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRequests.length > 0 ? (
                          filteredRequests.map((request) => (
                            <tr key={request.id}>
                              <td>{request.id}</td>
                              <td>{request.requester_name || "-"}</td>
                              <td>{request.material_name || "-"}</td>
                              <td>{request.quantity || "-"}</td>
                              <td>
                                {request.created_at
                                  ? new Date(request.created_at).toLocaleDateString()
                                  : "-"}
                              </td>
                              <td>
                                <span className={`badge bg-${getStatusColor(request.status)}`}>
                                  {request.status || "Inconnu"}
                                </span>
                              </td>
                              <td>
                                {request.delivery_date
                                  ? new Date(request.delivery_date).toLocaleDateString()
                                  : "-"}
                              </td>
                              <td>{request.rejection_reason || "-"}</td>
                              <td className="d-none d-md-table-cell">
                                {request.justification || "-"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="9" className="text-center">
                              Aucune demande trouvée.
                            </td>
                          </tr>
                        )}
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

export default Dashboard;

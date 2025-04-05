import React, { useState, useEffect } from "react";
// import apiService from "../../services/apiService";
import Sidebar from "../Sidebar";
import TopHeader from "../TopHeader";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../axios-client";

const Stocks = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stockForm, setStockForm] = useState({
    name: "",
    quantity: 0,
    description: "",
  });

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axiosClient.get("/stocks");
        setStocks(response.data.data);
      } catch (err) {
        setError("Erreur de chargement du stock");
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  const validateStockForm = () => {
    return stockForm.name.trim() && stockForm.quantity > 0;
  };

  const handleAddStock = async () => {
    try {
      const response = await axiosClient.post('/stocks',stockForm);
      setStocks([...stocks, response.data.data]);
      setShowModal(false);
      setError(null);
      setStockForm({ name: "", quantity: 0, description: "" });
    } catch (err) {
      setError("Erreur lors de l'ajout de l'article");
      console.error("Erreur:", err);
    }
  };

  const handleUpdateStock = async () => {
    if (!selectedStock) return;

    setLoading(true);
    
    try {
      const response = await axiosClient.put(
        `/stocks/${selectedStock.id}`,
        stockForm
      );
      
    console.log(response.data.data);
      setStocks(
        stocks.map((stock) =>
          stock.id === selectedStock.id ? response.data.data : stock
        )
      );
      setShowModal(false);
      setSelectedStock(null);
      setStockForm({ name: "", quantity: 0, description: "" });
      setError(null);
    } catch (error) {
      setError("Erreur de mise à jour");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStock = (stock) => {
    setSelectedStock(stock);
    setStockForm({
      name: stock.name,
      quantity: stock.quantity,
      description: stock.description,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Confirmer la suppression ?")) {
      try {
        await axiosClient.delete(`/stocks/${id}`);
        setStocks(stocks.filter((s) => s.id !== id));
        setError(null);
      } catch (err) {
        setError("Erreur lors de la suppression");
        console.error("Erreur:", err);
      }
    }
  };

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

        <div className={`col-lg-10 col-md-9 ${sidebarOpen ? "d-none" : ""}`}>
          <TopHeader onMenuClick={toggleSidebar} />

          <div className="container-fluid p-3 p-md-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Gestion du Stock</h5>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowModal(true)}
                >
                  + Ajouter un Materiel
                </button>
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
                          <th>ID</th>
                          <th>Nom</th>
                          <th>Quantité</th>
                          <th>Description</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stocks.map((stock) => (
                          <tr key={stock.id}>
                            <td>{stock.id}</td>
                            <td>{stock.name}</td>
                            <td>{stock.quantity}</td>
                            <td>{stock.description}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => handleEditStock(stock)}
                              >
                                Éditer
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(stock.id)}
                              >
                                Supprimer
                              </button>
                            </td>
                          </tr>
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

      {/* Modal d'ajout */}
      <div
        className={`modal ${showModal ? "d-block" : ""}`}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Ajouter un Material au Stock</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Nom</label>
                  <input
                    type="text"
                    className="form-control"
                    value={stockForm.name}
                    onChange={(e) =>
                      setStockForm({ ...stockForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Quantité</label>
                  <input
                    type="number"
                    className="form-control"
                    value={stockForm.quantity}
                    onChange={(e) =>
                      setStockForm({
                        ...stockForm,
                        quantity: parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={stockForm.description}
                    onChange={(e) =>
                      setStockForm({
                        ...stockForm,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={ 
                  selectedStock ? handleUpdateStock : handleAddStock
                }
                disabled={!validateStockForm()}
              >
                {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : selectedStock ? (
                    "Mettre à jour"
                  ) : (
                    "Ajouter"
                  )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stocks;

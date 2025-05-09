// AuthPage.jsx
import axiosClient from "./axios-client";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "./ContextProvider";

export default function AuthPage() {
  const navigate = useNavigate();
  const { setUser, setToken } = useStateContext();

  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const loginEmailRef = useRef();
  const loginPasswordRef = useRef();
  const loginRoleRef = useRef();

  const registerNameRef = useRef();
  const registerEmailRef = useRef();
  const registerEmailConfirmRef = useRef();
  const registerPasswordRef = useRef();
  const registerPasswordConfirmRef = useRef();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload = {
      email: loginEmailRef.current.value,
      password: loginPasswordRef.current.value,
      role: loginRoleRef.current.value,
    };

    try {
      await axiosClient.get("/sanctum/csrf-cookie");
      const { data } = await axiosClient.post("/login", payload);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);

      switch (payload.role) {
        case "admin":
          navigate("/dashboard-administaratif");
          break;
        case "validateur":
          navigate("/dashboard-validateur");
          break;
        case "employe":
          navigate("/dashboard-employe");
          break;
        default:
          navigate("/login");
      }
    } catch (err) {
      const res = err.response;
      if (res?.status === 401) {
        setMessage("Email ou mot de passe incorrect");
      } else {
        setMessage("Erreur de connexion");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (registerEmailRef.current.value !== registerEmailConfirmRef.current.value) {
      setMessage("Les emails ne correspondent pas.");
      setLoading(false);
      return;
    }

    if (registerPasswordRef.current.value !== registerPasswordConfirmRef.current.value) {
      setMessage("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    const payload = {
      name: registerNameRef.current.value,
      email: registerEmailRef.current.value,
      password: registerPasswordRef.current.value,
      password_confirmation: registerPasswordConfirmRef.current.value,
    };

    try {
      await axiosClient.get("/sanctum/csrf-cookie");
      const { data } = await axiosClient.post("/register", payload);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      navigate("/login");
    } catch (err) {
      const res = err.response;
      if (res?.status === 422) {
        setMessage(res.data.message || "Erreur de validation");
      } else {
        setMessage("Une erreur s'est produite");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light p-2 p-sm-3 p-md-4">
      <div className="row shadow rounded-4 overflow-hidden mx-auto" style={{ maxWidth: "1000px", width: "100%" }}>
        <div className="col-12 col-md-6 p-0">
          <img src="./Images/login3.jpg" alt="Login Visual" className="img-fluid w-100 d-md-none" style={{ maxHeight: "200px", objectFit: "cover" }} />
          <img src="./Images/loginPic.jpg" alt="Login Visual" className="img-fluid h-100 w-100 d-none d-md-block" style={{ objectFit: "cover" }} />
        </div>
        <div className="col-12 col-md-6 bg-white p-3 p-sm-4 p-lg-5">
          <h2 className="text-center mb-3 mb-md-4 text-primary fw-bold fs-3 fs-md-2">
            {isLogin ? "Connexion" : "Créer un compte"}
          </h2>

          {message && <div className="alert alert-danger text-center py-2">{message}</div>}

          {isLogin ? (
            <form onSubmit={handleLogin} className="px-0 px-sm-2">
              <div className="mb-3">
                <label className="form-label">Email</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
                  <input type="email" ref={loginEmailRef} className="form-control" required placeholder="Votre email" />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Mot de passe</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                  <input type="password" ref={loginPasswordRef} className="form-control" required placeholder="Votre mot de passe" />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Rôle</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-person-badge-fill"></i></span>
                  <select ref={loginRoleRef} className="form-select" required>
                    <option value="">Choisir un rôle</option>
                    <option value="admin">Admin</option>
                    <option value="validateur">Validateur</option>
                    <option value="employe">Employé</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 mt-2" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </button>

              <p className="text-center mt-3 small">
                Pas de compte ? <span className="text-primary fw-bold" role="button" onClick={toggleForm}>Créer un compte</span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="px-0 px-sm-2">
              <div className="mb-2 mb-md-3">
                <label className="form-label">Nom</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
                  <input type="text" ref={registerNameRef} className="form-control" required placeholder="Votre nom" />
                </div>
              </div>

              <div className="mb-2 mb-md-3">
                <label className="form-label">Email</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
                  <input type="email" ref={registerEmailRef} className="form-control" required placeholder="Votre email" />
                </div>
              </div>

              <div className="mb-2 mb-md-3">
                <label className="form-label">Confirmer Email</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-envelope-check-fill"></i></span>
                  <input type="email" ref={registerEmailConfirmRef} className="form-control" required placeholder="Confirmez votre email" />
                </div>
              </div>

              <div className="mb-2 mb-md-3">
                <label className="form-label">Mot de passe</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                  <input type="password" ref={registerPasswordRef} className="form-control" required minLength={6} placeholder="Minimum 6 caractères" />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Confirmer mot de passe</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                  <input type="password" ref={registerPasswordConfirmRef} className="form-control" required minLength={6} placeholder="Confirmez votre mot de passe" />
                </div>
              </div>

              <button type="submit" className="btn btn-success w-100 py-2 mt-2" disabled={loading}>
                {loading ? "Création..." : "Créer un compte"}
              </button>

              <p className="text-center mt-3 small">
                Déjà un compte ? <span className="text-primary fw-bold" role="button" onClick={toggleForm}>Se connecter</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

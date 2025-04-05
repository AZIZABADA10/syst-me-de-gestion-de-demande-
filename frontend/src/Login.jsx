import axiosClient from "./axios-client";
import { useRef, useState } from "react";
import { useStateContext } from "./ContextProvider";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const { setUser, setToken } = useStateContext();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await axiosClient.get("/sanctum/csrf-cookie");
      const { data } = await axiosClient.post("/login", payload);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const response = err.response;
      if (response) {
        if (response.status === 422) {
          setMessage(response.data.message || "Validation error");
        } else if (response.status === 401) {
          setMessage("Email ou mot de passe incorrect");
        } else {
          setMessage("Une erreur s'est produite. Veuillez réessayer.");
        }
      } else {
        setMessage("Problème de connexion au serveur");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4 rounded-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4 fw-bold text-primary">Connexion</h2>

        {message && (
          <div className="alert alert-danger text-center">
            {message}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Adresse Email</label>
            <input
              ref={emailRef}
              type="email"
              className="form-control form-control-lg"
              placeholder="Entrez votre email"
              required
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Mot de passe</label>
            <input
              ref={passwordRef}
              type="password"
              className="form-control form-control-lg"
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-100"
            disabled={loading}
          >
            {loading ? (
              <div className="spinner-border spinner-border-sm" role="status" />
            ) : (
              "Se connecter"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

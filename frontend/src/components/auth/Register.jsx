import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser, clearError } from "../../store/slices/authSlice";

const ROLES = [
  "CITY_ADMINISTRATOR",
  "TRAFFIC_CONTROLLER",
  "UTILITY_SUPERVISOR",
  "FIELD_TECHNICIAN",
];

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    fullName: "",
    role: ROLES[0],
    district: "",
    badgeNumber: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        {error && <div className="error-alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reg-username">Username</label>
            <input
              id="reg-username"
              type="text"
              placeholder="Choose a username"
              required
              value={form.username}
              onChange={handleChange("username")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              placeholder="Choose a password"
              required
              value={form.password}
              onChange={handleChange("password")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reg-fullname">Full Name</label>
            <input
              id="reg-fullname"
              type="text"
              placeholder="Enter full name"
              required
              value={form.fullName}
              onChange={handleChange("fullName")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reg-role">Role</label>
            <select id="reg-role" value={form.role} onChange={handleChange("role")}>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="reg-district">District</label>
            <input
              id="reg-district"
              type="text"
              value={form.district}
              onChange={handleChange("district")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reg-badge">Badge Number</label>
            <input
              id="reg-badge"
              type="text"
              value={form.badgeNumber}
              onChange={handleChange("badgeNumber")}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../CONTEXT/Context";
import Loading from "../LOADING/Loading";

export default function AdminRoute({ children }) {
  const { user, role, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin" && role !== "superAdmin" ) {
    return <Navigate to="/" replace />;
  }

  

  return children;
}
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../CONTEXT/Context";
import Loading from "../LOADING/Loading";

export default function ProtectedRoute({ children }) {
  const { user , loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
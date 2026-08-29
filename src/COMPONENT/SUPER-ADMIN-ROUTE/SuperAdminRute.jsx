

import React, { useContext } from 'react'
import { AuthContext } from '../CONTEXT/Context'
import Loading from '../LOADING/Loading'
import { Navigate } from 'react-router-dom'

export default function SuperAdminRute({children }) {

    const { user, role, loading } = useContext(AuthContext)

    if (loading) {
        return <Loading/>
    }

    if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "superAdmin") {
    return <Navigate to="/" replace />;
  }

  return children
}

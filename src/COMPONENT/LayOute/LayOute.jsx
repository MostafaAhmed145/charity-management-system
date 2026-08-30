import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../NAV-BAR/NavBar'

export default function LayOute() {
  return (
    <>
      <NavBar />
      <div className="pt-16">
        <Outlet />
      </div>
    </>
  )
}

import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../NAV-BAR/NavBar'

export default function LayOute() {
  return <>
  

    <NavBar/>
    <Outlet/>
  
  </>
  
}

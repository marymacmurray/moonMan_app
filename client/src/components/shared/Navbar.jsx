import React from 'react'

const Navbar = ({ children,user }) => (
  <div className={user ? 'navbar' : 'navbar'}>{children}</div> 
  // <div className={user ? "navbar-logged-in" : 'navbar'}>{children}</div> 

)
export default Navbar
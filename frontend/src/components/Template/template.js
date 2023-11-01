import { Outlet } from "react-router-dom";
import Navbar from "../Navigation/NavigationBar.js";

const Template = () => {
  return (
    <>
      <Navbar></Navbar>
		<main>
        	<Outlet></Outlet>
      	</main>,
    </>
  )
}

export default Template

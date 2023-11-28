import { Outlet } from "react-router-dom";
import Navbar from "../Navigation/NavigationBar.js";
import BackgroundComponent from "../Background/Background.js";
import Footer from "../Footer.js";


const Template = () => {
	return (<>
		<Navbar></Navbar>
		<BackgroundComponent></BackgroundComponent>
		<main>
			<Outlet>				
			</Outlet>		
		</main>
		<Footer />
	</>)
}

export default Template

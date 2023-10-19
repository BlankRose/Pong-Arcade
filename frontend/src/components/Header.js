import {Outlet, Link} from "react-router-dom";
import '../styles/Header.css'

const Header = () => {
    return (
        <>
        <header>
            <div className="title-header">Pong_42</div>
            <nav>
                <ul className="navbar">
                    <li className="link-nav">
                        <Link to ="/" className="text-nav">Home</Link>
                    </li>
                    <li className="link-nav">
                        <Link to ="/game" className="text-nav">Jeu</Link>
                    </li>
                    <li className="link-nav">
                        <Link to ="/chat" className="text-nav">Chat</Link>
                    </li>
                    <li className="link-nav">
                        <Link to = "/profil/:username" className="text-nav">Profil</Link>
                    </li>
                </ul>
            </nav>
        <Outlet />
        </header>
        </>
    )
}

export default Header;
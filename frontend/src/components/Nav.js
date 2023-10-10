import {Outlet, Link} from "react-router-dom";

const Nav = () => {
    return (
        <>
        <nav>
            <ul>
                <li>
                    <Link to ="/">Home</Link>
                </li>
                <li>
                    <Link to ="/game">Jeu</Link>
                </li>
                <li>
                    <Link to ="/chat">Chat</Link>
                </li>
            </ul>
        </nav>

        <Outlet />
        </>
    )
}

export default Nav;
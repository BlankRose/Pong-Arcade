import {Outlet, Link} from "react-router-dom";
import React from "react";

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
                <li>
                    <Link to ="/2fa">2fa</Link>
                </li>
            </ul>
        </nav>

        <Outlet />
        </>
    )
}

export default Nav;
import styles from './NavigationBar.module.css';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
 import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faComments, faGamepad } from '@fortawesome/free-solid-svg-icons';
import LogoutButton from '../Logout/LogoutButton'

const Navbar = () => {
    const isLoggedIn = useSelector((state) => state.user.status);

    const navLinks = [
        { to: '/profile', text: 'Profile', icon: faUser },
        // { to: '/2fa', text: '2FA', icon: faLock },
        { to: '/chat', text: 'Chat', icon: faComments },
        { to: '/game', text: 'Game', icon: faGamepad },
        { to: '/friends', text: 'Friends', icon: faUser}
    ];

    return (
        <header>
            <nav className={styles.nav}>
                <div className={styles.container}>
                    <div className={styles.leftContainer}>
                        {
                            navLinks.map((link, index) => (
                                <NavLink
                                    key={index}
                                    to={link.to}
                                    className={({ isActive }) =>
                                        isActive ? styles.active : undefined
                                    }
                                >
                                    <FontAwesomeIcon icon={link.icon} />
                                    {link.text}
                                </NavLink>

                            ))
                        }
                    </div>
                    <div className={styles.centerContainer}>
                            <LogoutButton></LogoutButton>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;

import styles from './NavigationBar.module.css';
import { NavLink } from 'react-router-dom';
// import { useAppSelector } from '../../store/types';
// import LogoutButton from './LogOutButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faComments, faGamepad, faTrophy } from '@fortawesome/free-solid-svg-icons';


const Navbar = () => {
    // const isLoggedIn = useAppSelector((state) => state.auth.logStatus);
    const isLoggedIn = 'isLogged';

    const navLinks = [
        { to: '/profile', text: 'Profile', icon: faUser },
        { to: '/2fa', text: '2FA', icon: faLock },
        { to: '/chat', text: 'Chat', icon: faComments },
        { to: '/game', text: 'Game', icon: faGamepad },
        { to: '/leader', text: 'Leader', icon: faTrophy}
    ];

    return (
        <header>
            <nav className={styles.nav}>
                <div className={styles.container}>
                    <div className={styles.leftContainer}>
                        {isLoggedIn === 'isLogged' &&
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
                        {/* {isLoggedIn === 'isLogged' && <LogoutButton />} */}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;

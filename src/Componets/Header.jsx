import UserIcon from './UserIcon.jsx';
import ThemeIcon from './ThemeIcon.jsx';
import s from '../StyleComponets/header.module.css';
function Header() {
    return (
        <header className={s.headerWrapper}>
            <h2>АТУ</h2>
            <div className={s.divIconWrapper}>
                <UserIcon />
                <ThemeIcon />
            </div>
        </header>
    );
}

export default Header;

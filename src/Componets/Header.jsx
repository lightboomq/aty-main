import UserIcon from './UserIcon.jsx';
import ThemeIcon from './ThemeIcon.jsx';
import ModeStorage from '../store/ModeStorage.js';
import s from '../StyleComponets/header.module.css';
function Header() {
    
    return (
        <header className={s.wrapper}>
            <h2 className={`${s.title} ${s[ModeStorage.theme]}`}>АТУ</h2>
            <div className={s.wrapperIcons}>
                <UserIcon />
                <ThemeIcon />
            </div>
        </header>
    );
}

export default Header;

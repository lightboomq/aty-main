import UserIcon from './UserIcon.jsx';
import ThemeIcon from './ThemeIcon.jsx';
import logo from '../assets/aty.svg';
import s from '../StyleComponets/header.module.css';
function Header() {
    return (
        <header className={s.wrapper}>
            <img src={logo} alt="logo" className={s.test}/>
            <div className={s.wrapperIcons}>
                <UserIcon />
                <ThemeIcon />
            </div>
        </header>
    );
}

export default Header;

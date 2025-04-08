import React from 'react';
import s from '../StyleComponets/userIcon.module.css';

function UserIcon() {
    const [isShow, setIsShow] = React.useState(false);
    const [randomColor, setRandomColor] = React.useState('');
    const user = JSON.parse(localStorage.getItem('user'));

    React.useEffect(() => {
        function generateRandomColor() {
            const colors = ['blue', 'green', 'purple'];
            const randomIndex = Math.floor(Math.random() * colors.length);
            return setRandomColor(colors[randomIndex]);
        }
        generateRandomColor();
    }, []);

    function show() {
        console.log(true);
    }
    function hidden() {
        console.log(false);
    }
    return (
        <div
            onMouseOver={show}
            onMouseOut={hidden}
            onFocus={show}
            onBlur={hidden}
            style={{ backgroundColor: randomColor }}
            className={s.divWrapper}
        >
            {`${user.firstName[0]}${user.secondName[0]}`}
            
        </div>
    );
}

export default UserIcon;

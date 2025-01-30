import React from 'react';
import s from '../StyleComponets/userIcon.module.css'

function UserIcon() {
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

    return (
        <div style={{ backgroundColor: randomColor }} className={s.divWrapper}>
            <h4>{`${user.firstName[0]}${user.secondName[0]}`}</h4>
        </div>
    );
}

export default UserIcon;

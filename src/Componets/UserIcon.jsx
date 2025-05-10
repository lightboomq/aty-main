import React from 'react';
import addAvatar from '../assets/addAvatar.svg';
import removeAvatar from '../assets/removeAvatar.svg';
import s from '../StyleComponets/userIcon.module.css';

function UserIcon() {
    const fileInput = React.useRef(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const [imgSrc, setImgSrc] = React.useState(user.avatar);
    

    const setUserAvatar = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('avatar', fileInput.current.files[0]);

        try {
            const res = await fetch('http://localhost:3333/api/auth/avatar', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                body: formData,
            });
            if (!res.ok) {
                const err = await res.json();
                throw err;
            }
            const data = await res.json();
            setImgSrc(data.avatar);
            const updatedUser = { ...user, avatar: data.avatar };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (err) {
            console.log(err);
        }
    };
   
    const deleteUserAvatar = async e => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3333/api/auth/avatar', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ avatar: null }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw err;
            }
            setImgSrc('');

            const updatedUser = { ...user, avatar: '' };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (err) {}
    };

    return (
        <div>
            {imgSrc ? (
                <div className={s.wrapper}>
                    <img src={imgSrc} className={s.userAvatar} alt='avatar' />
                    <img onClick={deleteUserAvatar} className={s.iconAvatar} src={removeAvatar} alt='removeAvatar' />
                </div>
            ) : (
                <>
                    <div
                        onClick={() => fileInput.current.click()}
                        className={s.wrapper}
                        title='Добавить аватар'
                    >
                        {`${user.firstName[0]}${user.secondName[0]}`}
                        <img className={s.iconAvatar} src={addAvatar} alt='addAvatar' />
                    </div>
                    <input type='file' ref={fileInput} onChange={setUserAvatar} name='avatar' accept='image/*' />
                </>
            )}
        </div>
    );
}

export default UserIcon;

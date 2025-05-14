import s from '../StyleComponets/modalWindow.module.css';
import { useNavigate } from 'react-router-dom';

function ModalWindow({ path, setIsOpenModal, text }) {
    const navigate = useNavigate();

    return (
        <div className={s.wrapperModalWindow}>
            <div className={s.modalWindow}>
                <p className={s.text}>{text}</p>

                <div className={s.wrapperBtns}>
                    <button onClick={() => navigate(path)} className={`${s.btn} ${s.btnYes}`} type='button'>
                        Да
                    </button>

                    <button onClick={() => setIsOpenModal(false)} className={`${s.btn} ${s.btnNo}`} type='button'>
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalWindow;

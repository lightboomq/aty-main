import React from 'react';
import Errors from '../store/Errors';
import { observer } from 'mobx-react-lite';
import logoSend from '../assets/sendComment.svg';
import ModeStorage from '../store/ModeStorage.js'
import s from '../StyleComponets/inputComment.module.css';
function InputComment({ webSocket, ticketId, questionId }) {

    const [userComment, setUserComment] = React.useState('');
    const [isPlaceholder, setIsPlaceholder] = React.useState(true);
    const inputRef = React.useRef(null);

    
    const sendComment = () => {
        if (!userComment.trim()) return Errors.setMessage('Комментарий не должен быть пустым');
        webSocket.current.emit('send_comment', {
            ticketId,
            questionId,
            text: userComment,
        });

        Errors.setMessage('');
        setUserComment('');
        setIsPlaceholder(true);
        inputRef.current.blur();
        inputRef.current.textContent = '';
    };
    const handleBlur = () => {
        if (userComment.trim() === '') return setIsPlaceholder(true);
    };
    const handleKeyDown = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendComment();
        }
    };
    return (
        <div className={s.wrapperInput}>
            <div className={s.avatar}> </div>
            <div
                contentEditable='true'
                className={`${s.inputArea} ${isPlaceholder && s.placeholder} ${s[ModeStorage.theme]}`}
                onInput={e => setUserComment(e.target.textContent)}
                onFocus={() => setIsPlaceholder(false)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                ref={inputRef}
                suppressContentEditableWarning
            >
                {isPlaceholder && 'Напишите комментарии...'}
            </div>

            <img onClick={sendComment} className={s.sendComment} src={logoSend} alt='sendComment' />
            <span style={{ color: 'red' }}>{Errors.getMessage()}</span>
        </div>
    );
}

export default observer (InputComment);

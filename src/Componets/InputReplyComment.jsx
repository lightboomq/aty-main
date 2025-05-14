import React from 'react';
import Errors from '../store/Errors';
import logoSend from '../assets/sendComment.svg';
import ModeStorage from '../store/ModeStorage.js';
import s from '../StyleComponets/inputReplyComment.module.css';
function InputComment({ webSocket, ticketId, questionId, commentId, targetUserName }) {
    const [userComment, setUserComment] = React.useState('');
    const [isPlaceholder, setIsPlaceholder] = React.useState(true);
    const inputRef = React.useRef(null);

    React.useEffect(() => {
        inputRef.current.focus();
    }, []);

    const sendReplyToComment = () => {
        webSocket.current.emit('send_reply_to_comment', {
            ticketId,
            questionId,
            text: `${targetUserName}, ${userComment}`,
            rootCommentId: commentId,
            replyToCommentId: commentId,
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
            sendReplyToComment();
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
                {isPlaceholder && `Ответить ${targetUserName} ...`}
            </div>

            <img onClick={sendReplyToComment} className={s.sendComment} src={logoSend} alt='sendComment' />
            <span style={{ color: 'red' }}>{Errors.getMessage()}</span>
        </div>
    );
}

export default InputComment;

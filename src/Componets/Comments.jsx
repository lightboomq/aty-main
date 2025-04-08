import React from 'react';
import s from '../StyleComponets/comments.module.css';
import { io } from 'socket.io-client';

function Comments({ webSocket, ticket, allComments, setAllComments, indexTicket }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const ticketId = localStorage.getItem('ticketId');
    const [userComment, setUserComment] = React.useState('');

    console.log(allComments)
    function sendComment() {
        webSocket.current.emit('send_comment', {
            ticketId: ticketId,
            questionId: ticket[indexTicket].questionId,
            text: userComment,
        });

        webSocket.current.on('error', err => {
            console.error('Ошибка WebSocket:', err);
        });
    }

    return (
        <div className={s.wrapper}>
            <div className={s.wrapperComment}>
                <div className={s.author}>
                    
                </div>
            </div>

            <span className={s.userName}>
                Ваше имя: {user.firstName} {user.secondName}
            </span>
            <textarea value={userComment} onChange={e => setUserComment(e.target.value)} placeholder='Введите текст комментария...' />
            <button onClick={sendComment} className={s.btnSendComment} type='button'>
                Добавить комментарий
            </button>
        </div>
    );
}

export default Comments;

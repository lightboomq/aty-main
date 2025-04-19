import React from 'react';
import s from '../StyleComponets/comments.module.css';
import { io } from 'socket.io-client';
import like from '../assets/likeComment.svg';
import disLike from '../assets/disLikeComment.svg';

function Comments({ webSocket, ticket, allComments, setAllComments, indexTicket }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const ticketId = localStorage.getItem('ticketId');
    const [userComment, setUserComment] = React.useState('');

    function sendComment() {
        webSocket.current.emit('send_comment', {
            ticketId: ticketId,
            questionId: ticket[indexTicket].questionId,
            text: userComment,
        });

       

        setUserComment('');
        webSocket.current.on('error', err => {
            console.error('Ошибка WebSocket:', err);
        });

        
    }

    return (
        <div className={s.wrapper}>
            {allComments.map(user => {
                return (
                    <div key={user.commentId} className={s.wrapperComment}>
                        <div className={s.wrapperAuthor}>
                            <div>
                                <h5>{`${user.firstName} ${user.secondName}`}</h5>
                                <p className={s.time}>08.04.25</p>
                            </div>
                        </div>

                        <div className={s.userComment}>
                            <div className={s.triangleUp}> </div>
                            {user.text}
                        </div>

                        <div className={s.wrapperBtns}>
                            <div style={{ display: 'flex' }}>
                                <button className={s.btns} type='button'>
                                    <img className={s.imgLike} src={like} alt='like' />
                                    <span className={s.likesCounter}>0</span>
                                </button>

                                <button className={s.btns} style={{ marginLeft: '10px' }} type='button'>
                                    <img className={s.imgDisLike} src={disLike} alt='like' />
                                    <span className={s.likesCounter}>0</span>
                                </button>
                            </div>

                            <button className={s.btns} type='button'>
                                Ответить
                            </button>
                        </div>
                    </div>
                );
            })}

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

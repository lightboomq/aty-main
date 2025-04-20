import React from 'react';
import s from '../StyleComponets/comments.module.css';
import like from '../assets/likeComment.svg';
import disLike from '../assets/disLikeComment.svg';
import iconComments from '../assets/comments.svg';
import { io } from 'socket.io-client';

function Comments({ ticket, indexTicket }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const userIdFromLocalStorage = user.userId;
    const ticketId = localStorage.getItem('ticketId');
    const [allComments, setAllComments] = React.useState([]);
    const [userComment, setUserComment] = React.useState('');
    const [isOpenComments, setIsOpenComments] = React.useState(false);

    const webSocket = React.useRef(null);
    //дописать логику на закрытие соединения на флан isOpenComments
    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        webSocket.current = io('ws://localhost:3333/api/comments', {
            query: {
                token: user.token,
            },
        });
        webSocket.current.on('connect', () => {
            console.log('connected');
        });
    }, []);

    React.useEffect(() => {
        if (ticket[indexTicket].ticketId === undefined) return;

        const handleComments = comments => setAllComments(comments);
        const handleNewComment = comment => setAllComments(prev => [...prev, comment]);
        const handleError = err => console.error('WebSocket error:', err);

        webSocket.current.emit('get_all_comments', {
            ticketId: ticket[indexTicket].ticketId,
            questionId: ticket[indexTicket].questionId,
        });

        webSocket.current.on('get_all_comments', handleComments);
        webSocket.current.on('send_comment', handleNewComment);

        webSocket.current.emit('join_room', {
            ticketId: ticket[indexTicket].ticketId,
            questionId: ticket[indexTicket].questionId,
        });

        return () => {
            if (webSocket.current) {
                webSocket.current.off('get_all_comments', handleComments);
                webSocket.current.off('send_comment', handleNewComment);
                webSocket.current.off('error', handleError);
            }
        };
    }, [ticket, indexTicket]);

    const sendComment = () => {
        webSocket.current.emit('send_comment', {
            ticketId: ticketId,
            questionId: ticket[indexTicket].questionId,
            text: userComment,
        });

        setUserComment('');
        webSocket.current.on('error', err => {
            console.error('Ошибка WebSocket:', err);
        });
    };

    const deleteComment = (userId, commentId, i) => {
        if (userId !== userIdFromLocalStorage) return;
        const res = confirm('Удалить комментарий?');
        if (!res) return;

        webSocket.current.emit('delete_comment', {
            commentId: commentId,
        });

        setAllComments(allComments.filter((_, index) => index !== i));
    };

    const setDateUserComment = dateStr => {
        const date = new Date(dateStr);
        const dayOfMonth = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
        const year = date.getFullYear();
        const hour = date.getHours();
        const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

        return `${dayOfMonth}.${month}.${year} ${hour}:${minutes}`;
    };

    return (
        <div className={s.wrapper}>
            <div className={s.wrapperComments} onClick={() => setIsOpenComments(!isOpenComments)}>
                <img src={iconComments} alt='comments' />
                <p className={s.countComments}>Комментарив: {allComments.length}</p>
            </div>

            {isOpenComments && (
                <>
                    {allComments.map((user, i) => {
                        return (
                            <div key={user.commentId} className={s.wrapperComment}>
                                <span onClick={() => deleteComment(user.userId, user.commentId, i)}>
                                    {user.userId === userIdFromLocalStorage ? 'Удалить' : ''}
                                </span>

                                <div className={s.wrapperAuthor}>
                                    <div>
                                        <h5>{`${user.firstName} ${user.secondName}`}</h5>
                                        <p className={s.time}>{setDateUserComment(user.time)}</p>
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
                    <textarea
                        value={userComment}
                        onChange={e => setUserComment(e.target.value)}
                        placeholder='Введите текст комментария...'
                    />
                    <button onClick={sendComment} className={s.btnSendComment} type='button'>
                        Добавить комментарий
                    </button>
                </>
            )}
        </div>
    );
}

export default Comments;

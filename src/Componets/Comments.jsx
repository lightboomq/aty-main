import React from 'react';
import likeImg from '../assets/likeComment.svg';
import disLikeImg from '../assets/disLikeComment.svg';
import iconComments from '../assets/comments.svg';
import { io } from 'socket.io-client';
import Errors from '../store/Errors';
import { observer } from 'mobx-react-lite';
import s from '../StyleComponets/comments.module.css';

function Comments({ ticketId, questionId }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const userIdFromLocalStorage = user.userId;
    const [allComments, setAllComments] = React.useState([]);
    const [userComment, setUserComment] = React.useState('');
    const [isOpenComments, setIsOpenComments] = React.useState(true);
    // const [likes,setLikes] = React.useState([]);
    const webSocket = React.useRef(null);

    React.useEffect(() => {
        //конект с сервером
        const user = JSON.parse(localStorage.getItem('user'));
        webSocket.current = io('ws://localhost:3333/api/comments', {
            query: {
                token: user.token,
            },
        });
        webSocket.current.on('connect', () => {});

        return () => {
            webSocket.current.disconnect();
        };
    }, []);

    React.useEffect(() => {
        if (ticketId === undefined) return;

        const handleComments = comments => setAllComments(comments);

        webSocket.current.on('get_all_comments', handleComments); // получение массива объектов  всех комментарий с сервера

        webSocket.current.emit('get_all_comments', {
            //запрос на все комментарий
            ticketId,
            questionId,
        });

        webSocket.current.emit('join_room', {
            //соединение с комнатой
            ticketId,
            questionId,
        });

        return () => {
            if (webSocket.current) {
                webSocket.current.off('get_all_comments', handleComments);
            }
        };
    }, [ticketId, questionId]);

    React.useEffect(() => {
        const handleLikes = usersLiked => {
            const idOfCommentLiked = usersLiked.commentId;
            setAllComments(prev =>
                prev.map(comments =>
                    comments.commentId === idOfCommentLiked
                        ? { ...comments, likes: [...usersLiked.likes] } 
                        : comments,
                ),
            );
        };
        const handleDisLikes = usersDisLiked => {
            console.log(usersDisLiked)
            const idOfCommentDisLiked = usersDisLiked.commentId;
            setAllComments(prev =>
                prev.map(comments =>
                    comments.commentId === idOfCommentDisLiked
                        ? { ...comments, dislikes: [...usersDisLiked.dislikes] } 
                        : comments,
                ),
            );
        };
        const handleNewComment = newComment => setAllComments(prev => [...prev, newComment]);
        const handleDeletedComment = deletedComment => setAllComments(prev => prev.filter(el => el.commentId !== deletedComment.commentId));
        const handleError = err => Errors.setMessage(err.message);

        webSocket.current.on('like_comment', handleLikes);
        webSocket.current.on('dislike_comment', handleDisLikes);
        webSocket.current.on('send_comment', handleNewComment);
        webSocket.current.on('delete_comment', handleDeletedComment);
        webSocket.current.on('error', handleError);

        return () => {
            webSocket.current.off('like_comment', handleLikes);
            webSocket.current.off('dislike_comment', handleDisLikes);
            webSocket.current.off('send_comment', handleNewComment);
            webSocket.current.off('delete_comment', handleDeletedComment);
            webSocket.current.off('error');
        };
    }, []);

    const like = commentId => {
        webSocket.current.emit('like_comment', {
            ticketId,
            questionId,
            commentId,
        });
    };
    const dislike = commentId => {
        webSocket.current.emit('dislike_comment', {
            ticketId,
            questionId,
            commentId,
        });
    };

    const sendComment = () => {
        if (!userComment.trim()) return Errors.setMessage('Комментарий не должен быть пустым');
        webSocket.current.emit('send_comment', {
            ticketId,
            questionId,
            text: userComment,
        });
        Errors.setMessage('');
        setUserComment('');
    };
    
    const deleteComment = (userId, commentId) => {
        if (userId !== userIdFromLocalStorage) return;
        webSocket.current.emit('delete_comment', { commentId });
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

    console.log(allComments)

    return (
        <div className={s.wrapper}>
            <div className={s.wrapperComments} onClick={() => setIsOpenComments(!isOpenComments)}>
                <img src={iconComments} alt='comments' />
                <p className={s.countComments}>Комментарив: {allComments.length}</p>
            </div>

            {isOpenComments && (
                <>
                    {allComments.map((comment, i) => {
                        return (
                            <div key={comment.commentId} className={s.wrapperComment}>
                                <span onClick={() => deleteComment(comment.userId, comment.commentId, i)}>
                                    {comment.userId === userIdFromLocalStorage ? 'Удалить' : ''}
                                </span>

                                <div className={s.wrapperAuthor}>
                                    <div>
                                        <h5>{`${comment.firstName} ${comment.secondName}`}</h5>
                                        <p className={s.time}>{setDateUserComment(comment.time)}</p>
                                    </div>
                                </div>

                                <div className={s.userComment}>
                                    <div className={s.triangleUp}> </div>
                                    {comment.text}
                                </div>

                                <div className={s.wrapperBtns}>
                                    <div style={{ display: 'flex' }}>
                                        <button onClick={() => like(comment.commentId)} className={s.btns} type='button'>
                                            <img className={s.imgLike} src={likeImg} alt='like' />
                                            <span className={s.likesCounter}>{comment.likes.length}</span>
                                        </button>

                                        <button onClick={() => dislike(comment.commentId)} className={s.btns} style={{ marginLeft: '10px' }} type='button'>
                                            <img className={s.imgDisLike} src={disLikeImg} alt='like' />
                                            <span className={s.likesCounter}>{comment.dislikes.length}</span>
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
                    <span style={{ color: 'red' }}>{Errors.getMessage()}</span>
                </>
            )}
        </div>
    );
}

export default observer(Comments);

import React from 'react';
import logoLike from '../assets/like.svg';
import logoRedLike from '../assets/redLike.svg';
import logoSend from '../assets/sendComment.svg';
import { io } from 'socket.io-client';
import Errors from '../store/Errors';
import { observer } from 'mobx-react-lite';
import s from '../StyleComponets/userComments.module.css';

function UserComments({ ticketId, questionId, setCounterComments }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const userIdFromLocalStorage = user.userId;
    const [allComments, setAllComments] = React.useState([]);
    const [userComment, setUserComment] = React.useState('');
    const [isShowAddComment, setIsShowAddComment] = React.useState(false); //флаг от прыгающей верстки
    const [isPlaceholder, setIsPlaceholder] = React.useState(true);

    const webSocket = React.useRef(null);
    const inputRef = React.useRef(null);

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

        const handleComments = comments => {
            setAllComments(comments);
            setIsShowAddComment(true);
        };

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
        const handleNewComment = newComment => {
            setAllComments(prev => [newComment, ...prev]);
            setCounterComments(prev => ({ ...prev, count: prev.count + 1 }));
        };

        const handleReplyUser = test => {
            console.log(test);
        };

        const handleLikes = usersLiked => {
            const idOfSelectedComment = usersLiked.commentId;
            setAllComments(prev =>
                prev.map(comments =>
                    comments.commentId === idOfSelectedComment ? { ...comments, likes: [...usersLiked.likes] } : comments,
                ),
            );
        };

        const handleDeletedComment = deletedComment => {
            setAllComments(prev => prev.filter(el => el.commentId !== deletedComment.commentId));
            setCounterComments(prev => ({ ...prev, count: prev.count - 1 }));
        };
        const handleError = err => Errors.setMessage(err.message);

        webSocket.current.on('send_comment', handleNewComment);
        webSocket.current.on('send_reply_to_comment', handleReplyUser);
        webSocket.current.on('delete_comment', handleDeletedComment);
        webSocket.current.on('like_comment', handleLikes);
        webSocket.current.on('error', handleError);
        return () => {
            console.log('unmount');
            webSocket.current.off('send_comment', handleNewComment);
            webSocket.current.off('send_reply_to_comment', handleReplyUser);
            webSocket.current.off('delete_comment', handleDeletedComment);
            webSocket.current.off('like_comment', handleLikes);
            webSocket.current.off('error', handleError);
        };
    }, [setCounterComments]);

    const sortedCommentsByLike = React.useMemo(() => {
        //оптимищация сортировки через хук от ререндеров
        return [...allComments].sort((a, b) => b.likes.length - a.likes.length);
    }, [allComments]);

    const like = commentId => {
        webSocket.current.emit('like_comment', {
            ticketId,
            questionId,
            commentId,
        });
    };

    const deleteComment = commentId => {
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

    const highlightLike = likes => {
        for (let i = 0; i < likes.length; i++) {
            const userId = likes[i].userId;
            if (userId === userIdFromLocalStorage) {
                return logoRedLike;
            }
        }
        return logoLike;
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
        setIsPlaceholder(false);
        inputRef.current.textContent = '';
    };

    const handleBlur = () => {
        if (userComment.trim() === '') return setIsPlaceholder(true);
        setIsPlaceholder(false);
    };
    const handleKeyDown = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendComment();
        }
    };

    const replyUser = (text, commentId, userId,name) => {
        console.log(`${name} commentId: `, commentId);
        console.log(`${name} userId:`, userId);
        // webSocket.current.emit('send_reply_to_comment', {
        //     ticketId,
        //     questionId,
        //     text,
        //     rootCommentId: commentId,
        //     replyToCommentId: commentId,
        // });
    };
console.log(allComments)
    return (
        <div className={s.wrapper}>
            {sortedCommentsByLike.map(comment => {
                
                return (
                    <div key={comment.commentId} className={s.wrapperUserComment}>
                        <div className={s.avatar}> </div>
                        <div>
                            <h4 className={s.author}>{`${comment.firstName} ${comment.secondName}`}</h4>

                            <p className={s.text}>{comment.text}</p>

                            <div className={s.wrapperActions}>
                                <div>
                                    <time className={s.date}>{setDateUserComment(comment.time)}</time>
                                    {comment.userId === userIdFromLocalStorage ? (
                                        <button onClick={() => deleteComment(comment.commentId)} className={s.reply} type='button'>
                                            Удалить
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => replyUser(comment.text, comment.commentId, comment.userId, comment.secondName)}
                                            className={s.reply}
                                            type='button'
                                        >
                                            Ответить
                                        </button>
                                    )}
                                </div>

                                <button onClick={() => like(comment.commentId)} type='button' className={s.btnLike}>
                                    <img src={highlightLike(comment.likes)} alt='like' />
                                    <span className={s.likesConter}>{comment.likes.length}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
            {isShowAddComment && (
                <div className={s.wrapperInput}>
                    <div className={s.avatar}> </div>

                    <div
                        contentEditable='true'
                        className={`${s.inputArea} ${isPlaceholder && s.placeholder}`}
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
            )}
        </div>
    );
}

export default observer(UserComments);

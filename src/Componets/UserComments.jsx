import React from 'react';
import UserCommentReplies from './UserCommentReplies.jsx';
import InputComment from './InputComment';
import InputReplyComment from './InputReplyComment';
import logoLike from '../assets/like.svg';
import logoRedLike from '../assets/redLike.svg';
import logoNoAvatar from '../assets/noAvatar.png';
import { io } from 'socket.io-client';
import Errors from '../store/Errors';
import { observer } from 'mobx-react-lite';
import ModeStorage from '../store/ModeStorage.js';
import s from '../StyleComponets/userComments.module.css';

function UserComments({ ticketId, questionId, setCounterComments, setIsLoader }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const userIdFromLocalStorage = user.userId;
    const [allComments, setAllComments] = React.useState([]);
    const [targetUserReplyId, setTargetUserReplyId] = React.useState('');
    const [isShowAddComment, setIsShowAddComment] = React.useState(false); //флаг от прыгающей верстки

    const wrapperUserComment = React.useRef(null);
    const webSocket = React.useRef(null);
   
    React.useEffect(() => {
        //конект с сервером
        setIsLoader(true);
        const user = JSON.parse(localStorage.getItem('user'));

        webSocket.current = io('ws://localhost:3333/api/comments', {
            query: {
                token: user.token,
            },
        });

        webSocket.current.on('connect', () => {
            // console.log('connect')
        });

        return () => {
            webSocket.current.disconnect();
        };
    }, [setIsLoader]);

    React.useEffect(() => {
        if (ticketId === undefined) return;

        const handleComments = comments => {
            setAllComments(comments);
            setIsShowAddComment(true);
            setIsLoader(false);
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
    }, [ticketId, questionId, setIsLoader]);

    React.useEffect(() => {
        const handleNewComment = newComment => {
            setAllComments(prev => [newComment, ...prev]);
            setCounterComments(prev => ({ ...prev, count: prev.count + 1 }));
        };
        const handleReplyUser = userReply => {
            setAllComments(prev =>
                prev.map(comment =>
                    comment.commentId === userReply.replyInfo.replyToCommentId
                        ? {
                              ...comment,
                              replies: [...(comment.replies || []), userReply],
                          }
                        : comment,
                ),
            );
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

    return (
        <div className={s.wrapper}>
            {sortedCommentsByLike.map(comment => {
                return (
                    <div key={comment.commentId} ref={wrapperUserComment} className={`${s.wrapperUserComment} ${s[ModeStorage.theme]}`}>
                        <img className={s.avatar} src={logoNoAvatar} alt='no-avatar' />
                        <div>
                            <h4 className={`${s.author} ${s[ModeStorage.theme]}`}>{`${comment.firstName} ${comment.secondName}`}</h4>

                            <p className={`${s.text} ${s[ModeStorage.theme]}`}>{comment.text.replace(/\s+/g, ' ').trim()}</p>

                            <div className={s.wrapperActions}>
                                <div>
                                    <time className={s.date}>{setDateUserComment(comment.time)}</time>
                                    {comment.userId === userIdFromLocalStorage ? (
                                        <button
                                            onClick={() => deleteComment(comment.commentId)}
                                            className={`${s.reply} ${s[ModeStorage.theme]}`}
                                            type='button'
                                        >
                                            Удалить
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                setTargetUserReplyId(prev => (prev === comment.commentId ? '' : comment.commentId))
                                            }
                                            className={`${s.reply} ${s[ModeStorage.theme]}`}
                                            type='button'
                                        >
                                            {targetUserReplyId === comment.commentId ? 'Скрыть' : 'Ответить'}
                                        </button>
                                    )}
                                </div>

                                <button onClick={() => like(comment.commentId)} type='button' className={s.btnLike}>
                                    <img src={highlightLike(comment.likes)} alt='like' />
                                    <span className={`${s.likesConter} ${s[ModeStorage.theme]}`}>{comment.likes.length}</span>
                                </button>
                            </div>

                            {comment.replies && (
                                <UserCommentReplies
                                    replies={comment.replies}
                                    userIdFromLocalStorage={userIdFromLocalStorage}
                                    setDateUserComment={setDateUserComment}
                                />
                            )}
                            {targetUserReplyId === comment.commentId && (
                                <InputReplyComment
                                    webSocket={webSocket}
                                    ticketId={ticketId}
                                    questionId={questionId}
                                    commentId={comment.commentId}
                                    targetUserName={comment.firstName}
                                />
                            )}
                        </div>
                    </div>
                );
            })}

            {isShowAddComment && <InputComment webSocket={webSocket} ticketId={ticketId} questionId={questionId} />}
        </div>
    );
}

export default observer(UserComments);

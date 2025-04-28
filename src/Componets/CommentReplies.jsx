import React from 'react';
import logoLike from '../assets/like.svg';
import logoRedLike from '../assets/redLike.svg';
import s from '../StyleComponets/commentReplies.module.css';
function CommentReplies({ replies, userIdFromLocalStorage, setDateUserComment }) {
    const [visibleCount, setVisibleCount] = React.useState(3);
    const showMoreComments = () => {//доработать
        
        if (visibleCount < replies.length) {
            return (
                <button className={s.showMoreComment} onClick={() => setVisibleCount(prev => prev + 5)} type='button'>
                    Показать следующие комментарий
                </button>
            );
        }
        return (
            <button className={s.showMoreComment} onClick={() => setVisibleCount(prev => prev + 5)} type='button'>
                Скрыть комментарий
            </button>
        );
    };
    return (
        <>
            {replies.slice(0, visibleCount).map(comment => {
                return (
                    <div key={comment.commentId} className={s.wrapperUserComment}>
                        <div className={s.avatar}> </div>
                        <div>
                            <h5 className={s.author}>{`${comment.firstName} ${comment.secondName}`}</h5>

                            <p className={s.text}>{comment.text.replace(/\s+/g, ' ').trim()}</p>

                            <div className={s.wrapperActions}>
                                <div>
                                    <time className={s.date}> {setDateUserComment(comment.time)}</time>
                                    {comment.userId === userIdFromLocalStorage ? (
                                        <button className={s.reply} type='button'>
                                            Удалить
                                        </button>
                                    ) : (
                                        <button className={s.reply} type='button'>
                                            Ответить
                                        </button>
                                    )}
                                </div>

                                <button type='button' className={s.btnLike}>
                                    <img src={logoLike} alt='like' />
                                    <span className={s.likesConter}>{comment.likes.length}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
            {showMoreComments()}
        </>
    );
}

export default React.memo(CommentReplies);

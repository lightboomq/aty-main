import React from 'react';
import logoNoAvatar from '../assets/noAvatar.png'
import s from '../StyleComponets/commentReplies.module.css';
function CommentReplies({ replies, userIdFromLocalStorage, setDateUserComment }) {
    
    const [visibleCount, setVisibleCount] = React.useState(3);
    
    const showMoreComments = () => {
        if(replies.length<3) return;
        if (visibleCount < replies.length) {
            return (
                <button className={s.showMoreComment} onClick={() => setVisibleCount(prev => prev + 5)} type='button'>
                    Показать следующие комментарий
                </button>
            );
        }
        return (
            <button className={s.showMoreComment} onClick={() => setVisibleCount(3)} type='button'>
                Скрыть комментарий
            </button>
        );
    };
    return (
        <>
            {replies.slice(0, visibleCount).map(comment => {
                return (
                    <div key={comment.commentId} className={s.wrapperUserComment}>
                       <img src={logoNoAvatar} alt="no-avatar" />
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

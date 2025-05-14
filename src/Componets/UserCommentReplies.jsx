import React from 'react';
import logoNoAvatar from '../assets/noAvatar.png';
import ModeStorage from '../store/ModeStorage.js';
import s from '../StyleComponets/userCommentReplies.module.css';
function UserCommentReplies({ replies, userIdFromLocalStorage, setDateUserComment }) {
    const [visibleCount, setVisibleCount] = React.useState(3);
  
    const showMoreComments = () => {
        if (replies.length < visibleCount+1) return;

        if (visibleCount < replies.length) {
            return (
                <button
                    className={`${s.showMoreComment} ${s[ModeStorage.theme]}`}
                    onClick={() => setVisibleCount(prev => prev + 5)}
                    type='button'
                >
                    Показать следующие комментарий
                </button>
            );
        }
        return (
            <button className={`${s.showMoreComment} ${s[ModeStorage.theme]}`} onClick={() => setVisibleCount(3)} type='button'>
                Скрыть комментарий
            </button>
        );
    };

    return (
        <>
            {replies.slice(0, visibleCount).map((comment, i, arr) => {
                const isLastEl = i === arr.length - 1;
                return (
                    <div
                        key={comment.commentId}
                        style={isLastEl ? { border: 'none' } : {}}
                        className={`${s.wrapperUserComment} ${s[ModeStorage.theme]}`}
                    >
                        <img src={logoNoAvatar} alt='no-avatar' />
                        <div>
                            <h5 className={`${s.author} ${s[ModeStorage.theme]}`}>{`${comment.firstName} ${comment.secondName}`}</h5>

                            <p className={`${s.text} ${s[ModeStorage.theme]}`}>{comment.text.replace(/\s+/g, ' ').trim()}</p>

                            <div className={s.wrapperActions}>
                                <div>
                                    <time className={s.date}> {setDateUserComment(comment.time)}</time>
                                    {comment.userId === userIdFromLocalStorage ? (
                                        <button className={`${s.reply} ${s[ModeStorage.theme]}`} type='button'>
                                            Удалить
                                        </button>
                                    ) : (
                                        <button className={`${s.reply} ${s[ModeStorage.theme]}`} type='button'>
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

export default React.memo(UserCommentReplies);

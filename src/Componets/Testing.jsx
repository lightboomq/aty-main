import React from 'react';
import Header from './Header.jsx';
import NavOfQuestion from './NavOfQuestion.jsx';
import GoBack from './GoBack.jsx';
import Timer from './Timer.jsx';
import Question from './Question.jsx';
import StepBtns from './StepBtns.jsx';
import ModeStorage from '../store/ModeStorage.js';
import Comments from './Comments.jsx';
import iconComments from '../assets/comments.svg';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import s from '../StyleComponets/testing.module.css';
import style from '../StyleComponets/comments.module.css';//
function Testing() {
    const typeTest = localStorage.getItem('typeTest');
    const [ticket, setTicket] = React.useState([{ question: '', answers: [], img: '', questionId: '' }]);
    const [indexTicket, setIndexTicket] = React.useState(0);
    const [userAnswers, setUserAnswers] = React.useState([0]);
    const [allComments, setAllComments] = React.useState(0);
    const [isOpenComments, setIsOpenComments] = React.useState(true);
    
    // const user = JSON.parse(localStorage.getItem('user'));
    // const ticketId = localStorage.getItem('ticketId');
    // const [userComment, setUserComment] = React.useState('');

    const navigate = useNavigate();

    const states = {
        ticket,
        userAnswers,
        indexTicket,
        setTicket,
        setUserAnswers,
        setIndexTicket,
    };

    React.useEffect(() => {
        function getTicketFromLocaleStorage() {
            const localeStorageTicket = JSON.parse(localStorage.getItem('ticketJson'));
            const fillNull = [];
            setTicket(localeStorageTicket);

            for (let i = 0; i < localeStorageTicket.length; i++) {
                fillNull.push(null);
            }
            setUserAnswers(fillNull);
        }
        getTicketFromLocaleStorage();
    }, []);

    const webSocket = React.useRef();
    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        webSocket.current = io('ws://localhost:3333/api/comments', {
            query: {
                token: user.token,
            },
        });
        webSocket.current.on('connect', () => {
            // console.log('server is connect');
        });
    }, []);



   
    React.useEffect(() => {
        const handleComments = comments => {
            setAllComments(comments);
        };

        webSocket.current.on('get_all_comments', handleComments);
        webSocket.current.emit('get_all_comments', {
            ticketId: ticket[indexTicket].ticketId,
            questionId: ticket[indexTicket].questionId,
        });

       
        return () => {
            if (webSocket.current) {
                webSocket.current.off('get_all_comments', handleComments);
            }
        };
    }, [ticket, indexTicket]);

    // function sendComment() {
    //     webSocket.current.emit('send_comment', {
    //         ticketId: ticketId,
    //         questionId: ticket[indexTicket].questionId,
    //         text: userComment,
    //     });   
    // }

    React.useEffect(() => {
        if (!userAnswers.includes(null) && ticket.length > 2) {
            const correctAnswers = userAnswers.reduce((accum, num) => accum + num, 0);
            localStorage.setItem('readyTicket', JSON.stringify(ticket));
            localStorage.setItem('correctAnswers', correctAnswers);
            return navigate('/result');
        }
    }, [userAnswers, ticket, navigate]);

    

    return (
        <div className={`${s.divWrapper} ${s[ModeStorage.theme]}`}>
            <div className={`${s.divWrapperContent} ${s[ModeStorage.theme]}`}>
                <Header />
                <NavOfQuestion {...states} />
                <div className={s.test}>
                    {typeTest !== 'Экзамен' && <GoBack />}
                    <Timer {...states} />
                </div>

                <Question {...states} />
                <StepBtns {...states} />

                <div className={s.wrapperComments} onClick={() => setIsOpenComments(!isOpenComments)}>
                    <img src={iconComments} alt='comments' />
                    <p className={s.countComments}>Комментарив: {allComments.length}</p>
                </div>

                {isOpenComments && (
                    <Comments
                        webSocket={webSocket}
                        ticket={ticket}
                        indexTicket={indexTicket}
                        allComments={allComments}
                        setAllComments={setAllComments}
                    />
                )}

                    
                {/* <div className={style.wrapper}>
                    <span className={style.userName}>
                        Ваше имя: {user.firstName} {user.secondName}
                    </span>
                    <textarea
                        value={userComment}
                        onChange={e => setUserComment(e.target.value)}
                        placeholder='Введите текст комментария...'
                    />
                    <button onClick={sendComment} className={style.btnSendComment} type='button'>
                        Добавить комментарий
                    </button>
                </div> */}
            </div>
        </div>
    );
}

export default observer(Testing);

import React from "react";
import NavOfQuestion from "./NavOfQuestion.jsx";
import GoBack from "./GoBack.jsx";
import Timer from "./Timer.jsx";
import Question from "./Question.jsx";
import StepBtns from "./StepBtns.jsx";
import ModeStorage from "../store/ModeStorage.js";
import UserComments from "./UserComments.jsx";
import Errors from "../store/Errors.js";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import iconComments from "../assets/comments.svg";
import Loader from "./Loader.jsx";
import Header from "./Header.jsx";
import ErrorsMessage from "./ErrorsMessage.jsx";
import s from "../StyleComponets/test.module.css";

function Testing() {
	const navigate = useNavigate();
	const typeTest = localStorage.getItem("typeTest");
	const [ticket, setTicket] = React.useState([
		{ question: "", answers: [], img: "", questionId: "" },
	]);
	const [indexTicket, setIndexTicket] = React.useState(0);
	const [userAnswers, setUserAnswers] = React.useState([]);
	const [counterComments, setCounterComments] = React.useState({ count: 0 });
	const [isOpenComments, setIsOpenComments] = React.useState(false);
	const [isLoader, setIsLoader] = React.useState(false);
	const [isLoaderOfNav, setIsLoaderOfNav] = React.useState(false);

	const states = {
		ticket,
		userAnswers,
		indexTicket,
		setTicket,
		setUserAnswers,
		setIndexTicket,
		isLoaderOfNav,
		setIsLoaderOfNav,
	};

	React.useEffect(() => {
		const localeStorageTicket = JSON.parse(localStorage.getItem("ticketJson"));
		const arr = [];

		for (let i = 0; i < localeStorageTicket.length; i++) {
			arr.push(null);
		}

		setTicket(localeStorageTicket); // основной массив вопросов, из выбраного билета или экзамен
		setUserAnswers(arr); //второстепенный массив для записи  0 или 1 после ответа на вопрос + опора при навигаций по вопросам
	}, []);

	React.useEffect(() => {
		//запрос на счетчик всех комментариев в вопросе
		async function getCountComments() {
			const user = JSON.parse(localStorage.getItem("user"));
			try {
				const res = await fetch("http://localhost:3333/api/comments/count", {
					method: "POST",
					headers: {
						Authorization: `Bearer ${user.token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						ticketId: ticket[indexTicket].ticketId,
						questionId: ticket[indexTicket].questionId,
					}),
				});

				if (!res.ok) {
					const err = await res.json();
					throw err;
				}
				const data = await res.json();
				setCounterComments(data);
				setIsOpenComments(false);
			} catch (err) {
				Errors.setMessage(err.message);
			}
		}
		getCountComments();
	}, [ticket, indexTicket]);

	React.useEffect(() => {
		if (!userAnswers.includes(null) && ticket.length > 2) {
			//Переход на результат тестирования после ответа на все вопросы
			const correctAnswers = userAnswers.reduce((accum, num) => accum + num, 0);
			localStorage.setItem("readyTicket", JSON.stringify(ticket));
			localStorage.setItem("correctAnswers", correctAnswers);
			return navigate("/result");
		}
	}, [userAnswers, ticket, navigate]);

	return (
		<div className={`${s.wrapper} ${s[ModeStorage.theme]}`}>
			{Errors.getMessage() && <ErrorsMessage err={Errors.getMessage()} />}

			<div className={`${s.wrapperContent} ${s[ModeStorage.theme]}`}>
				<Header />
				<NavOfQuestion {...states} />
				<div className={s.wrapperTimer}>
					{typeTest !== "Экзамен" && <GoBack />}
					<Timer {...states} />
				</div>

				<Question {...states} />
				<StepBtns {...states} />

				{
					typeTest !== 'Экзамен' && typeTest !== 'Тренировочный экзамен' ?
						<div
							className={s.wrapperCountComments}
							onClick={() => setIsOpenComments(!isOpenComments)}
						>
							<img src={iconComments} alt="comments" />
							<p className={s.countComments}>
								Комментарии: {counterComments.count}
							</p>
							{isLoader && (
								<Loader color="#056DF4" width={22} height={22} positionRight={0} />
							)}
						</div> : ''

				}
				{isOpenComments &&
					<UserComments
						ticketId={ticket[indexTicket].ticketId}
						questionId={ticket[indexTicket].questionId}
						setCounterComments={setCounterComments}
						setIsLoader={setIsLoader}
					/>}
			</div>
		</div>
	);
}

export default observer(Testing);

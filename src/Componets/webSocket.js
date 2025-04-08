import { io } from 'socket.io-client';

const method = {}

function webSocket(ticket,indexTicket) {
    const User = JSON.parse(localStorage.getItem('user'));

    const socket = io('http://localhost:3333/api/comments', {
        query: {
            token: User.token,
        },
    });

    socket.on('connect', () => { //onopen
        console.log('Успешно подключен к серверу');
    });

   

    socket.emit('get_all_comments', { // emit = send; type: get_all_comments
        ticketId: ticket[indexTicket].ticketId, //тело функций = data:{}
        questionId: ticket[indexTicket].questionId,
    });

    socket.on('get_all_comments', (comments) => {
        console.log(comments);
    });
    
}

export default webSocket;

// import React from 'react';
// export function useWebSocket() {
//     const [socket, setSocket] = React.useState(null);
//     const user = JSON.parse(localStorage.getItem('user'));

//     useEffect(() => {
//         const newSocket = io('ws://localhost:3333/api/comments', {
//             query: { token: user.token },
//         });
//         newSocket.on('connect', () => {
//             console.log('server is connect');
//         });
//         setSocket(newSocket);
//         return () => newSocket.disconnect();
//     }, []);

//     return socket;
// }
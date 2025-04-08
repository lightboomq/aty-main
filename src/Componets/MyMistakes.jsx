import React from 'react';

function MyMistakes() {
    React.useEffect(() => {
        async function getMyMistakes() {
            const token = JSON.parse(localStorage.getItem('user'));
            const response = await fetch('http://localhost:3333/api/tickets/failedQuestions', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token.token}`,
                },
            });
            const mistakes = await response.json();
            
        }
        getMyMistakes();
    }, []);

    return <div>

    </div>;
}

export default MyMistakes;

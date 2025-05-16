import React from 'react';
function ParentComponent() {
    const user = {
        id: 1,
        name: 'John Doe',
        address: {
            street: '123 Main St',
            city: 'New York',
            coordinates: {
                lat: 40.7128,
                lng: -74.006,
            },
        },
        hobbies: ['reading', 'swimming'],
        friends: [
            { id: 2, name: 'Jane Smith' },
            { id: 3, name: 'Bob Johnson' },
        ],
    };

    

   
}

export default ParentComponent;

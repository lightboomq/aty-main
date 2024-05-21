import React from 'react';
function Ref() {
    const divRef = React.useRef(1);
    console.log(divRef)
    function test() {
        console.log(divRef)
        // divRef.current.textContent = '10';
        
    }
    return (
        <div>
            <div ref={divRef}>lorem insput</div>
            <div ref={divRef2}>123</div>
            <button onClick={test} type='button'>
                click
            </button>
        </div>
    );
}

export default Ref;

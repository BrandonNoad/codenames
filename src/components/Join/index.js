import React, { useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';

const Join = () => {
    const { gameId } = useParams();

    const [gameIdToJoin, setGameIdToJoin] = useState(gameId || '');

    const [role, setRole] = useState('spymaster');

    const [isReadyToPlay, setIsReadyToPlay] = useState(false);

    const handleChangeGameIdToJoin = (e) => {
        setGameIdToJoin(e.target.value);
    };

    const handleChangeRole = (e) => {
        setRole(e.target.value);
    };

    const handleClickPlayGame = (e) => {
        setIsReadyToPlay(true);
    };

    if (isReadyToPlay) {
        return <Redirect to={`/game/${gameIdToJoin}/${role}`} />;
    }

    return (
        <>
            <label htmlFor="game-id">Game:</label>
            <input id="game-id" value={gameIdToJoin} onChange={handleChangeGameIdToJoin} />
            <br />
            <label>
                <input
                    type="radio"
                    checked={role === 'spymaster'}
                    value="spymaster"
                    onChange={handleChangeRole}
                />
                Spymaster
            </label>
            <label>
                <input
                    type="radio"
                    checked={role === 'operative'}
                    value="operative"
                    onChange={handleChangeRole}
                />
                Field Operative
            </label>
            <br />
            <button onClick={handleClickPlayGame} disabled={gameIdToJoin === ''}>
                Play Game!
            </button>
        </>
    );
};

export default Join;

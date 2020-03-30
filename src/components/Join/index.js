import React, { useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';

const useQuery = () => new URLSearchParams(useLocation().search);

const Join = () => {
    const query = useQuery();

    // May be null.
    const initialGameId = query.get('gameId');

    const [gameId, setGameId] = useState(initialGameId || '');

    const [team, setTeam] = useState('red');

    const [role, setRole] = useState(initialGameId === null ? 'operative' : 'spymaster');

    const [isReadyToPlay, setIsReadyToPlay] = useState(false);

    const handleChangeGameId = (e) => {
        setGameId(e.target.value);
    };

    const handleChangeTeam = (e) => {
        setTeam(e.target.value);
    };

    const handleChangeRole = (e) => {
        setRole(e.target.value);
    };

    const handleClickPlayGame = (e) => {
        setIsReadyToPlay(true);
    };

    if (isReadyToPlay) {
        return <Redirect to={`/game/${gameId.trim()}?team=${team}&role=${role}`} />;
    }

    return (
        <>
            <label htmlFor="game-id">Game:</label>
            <input id="game-id" value={gameId} onChange={handleChangeGameId} />
            <br />
            <label>
                <input
                    type="radio"
                    checked={team === 'red'}
                    value="red"
                    onChange={handleChangeTeam}
                />
                Red
            </label>
            <label>
                <input
                    type="radio"
                    checked={team === 'blue'}
                    value="blue"
                    onChange={handleChangeTeam}
                />
                Blue
            </label>
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
            <button onClick={handleClickPlayGame} disabled={gameId.trim() === ''}>
                Let's Play!
            </button>
        </>
    );
};

export default Join;

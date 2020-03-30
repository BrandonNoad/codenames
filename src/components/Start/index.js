import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

const gameId = 123;

const createNewGame = async () =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve({ gameId });
        }, 1000);
    });

const Start = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [gameId, setGameId] = useState(null);

    const handleClick = async (e) => {
        setIsLoading(true);

        const { gameId } = await createNewGame();

        setIsLoading(false);

        setGameId(gameId);
    };

    if (gameId !== null) {
        return <Redirect to={`/join/${gameId}`} />;
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <button onClick={handleClick}>Create</button>
            <br />
            <Link to="/join">Join</Link>
        </>
    );
};

export default Start;

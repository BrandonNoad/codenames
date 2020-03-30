import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

const game = { id: 123 };

const createNewGame = async () =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(game);
        }, 1000);
    });

const Start = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [game, setGame] = useState(null);

    const handleClick = async (e) => {
        setIsLoading(true);

        const game = await createNewGame();

        setIsLoading(false);

        setGame(game);
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (game !== null) {
        return <Redirect to={`/join?gameId=${game.id}`} />;
    }

    return (
        <>
            <button onClick={handleClick}>New Game</button>
            <br />
            <Link to="/join">Join Game</Link>
        </>
    );
};

export default Start;

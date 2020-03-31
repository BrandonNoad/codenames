import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button } from 'theme-ui';

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
            <Button mr={2} onClick={handleClick}>
                New Game
            </Button>
            <Button variant="secondary" as={Link} to="/join">
                Join Game
            </Button>
        </>
    );
};

export default Start;

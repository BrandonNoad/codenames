import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button } from 'theme-ui';
import Axios from 'axios';

const Start = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [game, setGame] = useState(null);

    const handleClickNewGame = async (e) => {
        setIsLoading(true);

        const { data: game } = await Axios.post(
            `${process.env.REACT_APP_BASE_URL}/.netlify/functions/createGame`
        );

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
            <Button mr={2} onClick={handleClickNewGame}>
                New Game
            </Button>
            <Button as={Link} to="/join">
                Join Game
            </Button>
        </>
    );
};

export default Start;

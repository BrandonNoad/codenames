import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';

const getStyle = (secretIdentity) => {
    if (secretIdentity === null) {
        return ['#000', '#999'];
    }

    if (secretIdentity === 'redAgent') {
        return ['#fff', 'red'];
    }

    if (secretIdentity === 'blueAgent') {
        return ['#fff', 'blue'];
    }

    if (secretIdentity === 'innocentBystander') {
        return ['#000', '#F9EBEA'];
    }

    return ['#fff', 'black'];
};

const getSecretIdentity = (n) => {
    if (n % 4 === 0) {
        return 'redAgent';
    }

    if (n % 4 === 1) {
        return 'blueAgent';
    }

    if (n % 4 === 2) {
        return 'innocentBystander';
    }

    if (n % 4 === 3) {
        return 'assassin';
    }
};

const makeMockGame = async (gameId, role) => {
    const { data: words } = await Axios.get('https://random-word-api.herokuapp.com/word?number=25');

    return {
        gameId,
        startingTeam: 'red',
        cards: words.map((word, idx) => ({
            codename: word,
            secretIdentity: role === 'operative' ? null : getSecretIdentity(idx),
            isIdentityRevealed: false
        }))
    };
};

const Game = () => {
    const { gameId, role } = useParams();

    const [game, setGame] = useState(null);

    useEffect(() => {
        makeMockGame(gameId, role).then((game) => {
            setGame(game);
        });
    }, []);

    if (game === null) {
        return <p>Loading...</p>;
    }

    return (
        <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
            {game.cards.map((card, idx) => {
                const [color, backgroundColor] = getStyle(card.secretIdentity);

                return (
                    <div
                        key={idx}
                        style={{
                            color,
                            padding: '8px',
                            width: '160px',
                            backgroundColor,
                            border: '1px solid #222',
                            borderRadius: '0.25rem',
                            margin: '0 4px 4px 0'
                        }}
                    >
                        {card.codename}
                    </div>
                );
            })}
        </div>
    );
};

export default Game;

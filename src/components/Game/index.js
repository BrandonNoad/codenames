import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';

const getRandomIntInclusive = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

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

const counts = {
    red: 9,
    blue: 8,
    bystander: 7,
    assassin: 1
};

const getSecretIdentities = () => {
    let numIdentitiesToAssign = 25;

    const results = [];

    while (numIdentitiesToAssign > 0) {
        const rand = getRandomIntInclusive(0, 24);

        if (results[rand] === undefined) {
            if (counts.red > 0) {
                counts.red -= 1;
                results[rand] = 'redAgent';
            } else if (counts.blue > 0) {
                counts.blue -= 1;
                results[rand] = 'blueAgent';
            } else if (counts.bystander > 0) {
                counts.bystander -= 1;
                results[rand] = 'innocentBystander';
            } else {
                counts.assassin -= 1;
                results[rand] = 'assassin';
            }

            numIdentitiesToAssign -= 1;
        }
    }

    return results;
};

const makeMockGame = async (gameId, role) => {
    const { data: words } = await Axios.get('https://random-word-api.herokuapp.com/word?number=25');

    const secretIdentities = getSecretIdentities();

    return {
        gameId,
        turn: 'red',
        cards: words.map((word, idx) => ({
            codename: word,
            secretIdentity: role === 'operative' ? null : secretIdentities[idx],
            isIdentityRevealed: false
        }))
    };
};

const useQuery = () => new URLSearchParams(useLocation().search);

const Game = () => {
    const { gameId } = useParams();

    const query = useQuery();

    const team = query.get('team');

    const role = query.get('role');

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
        <>
            <p>Team: {team === 'red' ? 'Red' : 'Blue'}</p>
            <p>{game.turn === team ? "It's your turn!" : 'Wait for the other team to guess...'}</p>
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
        </>
    );
};

export default Game;

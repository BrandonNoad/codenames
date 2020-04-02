import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Grid, Flex, Text, Card } from 'theme-ui';

const NUM_SECONDS_IN_AN_HOUR = 60 * 60;

const FETCH_INTERVAL_IN_SECONDS = 10;

const FETCH_LIMIT = NUM_SECONDS_IN_AN_HOUR / FETCH_INTERVAL_IN_SECONDS;

const fetchGame = (gameId, role) =>
    Axios.get(`${process.env.REACT_APP_BASE_URL}/.netlify/functions/fetchGame`, {
        params: { gameId, role }
    });

const getStyles = (secretIdentity) => {
    if (secretIdentity === null) {
        return ['greyPalette.8', 'yellowPalette.0', 'yellowPalette.1'];
    }

    if (secretIdentity === 'redAgent') {
        return ['white', 'redPalette.0', 'redPalette.1'];
    }

    if (secretIdentity === 'blueAgent') {
        return ['white', 'bluePalette.0', 'bluePalette.1'];
    }

    if (secretIdentity === 'innocentBystander') {
        return ['greyPalette.8', 'warmGreyPalette.0', 'warmGreyPalette.1'];
    }

    // assassin
    return ['white', 'greyPalette.9', 'black'];
};

const getCursorValue = (role, card) => {
    if (role !== 'operative') {
        return 'default';
    }

    if (card.isIdentityRevealed) {
        return 'default';
    }

    return 'pointer';
};

const useQuery = () => new URLSearchParams(useLocation().search);

const Game = () => {
    const numFetchesRef = useRef(0);

    const { gameId } = useParams();

    const query = useQuery();

    const team = query.get('team');

    const role = query.get('role').toLowerCase();

    const [game, setGame] = useState(null);

    useEffect(() => {
        const fetchAndSetGame = async () => {
            const { data: game } = await fetchGame(gameId, role);

            setGame(game);
        };

        fetchAndSetGame();

        const intervalId = setInterval(() => {
            fetchAndSetGame();

            numFetchesRef.current++;

            if (numFetchesRef.current >= FETCH_LIMIT) {
                clearInterval(intervalId);
            }
        }, 10 * 1000);

        return () => clearInterval(intervalId);
    }, [gameId, role]);

    if (game === null) {
        return <p>Loading...</p>;
    }

    const handleGuessFactory = (card) => async (e) => {
        if (
            role !== 'operative' ||
            card.isIdentityRevealed ||
            !window.confirm(`Are you sure you want to guess ${card.codename.toUpperCase()}?`)
        ) {
            return;
        }

        await Axios.post(`${process.env.REACT_APP_BASE_URL}/.netlify/functions/guess`, {
            gameId,
            codename: card.codename
        });

        const { data: game } = await fetchGame(gameId, role);

        setGame(game);
    };

    const cardsRemaining = {
        redAgent: game.startingTeam === 'red' ? 9 : 8,
        blueAgent: game.startingTeam === 'blue' ? 9 : 8,
        innocentBystander: 7,
        assassin: 1
    };

    game.cards.forEach((card) => {
        if (card.isIdentityRevealed) {
            if (card.secretIdentity === 'redAgent') {
                cardsRemaining.redAgent -= 1;
            } else if (card.secretIdentity === 'blueAgent') {
                cardsRemaining.blueAgent -= 1;
            } else if (card.secretIdentity === 'innocentBystander') {
                cardsRemaining.innocentBystander -= 1;
            } else {
                cardsRemaining.assassin -= 1;
            }
        }
    });

    return (
        <Box>
            <Text
                mb={3}
                sx={{ fontWeight: 'bold' }}
            >{`${game.startingTeam.toUpperCase()} goes first!`}</Text>
            <Grid mb={4} gap={2} columns={[2, 3, 5]}>
                {game.cards.map((card, idx) => {
                    const [color, backgroundColor, backgroundColorHover] = getStyles(
                        card.secretIdentity
                    );

                    return (
                        <Card
                            key={card.codename}
                            p={3}
                            sx={{
                                backgroundColor,
                                textAlign: 'center',
                                cursor: getCursorValue(role, card),
                                '&:hover': {
                                    backgroundColor: backgroundColorHover
                                }
                            }}
                            onDoubleClick={handleGuessFactory(card)}
                        >
                            <Text
                                variant="uppercase"
                                sx={{
                                    color,
                                    fontWeight: 'semibold',
                                    fontSize: 2,
                                    display: 'inline-block'
                                }}
                            >
                                {card.isIdentityRevealed ? '' : card.codename}
                            </Text>
                        </Card>
                    );
                })}
            </Grid>
            {role === 'operative' && (
                <Box>
                    <Grid gap={2} columns={[2, 3, 5]}>
                        {cardsRemaining.redAgent > 0 && (
                            <Card
                                p={3}
                                sx={{
                                    backgroundColor: 'redPalette.0',
                                    textAlign: 'center',
                                    '&:hover': {
                                        backgroundColor: 'redPalette.1'
                                    }
                                }}
                            >
                                <Text sx={{ color: 'white' }}>{`${cardsRemaining.redAgent} ${
                                    cardsRemaining.redAgent === 1 ? 'card' : 'cards'
                                }`}</Text>
                            </Card>
                        )}
                        {cardsRemaining.innocentBystander > 0 && (
                            <Card
                                p={3}
                                sx={{
                                    backgroundColor: 'warmGreyPalette.0',
                                    textAlign: 'center',
                                    '&:hover': {
                                        backgroundColor: 'warmGreyPalette.1'
                                    }
                                }}
                            >
                                <Text sx={{ color: 'greyPalette.8' }}>{`${
                                    cardsRemaining.innocentBystander
                                } ${
                                    cardsRemaining.innocentBystander === 1 ? 'card' : 'cards'
                                }`}</Text>
                            </Card>
                        )}
                        {cardsRemaining.assassin > 0 && (
                            <Card
                                p={3}
                                sx={{
                                    backgroundColor: 'greyPalette.9',
                                    textAlign: 'center',
                                    '&:hover': {
                                        backgroundColor: 'black'
                                    }
                                }}
                            >
                                <Text sx={{ color: 'white' }}>{`${cardsRemaining.assassin} ${
                                    cardsRemaining.assassin === 1 ? 'card' : 'cards'
                                }`}</Text>
                            </Card>
                        )}
                        {cardsRemaining.blueAgent > 0 && (
                            <Card
                                p={3}
                                sx={{
                                    backgroundColor: 'bluePalette.0',
                                    textAlign: 'center',
                                    '&:hover': {
                                        backgroundColor: 'bluePalette.1'
                                    }
                                }}
                            >
                                <Text sx={{ color: 'white' }}>{`${cardsRemaining.blueAgent} ${
                                    cardsRemaining.blueAgent === 1 ? 'card' : 'cards'
                                }`}</Text>
                            </Card>
                        )}
                    </Grid>
                </Box>
            )}
        </Box>
    );
};

export default Game;

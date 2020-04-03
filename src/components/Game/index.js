import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { useColorMode, Box, Flex, Grid, Text, Button } from 'theme-ui';

import PlayingCard, { AgentCardPile } from '../PlayingCard';

const NUM_SECONDS_IN_AN_HOUR = 60 * 60;

const FETCH_INTERVAL_IN_SECONDS = 10;

const FETCH_LIMIT = NUM_SECONDS_IN_AN_HOUR / FETCH_INTERVAL_IN_SECONDS;

const fetchGame = (gameId, role) =>
    Axios.get(`${process.env.REACT_APP_BASE_URL}/.netlify/functions/fetchGame`, {
        params: { gameId, role }
    });

const useQuery = () => new URLSearchParams(useLocation().search);

const Game = () => {
    const [, setColorMode] = useColorMode();

    const numFetchesRef = useRef(0);

    const { gameId } = useParams();

    const query = useQuery();

    const team = query.get('team');

    const role = query.get('role').toLowerCase();

    const [game, setGame] = useState(null);

    useEffect(() => {
        if (game !== null) {
            setColorMode(game.turn);
        }
    }, [game, setColorMode]);

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

    const handleGuessFactory = ({ codename }) => async (e) => {
        if (!window.confirm(`Are you sure you want to guess ${codename.toUpperCase()}?`)) {
            return;
        }

        await Axios.post(`${process.env.REACT_APP_BASE_URL}/.netlify/functions/guess`, {
            gameId,
            codename
        });

        const { data } = await fetchGame(gameId, role);

        setGame(data);
    };

    const handleClickEndTurn = async (e) => {
        if (!window.confirm(`Are you sure you want to end your turn?`)) {
            return;
        }

        await Axios.post(`${process.env.REACT_APP_BASE_URL}/.netlify/functions/toggleTurn`, {
            gameId
        });

        const { data } = await fetchGame(gameId, role);

        setGame(data);
    };

    // TODO: improve this!!
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
            <Flex mb={3} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                {game.turn === team ? (
                    <Text mr={2} sx={{ fontWeight: 'bold' }}>
                        <Text variant="uppercase" sx={{ display: 'inline', color: 'primary' }}>
                            {game.turn}
                        </Text>
                        , it's your turn!
                    </Text>
                ) : (
                    <Text mr={2} sx={{ fontWeight: 'bold' }}>
                        Wait for
                        <Text variant="uppercase" sx={{ display: 'inline', color: 'primary' }}>
                            {` ${game.turn} `}
                        </Text>
                        to finish guessing...
                    </Text>
                )}
                {role === 'operative' && game.turn === team ? (
                    <Button
                        sx={{
                            boxShadow: 'none',
                            color: 'primary',
                            backgroundColor: 'transparent',
                            '&:hover': {
                                color: 'primary',
                                backgroundColor: 'greyPalette.0'
                            }
                        }}
                        onClick={handleClickEndTurn}
                    >
                        End Turn
                    </Button>
                ) : null}
            </Flex>
            <Grid mb={4} gap={3} columns={[2, 3, 5]}>
                {game.cards.map((card) => (
                    <PlayingCard
                        key={card.codename}
                        {...card}
                        isYourTurn={game.turn === team}
                        role={role}
                        onGuess={handleGuessFactory(card)}
                    />
                ))}
            </Grid>
            {role === 'operative' && (
                <Box>
                    <Grid gap={2} columns={[2, 3, 5]}>
                        {cardsRemaining.redAgent > 0 && (
                            <AgentCardPile
                                secretIdentity="redAgent"
                                numCards={cardsRemaining.redAgent}
                            />
                        )}
                        {cardsRemaining.blueAgent > 0 && (
                            <AgentCardPile
                                secretIdentity="blueAgent"
                                numCards={cardsRemaining.blueAgent}
                            />
                        )}
                        {cardsRemaining.innocentBystander > 0 && (
                            <AgentCardPile
                                secretIdentity="innocentBystander"
                                numCards={cardsRemaining.innocentBystander}
                            />
                        )}
                        {cardsRemaining.assassin > 0 && (
                            <AgentCardPile
                                secretIdentity="assassin"
                                numCards={cardsRemaining.assassin}
                            />
                        )}
                    </Grid>
                </Box>
            )}
        </Box>
    );
};

export default Game;

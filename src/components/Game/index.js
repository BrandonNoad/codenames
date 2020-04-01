import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Grid, Text, Card } from 'theme-ui';

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
    const { gameId } = useParams();

    const query = useQuery();

    const team = query.get('team');

    const role = query.get('role').toLowerCase();

    const [game, setGame] = useState(null);

    const [numRefresh, setNumRefresh] = useState(0);

    useEffect(() => {
        (async () => {
            const {
                data: game
            } = await Axios.get(`${process.env.REACT_APP_BASE_URL}/.netlify/functions/fetchGame`, {
                params: { role, gameId }
            });

            setGame(game);
        })();
    }, [gameId, role, numRefresh]);

    if (game === null) {
        return <p>Loading...</p>;
    }

    const handleGuessFactory = (card) => async (e) => {
        if (
            role !== 'operative' ||
            card.isIdentityRevealed ||
            !window.confirm(`Are you sure you want to guess ${card.codename}?`)
        ) {
            return;
        }

        await Axios.post(`${process.env.REACT_APP_BASE_URL}/.netlify/functions/guess`, {
            gameId,
            codename: card.codename
        });

        setNumRefresh(numRefresh + 1);
    };

    return (
        <Box>
            {/* <Text>Team: {team === 'red' ? 'Red' : 'Blue'}</Text>
            <Text mb={3}>
                {game.turn === team ? "It's your turn!" : 'Wait for the other team to guess...'}
            </Text> */}
            <Grid gap={2} columns={[2, 3, 5]}>
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
        </Box>
    );
};

export default Game;

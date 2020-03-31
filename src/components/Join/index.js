import React, { useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { Box, Flex, Button, Label, Input, Radio } from 'theme-ui';

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

    const handleSubmit = (e) => {
        setIsReadyToPlay(true);
    };

    if (isReadyToPlay) {
        return <Redirect to={`/game/${gameId.trim()}?team=${team}&role=${role}`} />;
    }

    return (
        <Box as="form" onSubmit={handleSubmit} sx={{ width: '50%' }}>
            <Label htmlFor="gameId">Game:</Label>
            <Input mb={3} name="gameId" value={gameId} onChange={handleChangeGameId} />
            <Flex mb={3}>
                <Label>
                    <Radio checked={team === 'red'} value="red" onChange={handleChangeTeam} />
                    Red
                </Label>
                <Label>
                    <Radio checked={team === 'blue'} value="blue" onChange={handleChangeTeam} />
                    Blue
                </Label>
            </Flex>
            <Flex mb={3}>
                <Label>
                    <Radio
                        checked={role === 'spymaster'}
                        value="spymaster"
                        onChange={handleChangeRole}
                    />
                    Spymaster
                </Label>
                <Label>
                    <Radio
                        checked={role === 'operative'}
                        value="operative"
                        onChange={handleChangeRole}
                    />
                    Field Operative
                </Label>
            </Flex>
            <Button type="submit" disabled={gameId.trim() === ''}>
                Let's Play!
            </Button>
        </Box>
    );
};

export default Join;

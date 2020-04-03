import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Box, Text } from 'theme-ui';

import Start from '../Start';
import Join from '../Join';
import Game from '../Game';

function App() {
    return (
        <>
            <Router>
                <Box p={3} bg="primary">
                    <Text
                        variant="uppercase"
                        as={Link}
                        sx={{
                            color: 'white',
                            fontSize: 3,
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            '&:hover': {
                                color: '#dedede'
                            }
                        }}
                        to="/"
                    >
                        Codenames
                    </Text>
                </Box>
                <Box p={4}>
                    <Switch>
                        <Route path="/join">
                            <Join />
                        </Route>
                        <Route path="/game/:gameId">
                            <Game />
                        </Route>
                        <Route path="/">
                            <Start />
                        </Route>
                    </Switch>
                </Box>
            </Router>
        </>
    );
}

export default App;

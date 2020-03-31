import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Box, Heading, Text } from 'theme-ui';

import Start from './components/Start';
import Join from './components/Join';
import Game from './components/Game';

function App() {
    return (
        <Box p={4}>
            <Router>
                <Heading mb={3} as="h1">
                    <Text variant="uppercase" as={Link} to="/">
                        Codenames
                    </Text>
                </Heading>
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
            </Router>
        </Box>
    );
}

export default App;

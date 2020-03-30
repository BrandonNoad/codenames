import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Start from './components/Start';
import Join from './components/Join';
import Game from './components/Game';

function App() {
    return (
        <>
            <Router>
                <h1 style={{ color: 'tomato' }}>
                    <Link to="/">Codenames</Link>
                </h1>
                <Switch>
                    <Route path="/join/:gameId?">
                        <Join />
                    </Route>
                    <Route path="/game/:gameId/:role">
                        <Game />
                    </Route>
                    <Route path="/">
                        <Start />
                    </Route>
                </Switch>
            </Router>
        </>
    );
}

export default App;

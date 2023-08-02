import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import RootPage from './pages/Root'
import SignupPage from './pages/Signup'
import LoginPage from './pages/Login'
import LoginSelect from './pages/LoginSelect'

import NotfoundPage from './pages/Notfound'
import MyProfilePage from './pages/MyProfile'
import ProfilePage from './pages/UserProfile'

import ContentPage from './pages/Content'

import './App.css'

const App = () => {
    const isDarkmode = useSelector((state: any) => state.app.isDarkmode);

    const darkTheme = createTheme({
        palette: {
            mode: isDarkmode === true ? 'dark' : 'light',
            primary: {
                main: '#0d6efd',
            },
        },
    });

    return (
        <div>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />

                <Container color="palette.background.default">
                    <BrowserRouter>
                        <Switch>
                            <Route exact path="/" component={RootPage} />
                            <Route path="/profile" component={MyProfilePage} />

                            <Route path="/feed/*" component={ContentPage} />
                            <Route path="/user/*" component={ProfilePage} />

                            <Route path="/auth/select" component={LoginSelect} />
                            <Route path="/auth/login" component={LoginPage} />
                            <Route path="/auth/signup" component={SignupPage} />

                            <Route path='*' component={NotfoundPage} />
                        </Switch>
                    </BrowserRouter>
                </Container>
            </ThemeProvider>
        </div>
    );
};

export default App;
import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import RootPage from './pages/Root'
import SignupPage from './pages/Signup'
import LoginPage from './pages/Login'
import LoginSelectPage from './pages/LoginSelect'

import NotfoundPage from './pages/Notfound'
import MyProfilePage from './pages/MyProfile'
import ProfilePage from './pages/UserProfile'

import ContentPage from './pages/Content'
import FeedWritePage from './pages/Write'
import FeedSearchPage from './pages/Search'



import './App.css'

const App = () => {
    const isDarkmode = useSelector((state: any) => state.app.isDarkmode);
    const isLogin = useSelector((state: any) => state.auth.isLogin);

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


                            <Route
                                path="/profile"
                                render={() => (isLogin ? <MyProfilePage />  : <Redirect to={"/auth/select"} />)}
                            />
                            
                    
                            <Route
                                path="/write"
                                component={() => (isLogin ? <FeedWritePage /> : <Redirect to="/auth/select" /> )}
                            />

                            <Route path="/feed/*" component={ContentPage} />
                            <Route path="/@*" component={ProfilePage} />
                            <Route path="/search/*" component={FeedSearchPage} />


                            <Route path="/auth/select" component={LoginSelectPage} />
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
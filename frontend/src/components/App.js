import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../i18n';
import { ErrorBoundary, Provider as RollbarProvider } from '@rollbar/react';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import store from '../slices';
import AuthProvider from '../contexts/AuthProvider';
import socketManager from '../socketManager';
import { newMessage } from '../slices/messagesSlice';
import { newChannel, removeChannel, renameChannel } from '../slices/channelsSlice';
import routes from '../routes';
import Nav from './Nav';
import Login from './Login';
import Signup from './Signup';
import Chat from './Chat';
import NotFound from './NotFound';
import PrivateRoute from './PrivateRoute';
import ErrorDisplay from './ErrorDisplay';

const rollbarConfig = {
  accessToken: process.env.REACT_APP_ROLLBAR_ACCESS_TOKEN,
  environment: 'testenv',
};

const App = () => {
  useEffect(() => {
    socketManager.subscribe('newMessage', (payload) => { store.dispatch(newMessage(payload)); });
    socketManager.subscribe('newChannel', (payload) => { store.dispatch(newChannel(payload)); });
    socketManager.subscribe('removeChannel', (payload) => { store.dispatch(removeChannel(payload.id)); });
    socketManager.subscribe('renameChannel', (payload) => { store.dispatch(renameChannel(payload)); });
  }, []);

  return (
    <div className="d-flex flex-column h-100">
      <RollbarProvider config={rollbarConfig}>
        <ErrorBoundary fallbackUI={ErrorDisplay}>
          <Router>
            <Provider store={store}>
              <AuthProvider>
                <Nav />
                <Routes>
                  <Route path={routes.loginPagePath()} element={<Login />} />
                  <Route path={routes.signupPagePath()} element={<Signup />} />
                  <Route
                    path={routes.homePagePath()}
                    element={(
                      <PrivateRoute>
                        <Chat />
                      </PrivateRoute>
                  )}
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <ToastContainer />
              </AuthProvider>
            </Provider>
          </Router>
        </ErrorBoundary>
      </RollbarProvider>
    </div>
  );
};

export default App;

import React from 'react';
import { Provider } from 'react-redux';
import { Provider as RollbarProvider } from '@rollbar/react';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import filter from 'leo-profanity';
import io from 'socket.io-client';
import resources from './locales/index.js';
import { ApiContext } from './contexts';
import store from './slices';
import App from './components/App';

const i18n = i18next.createInstance();

await i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru',
    fallbackLng: 'ru',
    debug: true,

    interpolation: {
      escapeValue: false,
    },
  });

const rollbarConfig = {
  accessToken: process.env.REACT_APP_ROLLBAR_ACCESS_TOKEN,
  environment: 'testenv',
};

filter.add(filter.getDictionary('ru'));

const socket = io();

const socketApi = {
  subscribe: (event, callback) => {
    socket.on(event, callback);
  },
  emit: (event, payload, callback) => {
    socket.emit(event, payload, callback);
  },
};

export default async () => (
  <RollbarProvider config={rollbarConfig}>
    <I18nextProvider i18n={i18n}>
      <ApiContext.Provider value={socketApi}>
        <Provider store={store}>
          <App />
        </Provider>
      </ApiContext.Provider>
    </I18nextProvider>
  </RollbarProvider>
);

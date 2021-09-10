import React from 'react';
import userEvent from '@testing-library/user-event';
import { fireEvent, screen } from '@testing-library/react';
import App from '../App';

import { renderWithRouterAndStore } from './testConfig';

const EMAIL_INPUT_TEST_ID = 'email-input';
const PASSWORD_INPUT_TEST_ID = 'password-input';
const VALID_EMAIL = 'alguem@email.com';
const VALID_PASSWORD = '123456';

afterEach(() => jest.clearAllMocks());

describe('1 - Crie uma página inicial de login com os seguintes campos e características:', () => {
  test('A rota para esta página deve ser \'/\'', () => {
    const { history } = renderWithRouterAndStore(<App />, '/mywallet');
    expect(history.location.pathname).toBe('/mywallet');
  });

  test('Crie um local para que o usuário insira seu email e senha', () => {
    renderWithRouterAndStore(<App />, '/mywallet');
    const email = screen.getByTestId(EMAIL_INPUT_TEST_ID);
    const senha = screen.getByTestId(PASSWORD_INPUT_TEST_ID);

    expect(email).toBeInTheDocument();
    expect(senha).toBeInTheDocument();
  });

  test('Crie um botão com o texto \'Entrar\'', () => {
    renderWithRouterAndStore(<App />, '/mywallet');

    const button = screen.getByText(/Entrar/i);
    expect(button).toBeInTheDocument();
  });
});

describe('2 - Realize as seguintes verificações nos campos de email, senha e botão:', () => {
  test('O botão de "Entrar" está desabilitado ao entrar na página', () => {
    renderWithRouterAndStore(<App />, '/mywallet');

    const button = screen.getByText(/Entrar/i);
    expect(button).toBeDisabled();
  });

  test('O botão de "Entrar está desabilitado quando um email inválido é digitado', () => {
    renderWithRouterAndStore(<App />, '/mywallet');

    const email = screen.getByTestId(EMAIL_INPUT_TEST_ID);
    const senha = screen.getByTestId(PASSWORD_INPUT_TEST_ID);
    const button = screen.getByText(/Entrar/i);

    userEvent.type(email, 'email');
    userEvent.type(senha, VALID_PASSWORD);
    expect(button).toBeDisabled();

    userEvent.type(email, 'email@com@');
    userEvent.type(senha, VALID_PASSWORD);
    expect(button).toBeDisabled();

    userEvent.type(email, 'emailcom@');
    userEvent.type(senha, VALID_PASSWORD);
    expect(button).toBeDisabled();

    userEvent.type(email, 'alguem@email.');
    userEvent.type(senha, VALID_PASSWORD);
    expect(button).toBeDisabled();
  });

  test('O botão de "Entrar está desabilitado quando uma senha inválida é digitada', () => {
    renderWithRouterAndStore(<App />, '/mywallet');

    const email = screen.getByTestId(EMAIL_INPUT_TEST_ID);
    const senha = screen.getByTestId(PASSWORD_INPUT_TEST_ID);
    const button = screen.getByText(/Entrar/i);

    userEvent.type(email, VALID_EMAIL);
    userEvent.type(senha, '23456');
    expect(button).toBeDisabled();
  });

  test('O botão de "Entrar" está habilitado quando um email e uma senha válidos são passados', () => {
    renderWithRouterAndStore(<App />, '/mywallet');

    const email = screen.getByTestId(EMAIL_INPUT_TEST_ID);
    const senha = screen.getByTestId(PASSWORD_INPUT_TEST_ID);
    const button = screen.getByText(/Entrar/i);

    userEvent.type(email, VALID_EMAIL);
    userEvent.type(senha, VALID_PASSWORD);
    expect(button).toBeEnabled();
  });
});

describe('3 - Utilize o Redux para salvar no estado global as informações da pessoa logada', () => {
  test('Salve o email no estado da aplicação, com a chave email, assim que o usuário logar.', () => {
    const { store } = renderWithRouterAndStore(<App />, '/mywallet');
    const email = screen.getByTestId(EMAIL_INPUT_TEST_ID);
    const senha = screen.getByTestId(PASSWORD_INPUT_TEST_ID);
    const button = screen.getByText(/Entrar/i);

    userEvent.type(email, VALID_EMAIL);
    userEvent.type(senha, VALID_PASSWORD);
    fireEvent.click(button);

    expect(store.getState().user.email).toBe(VALID_EMAIL);
  });

  test('A rota deve ser mudada para \'/carteira\' após o clique no botão.', () => {
    const { history } = renderWithRouterAndStore(<App />, '/mywallet');
    const email = screen.getByTestId(EMAIL_INPUT_TEST_ID);
    const senha = screen.getByTestId(PASSWORD_INPUT_TEST_ID);
    const button = screen.getByText(/Entrar/i);

    userEvent.type(email, VALID_EMAIL);
    userEvent.type(senha, VALID_PASSWORD);
    fireEvent.click(button);

    setTimeout(
      () => (expect(history.location.pathname).toBe('/mywallet/carteira')),
      3000
    )
  });
});

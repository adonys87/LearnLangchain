import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/server.ts';


test('command upper transforms message into uppercase', async () => {

    const app = createServer();
    const msg = 'make This message uppercase, please!';
    const expected = msg.toUpperCase();
    // Simula uma requisição POST para o endpoint /chat do servidor, enviando a mensagem de teste no corpo da requisição.
    const response = await app.inject({
        method: 'POST',
        url: '/chat',
        body: {
            question: msg
        }
    });
    //compara o status da resposta e o corpo da resposta com os valores esperados, garantindo que a transformação para maiúsculas foi realizada corretamente.
    assert.equal(response.statusCode, 200);
    assert.equal(response.body, expected);
})


test('command lower transforms message into lowercase', async () => {

    const app = createServer();
    const msg = 'MAKE THIS MESSAGE LOWERCASE, PLEASE!';
    const expected = msg.toLowerCase();
    const response = await app.inject({
        method: 'POST',
        url: '/chat',
        body: {
            question: msg
        }
    });
    assert.equal(response.statusCode, 200);
    assert.equal(response.body, expected);
})


test('command lower transforms message into UNKOWN', async () => {

    const app = createServer();
    const msg = 'Hey There!';
    const expected = "Unknown command. Please use 'uppercase' or 'lowercase'.";
    const response = await app.inject({
        method: 'POST',
        url: '/chat',
        body: {
            question: msg
        }
    });
    assert.equal(response.statusCode, 200);
    assert.equal(response.body, expected);
})
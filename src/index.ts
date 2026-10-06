import {createServer} from "./server.ts";

const app = createServer();

await app.listen({port: 3003, host: '0.0.0.0'})

console.log('Server is running on http://localhost:3003');

// app.inject({
//     method: 'POST',
//     url: '/chat',
//     body: {
//         question: 'What is rate limiting and how does it work?'
//     }
// }).then((response) => {
//     console.log('\nResponse status code:', response.statusCode);
//     console.log('Response body:', response.body);
// })
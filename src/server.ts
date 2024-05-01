import fastify from "fastify"

const app = fastify()

app.get('/hello', () => {
    return 'Hello World'
})

app.listen({
    port: 3333
}).then(() => console.log('server is running on port 3333'))


/*
npm init -y
npm i -D typescript
npx tsc --init
npm i fastify
npm i tsx -D
npx tsx src/server.ts
*/
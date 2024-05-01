import fastify from 'fastify'

const app = fastify()

app.get('/hello', () => {
  return 'hi m'
})

app
  .listen({
    port: 3333,
  })
  .then(() => console.log('server is running on port 3333'))

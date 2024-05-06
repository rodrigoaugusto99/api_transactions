import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

app.register(cookie)

app.register(transactionsRoutes, {
  prefix: 'transactions',
})

// app.use((error, request, response, next) => {
//erro do usuario
//   if(error instanceof AppError){
//       return response.status(error.statusCode).json({
//           status: 'error',
//           message: error.message,
//       })
//   }

//   console.log(error)
//erro que nao foi do usuario, entao foi do server
//   return response.status(500).json({
//       status: 'error',
//       message: 'Internal server error',
//   })
  
// })

app
  .listen({
    port: 3333,
  })
  .then(() => console.log('server is running on port 3333'))

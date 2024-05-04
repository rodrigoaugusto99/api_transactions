import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { z } from 'zod'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const { sessionId } = request.cookies

    const cookie = request.headers['set-cookie']

    if(cookie){
      console.log('cookie:', cookie);
      const transactions = await knex('transactions')
              .where('session_id', cookie[0])
              .select()

  return transactions
    }
    
    if (!sessionId) {
      return reply.status(401).send({
          error: 'Unauthorized.'
      });
    }


      console.log('sessionId:', sessionId);
      const transactions = await knex('transactions')
            .where('session_id', sessionId)
            .select()

      return transactions
    


  })

  app.get('/:id', async (request, reply) => {
    const getTransactionsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionsParamsSchema.parse(request.params)

    const sessionId = request.cookies.sessionId

    if (!sessionId) {
      return reply.status(401).send({
        error: 'Unauthorized.',
      })
    }

    const transaction = await knex('transactions')
      .where({
        session_id: sessionId,
        id,
      })
      .first()

    return {
      transaction,
    }
  })

  app.get(
    '/summary',

    async (request, reply) => {
      const { sessionId } = request.cookies

      if (!sessionId) {
        return reply.status(401).send({
          error: 'Unauthorized.',
        })
      }

      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return { summary }
    },
  )

  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    const cookie = request.headers['set-cookie']

    if(cookie && cookie[0] != ''){
      console.log('cookie post:', cookie)
      await knex('transactions').insert({
        id: randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
        session_id: cookie[0],
      })

      reply.header('set-cookie', `sessionId=${cookie[0]}; Path=/; Max-Age=604800;`);

      return reply.status(201).send()
    }

    let sessionId = request.cookies.sessionId

    

    if (!sessionId) {
      sessionId = randomUUID()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

   
      await knex('transactions').insert({
        id: randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
        session_id: sessionId,
      })
  
      reply.header('set-cookie', `sessionId=${sessionId}; Path=/; Max-Age=604800;`);

    return reply.status(201).send()
  })
}

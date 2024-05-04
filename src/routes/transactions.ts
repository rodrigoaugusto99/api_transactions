import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { z } from 'zod'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    

    const sessionIdFromHeader = request.headers['set-cookie']

    if(sessionIdFromHeader){
      console.log('sessionIdFromHeader:', sessionIdFromHeader);
      const transactions = await knex('transactions')
              .where('session_id', sessionIdFromHeader[0])
              .select()

  return transactions
    }

    //const { sessionId } = request.cookies
    const sessionIdFromCookies  = request.cookies.sessionId
    
    if (!sessionIdFromCookies) {
      return reply.status(401).send({
          error: 'Unauthorized.'
      });
    }


      console.log('sessionId:', sessionIdFromCookies);
      const transactions = await knex('transactions')
            .where('session_id', sessionIdFromCookies)
            .select()

      return transactions
    


  })

  app.get('/:id', async (request, reply) => {
    const getTransactionsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionsParamsSchema.parse(request.params)

    const sessionIdFromHeader = request.headers['set-cookie']


    //logica para caso tenha sessionIdPeloHeader (flutter)
    if(sessionIdFromHeader){
      console.log('sessionIdFromHeader:', sessionIdFromHeader);
      const transaction = await knex('transactions')
      .where({
        session_id: sessionIdFromHeader[0],
        id,
      })
      .first()

      //estamos pegando o primeiro elemento, entao nao eh lista.
    return { transaction }
    }
    

//logica para rodar quando nao tiver sessionIdpeloHeader.
//se tiver pelo header, nem continua por aqui pois teve early return.
    const sessionIdFromCookies  = request.cookies.sessionId
    
    
    if (!sessionIdFromCookies) {
      return reply.status(401).send({
          error: 'Unauthorized.'
      });
    }

    const transaction = await knex('transactions')
      .where({
        session_id: sessionIdFromCookies,
        id,
      })
      .first()

      //estamos pegando o primeiro elemento, entao nao eh lista.
    return { transaction }
  })

  //nao tratado para casos do flutter.(cookie no header)
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

    const sessionIdFromHeader = request.headers['set-cookie']

  /*
  se tiver cookie no header && ele nao for nulo, entao vamos 
  fazer usar esse cookie[0] para inserir no banco e retornar
  pro front.

  no caso, tbm tem que ter verificacao se o cookie esta vazio.
  pois no caso do flutter, eh impossivel o cookie ser nulo, pois 
  o cookie la eh iniciado como ''.

  
   */
    if(sessionIdFromHeader && sessionIdFromHeader[0] != ''){
      console.log('cookie post:', sessionIdFromHeader)
      await knex('transactions').insert({
        id: randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
        session_id: sessionIdFromHeader[0],
      })

      reply.header('set-cookie', `sessionId=${sessionIdFromHeader[0]}; Path=/; Max-Age=604800;`);

      return reply.status(201).send()
    }

    let sessionIdFromCookies = request.cookies.sessionId

    
/**
 * se entrou aqui, eh pq nao tem cookie no header.
 * vamos entao verificar se tem sessionId (que veio dos cookies) da web.
 * se nao tiver, quer dizer que nao tem cookie tanto no mobile quanto na
 * web, entao vamos criar um cookie do zero e enviar pro front.
 * 
 * agora, tanto no flutter quando no react, vms ter acesso a esse sessionId.
 * no react, vms guardar nos cookies e usar pras outras requisicoes.
 * 
 * no flutter, vamos guardar o sessionId numa variavel pra usar nas outras
 * requisicoes. Sera feito persistencia com shared preferences para esse token
 * no flutter.
 */
    if (!sessionIdFromCookies) {
      sessionIdFromCookies = randomUUID()

      reply.setCookie('sessionId', sessionIdFromCookies, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    console.log('sessionIdFromCookies post:', sessionIdFromCookies)
      await knex('transactions').insert({
        id: randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
        session_id: sessionIdFromCookies,
      })
  
      reply.header('set-cookie', `sessionId=${sessionIdFromCookies}; Path=/; Max-Age=604800;`);

    return reply.status(201).send()
  })
}

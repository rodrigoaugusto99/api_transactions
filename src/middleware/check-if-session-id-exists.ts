import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionIdByCookies = request.cookies.sessionId
  const sessionIdByHeader = request.headers['set-cookie']


  console.log(sessionIdByCookies)
  console.log(sessionIdByHeader)

  if (sessionIdByHeader && sessionIdByHeader[0] == '') {
    console.log('sem sessionIdByHeader')
    
   return reply.status(401).send({
      error: 'Unauthorized.',
    })
  }

  if (!sessionIdByCookies && !sessionIdByHeader) {
    console.log('sem sessionIdByCookies')
   return reply.status(401).send({
      error: 'Unauthorized.',
    })
  }

}
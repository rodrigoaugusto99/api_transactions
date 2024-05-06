import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionIdByCookies = request.cookies.sessionId
  const sessionIdByHeader = request.headers['set-cookie']


  console.log(sessionIdByCookies)
  console.log(sessionIdByHeader)

  if (!sessionIdByCookies) {
    console.log('sem sessionIdByCookies')
  }

  if (sessionIdByHeader && sessionIdByHeader[0] == '') {
    console.log('sem sessionIdByHeader')
  }

  //cai aqui se nao tiver cookie no cookie ou no header
  if(!sessionIdByCookies && sessionIdByHeader && sessionIdByHeader[0] == ''){
    return reply.status(401).send({
      error: 'Unauthorized.',
    })
  }
}
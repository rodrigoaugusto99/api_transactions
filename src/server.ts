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

git init
git add .
git commit -m "initial commit" 
git remote add origin https://github.com/rodrigoaugusto99/api_rest_node_test.git
git push -u origin master

npm i knex sqlite3
knexfile.ts
@types w/ knex.d.ts
script "knex": "node --no-warnings --import tsx ./node_modules/knex/bin/cli.js"
npm run knex -- migrate:make create-documents    
*/
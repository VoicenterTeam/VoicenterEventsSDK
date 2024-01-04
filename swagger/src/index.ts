import fastify from 'fastify'

const app = fastify()

const swaggerOptions = {
    swagger: {
        ...require('../../generated/Swagger.json'),
    }
}

console.log(swaggerOptions.swagger)

app.register(require('@fastify/swagger'), swaggerOptions)

const start = async () => {
    try {
        await app.listen({
            host: 'localhost',
            port: 3000 
        })

        console.log('Server is running on port: 3000')
    } catch (err) {
        console.error('Error starting server:', err)

        process.exit(1)
    }
}

start()

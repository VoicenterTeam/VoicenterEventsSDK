import fs from 'fs'
import fastify from 'fastify'
import fastifySwagger from '@fastify/swagger'

const app = fastify()

const start = async () => {
    try {
        if (!fs.existsSync('./generated/Swagger.json')) {
            console.log('Swagger.json file not generated. Try to run: npm run update')

            return
        }

        const swagger = JSON.parse(fs.readFileSync('./generated/Swagger.json').toString())

        const swaggerOptions = {
            swagger
        }

        console.log(swaggerOptions)

        app.register(fastifySwagger, swaggerOptions)

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

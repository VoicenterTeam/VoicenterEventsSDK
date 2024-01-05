import fs from 'fs'
import fastify from 'fastify'
import fastifySwagger from 'fastify-swagger'
import openapiGlue from 'fastify-openapi-glue'

const app = fastify()

const start = async () => {
    try {
        if (!fs.existsSync('./generated/Swagger.json')) {
            console.log('Swagger.json file not generated. Try to run: npm run update')

            return
        }

        const swagger = JSON.parse(fs.readFileSync('./generated/Swagger.json').toString())

        const swaggerOptions = {
            routePrefix: '/documentation',
            exposeRoute: true,
            swagger: {
                ...swagger,
                schemes: [ 'https', 'http' ],
                securityDefinitions: {
                    JWT: {
                        type: 'apiKey',
                        name: 'Authorization',
                        in: 'header'
                    }
                },
                security: [ { JWT: [] } ]
            },
            uiConfig: {
                docExpansion: 'full',
                deepLinking: false
            }
        }

        const openapiGlueOptions = {
            specification: './generated/Swagger.json',
            service: {},
        }

        app.register(fastifySwagger, swaggerOptions)

        app.register(openapiGlue, openapiGlueOptions)

        await app.listen({
            port: 3000
        })

        console.log('Server is running on port: 3000')
    } catch (err) {
        console.error('Error starting server:', err)

        process.exit(1)
    }
}

start()

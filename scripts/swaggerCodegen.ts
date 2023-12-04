import { join } from 'path'
import { codegen } from 'swagger-axios-codegen'

codegen({
    methodNameMode: 'operationId',
    outputDir: join(process.cwd(), 'src', 'core', 'generated', 'service'),
    remoteUrl: process.env.APP_API_SWAGGER_URL,
})
    .catch(({ response }) => {
        const message = response.data.message

        console.error(`Cannot generate swagger services, error: \n ${message}`)
    })

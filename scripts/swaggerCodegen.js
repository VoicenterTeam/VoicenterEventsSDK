import { join } from 'path'
import { codegen } from 'swagger-axios-codegen'

codegen({
    methodNameMode: 'operationId',
    outputDir: join(process.cwd(), 'src', 'core', 'generated', 'service'),
    remoteUrl: 'https://apiver2.voicenter.co/documentation/json',
})
    .catch(error => {
        console.error(`Cannot generate swagger services, error: ${error}`)
    })

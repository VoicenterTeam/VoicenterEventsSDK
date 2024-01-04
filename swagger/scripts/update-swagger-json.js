import fs from 'fs'
import mysql from '@voicenter-team/mysql-dynamic-cluster'

const connection = mysql.createPoolCluster({
    clusterName: 'demo',
    hosts: [
        {
            host: '192.168.187.22',
            port: 3306,
            name: 'lab22',
        }
    ],
    // Configuration for all pools
    defaultPoolSettings: {
        user: 'api',
        password: 'SecretAPI35t478p3!!!',
        database: 'voicenter_core',
        docsDatabase: 'monitor_events_api_doc',
        charset: 'utf8mb4',
        port: 3313,
        // validators: [],
        // loadFactors: [],
    },
})

const pathToFile = 'generated/'
const filename = 'Swagger.json'
const fullPath = pathToFile + filename

const generate = async () => {
    await connection.connect()

    const results = await connection.query('SELECT monitor_events_api_doc.FN_GetSwagger(0.01) as data')

    const targetResult = results[0].data

    console.log(targetResult)

    const targetResultString = JSON.stringify(targetResult)

    if (!fs.existsSync(pathToFile)) {
        fs.mkdirSync(pathToFile, { recursive: true })
    }

    fs.writeFile(fullPath, targetResultString, (err) => {
        if (err) throw err
        console.log('Swagger.json is updated!')
    })

    await connection.disconnect()
}

generate().then(data => console.log(data))
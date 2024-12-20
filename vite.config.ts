import { resolve } from 'path'
import { defineConfig, loadEnv, ConfigEnv } from 'vite'
import dts from 'vite-plugin-dts'

export default ({ mode }: ConfigEnv) => {
    process.env = {
        ...process.env,
        ...loadEnv(mode, process.cwd(), '')
    }

    return defineConfig({
        build: {
            rollupOptions: {
                external: [ 'ws' ],
                output: {
                    exports: 'named'
                }
            },
            outDir: 'dist',
            sourcemap: true,
            commonjsOptions: {
                esmExternals: true
            },
            lib: {
                entry: resolve(__dirname, 'src/index.ts'),
                formats: [ 'es', 'cjs', 'umd', 'iife' ],
                name: 'VoicenterEventsSDK',
                fileName: (format) => {
                    return `voicenter-events-sdk.${format}.js`
                },
            }
        },
        plugins: [
            dts({
                copyDtsFiles: true,
                rollupTypes: true,
                bundledPackages: [
                    '@voicenter-team/real-time-events-types'
                ]
            })
        ],
        resolve: {
            alias: {
                '@': resolve(__dirname, './src'),
                voicenterEventsSDK: resolve(__dirname, './src'),
            }
        }
    })
}

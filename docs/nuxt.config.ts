// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'
import { resolve } from 'path'

export default defineNuxtConfig({
    devtools: { enabled: true },
    extends: [
        // [ '../../nuxt-ui/nuxt-ui-new', { install: true } ]
        [ 'github:voicenter-team-documentation-template', { install: true } ]
    ],

    // modules: ["@nuxt/content"]
    routeRules: {
        '/': { prerender: true }
    },

    css: [
        // join(currentDirLocal, 'assets/css/main.css'),
        './assets/css/tailwind.css'
    ],

    uiTypedoc: {
        typesGenerate: true,
        entryPoints: [ resolve(__dirname, '../dist/voicenter-events-sdk.d.ts') ]
    },

    compatibilityDate: '2024-08-21',
    alias: {
        sdk: fileURLToPath(new URL('../src', import.meta.url)),
        voicenterEventsSDK: fileURLToPath(new URL('../src', import.meta.url)),
        doc: fileURLToPath(new URL('./', import.meta.url)),
        '@': resolve(__dirname, '../src')
    }
})

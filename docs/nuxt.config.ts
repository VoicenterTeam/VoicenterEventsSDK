// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'
import { resolve } from 'path'
import { useNuxt } from '@nuxt/kit'

// Workaround: documentation-template lists its module as a relative path ('./modules/typedocGenerate.ts').
// Nuxt >= 3.16 resolves relative module paths from this project's rootDir, not from the layer's folder.
// Remove once the template uses an absolute path (e.g. join(currentDirLocal, './modules/typedocGenerate.ts')).
const TEMPLATE_TYPEDOC_MODULE = './modules/typedocGenerate.ts'

export default defineNuxtConfig({
    hooks: {
        'modules:before' () {
            const nuxt = useNuxt()
            const layer = nuxt.options._layers.find(l => l.config.modules?.includes(TEMPLATE_TYPEDOC_MODULE))
            if (!layer) {
                return
            }
            nuxt.options.modules = nuxt.options.modules.map(m =>
                m === TEMPLATE_TYPEDOC_MODULE ? resolve(layer.config.rootDir, TEMPLATE_TYPEDOC_MODULE) : m
            )
        }
    },

    devtools: { enabled: true },
    extends: [
        // [ '../../nuxt-ui/nuxt-ui-new', { install: true } ]
        [ 'github:VoicenterTeam/documentation-template', { install: true } ]
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

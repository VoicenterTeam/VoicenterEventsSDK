<template>
    <div>
        <p v-if="loading">
            Loading...
        </p>

        <template v-else>
            <div>
                <pre><code style="color: black">{{ JSON.stringify(events, null, 4) }}</code></pre>
            </div>

            <div>
                <form @submit.prevent="login">
                    <input type="text" v-model="token" placeholder="token"/>

                    <button type="submit">Login</button>
                </form>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import EventsSdkClass from '@/index'
import {eventsSdkDefaultOptions} from '@/classes/events-sdk/events-sdk-default-options'
import {EventsEnum} from '@/enum/events.enum'
import {EventTypeData} from '@/types/events'

/* Data */
const token = ref('QMSVU9dwNYC9Le9VCBqx24AB9TYyWj9Xn5aCPV0GFHIWoShQqfPtnAPmnw24xpJIUSsDDtlac2OPpjx0t3MSkxH3AhiQGHCeGZ8e')
const loading = ref(false)
const loggedId = ref(false)
const events = reactive<{ [K in EventsEnum]?: Array<EventTypeData<K>> }>({})

/* Methods */
async function login() {
    if (!token.value) {
        return alert('Token is required')
    }

    loading.value = true

    const sdk = new EventsSdkClass({
        ...eventsSdkDefaultOptions,
        token: token.value,
    })

    await sdk.init()

    sdk.on(
        EventsEnum.ALL_DIALER_STATUS,
        ({ data }) => {
            console.log(EventsEnum.ALL_DIALER_STATUS, data)

            if (!events[EventsEnum.ALL_DIALER_STATUS]) {
                events[EventsEnum.ALL_DIALER_STATUS] = []
            }

            events[EventsEnum.ALL_DIALER_STATUS]?.push(data)
        }
    )

    sdk.on(
        EventsEnum.ALL_EXTENSION_STATUS,
        ({ data }) => {
            console.log(EventsEnum.ALL_EXTENSION_STATUS, data)

            if (!events[EventsEnum.ALL_EXTENSION_STATUS]) {
                events[EventsEnum.ALL_EXTENSION_STATUS] = []
            }

            events[EventsEnum.ALL_EXTENSION_STATUS]?.push(data)
        }
    )

    sdk.on(
        EventsEnum.ALL_USERS_STATUS,
        ({ data }) => {
            console.log(EventsEnum.ALL_USERS_STATUS, data)

            if (!events[EventsEnum.ALL_USERS_STATUS]) {
                events[EventsEnum.ALL_USERS_STATUS] = []
            }

            events[EventsEnum.ALL_USERS_STATUS]?.push(data)
        }
    )

    sdk.on(
        EventsEnum.QUEUE_EVENT,
        ({ data }) => {
            console.log(EventsEnum.QUEUE_EVENT, data)

            if (!events[EventsEnum.QUEUE_EVENT]) {
                events[EventsEnum.QUEUE_EVENT] = []
            }

            events[EventsEnum.QUEUE_EVENT]?.push(data)
        }
    )

    sdk.on(
        EventsEnum.EXTENSION_EVENT,
        ({ data }) => {
            console.log(EventsEnum.EXTENSION_EVENT, data)

            if (!events[EventsEnum.EXTENSION_EVENT]) {
                events[EventsEnum.EXTENSION_EVENT] = []
            }

            events[EventsEnum.EXTENSION_EVENT]?.push(data)
        }
    )

    sdk.on(
        EventsEnum.LOGIN_SUCCESS,
        ({ data }) => {
            console.log(EventsEnum.LOGIN_SUCCESS, data)
            if (!events[EventsEnum.LOGIN_SUCCESS]) {
                events[EventsEnum.LOGIN_SUCCESS] = []
            }

            loggedId.value = true
            loading.value = false

            events[EventsEnum.LOGIN_SUCCESS]?.push(data)
            alert('Login success')
        }
    )

    sdk.on(
        EventsEnum.LOGIN_STATUS,
        ({ data }) => {
            console.log(EventsEnum.LOGIN_STATUS, data)
            if (!events[EventsEnum.LOGIN_STATUS]) {
                events[EventsEnum.LOGIN_STATUS] = []
            }

            events[EventsEnum.LOGIN_STATUS]?.push(data)
        }
    )

    setTimeout(
        () => {
            if (!loggedId.value) {
                loading.value = false
                alert('Login failed')
            }
        },
        5000
    )
}
</script>

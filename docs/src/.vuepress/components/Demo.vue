<template>
    <div>
        <p v-if="loading">
            Loading...
        </p>

        <template v-else>
            <div v-if="loggedId">
                <pre><code style="color: black">{{ JSON.stringify(events, null, 4) }}</code></pre>
            </div>

            <div v-else>
                <form @submit.prevent="login">
                    <input type="text" v-model="token" placeholder="token" />

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
const token = ref('')
const loading = ref(false)
const loggedId = ref(false)
const events = reactive<{ [K in EventsEnum]?: Array<EventTypeData<K>> }>({})

/* Methods */
function login() {
    if (!token.value) {
        return alert('Token is required')
    }

    loading.value = true

    const sdk = new EventsSdkClass({
        ...eventsSdkDefaultOptions,
        token: token.value,
    })

    sdk.init()

    sdk.socket?.on(
        EventsEnum.QUEUE_EVENT,
        (data) => {
            console.log(EventsEnum.QUEUE_EVENT, data)

            if (!events[EventsEnum.QUEUE_EVENT]) {
                events[EventsEnum.QUEUE_EVENT] = []
            }

            events[EventsEnum.QUEUE_EVENT]?.push(data)
        }
    )
    sdk.socket?.on(
        EventsEnum.EXTENSION_EVENT,
        (data) => {
            console.log(EventsEnum.EXTENSION_EVENT, data)

            if (!events[EventsEnum.EXTENSION_EVENT]) {
                events[EventsEnum.EXTENSION_EVENT] = []
            }

            events[EventsEnum.EXTENSION_EVENT]?.push(data)
        }
    )
    sdk.socket?.on(
        EventsEnum.ALL_DIALER_STATUS,
        (data) => {
            console.log(EventsEnum.ALL_DIALER_STATUS, data)

            if (!events[EventsEnum.ALL_DIALER_STATUS]) {
                events[EventsEnum.ALL_DIALER_STATUS] = []
            }

            events[EventsEnum.ALL_DIALER_STATUS]?.push(data)
        }
    )

    sdk.socket?.on(
        EventsEnum.LOGIN_SUCCESS,
        (data) => {
            console.log(EventsEnum.LOGIN_SUCCESS, data)

            loggedId.value = true
            loading.value = false
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

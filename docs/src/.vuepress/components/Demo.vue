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
import {LoginType} from "@/enum/auth.enum";

/* Data */
const token = ref('lJVBSEk084tzLaFpIWTReBw54trHD2Jlt8hThhX6OAxJ5IjyCC740znrXXgIzj1QtM67n2NOEGNn4SjrPJxuvkxbFb4tWHjS3cyh')
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
        "token": "lJVBSEk084tzLaFpIWTReBw54trHD2Jlt8hThhX6OAxJ5IjyCC740znrXXgIzj1QtM67n2NOEGNn4SjrPJxuvkxbFb4tWHjS3cyh",
        "serverFetchStrategy": "remote",
        "url": "https://monitor2.comms24x7.com/monitorAPI/getMonitorUrls",
        "loginUrl": "https://loginapi.comms24x7.com/monitorAPI/Login",
        "refreshTokenUrl": "https://loginapi.comms24x7.com/monitorAPI/RefreshIdentityToken",
        "servers": [{
            "URLID": 1,
            "Priority": 5,
            "Version": "1.3.7",
            "Domain": "monitor1.comms24x7.com"
        }, {"URLID": 2, "Priority": 4, "Version": "1.3.7", "Domain": "monitor2.comms24x7.com"}]
    })

    await sdk.init()

    sdk.on(
        EventsEnum.ALL_DIALER_STATUS,
        ({ data }) => {

            if (!events[EventsEnum.ALL_DIALER_STATUS]) {
                events[EventsEnum.ALL_DIALER_STATUS] = []
            }

            events[EventsEnum.ALL_DIALER_STATUS]?.push(data)
        }
    )

    sdk.on(
        EventsEnum.ALL_EXTENSION_STATUS,
        ({ data }) => {

            if (!events[EventsEnum.ALL_EXTENSION_STATUS]) {
                events[EventsEnum.ALL_EXTENSION_STATUS] = []
            }

            events[EventsEnum.ALL_EXTENSION_STATUS]?.push(data)
        }
    )

    sdk.on(
        EventsEnum.ALL_USERS_STATUS,
        ({ data }) => {

            if (!events[EventsEnum.ALL_USERS_STATUS]) {
                events[EventsEnum.ALL_USERS_STATUS] = []
            }

            events[EventsEnum.ALL_USERS_STATUS]?.push(data)
        }
    )

    sdk.on(
        EventsEnum.QUEUE_EVENT,
        ({ data }) => {

            if (!events[EventsEnum.QUEUE_EVENT]) {
                events[EventsEnum.QUEUE_EVENT] = []
            }

            events[EventsEnum.QUEUE_EVENT]?.push(data)
        }
    )

    sdk.on(
        EventsEnum.EXTENSION_EVENT,
        ({ data }) => {

            if (!events[EventsEnum.EXTENSION_EVENT]) {
                events[EventsEnum.EXTENSION_EVENT] = []
            }

            events[EventsEnum.EXTENSION_EVENT]?.push(data)
        }
    )

    sdk.on(
        EventsEnum.LOGIN_SUCCESS,
        ({ data }) => {
            if (!events[EventsEnum.LOGIN_SUCCESS]) {
                events[EventsEnum.LOGIN_SUCCESS] = []
            }

            loggedId.value = true
            loading.value = false

            events[EventsEnum.LOGIN_SUCCESS]?.push(data)
        }
    )

    sdk.on(
        EventsEnum.LOGIN_STATUS,
        ({ data }) => {
            if (!events[EventsEnum.LOGIN_STATUS]) {
                events[EventsEnum.LOGIN_STATUS] = []
            }

            events[EventsEnum.LOGIN_STATUS]?.push(data)
        }
    )

    sdk.on(
        '*',
        (data) => {
            switch (data.name) {
                case EventsEnum.ALL_DIALER_STATUS:
                    console.log(`FROM ALL ${EventsEnum.ALL_DIALER_STATUS}`, data)
                    break
                case EventsEnum.ALL_EXTENSION_STATUS:
                    console.log(`FROM ALL ${EventsEnum.ALL_EXTENSION_STATUS}`, data)
                    break
                case EventsEnum.ALL_USERS_STATUS:
                    console.log(`FROM ALL ${EventsEnum.ALL_USERS_STATUS}`, data)
                    break
                case EventsEnum.QUEUE_EVENT:
                    console.log(`FROM ALL ${EventsEnum.QUEUE_EVENT}`, data)
                    break
                case EventsEnum.EXTENSION_EVENT:
                    console.log(`FROM ALL ${EventsEnum.EXTENSION_EVENT}`, data)
                    break
                case EventsEnum.LOGIN_SUCCESS:
                    console.log(`FROM ALL ${EventsEnum.LOGIN_SUCCESS}`, data)
                    break
                case EventsEnum.LOGIN_STATUS:
                    console.log(`FROM ALL ${EventsEnum.LOGIN_STATUS}`, data)
                    break
                case EventsEnum.ONLINE_STATUS_EVENT:
                    console.log(`FROM ALL ${EventsEnum.ONLINE_STATUS_EVENT}`, data)
                    break
                default:
                    console.log('Unknown event', data)

            }
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

<template>
    <div>
        <Transition name="fade">
            <div v-if="isOnline && showSuccessNotification" class="message message--success" key="success">
                Connection established!
            </div>
        </Transition>

        <Transition name="fade">
            <p v-if="!isOnline && !attemptToConnect" class="message message--error" key="error">
                No connection
            </p>
        </Transition>

      <Transition name="attempt-to-connect">
                <p v-if="attemptToConnect && !isOnline"  class="message message--warning" key="warning">
                            Trying to connect to {{ attemptToConnect }}
                </p>
      </Transition>

        <p v-if="loading && isOnline">
            Loading...
        </p>

        <template v-else>
            <json-viewer :value="events" />

            <div>
                <form @submit.prevent="login">
                    <input type="text" v-model="token" placeholder="token"/>

                    <button type="submit">
                        {{ loggedId ? 'Reconnect' : 'Login' }}
                    </button>
                </form>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import JsonViewer from 'vue-json-viewer'
import {EventsEnum} from '@voicenter-team/real-time-events-types'
import EventsSdkClass from 'voicenterEventsSDK/index'
import {EventTypeData} from 'voicenterEventsSDK/types/events'
import {LoginType} from "voicenterEventsSDK/enum/auth.enum";

/* Data */
const showSuccessNotification = ref(false)
const isOnline = ref(false)
const attemptToConnect = ref<string | undefined>(undefined)
const token = ref('')
const loading = ref(false)
const loggedId = ref(false)
const events = reactive<{ [K in EventsEnum]?: Array<EventTypeData<K>> }>({})
let eventsdk: EventsSdkClass | undefined

/* Methods */
async function login() {
    let tokenValue = token.value

    if (!token.value) {
        tokenValue = 'QMSVU9dwNYC9Le9VCBqx24AB9TYyWj9Xn5aCPV0GFHIWoShQqfPtnAPmnw24xpJIUSsDDtlac2OPpjx0t3MSkxH3AhiQGHCeGZ8e'
    }

    loading.value = true

    if (eventsdk) {
        eventsdk.disconnect()
        eventsdk = undefined
    }

    const sdk = new EventsSdkClass({
      loginUrl: "https://loginapidev.voicenter.co.il/Auth/Login/Voicenter/Monitor",
      refreshTokenUrl: "https://loginapidev.voicenter.co.il/Auth/RefreshToken",
      getSettingsUrl: "https://loginapidev.voicenter.co.il/Application/GetSettings",
      loginType: LoginType.TOKEN, // <=== "User" or "Token"
      token: tokenValue,
      password: '78253050510',
      email: 'test2@status.com',
      isNewStack: true
    })

    sdk.init()

    eventsdk = sdk

    sdk.on(
        EventsEnum.ALL_DIALER_STATUS,
        ({ data }) => {
            if (!events[EventsEnum.ALL_DIALER_STATUS]) {
                events[EventsEnum.ALL_DIALER_STATUS] = []
            }

            events[EventsEnum.ALL_DIALER_STATUS] = [
                ...events[EventsEnum.ALL_DIALER_STATUS],
                data
            ]
        }
    )

    sdk.on(
        EventsEnum.ALL_EXTENSION_STATUS,
        ({ data }) => {

            if (!events[EventsEnum.ALL_EXTENSION_STATUS]) {
                events[EventsEnum.ALL_EXTENSION_STATUS] = []
            }

            events[EventsEnum.ALL_EXTENSION_STATUS] = [
                ...events[EventsEnum.ALL_EXTENSION_STATUS],
                data
            ]
        }
    )

    sdk.on(
        EventsEnum.ALL_USERS_STATUS,
        ({ data }) => {

            if (!events[EventsEnum.ALL_USERS_STATUS]) {
                events[EventsEnum.ALL_USERS_STATUS] = []
            }

            events[EventsEnum.ALL_USERS_STATUS] = [
                ...events[EventsEnum.ALL_USERS_STATUS],
                data
            ]
        }
    )

    sdk.on(
        EventsEnum.QUEUE_EVENT,
        ({ data }) => {

            if (!events[EventsEnum.QUEUE_EVENT]) {
                events[EventsEnum.QUEUE_EVENT] = []
            }

            events[EventsEnum.QUEUE_EVENT] = [
                ...events[EventsEnum.QUEUE_EVENT],
                data
            ]
        }
    )

    sdk.on(
        EventsEnum.EXTENSION_EVENT,
        ({ data }) => {

            if (!events[EventsEnum.EXTENSION_EVENT]) {
                events[EventsEnum.EXTENSION_EVENT] = []
            }

            events[EventsEnum.EXTENSION_EVENT] = [
                ...events[EventsEnum.EXTENSION_EVENT],
                data
            ]
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

            events[EventsEnum.LOGIN_SUCCESS] = [
                ...events[EventsEnum.LOGIN_SUCCESS],
                data
            ]
        }
    )

    sdk.on(
        EventsEnum.LOGIN_STATUS,
        ({ data }) => {
            if (!events[EventsEnum.LOGIN_STATUS]) {
                events[EventsEnum.LOGIN_STATUS] = []
            }

            events[EventsEnum.LOGIN_STATUS] = [
                ...events[EventsEnum.LOGIN_STATUS],
                data
            ]
        }
    )

    sdk.on(
        EventsEnum.ONLINE_STATUS_EVENT,
        ({ data }) => {
            isOnline.value = data.isSocketConnected
            attemptToConnect.value = data.attemptToConnect

            if (data.isSocketConnected) {
                showSuccessNotification.value = true

                setTimeout(() => {
                    showSuccessNotification.value = false
                }, 3000)
            }
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
                case EventsEnum.EXTENSIONS_UPDATED:
                    console.log(`FROM ALL ${EventsEnum.EXTENSIONS_UPDATED}`, data)
                    break
                case EventsEnum.ONLINE_STATUS_EVENT:
                    console.log(`FROM ALL ${EventsEnum.ONLINE_STATUS_EVENT}`, data)
                    break
                default:
                    console.log('Unknown event', data)

            }
        }
    )
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}


.message-container {
    position: relative;
    min-height: 50px; /* Adjust based on your content's typical size */
}

/* Enhanced transition handling for attempt-to-connect */
.attempt-to-connect-enter-active, .attempt-to-connect-leave-active {
    transition: opacity 0.5s, transform 0.5s;
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
}

.attempt-to-connect-enter {
    opacity: 0;
    transform: translateY(20px);
}

.attempt-to-connect-leave-active {
    opacity: 1;
}

.attempt-to-connect-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

.attempt-to-connect-enter-to, .attempt-to-connect-leave {
    opacity: 1;
    transform: translateY(0);
    position: relative;
}
</style>

<style lang="scss" scoped>
.message {
    border-radius: 24px;
    font-size: 24px;
    text-align: center;
    padding: 8px 0;

    &--error {
        background-color: #a31c1c;
        color: white;

        span {
            font-size: 16px;
            margin-top: 16px;
            display: block;
        }
    }

    &--success {
        background-color: #1ca31c;
        color: white;
    }

    &--warning {
      background-color: #f8f83d;
      color: black;
    }
}
</style>

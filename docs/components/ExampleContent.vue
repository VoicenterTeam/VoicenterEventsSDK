<template>
    <div class="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-10">
        <div class="min-h-14 px-5">
            <Transition
                name="slide-down"
                mode="out-in"
                appear
            >
                <div
                    v-if="isOnline === 'connected'"
                    key="success"
                    class="message message--success"
                >
                    Connection established!
                </div>
                <div
                    v-else-if="isOnline === 'disconnected'"
                    key="error"
                    class="message message--error"
                >
                    No connection
                </div>
                <div
                    v-else-if="isOnline === 'tryingToConnect'"
                    key="warning"
                    class="message message--warning"
                >
                    Trying to connect...
                </div>
            </Transition>
        </div>

        <p
            v-if="loading && isOnline"
            class="p-3 text-center font-medium"
        >
            Loading...
        </p>
        <template v-else>
            <div class="p-5">
                <json-viewer
                    :value="events"
                    boxed
                    theme="my-awesome-json-theme"
                />
            </div>
            <div class="">
                <UForm
                    :state="formModel"
                    class="w-full"
                    @submit="login"
                >
                    <div class="px-5 py-2">
                        <URadioGroup
                            v-model="formModel.loginType"
                            :ui="{
                                fieldset: 'space-y-2'
                            }"
                            legend="Select a login type:"
                            :options="[
                                { value: LoginType.TOKEN, label: 'Token' },
                                { value: LoginType.USER, label: 'User' }
                            ]"
                        />
                    </div>

                    <div
                        v-if="formModel.loginType === LoginType.USER"
                        class="grid md:grid-cols-2 items-center gap-4 w-full px-5 py-2"
                    >
                        <UFormGroup
                            label="Email"
                            name="email"
                        >
                            <UInput v-model="formModel.email" />
                        </UFormGroup>

                        <UFormGroup
                            label="Password"
                            name="password"
                        >
                            <UInput
                                v-model="formModel.password"
                                type="password"
                            />
                        </UFormGroup>
                    </div>

                    <div
                        v-else
                        class="w-full px-5 py-2"
                    >
                        <UFormGroup
                            label="Token"
                            name="token"
                        >
                            <UTextarea
                                v-model="formModel.token"
                                color="primary"
                                variant="outline"
                                placeholder="Token..."
                            />
                        </UFormGroup>
                    </div>

                    <div class="px-5 py-2">
                        <UButton
                            :ui="{
                                padding: {
                                    md: 'px-5 py-2.5'
                                }
                            }"
                            block
                            type="submit"
                            size="md"
                        >
                            <template #trailing>
                                <UIcon
                                    name="i-heroicons-arrow-right-20-solid"
                                    class="w-5 h-5"
                                />
                            </template>
                            Submit
                        </UButton>
                    </div>
                </UForm>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import JsonViewer from 'vue-json-viewer'
import { EventsEnum } from '@voicenter-team/real-time-events-types'
import type { EventTypeData } from 'sdk/types/events'
import { LoginType } from 'sdk/enum/auth.enum'
import EventsSdkClass from 'sdk/index'
import type { EventsSdkOptionsNewStack } from '../../dist/voicenter-events-sdk'

/* Types */
type FormModel = {
    loginType: LoginType
    token?: string
    email?: string
    password?: string
}

/* Data */
const showSuccessNotification = ref(false)
const isOnline = ref('disconnected')
const loading = ref(false)
const loggedId = ref(false)
const events = reactive<{ [K in EventsEnum]?: Array<EventTypeData<K>> }>({})
let eventsdk: EventsSdkClass | undefined

const formModel = ref<FormModel>({
    loginType: LoginType.TOKEN,
    token: '',
    email: '',
    password: ''
})

/* Methods */
async function login () {
    const sdkOptions: Partial<EventsSdkOptionsNewStack> & { token: string, email: string, password: string } = {
        loginUrl: 'https://loginapidev.voicenter.co.il/Auth/Login/Voicenter/Monitor',
        refreshTokenUrl: 'https://loginapidev.voicenter.co.il/Auth/RefreshToken',
        getSettingsUrl: 'https://loginapidev.voicenter.co.il/Application/GetSettings',
        isNewStack: true,
        token: '',
        email: '',
        password: ''
    }

    if (formModel.value.loginType === LoginType.TOKEN && formModel.value.token) {
        sdkOptions['loginType'] = LoginType.TOKEN
        sdkOptions['token'] = formModel.value.token
    } else if (formModel.value.loginType === LoginType.USER && formModel.value.email && formModel.value.password) {
        sdkOptions['loginType'] = LoginType.USER
        sdkOptions['email'] = formModel.value.email
        sdkOptions['password'] = formModel.value.password
    } else {
        return alert('Please fill in the required fields')
    }

    Object.keys(events).forEach((key) => delete events[key as keyof typeof events])

    loading.value = true

    if (eventsdk) {
        eventsdk.disconnect()
        eventsdk = undefined
    }

    const sdk = new EventsSdkClass(sdkOptions as EventsSdkOptionsNewStack)

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
            console.log('============>', data.connectionStatus)
            isOnline.value = data.connectionStatus

            if (data?.isSocketConnected) {
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

    await sdk.init()
}
</script>

<style lang="scss">
.message {
    border-radius: 12px;
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

.my-awesome-json-theme {
    --bg-color: #f2f5f7;
    --text-color: #8cad5f;
    --jv-key-color: #111827;
    --jv-ellipsis-color: #111827;
    --jv-ellipsis-bg: #cccfd1;
    background: var(--bg-color);
    color: var(--text-color);
    white-space: nowrap;
    font-size: 14px;
    font-family: Consolas, Menlo, Courier, monospace;

    .jv-ellipsis {
        color: var(--jv-ellipsis-color);
        background-color: var(--jv-ellipsis-bg);
        display: inline-block;
        line-height: 0.9;
        font-size: 0.9em;
        padding: 0px 4px 2px 4px;
        border-radius: 3px;
        vertical-align: 2px;
        cursor: pointer;
        user-select: none;
    }
    .jv-button { color: #49b3ff }
    .jv-key { color: var(--jv-key-color) }
    .jv-item {
        &.jv-array { color: var(--jv-key-color) }
        &.jv-boolean { color: #fc1e70 }
        &.jv-function { color: #067bca }
        &.jv-number { color: #fc1e70 }
        &.jv-number-float { color: #fc1e70 }
        &.jv-number-integer { color: #fc1e70 }
        &.jv-object { color: var(--jv-key-color) }
        &.jv-undefined { color: #e08331 }
        &.jv-string {
            color: #42b983;
            word-break: break-word;
            white-space: normal;
        }
    }
    .jv-code {
        .jv-toggle {
            &:before {
                padding: 0px 2px;
                border-radius: 2px;
            }
            &:hover {
                &:before {
                    background: #eee;
                }
            }
        }
    }
}


.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.25s ease-out;
}

.slide-down-enter-from {
    opacity: 0;
    transform: translateY(-30px);
}

.slide-down-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
.dark {
    .my-awesome-json-theme {
        --bg-color: #1e293b;
        --text-color: #b2d484;
        --jv-key-color: #cbd5e1;
    }
}
</style>

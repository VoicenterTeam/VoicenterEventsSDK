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
            <!-- Test Controls Section -->
            <div class="p-5 border-b border-gray-200 dark:border-gray-700" v-if="loggedId">
                <h3 class="text-lg font-semibold mb-4">Duplicate Event Testing</h3>

                <!-- Event Statistics -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <!-- Status Events (Expected Multiple) -->
                    <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h4 class="text-sm font-semibold mb-2 text-blue-800 dark:text-blue-200">Status Events (Expected Multiple)</h4>
                        <div class="space-y-2">
                            <div v-for="eventType in STATUS_EVENTS" :key="eventType"
                                 v-if="eventStats[eventType]"
                                 class="flex justify-between text-xs">
                                <span class="text-gray-600 dark:text-gray-400">{{ eventType.replace('_', ' ') }}</span>
                                <div class="flex gap-2">
                                    <span class="text-blue-600">{{ eventStats[eventType].total }}</span>
                                    <span v-if="eventStats[eventType].duplicates > 0"
                                          class="text-red-500 font-bold">⚠️{{ eventStats[eventType].duplicates }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Transactional Events (Duplicates Are Bad) -->
                    <div class="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                        <h4 class="text-sm font-semibold mb-2 text-orange-800 dark:text-orange-200">Transactional Events (Duplicates Bad)</h4>
                        <div class="space-y-2">
                            <div v-for="eventType in TRANSACTIONAL_EVENTS" :key="eventType"
                                 v-if="eventStats[eventType]"
                                 class="flex justify-between text-xs">
                                <span class="text-gray-600 dark:text-gray-400">{{ eventType.replace('_', ' ') }}</span>
                                <div class="flex gap-2">
                                    <span :class="eventStats[eventType].duplicates > 0 ? 'text-red-500 font-bold' : 'text-green-600'">{{ eventStats[eventType].total }}</span>
                                    <span v-if="eventStats[eventType].duplicates > 0"
                                          class="text-red-500 font-bold">🚨{{ eventStats[eventType].duplicates }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Connection Status -->
                <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div class="text-sm font-medium mb-2">Connection Status: {{ isOnline }}</div>
                    <div class="text-xs text-gray-600 dark:text-gray-400">
                        Last Event: {{ lastEventTime || 'None' }}
                    </div>
                </div>

                <!-- Test Controls -->
                <div class="flex flex-wrap gap-2">
                    <UButton @click="manualDisconnect" color="red" variant="outline" size="sm">
                        Force Disconnect
                    </UButton>
                    <UButton @click="manualReconnect" color="blue" variant="outline" size="sm">
                        Manual Reconnect
                    </UButton>
                    <UButton @click="clearEventLogs" color="gray" variant="outline" size="sm">
                        Clear Logs
                    </UButton>
                    <UButton @click="resetCounters" color="orange" variant="outline" size="sm">
                        Reset Counters
                    </UButton>
                </div>
            </div>

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
const events = reactive<{ [K in EventsEnum]?: Array<EventTypeData<K> & { timestamp: string, isDuplicate?: boolean }> }>({})
const eventStats = reactive<{ [K in EventsEnum]?: { total: number, duplicates: number, lastReceived: number } }>({})
const recentEvents = reactive<{ [key: string]: { timestamp: number, content: string } }>({})
const lastEventTime = ref<string>('')

// Event categorization
const STATUS_EVENTS = [
    EventsEnum.ALL_EXTENSION_STATUS,
    EventsEnum.ALL_DIALER_STATUS,
    EventsEnum.ALL_USERS_STATUS,
    EventsEnum.LOGIN_STATUS,
    EventsEnum.ONLINE_STATUS_EVENT,
    EventsEnum.ALL_VOICEBOTS_STATUS
] as const

const TRANSACTIONAL_EVENTS = [
    EventsEnum.EXTENSION_EVENT,
    EventsEnum.QUEUE_EVENT,
    EventsEnum.LOGIN_SUCCESS,
    EventsEnum.EXTENSIONS_UPDATED,
    EventsEnum.VOICEBOT_EVENT
] as const
let eventsdk: EventsSdkClass | undefined

const formModel = ref<FormModel>({
    loginType: LoginType.TOKEN,
    token: '',
    email: '',
    password: ''
})

/* Helper Functions */
function detectDuplicate(eventType: EventsEnum, data: any): boolean {
    const now = Date.now()
    const contentHash = JSON.stringify(data)
    const eventKey = `${eventType}-${contentHash}`

    // Check if we received identical event within last 2 seconds
    if (recentEvents[eventKey] && (now - recentEvents[eventKey].timestamp) < 2000) {
        return true
    }

    // Store this event
    recentEvents[eventKey] = { timestamp: now, content: contentHash }

    // Clean up old entries (older than 5 seconds)
    Object.keys(recentEvents).forEach(key => {
        if (now - recentEvents[key].timestamp > 5000) {
            delete recentEvents[key]
        }
    })

    return false
}

function updateEventStats(eventType: EventsEnum, isDuplicate: boolean) {
    if (!eventStats[eventType]) {
        eventStats[eventType] = { total: 0, duplicates: 0, lastReceived: 0 }
    }

    eventStats[eventType].total++
    eventStats[eventType].lastReceived = Date.now()

    if (isDuplicate) {
        eventStats[eventType].duplicates++
    }

    lastEventTime.value = new Date().toLocaleTimeString()
}

function addEventWithTimestamp<K extends EventsEnum>(eventType: K, data: EventTypeData<K>) {
    const timestamp = new Date().toISOString()
    const isDuplicate = detectDuplicate(eventType, data)

    if (!events[eventType]) {
        events[eventType] = []
    }

    events[eventType] = [
        ...events[eventType],
        { ...data, timestamp, isDuplicate } as EventTypeData<K> & { timestamp: string, isDuplicate?: boolean }
    ]

    updateEventStats(eventType, isDuplicate)

    // Log duplicates to console
    if (isDuplicate) {
        console.warn(`🚨 DUPLICATE EVENT DETECTED: ${eventType}`, data)
    }
}

/* Test Functions */
async function manualDisconnect() {
    if (eventsdk) {
        await eventsdk.disconnect()
        console.log('🔌 Manual disconnect completed')
    }
}

function manualReconnect() {
    if (eventsdk) {
        eventsdk.socketIoClass.doReconnect = true
        eventsdk.connect(0) // ServerParameter.MAIN
        console.log('🔄 Manual reconnect triggered')
    }
}

function clearEventLogs() {
    Object.keys(events).forEach((key) => delete events[key as keyof typeof events])
    console.log('🧹 Event logs cleared')
}

function resetCounters() {
    Object.keys(eventStats).forEach((key) => delete eventStats[key as keyof typeof eventStats])
    Object.keys(recentEvents).forEach((key) => delete recentEvents[key])
    lastEventTime.value = ''
    console.log('🔄 Event counters reset')
}

/* Methods */
async function login () {
    const sdkOptions: Partial<EventsSdkOptionsNewStack> & { token: string, email: string, password: string } = {
        loginUrl: 'https://loginapidev.voicenter.co.il/Auth/Login/Voicenter/Monitor',
        refreshTokenUrl: 'https://loginapidev.voicenter.co.il/Auth/RefreshToken',
        getSettingsUrl: 'https://loginapidev.voicenter.co.il/Application/GetSettings',
        isNewStack: true,
        reconnectionDelay: 1,
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

    clearEventLogs()
    resetCounters()

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
            addEventWithTimestamp(EventsEnum.ALL_DIALER_STATUS, { data })
        }
    )

    sdk.on(
        EventsEnum.ALL_EXTENSION_STATUS,
        ({ data }) => {
            addEventWithTimestamp(EventsEnum.ALL_EXTENSION_STATUS, { data })
        }
    )

    sdk.on(
        EventsEnum.ALL_USERS_STATUS,
        ({ data }) => {
            addEventWithTimestamp(EventsEnum.ALL_USERS_STATUS, { data })
        }
    )

    sdk.on(
        EventsEnum.QUEUE_EVENT,
        ({ data }) => {
            addEventWithTimestamp(EventsEnum.QUEUE_EVENT, { data })
        }
    )

    sdk.on(
        EventsEnum.EXTENSION_EVENT,
        ({ data }) => {
            addEventWithTimestamp(EventsEnum.EXTENSION_EVENT, { data })
        }
    )

    sdk.on(
        EventsEnum.LOGIN_SUCCESS,
        ({ data }) => {
            loggedId.value = true
            loading.value = false
            addEventWithTimestamp(EventsEnum.LOGIN_SUCCESS, { data })
        }
    )

    sdk.on(
        EventsEnum.LOGIN_STATUS,
        ({ data }) => {
            addEventWithTimestamp(EventsEnum.LOGIN_STATUS, { data })
        }
    )

    sdk.on(
        EventsEnum.EXTENSIONS_UPDATED,
        ({ data }) => {
            addEventWithTimestamp(EventsEnum.EXTENSIONS_UPDATED, { data })
        }
    )

    sdk.on(
        EventsEnum.ONLINE_STATUS_EVENT,
        ({ data }) => {
            console.log('============>', data.connectionStatus)
            isOnline.value = data.connectionStatus
            addEventWithTimestamp(EventsEnum.ONLINE_STATUS_EVENT, { data })

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

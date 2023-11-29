<template>
    <div>
        <h2>
            Hello
        </h2>

        <pre><code style="color: black">{{ JSON.stringify(events, null, 4) }}</code></pre>
    </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import EventsSdkClass from '@/index'
import { eventsSdkDefaultOptions } from '@/classes/events-sdk/events-sdk-default-options'
import { EventsEnum } from '@/enum/events.enum'
import { EventTypeData } from '@/types/events'

const sdk = new EventsSdkClass(eventsSdkDefaultOptions)

const events = reactive<{ [K in EventsEnum]?: Array<EventTypeData<K>> }>({})

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
</script>

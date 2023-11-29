<template>
    <div>
        <h2>
            Hello
        </h2>

        <code>
            {{ JSON.stringify(new EventsSdkClass(eventsSdkDefaultOptions), null, 2) }}
        </code>
    </div>
</template>

<script lang="ts" setup>
import EventsSdkClass from '@/index'
import {eventsSdkDefaultOptions} from "@/classes/events-sdk/events-sdk-default-options";

const sdk = new EventsSdkClass(eventsSdkDefaultOptions)

const events = []

sdk.init();

sdk.socket.on(
    'QueueEvent',
    (data) => {
      console.log('QueueEvent', data)
    }
)
sdk.socket.on(
    'ExtensionEvent',
    (data) => {
      console.log('ExtensionEvent', data)
    }
)
sdk.socket.on(
    'AllDialersStatus',
    (data) => {
      console.log('AllDialersStatus', data)
    }
)
</script>

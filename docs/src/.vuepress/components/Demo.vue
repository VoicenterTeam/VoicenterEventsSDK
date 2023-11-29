<template>
    <div>
        <h2>
            Hello
        </h2>

        <code>
            {{ JSON.stringify(EventsSdkClass, null, 2) }}
        </code>
    </div>
</template>

<script lang="ts" setup>
import EventsSdkClass from '@/index'
import {eventsSdkDefaultOptions} from "@/classes/events-sdk/events-sdk-default-options";

const sdk = new EventsSdkClass(eventsSdkDefaultOptions)

console.log(sdk)
</script>

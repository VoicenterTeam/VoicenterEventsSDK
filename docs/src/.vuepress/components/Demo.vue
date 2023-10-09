<template>
    <div>
        <h2>
            Hello
        </h2>

        <code>
            {{ JSON.stringify(VoicenterEventsSDK, null, 2) }}
        </code>
    </div>
</template>

<script lang="ts" setup>
import VoicenterEventsSDK from '@/index'
</script>

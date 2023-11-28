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

const io = VoicenterEventsSDK.sockets.makeSocketVersion(
    'v1_3_7',
    'https://monitor4.voicenter.co/',
    {
        transports: ['websocket'],
        query: {
            token: ''
        },
        reconnection: false,
        upgrade: false,
    }
)

io.on(
    'AllDialersStatus',
    (data) => {
        console.log('basicEmit', data.dialers)
    }
)
</script>

<template>
    <el-tooltip class="item" effect="dark"
                :content="isSocketOffline ? $t('tooltip.socket.reconnect'): $t('tooltip.socket.connected')"
                placement="bottom">
        <button class="btn p-2 shadow rounded bg-white flex items-center"
                :class="{'text-red-500 hover:bg-red-100 flash-animation': isSocketOffline, 'text-green-500 hover:bg-primary-100': !isSocketOffline}"
                :disabled="!isSocketOffline"
                @click="$emit('click')">
            <ZapIcon class="w-5 h-5"/>
            <span v-if="isSocketOffline" class="ml-1">
                                    {{$t('Reconnect')}}
                                </span>
        </button>
    </el-tooltip>
</template>
<script>
    import { ZapIcon } from 'vue-feather-icons'

    export default {
        name: 'socket-status-button',
        components: {
            ZapIcon
        },
        computed: {
            isSocketOffline() {
                return this.$store.getters['extensions/isSocketOffline']
            }
        }
    }
</script>
<style>
    @keyframes flash {
        from,
        50%,
        to {
            opacity: 1;
        }

        25%,
        75% {
            opacity: 0;
        }
    }

    .flash-animation {
        animation-name: flash;
        animation-duration: 3s;
        animation-iteration-count: infinite;
    }
</style>

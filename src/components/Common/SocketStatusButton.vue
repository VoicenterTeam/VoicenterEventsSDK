<template>
    <el-tooltip class="item" effect="dark"
                :content="tooltipContent"
                placement="bottom">
        <button class="btn p-2 shadow rounded bg-white flex items-center"
                :class="{'text-red-500 hover:bg-red-100 flash-animation': isSocketOffline, 'text-green-500': !isSocketOffline}"
                @click="onClick">
            <ZapIcon class="w-5 h-5"/>
            <span v-if="isSocketOffline" class="ml-1">
                {{$t('Reconnect')}}
            </span>
        </button>
    </el-tooltip>
</template>
<script>
    import {Tooltip} from 'element-ui'
    import {ZapIcon} from 'vue-feather-icons'

    export default {
        name: 'socket-status-button',
        components: {
            ZapIcon,
            [Tooltip.name]: Tooltip
        },
        computed: {
            isSocketOffline() {
                return this.$store.getters['extensions/isSocketOffline']
            },
            tooltipContent() {
                return this.isSocketOffline ? this.$t('tooltip.socket.reconnect') : this.$t('tooltip.socket.connected')
            }
        },
        methods: {
            onClick() {
                if (this.isSocketOffline) {
                    return
                }
                this.$emit('click')
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

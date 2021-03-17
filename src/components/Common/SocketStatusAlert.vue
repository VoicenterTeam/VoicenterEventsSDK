<template>
    <transition name="slide-top" mode="out-in">
        <div v-if="isSocketOffline" class="socket-notification notification-handler offline__notification-handler">
            <CloudOffIcon class="icon"></CloudOffIcon>
            {{ $t('common.socketOffline') }}
            <button
                class="btn ml-2 p-2 shadow rounded bg-white text-primary hover:bg-primary hover:text-white mx-1 border hover:border-primary"
                @click="$emit('retry')">
                <ZapIcon class="w-3 h-3" :class="{'loading': loading}"/>
            </button>
        </div>
    </transition>
</template>

<script>
import { CloudOffIcon, ZapIcon } from 'vue-feather-icons'
import { MINUTE } from '@/enum/generic';

export default {
    components: {
        CloudOffIcon,
        ZapIcon,
    },
    computed: {
        isSocketOffline() {
            return this.$store.getters['extensions/isSocketOffline']
        },
    },
    watch: {
        isSocketOffline(value) {
            if (!value) {
                setTimeout(() => {
                    window.location.reload()
                }, MINUTE * 3)
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.notification-handler {
    @apply flex items-center justify-center w-screen;
    z-index: 2000;
    position: fixed;
    top: 0;
    left: 0;
    padding: 3px 0;
    color: white;
    font-weight: 600;

    .icon {
        margin: 0 10px;
    }

    @apply py-1;
}

.offline__notification-handler {
    @apply bg-red-500;
}

.online__notification-handler {
    @apply bg-green-400;
}
</style>

<style lang="scss">
.slide-top-enter,
.slide-top-leave-to {
    transform: translateY(-30px);
}

.slide-top-enter-active {
    transition: all 0.3s ease;
}

.slide-top-leave-active {
    transition: all 0.5s ease;
}
</style>

<template>
  <transition name="slide-top" mode="out-in">
    <div v-if="isOffline" class="notification-handler offline__notification-handler" key="offline">
      <wifi-off-icon class="icon"></wifi-off-icon>{{$t('common.offline')}}
    </div>
    <div v-if="isOnline" class="notification-handler online__notification-handler" key="online">
      <wifi-icon class="icon"></wifi-icon>{{$t('common.online')}}
    </div>
  </transition>
</template>

<script>
  import { WifiIcon, WifiOffIcon } from 'vue-feather-icons'
  export default {
    name: 'network-status-alert',
    components: {
      WifiOffIcon,
      WifiIcon
    },
    data() {
      return {
        isOffline: false,
        isOnline: false
      }
    },
    mounted() {
      this.handleNetworkConnection()
    },
    methods: {
      handleNetworkConnection() {
        if (!window) {
          return
        }
        this.isOffline = !navigator.onLine

        const onlineHandler = () => {
          this.isOffline = false
          this.isOnline = true
          this.$emit('on-online')
          setTimeout(() => {
            this.isOnline = false
            window.location.reload()
          }, 2000)
        }

        const offlineHandler = () => {
          this.isOffline = true
        }

        window.addEventListener('online',  onlineHandler)
        window.addEventListener('offline',  offlineHandler)

        this.$once('hook:beforeDestroy', () => {
          window.removeEventListener('online', onlineHandler)
          window.removeEventListener('offline', offlineHandler)
        })
      }
    }
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

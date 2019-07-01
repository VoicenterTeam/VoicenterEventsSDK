<template>
  <div id="app" class="bg-gray-100 min-h-screen p-20">
    <h1 class="text-4xl">Real Time Events</h1>
    <transition-group type="transition" name="list">
      <div v-for="event in events" :key="event.timestamp"
           class="bg-white shadow-lg rounded-lg p-8 flex flex-col mb-5">
        <div class="flex w-full justify-between">
          <div class="text-xl text-green-500 mb-3">{{event.name}}</div>
          <span class="text-gray-500">{{event.timestamp}}</span>
        </div>
        <span class="text-xl text-blue-500">Event Data</span>
        <tree-view :data="event.data" :options="{ maxDepth: 0, rootObjectKey: 'data'}"></tree-view>
      </div>
    </transition-group>
    <div v-if="events.length === 0" class="text-red-500 text-2xl">
      Waiting for events...
    </div>
  </div>
</template>

<script>
import EventsSdk from '../src/index'
export default {
  name: 'app',
  data() {
    return {
      events: []
    }
  },
  async mounted() {
    let sdk = new EventsSdk({
      token: "FWsqFkPDsJuuh54YU0VLCvTu5EIrplkrUFVQ7yMiXh7U52hfiNOYanNINtekWBb6X06C3LQR7jfgCCWGAbKKCdBJAeQFIWO3DCCl"
    })
    let res = await sdk.login()
    sdk.on('*', data => {
      this.events.unshift({
        timestamp: new Date(),
        ...data
      })
    })
  }
};
</script>

<style>
  .list-enter-active, .list-leave-active {
    transition: all .4s;
  }
  .list-leave-active {
    position: absolute;
  }
  .list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateX(-20px);
  }
  .list-move {
    transition: transform .3s;
  }
</style>

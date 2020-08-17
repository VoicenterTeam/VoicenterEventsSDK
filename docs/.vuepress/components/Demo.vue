<template>
  <div id="app" class="min-h-screen py-8">
    <div class="flex mb-3 w-full items-end">
      <div class="flex-1">
        <label>Monitor Code</label>
        <input class="h-10 p-4 border rounded outline-none text-lg w-full"
               type="text"
               placeholder="Monitor code"
               v-model="monitorCode">
      </div>
      <button class="px-3 p-2 bg-blue-400 text-white shadow rounded-r" @click="login">Login</button>
    </div>
    <h1 class="text-4xl">Real Time Events</h1>
    <transition-group type="transition" name="list">
      <div v-for="event in events" :key="event.timestamp.getTime()"
           class="bg-white shadow-lg rounded-lg p-8 flex flex-col mb-5">
        <div class="flex w-full justify-between">
          <div class="text-xl text-green-500 mb-3">{{event.name}}</div>
          <span class="text-gray-500">{{event.timestamp.toUTCString()}}</span>
        </div>
        <span class="text-xl text-blue-500">Event Data</span>
        <tree-view :data="event.data" :options="{ maxDepth: 0, rootObjectKey: 'data'}"></tree-view>
      </div>
    </transition-group>
    <div v-if="events.length === 0 && !error" class="text-blue-500 text-2xl">
      Waiting for events...
    </div>
    <div v-if="error" class="text-red-500 text-2xl">
      {{error}}
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import EventsSdk from '../../../src';
  import TreeView from 'vue-json-tree-view';
  Vue.use(TreeView);
  let token = process.env.NODE_ENV === 'development' ? 'Af6szccCRWwxlmjiFN4J5ld4jaSr4O77Xp6cxuaqMQEvWmnqumPGmLZfr2nxajXTgAoM7qmQtgM8vUTxUTEhwwjmitEnX0yFTUbF': ''
  export default {
    name: 'app',
    data() {
      return {
        events: [],
        monitorCode: token,
        error: ''
      };
    },
    methods: {
      async login() {
        this.error = '';
        try {
          await this.initSdk()
          this.listenToEvents()
        } catch (e) {
          this.error = e;
        }
      },
      listenToEvents() {
        this.events = [];
        this.sdk.on('*', data => {
          this.events.unshift({
            timestamp: new Date(),
            ...data
          });
        });
      },
      async initSdk() {
        try {
          let sdk = new EventsSdk({
            token: this.monitorCode,
            store: this.$store,
            useLoginApi: true,
            debug: true,
          });
          window.sdk = sdk
          this.sdk = sdk
          await sdk.init();
        } catch (err) {
          this.error = err
        }
      }
    },
    async mounted() {
      try {
        await this.initSdk()
        this.listenToEvents()
      } catch(e) {
        this.error = e
      }
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

  .list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */
  {
    opacity: 0;
    transform: translateX(-20px);
  }

  .list-move {
    transition: transform .3s;
  }
</style>

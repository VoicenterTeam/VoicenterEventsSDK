<template>
    <nav class="px-24 navbar w-full bg-white shadow py-3 flex justify-between z-10">
        <img src="/img/navbar/logo.png" alt="Logo" class="w-32">
        <div>
            <div class="relative">
                <button class="flex items-center p-3 outline-none rounded-lg cursor-pointer outline-none"
                        @click="showDashboardsMenu = !showDashboardsMenu">
                    <span class="mr-1 text-lg text-gray-700">{{$t(activeDashboard.Title) || activeDashboard.Title}}</span>
                    <IconArrowDown></IconArrowDown>
                </button>
                <div class="bg-white shadow-lg rounded-lg py-4 mt-3 absolute w-56 flex flex-col dashboards-menu"
                     v-if="showDashboardsMenu">
                <span class="hover:bg-blue-100 py-3 px-4 cursor-pointer hover:text-blue-600"
                      @click="chooseDashboard(dashboard)"
                      v-for="dashboard in allDashboards">
                    {{$t(dashboard.Title) || dashboard.Title}}
                </span>
                </div>
            </div>
        </div>
    </nav>
</template>
<script>
  export default {
    data() {
      return {
        showDashboardsMenu: false
      }
    },
    computed: {
      activeDashboard() {
        return this.$store.state.dashboards.activeDashboard
      },
      allDashboards() {
        return this.$store.state.dashboards.allDashboards
      },
    },
    methods: {
      chooseDashboard(dashboard) {
        this.$store.dispatch('dashboards/selectDashboard', dashboard)
        this.showDashboardsMenu = false
      }
    }
  }
</script>
<style scoped>
    .navbar {
        position: absolute;
        left: 0;
        top: 0;
    }

    .dashboards-menu {
        right: 0;
    }
</style>

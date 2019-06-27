<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
  export default {
    created() {
      this.$store.dispatch('dashboards/getDashboards')
      this.$store.dispatch('widgets/getAllWidgets')
    }
  }
</script>

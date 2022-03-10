<template>
    <el-tooltip :content="$t('report.manageReports')"
                v-if="showButton"
                placement="bottom">
        <router-link to="/reports">
            <i class="vc-icon-server icon-lg mx-2 w-6 h-6 text-gray-400 hover:text-primary" />
        </router-link>
    </el-tooltip>
</template>
<script>
    export default {
        data() {
            return {
                showButton: true,
            }
        },
        methods: {
            updateButtonVisibility(routeName) {
                this.showButton = !routeName.includes('reports')
            },
            goToReports() {
                this.$router.push('/reports')
            }
        },
        watch: {
            '$route.name': {
                immediate: true,
                handler(value) {
                    if (!value) {
                        return
                    }
                    this.updateButtonVisibility(value)
                },
            },
        },
    }
</script>

<template>
    <el-tooltip :content="$t('Manage Reports')"
                v-if="showButton"
                placement="bottom">
        <router-link to="/reports">
            <div class="text-gray-400 hover:text-primary mx-3 focus:outline-none"
                 role="button">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.0625 12.5714H12.5625V14.1428H6.0625V12.5714Z" fill="currentColor"/>
                    <path d="M6.0625 8.64282H15.8125V10.2143H6.0625V8.64282Z" fill="currentColor"/>
                    <path d="M6.0625 16.5H10.125V18.0714H6.0625V16.5Z" fill="currentColor"/>
                    <path
                        d="M18.25 2.35714H15.8125V1.57143C15.8125 1.15466 15.6413 0.754961 15.3365 0.460261C15.0318 0.165561 14.6185 0 14.1875 0H7.6875C7.25652 0 6.8432 0.165561 6.53845 0.460261C6.23371 0.754961 6.0625 1.15466 6.0625 1.57143V2.35714H3.625C3.19402 2.35714 2.7807 2.5227 2.47595 2.8174C2.1712 3.1121 2 3.5118 2 3.92857V20.4286C2 20.8453 2.1712 21.245 2.47595 21.5397C2.7807 21.8344 3.19402 22 3.625 22H18.25C18.681 22 19.0943 21.8344 19.399 21.5397C19.7038 21.245 19.875 20.8453 19.875 20.4286V3.92857C19.875 3.5118 19.7038 3.1121 19.399 2.8174C19.0943 2.5227 18.681 2.35714 18.25 2.35714ZM7.6875 1.57143H14.1875V4.71429H7.6875V1.57143ZM18.25 20.4286H3.625V3.92857H6.0625V6.28571H15.8125V3.92857H18.25V20.4286Z"
                        fill="currentColor"/>
                </svg>
            </div>
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

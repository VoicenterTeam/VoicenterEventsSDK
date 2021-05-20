<template>
    <span class="notification-link mt-2" @click="$emit('click', $event)">
        {{$t('general.clickToEdit', {entity: this.entity})}}
    </span>
</template>

<script>
    export default {
        name: 'NotificationEditLink',
        props: {
            entity: {
                type: String,
                default: ''
            }
        }
    }
</script>

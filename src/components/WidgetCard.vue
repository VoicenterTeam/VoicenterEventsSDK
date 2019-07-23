<template>
   <div class="bg-white px-6 py-4 my-4 flex items-center justify-between rounded-lg shadow">
       <div class="flex items-center">
           <slot name="icon">
               <component class="w-16 mr-4 text-primary" :is="icon"></component>
           </slot>
           <slot name="title">
               <h5 class="text-3xl font-bold mr-4" v-if="title">
                   {{title}}
               </h5>
           </slot>
           <slot name="description">
               <p class="text-gray-500 text-lg" v-if="description">{{$t(description)}}</p>
           </slot>

       </div>
       <div class="flex editable-content" v-if="editable">
           <trash-icon class="flex align-center w-8 h-8 p-2 text-red close-icon  bg-red-100"
           @click="$emit('remove-item')"></trash-icon>
           <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-1"></more-vertical-icon>
           <more-vertical-icon class="flex align-center w-5 h-8 text-primary -mx-2"></more-vertical-icon>
       </div>
   </div>
</template>
<script>
    import { TrashIcon, MoreVerticalIcon} from 'vue-feather-icons'
  export default {
    props: {
      icon: String,
      title: {
        type: [String, Number],
        default: '- -'
      },
      description: {
        type: [String],
        default: '- -'
      },
        editable:{
            type: Boolean,
            default: false
        }
    },
    components: {
      TrashIcon,
      MoreVerticalIcon
    }
  }
</script>
<style lang="scss">
    .close-icon{
        position: relative;
        top: -45px;
        right: -50px;
        border-radius: 50%;
        cursor:pointer;
    }
    .editable-content {
        transition: all 0.3s ease-in-out 0s;
    }
</style>

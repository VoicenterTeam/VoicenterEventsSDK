<template>
    <div class="mt-10">
        <div class="flex justify-end mb-4">
            <AddButton></AddButton>
        </div>
        <div class="flex -mx-2">
            <div class="w-full flex-wrap lg:w-1/3 px-2">
                <WidgetCard icon="IconPhone"
                            title="16"
                            description="Telephone Numbers">
                </WidgetCard>
            </div>
            <div class="w-full lg:w-1/3 px-2">
                <WidgetCard icon="IconUsers"
                            title="25"
                            description="Users">
                </WidgetCard>
            </div>
            <div class="w-full lg:w-1/3 px-2">
                <WidgetCard icon="IconExtensions"
                            title="38"
                            description="Extensions">
                </WidgetCard>
            </div>
        </div>
    </div>
</template>

<script>
  import AddButton from '@/components/AddButton'
  import WidgetCard from '@/components/WidgetCard'

  export default {
    name: 'home',
    components: {
      AddButton,
      WidgetCard
    }
  }
</script>

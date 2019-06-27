<template>
    <div class="mt-10">
        <div class="flex -mx-2">
            <div class="w-full lg:w-1/3 px-2">
                <WidgetCard icon="/img/svg/phone.svg"
                            title="16"
                            description="Telephone Numbers">
                </WidgetCard>
            </div>
            <div class="w-full lg:w-1/3 px-2">
                <WidgetCard icon="/img/svg/phone.svg"
                            title="25"
                            description="Telephone Numbers">
                </WidgetCard>
            </div>
            <div class="w-full lg:w-1/3 px-2">
                <WidgetCard icon="/img/svg/phone.svg"
                            title="115"
                            description="Telephone Numbers">
                </WidgetCard>
            </div>
        </div>
    </div>
</template>

<script>
  import WidgetCard from '@/components/WidgetCard'

  export default {
    name: 'home',
    components: {
      WidgetCard
    }
  }
</script>

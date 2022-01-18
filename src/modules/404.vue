<template>
  <div class="content__404">
    <lottie-animation
        class="hidden md:flex lottie-anim"
        path="animation/404-animation.json"
        :loop="true"
        :autoPlay="true"
        :speed="1"
    />
    <div class="h-full w-full flex flex-col items-center justify-center md:pl-40">
      <div class="text-sm text-default-text font-medium">{{$t('general.pageNotFound')}}</div>
      <div class="text-404 text-active-elements font-bold">404</div>
      <div class="text-sm text-default-text text-center max-w-60 font-medium">
        {{$t('general.pageDoesNotExist')}}
      </div>
      <base-button outline class="my-10"
                   type="primary"
                   @click="goToMainPage">
        <div class="flex items-center">
          <i class="text-active-elements vc-back icon-md mr-2"/>
          {{$t('general.backToMainPage')}}
        </div>
      </base-button>
    </div>
  </div>
</template>

<script>
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue";

export default {
  name: "NotFound",
  components: {
    LottieAnimation
  },
  methods:{
    goToMainPage(){
      this.$router.push({name: 'Main Page'})
    }
  }
}
</script>

<style scoped lang="scss">
.content__404 {
  height: calc(100vh - 140px);
}

.text-404 {
  font-size: 100px;
  @screen md {
    font-size: 230px;
    line-height: 230px;
  }
  @screen lg {
    font-size: 288px;
    line-height: 351px;
  }
}

.lottie-anim {
  z-index: 1;
  position: absolute;
  left: 0;
  width: 50% !important;
  height: 90% !important;
  pointer-events: none;
}
</style>

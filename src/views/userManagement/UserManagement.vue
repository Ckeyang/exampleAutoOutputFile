
<template>
    <div class="content-warp">
        <transition name="el-fade-in">
            <div class="content-warp">
                <keep-alive>
                    <!-- 只缓存keepAlive为true的组件 -->
                    <router-view v-if="$route.meta.keepAlive"></router-view>
                </keep-alive>
                <router-view v-if="!$route.meta.keepAlive"></router-view>
            </div>
        </transition>
    </div>
</template>
<style>
.content-warp {
  height: 100%;
}
</style>
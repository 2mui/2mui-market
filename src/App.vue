<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    data() {
        return {
        };
    },
    watch: {
        $route(to, from) {
            console.log(to, from,'app')
        },
    }
};
</script>
<style>
</style>
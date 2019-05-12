<template>
  <div class="home">
    home
     <router-link to="/game">Go to game</router-link>
  </div>
</template>

<script>
export default {
  name: "home",
  mounted() {
    console.log('home')
  }
}
</script>


<style lang="scss" scoped>
    .home {
      display: flex;
      padding: 20px;
      background: #eee;
      align-items: center;
      p {
        color: #999;
      }
    }
</style>

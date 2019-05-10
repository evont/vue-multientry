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

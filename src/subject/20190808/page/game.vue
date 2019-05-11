<template>
  <div class="game">
    game
    <p>fsaf</p>
  </div>
</template>

<script>
export default {
  name: "game",
  mounted() {
    console.log('game fdsfad')
  }
}
</script>

<style lang="scss" scoped>
    .game {
      display: flex;
      padding: 20px;
      background: #eee;
      p {
        color: #999;
      }
    }
</style>

<template>
  <div id="app">
    <vitualList />
    <!-- <xiao-button /> -->
  </div>
</template>

<script>
import vitualList from './components/VitualList'
export default {
  name: "App",
  components: { vitualList }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<script setup>

import GameCard from "@/GameCard";
import {ref} from "vue";

const collection = [
  {
    coords: [240, 79, 30],
    main: require('./assets/quiz1a.png'),
    quiz: require('./assets/quiz1b.jpg'),
    size: 512,
    duration: 1000,
    title: `boy with a ball`,
  },
  {
    coords: [240, 79, 30],
    main: require('./assets/quiz2a.png'),
    quiz: require('./assets/quiz2b.png'),
    size: 512,
    duration: 1000,
    title: `boy with a balloon`,
  },
  {
    coords: [240, 79, 30],
    main: require('./assets/quiz3a.png'),
    quiz: require('./assets/quiz3b.png'),
    size: 512,
    duration: 1000,
    title: `boy with a balloon`,
  }
];

let index = ref(0);

function onClose() {
  index.value++;
}

</script>

<template>
    <v-layout style="z-index: 0">
      <v-app-bar color="grey-lighten-2">
        <v-btn prepend-icon="mdi-reload" @click="index = 0">Start over</v-btn>
      </v-app-bar>
      <v-navigation-drawer color="grey-darken-2" permanent></v-navigation-drawer>
      <v-navigation-drawer color="grey-darken-2" permanent location="right"></v-navigation-drawer>
      <v-main class="d-flex justify-center align-end mt-16">
        <Transition mode="out-in" duration="2000">
          <GameCard
              class="card"
              v-if="collection[index]"
              v-bind="collection[index]"
              :key="index"
              :initial="index === 0 ? 'menu' : 'preview'"
              @close="onClose"
          />
        </Transition>
      </v-main>
    </v-layout>

</template>

<style scoped>

.card {
  /*perspective: 500px;*/
  transform: rotateY(0);
  /*backface-visibility: hidden;*/
}

.v-enter-active,
.v-leave-active {
  transition-property: transform;
  transition-duration: 1000ms;
  transition-timing-function: ease;
}

.v-enter-from {
  transform: rotateY(-180deg);

}
.v-leave-to {
  background-color: red;;
  transform: rotateY(180deg);
}

.main {
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>



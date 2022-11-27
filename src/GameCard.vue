<script setup>

import {useMachine} from '@xstate/vue';
import {createMachine, assign} from 'xstate';
import {useDisplay} from 'vuetify'
import {computed} from "vue";

// Action to increment the context amount
const setCoords = assign({
  coords: (context, event) => context.coords = event.value
});
const emit = defineEmits(['close'])
const props = defineProps(['coords', 'main', 'quiz', 'duration', 'size', 'title', 'initial']);
const size = props.size + 'px'
const duration = props.duration + 'ms';
const {mobile} = useDisplay();
const initial = props.initial || 'menu';

const gameMachine = createMachine({
  predictableActionArguments: true,
  id: 'game',
  initial,
  context: {coords: null},
  on: {
    CLOSE: {
      target: 'closed',
    },
    RESET: {
      target: 'menu',
      actions: assign(context => {
        return {...props};
      }),
    }
  },
  states: {
    menu: {
      on: {
        NEXT: {
          target: 'preview',
        },
      },
    },
    preview: {
      on: {
        NEXT: 'quiz',
      },
    },
    quiz: {
      on: {
        SOLVE: 'success',
        BACK: 'preview'
      }
    },
    success: {},
    closed: {
      type: 'final'
    }
  }
}, {
  actions: {
    setCoords,
  }
}).withContext({...props});

const {state, send, service} = useMachine(gameMachine);

let whitePixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII=';
let interact = computed(() => mobile.value ? 'Touch' : 'Click')
let variant = computed(() => state.value.value === 'success' ? 'tonal' : 'outlined')
let title = computed(() => state.value.value === 'menu' || !props.title ? '&nbsp;' : props.title);

function onClose() {
  emit('close');
  send('CLOSE');
}
</script>

<template>
  <div class="wrapper">
    <v-card class="card" :variant="variant">
      <Transition mode="out-in">
        <v-card-title
            v-if="state.value === 'menu' || !props.title"
            class="d-flex justify-end"
        ><p>&nbsp;</p></v-card-title>
        <v-card-title
            v-else
            class="d-flex justify-space-between"
        ><p class="card__title">{{ props.title }}</p>
        </v-card-title>
      </Transition>
      <v-btn @click="onClose" icon="mdi-close" class="mt-1 mr-1" variant="plain" size="small"
             style="position: absolute; top: 0; right: 0;"/>
      <div class="slide-wrapper" :style="{ height: size, width: size }" v-ripple @mousemove.stop>
        <Transition mode="out-in" appear :duration="props.duration">
          <div
              v-if="state.value === 'menu'"
              @click="send('NEXT')"
              class="slide slide__start d-inline-flex"
          >
            {{ interact }} to find difference
          </div>
          <v-img
              v-else-if="state.value === 'preview'"
              alt="child plays a ball"
              :src="props.main"
              @click="send('NEXT')"
              class="slide slide__main"
          ></v-img>
          <div
              v-else-if="state.value === 'quiz'"
          >
            <v-img
                :src="props.quiz"
                :width="size"
                :heigh="size"
                class="slide"
            ></v-img>
            <img
                usemap="#quiz__map"
                alt="diff"
                class="slide slide__click-map"
                :src="whitePixel"
            />
            <map name="quiz__map">
              <area
                  shape="circle"
                  :coords="props.coords.join(',')"
                  :alt="`${interact} me`"
                  class="slide__click-map-target"
                  @click="send('SOLVE')"
              />
            </map>
          </div>
          <div
              v-else-if="state.value === 'success'"
              class="position-relative"
          >
            <v-img
                alt="child plays a ball"
                :src="props.main"
                class="slide slide--success"
                @close="onClose"
            ></v-img>
            <span class="bottom"></span>
            <span class="right"></span>
            <span class="top"></span>
            <span class="left"></span>
          </div>
        </Transition>
      </div>
      <v-card-actions class="ma-2 justify-space-between" style="align-items: flex-end;">
        <v-btn :style="{ opacity: state.value === 'menu' ? 0 : 1 }" @click="send('RESET')" size="large">Reset</v-btn>
        <Transition mode="out-in">
          <v-btn v-if="state.value==='quiz'" @click="send('BACK')" size="large">Back</v-btn>
          <v-btn v-else-if="state.value==='preview'" @click="send('NEXT')" size="large">Next</v-btn>
          <v-btn v-else-if="state.value==='success'" @click="onClose" size="large">Close</v-btn>
        </Transition>
      </v-card-actions>
    </v-card>
  </div>

</template>

<style scoped>

@keyframes animation__color {
  0% {
    background-color: #ffbe0b;
    color: #fff;
  }
  20% {
    background-color: #fb5607;
  }
  40% {
    background-color: #ff006e;
  }
  60% {
    background-color: #8338ec;
  }
  80% {
    background-color: #3a86ff;
    color: #fff;
  }
}

.v-enter-active,
.v-leave-active {
  transition-property: opacity;
  transition-duration: v-bind(duration);
  transition-timing-function: ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.slide-wrapper {
  position: relative;
  width: v-bind('size');
  height: v-bind('size');
  font-size: 1.5rem;
}

.slide {
  width: 100%;
  height: 100%;
  font-size: inherit;
  font-family: inherit;
}

.slide__start {
  color: #fff;
  background-color: #ffbe0b;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  animation: 10s animation__color infinite;
  text-transform: uppercase;
}

.slide__click-map {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
}

.slide__click-map-target,
.slide__start {
  cursor: pointer;
}

.card {
  display: inline-block;
}

.card__title {
  display: block;
}

.card__title::first-letter {
  text-transform: uppercase;
}


</style>



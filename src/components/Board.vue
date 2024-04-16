<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { DrawElement, DrawPoint } from "../scripts/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faPen,
  faEraser,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";

const props = defineProps<{ boardId: string }>();

const state = reactive({
  elements: [] as DrawElement[],
  drawingElement: null as DrawElement | null,
  selectedMode: "drawLine" as "drawLine" | "erase",
  selectedColor: "black",
  colorList: ["black", "red", "blue", "green", "yellow", "purple", "cyan"],
});

const svgElementRef = ref<SVGElement>();

let dragMoveHandler = null as ((event: Event) => void) | null;
let dragEndHandler = null as ((event: Event) => void) | null;

const store = getFirestore();
const elementsCollectionRef = collection(
  store,
  `rooms/${props.boardId}/elements`
);
onSnapshot(elementsCollectionRef, (querySnapshot) => {
  state.elements = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      color: data.color,
      points: data.points,
    };
  });
});

const dragStart = () => {
  if (!svgElementRef.value) return;
  if (state.selectedMode === "drawLine") {
    state.drawingElement = {
      id: "",
      points: [],
      color: state.selectedColor,
    };
    const rect = svgElementRef.value.getBoundingClientRect();
    dragMoveHandler = (event: Event) => {
      if (state.drawingElement) {
        if (event instanceof TouchEvent) {
          state.drawingElement.points.push({
            x: event.touches[0].clientX - rect.x,
            y: event.touches[0].clientY - rect.y,
          });
        } else if (event instanceof MouseEvent) {
          state.drawingElement.points.push({
            x: event.clientX - rect.x,
            y: event.clientY - rect.y,
          });
        }
      }
    };
    dragEndHandler = () => {
      if (!state.drawingElement) return;
      if (state.drawingElement.points.length === 0) return;
      addDoc(elementsCollectionRef, state.drawingElement);
      state.drawingElement = null;
    };
  } else if (state.selectedMode === "erase") {
    dragMoveHandler = (event: Event) => {
      const target =
        event instanceof TouchEvent
          ? document.elementFromPoint(
              event.touches[0].clientX,
              event.touches[0].clientY
            )
          : event instanceof MouseEvent
          ? event.target
          : null;
      if (target instanceof SVGPolylineElement) {
        const elementId = target.getAttribute("element-id");
        if (elementId) {
          deleteDoc(doc(store, `rooms/${props.boardId}/elements/${elementId}`));
        }
      }
    };
  }
};
const dragMove = (event: Event) => {
  if (dragMoveHandler) dragMoveHandler(event);
};
const dragEnd = (event: Event) => {
  if (dragEndHandler) dragEndHandler(event);
  dragMoveHandler = null;
  dragEndHandler = null;
};
const onClickDraw = (color: string) => {
  state.selectedMode = "drawLine";
  state.selectedColor = color;
};
const onClickShare = async () => {
  if (!navigator.clipboard) return;
  await navigator.clipboard.writeText(location.href);
  alert("Copied the URL. Send it to your collaborators!");
};
const convertPointsToString = (points: DrawPoint[]) => {
  let attr = "";
  for (let point of points) {
    attr += `${point.x},${point.y} `;
  }
  return attr;
};
</script>

<template>
  <div class="component-container">
    <div class="header">
      <button
        v-for="color in state.colorList"
        :key="color"
        :style="{ backgroundColor: color }"
        :selected="
          state.selectedMode === 'drawLine' && color === state.selectedColor
        "
        :title="color"
        @click="onClickDraw(color)"
      >
        <FontAwesomeIcon :icon="faPen" />
      </button>
      <button
        :selected="state.selectedMode === 'erase'"
        @click="state.selectedMode = 'erase'"
        title="erase"
      >
        <FontAwesomeIcon :icon="faEraser" />
      </button>
      <button @click="onClickShare" title="share">
        <FontAwesomeIcon :icon="faShareNodes" />
      </button>
    </div>
    <svg
      ref="svgElementRef"
      class="canvas"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      @mousedown.prevent="dragStart"
      @mousemove.prevent="dragMove"
      @mouseup.prevent="dragEnd"
      @mouseleave="dragEnd"
      @touchstart.prevent="dragStart"
      @touchmove.prevent="dragMove"
      @touchend.prevent="dragEnd"
    >
      <polyline
        v-for="element in state.elements"
        :key="element.id"
        :element-id="element.id"
        fill="none"
        :stroke="element.color"
        stroke-linecap="round"
        stroke-width="5"
        :points="convertPointsToString(element.points)"
      />
      <polyline
        v-if="state.drawingElement"
        fill="none"
        :stroke="state.drawingElement.color"
        stroke-linecap="round"
        stroke-width="5"
        :points="convertPointsToString(state.drawingElement.points)"
      />
    </svg>
  </div>
</template>

<style scoped>
.component-container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 50px 1fr;
}
.canvas {
  width: 100%;
  height: 100%;
}
.header {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  white-space: nowrap;
  overflow-x: auto;
  background-color: antiquewhite;
}
.header > button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  color: white;
  background-color: gray;
  cursor: pointer;
}
.header > button:hover {
  opacity: 0.5;
}
.header > button[selected="true"] {
  border-width: 5px;
  border-color: gray;
}
</style>

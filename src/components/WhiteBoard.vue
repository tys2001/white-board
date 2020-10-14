<template>
  <div class="component-container">
    <div class="header">
      <b-button @click="leaveRoom">
        <b-icon icon="arrow-return-left" />
      </b-button>
      <b-button
        v-for="color in colors"
        :key="color"
        pill
        :style="{ backgroundColor: color }"
        :selected="selectedMode === 'drawLine' && color === selectedColor"
        @click="clickDrawMode(color)"
      >
        <b-icon icon="brush" />
      </b-button>
      <b-button
        pill
        variant="light"
        :selected="selectedMode === 'erase'"
        @click="selectedMode = 'erase'"
      >
        <b-icon icon="layout-sidebar" />
      </b-button>
      <b-button pill @click="clearBoard">
        <b-icon icon="trash-fill" />
      </b-button>
    </div>
    <svg
      ref="svgElement"
      class="canvas"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      @mousedown.prevent="dragStart"
      @mousemove.prevent="dragMove"
      @mouseup.prevent="dragEnd"
      @touchstart.prevent="dragStart"
      @touchmove.prevent="dragMove"
      @touchend.prevent="dragEnd"
    >
      <polyline
        v-for="element in elements"
        :key="element.id"
        fill="none"
        :stroke="element.color"
        stroke-linecap="round"
        stroke-width="5"
        :points="pointsAttr(element.points)"
        @mousemove.prevent="dragMoveOnElement(element.id)"
        @touchmove.prevent="dragMoveOnElement(element.id)"
      />
    </svg>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      elements: [],
      colors: ["black", "red", "blue", "green", "yellow", "purple", "cyan"],
      selectedColor: "black",
      selectedMode: "drawLine",
    };
  },
  created() {
    this.db = firebase.firestore();
    this.elementsCollectionRef = this.db
      .collection("rooms")
      .doc(this.$route.params.roomId)
      .collection("elements");
    this.elementsCollectionRef.onSnapshot((querySnapshot) => {
      this.elements = [];
      querySnapshot.forEach((doc) => {
        const element = doc.data();
        element.id = doc.id;
        this.elements.push(element);
      });
    });
  },
  methods: {
    dragStart() {
      const newElement = { points: [], color: this.selectedColor };
      this.elements.push(newElement);
      const rect = this.$refs.svgElement.getBoundingClientRect();
      if (this.selectedMode === "drawLine") {
        this.dragMoveHandler = () => {
          if (event.touches) {
            event.clientX = event.touches[0].clientX;
            event.clientY = event.touches[0].clientY;
          }
          newElement.points.push({
            x: event.clientX - rect.x,
            y: event.clientY - rect.y,
          });
        };
        this.dragEndHandler = () => {
          if (newElement.points.length === 0) return;
          this.elementsCollectionRef.add(newElement);
        };
      } else if (this.selectedMode === "erase") {
        this.dragMoveOnElementHandler = (id) => {
          this.elementsCollectionRef.doc(id).delete();
        };
      }
    },
    dragMove() {
      if (this.dragMoveHandler) {
        this.dragMoveHandler();
      }
    },
    dragMoveOnElement(id) {
      if (this.dragMoveOnElementHandler) {
        this.dragMoveOnElementHandler(id);
      }
    },
    dragEnd() {
      if (this.dragEndHandler) {
        this.dragEndHandler();
      }
      this.dragMoveHandler = null;
      this.dragMoveOnElementHandler = null;
      this.dragEndHandler = null;
    },
    clickDrawMode(color) {
      this.selectedMode = "drawLine";
      this.selectedColor = color;
    },
    async clearBoard() {
      if (!confirm("ボードをクリアしますか？")) return;
      const query = this.elementsCollectionRef.limit(500);
      const snapshot = await query.get();
      const batch = this.db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      return await batch.commit();
    },
    pointsAttr(points) {
      let attr = "";
      for (let point of points) {
        attr += `${point.x},${point.y} `;
      }
      return attr;
    },
    leaveRoom() {
      if (!confirm("このボードから退出しますか？")) return;
      this.$router.push("/");
    },
  },
};
</script>

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
  padding: 5px 10px;
  white-space: nowrap;
  overflow-x: auto;
}
.header > button {
  padding: 0;
  width: 40px;
  height: 40px;
  margin-right: 5px;
  border-width: 0px;
}
.header > button[selected] {
  border-width: 5px;
}
.header > button > svg {
  display: block;
  margin: 0 auto;
}
</style>

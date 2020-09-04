<template>
  <div class="component-container">
    <div class="title">イメージをシェアしよう</div>
    <div class="room-button">
      <b-button @click="createRoom" variant="primary">新規ボードを作成</b-button>
    </div>
    <div class="build-label">
      <b-badge>Build: {{buildTimestamp}}</b-badge>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  data() {
    return {
      buildTimestamp: document.documentElement.dataset.buildTimestamp,
    };
  },
  created() {
    this.db = firebase.firestore();
  },
  methods: {
    async createRoom() {
      const result = await this.db.collection("rooms").add({});
      this.$router.push(`/room/${result.id}`);
    },
  },
};
</script>

<style scoped>
.component-container {
  width: 100%;
  height: 100%;
  background-image: url(/entrance.jpg);
  background-size: cover;
  background-position: center;
  display: grid;
  grid-template-rows: 1fr 100px 30px;
}
.title {
  height: fit-content;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  align-self: center;
  font-size: 24px;
  padding: 5px 0;
}
.room-button {
  place-self: center;
}
.build-label {
  place-self: end;
  padding: 5px;
}
</style>

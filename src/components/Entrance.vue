<template>
  <div class="component-container">
    <p>ホワイトボード</p>
    <p>
      <b-button @click="createRoom" variant="primary">新規ボードを作成</b-button>
    </p>
    <p class="text-right">
      <b-badge class="build-info">Build: {{buildTimestamp}}</b-badge>
    </p>
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
  padding: 20px;
}
</style>

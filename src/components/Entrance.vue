<script setup lang="ts">
import router from "../router";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const store = getFirestore();

const enterNewBoard = async () => {
  const collectionRef = collection(store, "rooms");
  const result = await addDoc(collectionRef, {});
  router.push({ path: `/board/${result.id}` });
};
</script>

<template>
  <div class="component-container">
    <div class="title">Share your Image.</div>
    <div class="buttons">
      <button @click="enterNewBoard" variant="primary">
        <FontAwesomeIcon :icon="faPlus" /> Create new board
      </button>
    </div>
  </div>
</template>

<style scoped>
.component-container {
  width: 100%;
  height: 100%;
  background-image: url(/entrance.jpg);
  background-size: cover;
  background-position: center;
  display: grid;
  grid-template-rows: 4fr 1fr;
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
.buttons {
  place-self: center;
}
button {
  border: none;
  border-radius: 2px;
  padding: 10px;
  color: white;
  background-color: blue;
  cursor: pointer;
}
button:hover {
  opacity: 0.5;
}
</style>

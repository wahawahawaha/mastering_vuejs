<script setup>
import { ref, reactive, watchEffect } from 'vue'
import Chat_bedrock from './Chat_bedrock.vue';

const user = reactive({
  name: '',
  age: '',
})
</script>

<template>
  <h2>{{ user.name }}さんは{{ user.age }}歳</h2>
  <input v-model="user.name" placeholder="名前" />
  <input v-model="user.age" placeholder="年齢" />

  <chat_bedrock/>
</template>

<style></style>

<script setup>
import { ref } from 'vue'

const prompt = ref('')           // 入力テキスト
const responseText = ref('')     // AIの返答
const isLoading = ref(false)     // ローディング状態
const errorMessage = ref('')     // エラーメッセージ


const API_URL = 'https://vxk1txtbn1.execute-api.ap-northeast-1.amazonaws.com/dev/chat'

const askAI = async () => {
  if (!prompt.value) return

  isLoading.value = true
  errorMessage.value = ''
  responseText.value = ''

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: prompt.value
    })

    if (!response.ok) {
      throw new Error('エラーが発生しました')
    }

    responseText.value = await response.text()
  } catch (err) {
    errorMessage.value = `エラー発生: ${err.message}`
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="chat-container">
    <h2>Gemini AI チャット実験</h2>
    
    <div class="input-area">
      <textarea 
        v-model="prompt" 
        placeholder="AIに何を聞いてみる？"
        :disabled="isLoading"
      ></textarea>
      <button @click="askAI" :disabled="isLoading || !prompt">
        {{ isLoading ? '考え中...' : '送信する' }}
      </button>
    </div>

    <div v-if="responseText" class="result success">
      <strong>AIの回答:</strong>
      <p>{{ responseText }}</p>
    </div>

    <div v-if="errorMessage" class="result error">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.chat-container { max-width: 600px; margin: 2rem auto; font-family: sans-serif; }
textarea { width: 100%; height: 100px; margin-bottom: 1rem; border-radius: 8px; padding: 10px; }
button { width: 100%; padding: 10px; background-color: #42b883; color: white; border: none; border-radius: 8px; cursor: pointer; }
button:disabled { background-color: #ccc; }
.result { margin-top: 1.5rem; padding: 1rem; border-radius: 8px; line-height: 1.6; }
.success { background-color: #f0fdf4; border: 1px solid #bbf7d0; }
.error { background-color: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }
</style>
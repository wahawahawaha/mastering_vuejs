<template>
  <div class="ctf-container">
    <div class="ctf-main-container">
      <div class="ctf-header">
        <h1>🏴‍☠️ CTF チャレンジ</h1>
        <p>隠されたフラグを見つけよう！</p>
        <p>flag { 〇〇〇〇〇〇 } の中身を入力してね！</p>
      </div>

      <div class="ctf-input-group">
        <label for="flagInput">フラグを入力してください:</label>
        <input
          type="text"
          id="flagInput"
          v-model="flagInput"
          placeholder="flag{...}"
          @keyup.enter="checkFlag"
        >
      </div>

      <button class="ctf-btn" @click="checkFlag">フラグを送信</button>
      <button class="ctf-btn ctf-hint-btn" @click="toggleHint" style="margin-left: 10px;">
        💡 ヒント
      </button>

      <div v-if="showHintMessage" class="ctf-hint-box">
        💡 Devtoolからソースコードを見てみよう！<br>
        (F12キーを押すか、右クリック→「検証」→「Sources」タブ)
      </div>

      <div v-if="showError" class="ctf-error">
        ❌ 間違っています！もう一度試してください。❌
      </div>
    </div>

    <!-- お祝いモーダル -->
    <div v-if="showModal" class="ctf-modal">
      <div class="confetti-container">
        <div
          v-for="confetti in confettiPieces"
          :key="confetti.id"
          class="confetti"
          :class="confetti.animationClass"
          :style="{
            left: confetti.x + '%',
            animationDelay: confetti.delay + 's',
            animationDuration: confetti.duration + 's'
          }"
        ></div>
      </div>

      <div class="ctf-modal-content">
        <div class="whale">🐳</div>
        <h2>🎊 やったね！おめでとう！ 🎊</h2>
        <div class="celebration-icons">
          <span>🎉</span>
          <span>🎊</span>
          <span>🥳</span>
          <span>🌟</span>
          <span>✨</span>
          <span>🚀</span>
          <span>🏆</span>
        </div>
        <p>🔍 隠されたフラグを見つけました！</p>
        <button class="ctf-close-btn" @click="closeModal">閉じる</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'SimpleCTF',
  setup() {
    // リアクティブな状態
    const flagInput = ref('')
    const correctFlag = ref('docker_container_master_2024')
    const showError = ref(false)
    const showHintMessage = ref(false)
    const showModal = ref(false)
    const confettiPieces = ref([])

    // フラグチェック
    const checkFlag = () => {
      showError.value = false

      if (flagInput.value.toLowerCase().trim() === correctFlag.value.toLowerCase()) {
        showCelebration()
      } else {
        showError.value = true
        // 3秒後にエラーを消す
        setTimeout(() => {
          showError.value = false
        }, 3000)
      }
    }

    // ヒント表示切り替え
    const toggleHint = () => {
      showHintMessage.value = !showHintMessage.value
    }

    // お祝い表示
    const showCelebration = () => {
      createConfetti()
      showModal.value = true
    }

    // モーダルを閉じる
    const closeModal = () => {
      showModal.value = false
      flagInput.value = ''
      confettiPieces.value = []
    }

    // 紙吹雪作成
    const createConfetti = () => {
      const animationClasses = ['confetti-fall-1', 'confetti-fall-2', 'confetti-fall-3']
      confettiPieces.value = []

      // 100個の紙吹雪を作成
      for (let i = 0; i < 100; i++) {
        confettiPieces.value.push({
          id: `confetti-${i}`,
          x: Math.random() * 100,
          delay: Math.random() * 2,
          duration: 3 + Math.random() * 2, // 3-5秒
          animationClass: animationClasses[Math.floor(Math.random() * animationClasses.length)]
        })
      }

      // 6秒後に紙吹雪をクリア
      setTimeout(() => {
        confettiPieces.value = []
      }, 6000)
    }

    return {
      flagInput,
      showError,
      showHintMessage,
      showModal,
      confettiPieces,
      checkFlag,
      toggleHint,
      closeModal
    }
  }
}
</script>

<style scoped>
/* ベーススタイル */
.ctf-container {
  font-family: 'Courier New', monospace;
  background: #1a1a1a;
  color: #fff;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  box-sizing: border-box;
}

.ctf-container * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* メインコンテナ */
.ctf-main-container {
  text-align: center;
  background: #2a2a2a;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  max-width: 500px;
  width: 90%;
}

/* ヘッダー */
.ctf-header h1 {
  color: #00ff41;
  margin-bottom: 20px;
  font-size: 2em;
}

.ctf-header p {
  margin: 10px 0;
  color: #ccc;
}

/* 入力グループ */
.ctf-input-group {
  margin: 30px 0;
}

.ctf-input-group label {
  display: block;
  margin-bottom: 10px;
  color: #ccc;
  font-weight: bold;
}

.ctf-input-group input {
  width: 100%;
  padding: 15px;
  background: #333;
  border: 2px solid #555;
  border-radius: 5px;
  color: #fff;
  font-size: 16px;
  font-family: 'Courier New', monospace;
  box-sizing: border-box;
}

.ctf-input-group input:focus {
  outline: none;
  border-color: #00ff41;
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
}

/* ボタン */
.ctf-btn {
  background: #00ff41;
  color: #000;
  border: none;
  padding: 15px 30px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 5px;
}

.ctf-btn:hover {
  background: #00cc33;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 255, 65, 0.4);
}

.ctf-hint-btn {
  background: #ff9800;
  color: white;
}

.ctf-hint-btn:hover {
  background: #e68900;
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.4);
}

/* メッセージスタイル */
.ctf-error {
  background: rgba(255, 107, 107, 0.2);
  border: 2px solid #ff6b6b;
  color: #ff6b6b;
  padding: 15px;
  border-radius: 5px;
  margin: 15px 0;
  text-align: center;
  font-weight: bold;
}

.ctf-hint-box {
  background: rgba(255, 193, 7, 0.1);
  border: 2px solid #ffc107;
  color: #ffc107;
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0;
  text-align: center;
  font-weight: bold;
  animation: hintGlow 2s ease-in-out infinite alternate;
}

@keyframes hintGlow {
  from {
    box-shadow: 0 0 10px rgba(255, 193, 7, 0.3);
  }
  to {
    box-shadow: 0 0 20px rgba(255, 193, 7, 0.6);
  }
}

/* モーダル関連 */
.ctf-modal {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f9ca24, #f0932b, #eb4d4b, #6c5ce7);
  background-size: 400% 400%;
  animation: rainbowBg 3s ease infinite;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes rainbowBg {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.ctf-modal-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 40px;
  border-radius: 30px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 700px;
  width: 90%;
  animation: superCelebrate 1s ease-out;
  position: relative;
  overflow: hidden;
}

@keyframes superCelebrate {
  0% {
    transform: scale(0.1) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.ctf-modal h2 {
  font-size: 4em;
  margin-bottom: 20px;
  color: #fff;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
  animation: textGlow 2s ease-in-out infinite alternate;
}

@keyframes textGlow {
  from {
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5), 0 0 20px #fff;
  }
  to {
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5), 0 0 30px #fff, 0 0 40px #fff;
  }
}

.ctf-modal p {
  font-size: 1.3em;
  color: #f0f0f0;
  line-height: 1.8;
  margin-bottom: 30px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.ctf-close-btn {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: 2px solid #fff;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.ctf-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

/* アニメーション関連 */
.celebration-icons {
  font-size: 2em;
  margin: 20px 0;
}

.celebration-icons span {
  display: inline-block;
  margin: 0 10px;
  animation: iconBounce 1s ease-in-out infinite;
}

.celebration-icons span:nth-child(1) { animation-delay: 0s; }
.celebration-icons span:nth-child(2) { animation-delay: 0.2s; }
.celebration-icons span:nth-child(3) { animation-delay: 0.4s; }
.celebration-icons span:nth-child(4) { animation-delay: 0.6s; }
.celebration-icons span:nth-child(5) { animation-delay: 0.8s; }
.celebration-icons span:nth-child(6) { animation-delay: 1s; }
.celebration-icons span:nth-child(7) { animation-delay: 1.2s; }

@keyframes iconBounce {
  0%, 100% {
    transform: translateY(0) scale(1) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) scale(1.2) rotate(360deg);
  }
}

.whale {
  font-size: 5em;
  margin-bottom: 20px;
  animation: happyWhaleBounce 1.5s ease-in-out infinite;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.8));
}

@keyframes happyWhaleBounce {
  0%, 100% {
    transform: translateY(0) rotate(-5deg) scale(1);
  }
  25% {
    transform: translateY(-30px) rotate(5deg) scale(1.1);
  }
  50% {
    transform: translateY(-20px) rotate(-2deg) scale(1.05);
  }
  75% {
    transform: translateY(-35px) rotate(3deg) scale(1.08);
  }
}

/* 紙吹雪アニメーション */
.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1001;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #f43f5e;
}

.confetti:nth-child(odd) {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border-radius: 50%;
}

.confetti:nth-child(even) {
  background: linear-gradient(45deg, #feca57, #48dbfb);
  transform: rotate(45deg);
}

.confetti:nth-child(3n) {
  background: linear-gradient(45deg, #ff9ff3, #54a0ff);
  border-radius: 50%;
  width: 8px;
  height: 8px;
}

.confetti:nth-child(4n) {
  background: linear-gradient(45deg, #5f27cd, #00d2d3);
  width: 12px;
  height: 4px;
  border-radius: 2px;
}

.confetti:nth-child(5n) {
  background: linear-gradient(45deg, #fd79a8, #fdcb6e);
  width: 6px;
  height: 6px;
  transform: rotate(30deg);
}

/* 紙吹雪のアニメーション */
@keyframes confettiFall1 {
  0% {
    transform: translateY(-100vh) rotateZ(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotateZ(720deg);
    opacity: 0;
  }
}

@keyframes confettiFall2 {
  0% {
    transform: translateY(-100vh) rotateZ(0deg) rotateY(0deg);
    opacity: 1;
  }
  50% {
    opacity: 1;
    transform: translateY(50vh) rotateZ(360deg) rotateY(180deg);
  }
  100% {
    transform: translateY(100vh) rotateZ(720deg) rotateY(360deg);
    opacity: 0;
  }
}

@keyframes confettiFall3 {
  0% {
    transform: translateY(-100vh) rotateZ(0deg) scale(1);
    opacity: 1;
  }
  25% {
    transform: translateY(25vh) rotateZ(180deg) scale(1.2);
  }
  50% {
    transform: translateY(50vh) rotateZ(360deg) scale(0.8);
  }
  75% {
    transform: translateY(75vh) rotateZ(540deg) scale(1.1);
  }
  100% {
    transform: translateY(100vh) rotateZ(720deg) scale(0.5);
    opacity: 0;
  }
}

@keyframes confettiSway {
  0%, 100% {
    transform: translateX(0px) rotateZ(0deg);
  }
  25% {
    transform: translateX(30px) rotateZ(90deg);
  }
  50% {
    transform: translateX(-20px) rotateZ(180deg);
  }
  75% {
    transform: translateX(40px) rotateZ(270deg);
  }
}

/* 紙吹雪の種類別アニメーション */
.confetti-fall-1 {
  animation: confettiFall1 3s linear forwards, confettiSway 1s ease-in-out infinite;
}

.confetti-fall-2 {
  animation: confettiFall2 3.5s linear forwards, confettiSway 1.2s ease-in-out infinite;
}

.confetti-fall-3 {
  animation: confettiFall3 4s linear forwards, confettiSway 0.8s ease-in-out infinite;
}

/* レスポンシブ対応 */
@media (max-width: 600px) {
  .ctf-main-container {
    padding: 20px;
  }

  .ctf-header h1 {
    font-size: 1.5em;
  }

  .ctf-modal h2 {
    font-size: 2.5em;
  }

  .ctf-modal-content {
    padding: 40px 20px;
  }
}
</style>

<!-- flag{docker_container_master_2024} -->
// CTF共通のVue Composition Function
import { ref, computed, nextTick } from 'vue'

export function useCTF() {
  // リアクティブな状態
  const flagInputs = ref({})
  const flagStates = ref({})
  const showHints = ref({})
  const showModal = ref(false)
  const particles = ref([])
  const confettiPieces = ref([])

  // フラグ検証
  const checkFlag = (challengeId, userInput, correctFlag) => {
    const normalizedInput = userInput.toLowerCase().trim()
    const normalizedCorrect = correctFlag.toLowerCase().trim()

    if (normalizedInput === normalizedCorrect) {
      flagStates.value[challengeId] = { success: true, error: false }
      return true
    } else {
      flagStates.value[challengeId] = { success: false, error: true }
      // 3秒後にエラーを消す
      setTimeout(() => {
        if (flagStates.value[challengeId]) {
          flagStates.value[challengeId].error = false
        }
      }, 3000)
      return false
    }
  }

  // ヒント表示の切り替え
  const toggleHint = (challengeId) => {
    showHints.value[challengeId] = !showHints.value[challengeId]
  }

  // 成功時のお祝いモーダル
  const showCelebration = () => {
    createParticles()
    createConfetti()
    showModal.value = true
    playVictorySound()
  }

  const closeCelebration = () => {
    showModal.value = false
    particles.value = []
    confettiPieces.value = []
  }

  // パーティクル作成
  const createParticles = () => {
    const emojis = ['🎉', '🎊', '⭐', '✨', '🌟', '🎈', '🎁', '🏆', '🥳', '🚀', '🌈', '💎', '👑', '🔥']
    particles.value = []

    for (let i = 0; i < 30; i++) {
      particles.value.push({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: Math.random() * 100,
        delay: Math.random() * 2
      })
    }
  }

  // 紙吹雪作成
  const createConfetti = () => {
    const animationClasses = ['confetti-fall-1', 'confetti-fall-2']
    confettiPieces.value = []

    for (let i = 0; i < 100; i++) {
      confettiPieces.value.push({
        id: `confetti-${i}`,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
        animationClass: animationClasses[Math.floor(Math.random() * animationClasses.length)]
      })
    }

    // 6秒後に紙吹雪をクリア
    setTimeout(() => {
      confettiPieces.value = []
    }, 6000)
  }

  // 勝利音再生
  const playVictorySound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const notes = [523.25, 659.25, 783.99, 1046.50] // C, E, G, C音階

      notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + index * 0.2)
        oscillator.type = 'triangle'

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + index * 0.2)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.2 + 0.3)

        oscillator.start(audioContext.currentTime + index * 0.2)
        oscillator.stop(audioContext.currentTime + index * 0.2 + 0.3)
      })
    } catch  {
      console.log('Audio not supported or blocked')
    }
  }

  // マトリックス背景アニメーション
  const initMatrix = () => {
    nextTick(() => {
      const canvas = document.getElementById('matrix')
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      const chars = '01'
      const charArray = chars.split('')
      const fontSize = 14
      const columns = canvas.width / fontSize

      const drops = []
      for (let i = 0; i < columns; i++) {
        drops[i] = 1
      }

      const draw = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = '#00ff41'
        ctx.font = fontSize + 'px monospace'

        for (let i = 0; i < drops.length; i++) {
          const text = charArray[Math.floor(Math.random() * charArray.length)]
          ctx.fillText(text, i * fontSize, drops[i] * fontSize)

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0
          }
          drops[i]++
        }
      }

      setInterval(draw, 100)
    })
  }

  // 計算プロパティ
  const completedChallenges = computed(() => {
    return Object.values(flagStates.value).filter(state => state.success).length
  })

  // チャレンジIDのリストから総チャレンジ数を計算
  const getTotalChallenges = (challengeIds) => {
    return challengeIds.length
  }

  // 全チャレンジ完了かどうか
  const isAllCompleted = (challengeIds) => {
    return computed(() => completedChallenges.value === challengeIds.length)
  }

  return {
    // 状態
    flagInputs,
    flagStates,
    showHints,
    showModal,
    particles,
    confettiPieces,

    // メソッド
    checkFlag,
    toggleHint,
    showCelebration,
    closeCelebration,
    initMatrix,

    // 計算プロパティ
    completedChallenges,
    getTotalChallenges,
    isAllCompleted
  }
}
<template>
  <div class="min-h-screen bg-gray-50 pb-32">
    <header class="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <h1 class="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Utensils class="text-orange-500" />
          <span>冷蔵庫の中身を選択</span>
        </h1>
        <button @click="resetSelection" class="text-sm text-gray-500 hover:text-orange-600 transition-colors">
          選択をリセット
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto p-4 md:p-6">
      <div v-for="(group, category) in groupedIngredients" :key="category" class="mb-8">
        <h2 class="text-lg font-semibold text-gray-700 mb-4 border-l-4 border-orange-400 pl-3">
          {{ category }}
        </h2>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div 
            v-for="item in group" 
            :key="item.id"
            @click="toggleItem(item.id)"
            :class="[
              'relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 transform active:scale-95 border-2 shadow-sm',
              item.isSelected 
                ? 'border-orange-500 ring-2 ring-orange-200 bg-orange-50 scale-[1.02]' 
                : 'border-white hover:border-gray-200 bg-white'
            ]"
          >
            <div class="aspect-square w-full overflow-hidden bg-gray-100">
              <img 
                :src="item.image" 
                :alt="item.name"
                class="w-full h-full object-cover transition-opacity duration-300"
                loading="lazy"
              />
            </div>

            <div class="p-3 text-center">
              <span :class="['text-sm font-medium', item.isSelected ? 'text-orange-700' : 'text-gray-700']">
                {{ item.name }}
              </span>
            </div>

            <div 
              v-if="item.isSelected" 
              class="absolute top-2 right-2 bg-orange-500 text-white rounded-full p-1 shadow-lg animate-in zoom-in duration-200"
            >
              <Check :size="16" stroke-width="3" />
            </div>
          </div>
        </div>
      </div>
    </main>

    <div class="fixed bottom-8 left-0 right-0 px-4 flex justify-center pointer-events-none">
      <button 
        :disabled="selectedCount === 0"
        :class="[
          'pointer-events-auto flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg shadow-2xl transition-all duration-300 transform active:scale-90',
          selectedCount > 0 
            ? 'bg-orange-500 text-white hover:bg-orange-600 translate-y-0' 
            : 'bg-gray-300 text-gray-500 translate-y-20 opacity-0'
        ]"
      >
        <Search :size="20" />
        <span>{{ selectedCount }}件の食材でレシピを検索</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Check, Search, Utensils } from 'lucide-vue-next';

// 食材データ（画像はキーワードベースの外部APIを使用）
const ingredients = ref([
  // 野菜
  { id: 1, name: '玉ねぎ', category: '野菜', image: 'https://loremflickr.com/300/300/onion', isSelected: false },
  { id: 2, name: 'にんじん', category: '野菜', image: 'https://loremflickr.com/300/300/carrot', isSelected: false },
  { id: 3, name: 'キャベツ', category: '野菜', image: 'https://loremflickr.com/300/300/cabbage', isSelected: false },
  { id: 4, name: '大根', category: '野菜', image: 'https://loremflickr.com/300/300/radish', isSelected: false },
  { id: 5, name: 'にんにく', category: '野菜', image: 'https://loremflickr.com/300/300/garlic', isSelected: false },
  { id: 6, name: 'じゃがいも', category: '野菜', image: 'https://loremflickr.com/300/300/potato', isSelected: false },
  // 肉
  { id: 7, name: '鶏もも肉', category: '肉', image: 'https://loremflickr.com/300/300/chicken,thigh', isSelected: false },
  { id: 8, name: '豚バラ肉', category: '肉', image: 'https://loremflickr.com/300/300/pork,belly', isSelected: false },
  { id: 9, name: '牛こま切れ肉', category: '肉', image: 'https://loremflickr.com/300/300/beef,meat', isSelected: false },
  // その他
  { id: 10, name: '卵', category: 'その他', image: 'https://loremflickr.com/300/300/egg', isSelected: false },
  { id: 11, name: '納豆', category: 'その他', image: 'https://loremflickr.com/300/300/natto', isSelected: false },
  { id: 12, name: '豆腐', category: 'その他', image: 'https://loremflickr.com/300/300/tofu', isSelected: false },
]);

// カテゴリーごとにグループ化する算出プロパティ
const groupedIngredients = computed(() => {
  return ingredients.value.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});
});

// 選択されている食材の数
const selectedCount = computed(() => {
  return ingredients.value.filter(item => item.isSelected).length;
});

// トグル機能
const toggleItem = (id) => {
  const item = ingredients.value.find(i => i.id === id);
  if (item) {
    item.isSelected = !item.isSelected;
  }
};

// リセット機能
const resetSelection = () => {
  ingredients.value.forEach(item => item.isSelected = false);
};
</script>

<style scoped>
/* 必要に応じてアニメーションなどを追加 */
.animate-in {
  animation: zoom-in 0.2s ease-out;
}

@keyframes zoom-in {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}
</style>
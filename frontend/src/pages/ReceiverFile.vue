<template>
  <div class="receiver-file-page">
    <Banner />
    <main class="main-content">
      <h1>Receiver File Page</h1>
    </main>
  </div>
</template>

<script setup>
import Banner from '../components/Banner.vue';
</script>

<style scoped>
.receiver-file-page {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: #f5f5f5;
  padding: 0;
  margin: 0;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(40px, 10vw, 80px) 20px;
}

h1 {
  font-size: clamp(24px, 6vw, 32px);
  color: #333;
}
</style> 
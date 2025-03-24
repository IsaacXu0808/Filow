<template>
  <header class="banner">
    <div class="banner-content">
      <img src="../assets/logo.png" alt="Filow Logo" class="logo">
      <div class="banner-text">
        <h1 class="app-name">Filow</h1>
        <p class="slogan">File + Flow: point-to-point file transmission stream</p>
      </div>
    </div>
  </header>
</template>

<script setup>
// 组件逻辑
</script>

<style scoped>
.banner {
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  color: white;
  padding: clamp(25px, 5vw, 45px) 0;
  text-align: left;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin: 0;
}

.banner-content {
  display: flex;
  align-items: center;
  gap: clamp(32px, 6vw, 48px);
  padding-left: 5%;
  width: 100%;
  box-sizing: border-box;
}

.logo {
  width: clamp(80px, 15vw, 100px);
  height: clamp(80px, 15vw, 100px);
  object-fit: contain;
}

.banner-text {
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 2vw, 12px);
  width: clamp(800px, 40vw, 400px);
}

.app-name {
  font-size: clamp(48px, 10vw, 64px);
  font-weight: 700;
  margin: 0;
  background: linear-gradient(45deg, #64b5f6, #bbdefb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  width: 100%;
}

.slogan {
  font-size: clamp(20px, 4vw, 27px);
  color: #bbdefb;
  margin: 0;
  letter-spacing: 2px;
  text-align: left;
  font-weight: 500;
  width: 100%;
}
</style> 
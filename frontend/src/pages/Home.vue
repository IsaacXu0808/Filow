<template>
  <div class="home">
    <Banner />

    <main class="main-content">
      <h2 class="identity-title">I want to ...</h2>
      <div class="identity-buttons">
        <router-link to="/sender" class="identity-button sender">
          <span class="button-text">Send</span>
        </router-link>
        <div class="divider"></div>
        <router-link to="/receiver" class="identity-button receiver">
          <span class="button-text">Receive</span>
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import Banner from '../components/Banner.vue'
// 组件逻辑
</script>

<style scoped>
.home {
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  background: #f5f5f5;
  position: relative;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

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
  padding-left: clamp(60px, 12vw, 100px);
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

.main-content {
  min-height: unset;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: clamp(40px, 8vw, 60px) 20px;
  background: #f5f5f5;
  width: 100%;
  gap: clamp(40px, 8vw, 60px);
  margin: 0;
  box-sizing: border-box;
}

.identity-title {
  font-size: clamp(100px, 20vw, 120px);
  font-weight: 800;
  color: #1a237e;
  margin: 0;
  text-align: center;
  letter-spacing: -2px;
  padding-top: 2%;
}

.identity-buttons {
  display: flex;
  align-items: center;
  gap: clamp(90px, 16vw, 110px);
  width: 100%;
  justify-content: center;
  padding: 0;
  padding-top: 2%;
}

.identity-button {
  width: clamp(300px, 60vw, 400px);
  height: clamp(240px, 48vw, 320px);
  border-radius: clamp(40px, 8vw, 50px);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  flex: 1;
  max-width: 400px;
  margin: 0;
  border: 4px solid;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.identity-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  opacity: 0;
  transition: all 0.3s ease;
}

.identity-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.identity-button:hover::before {
  opacity: 0.1;
}

.identity-button.sender {
  background: #ff793b;
  border-color: #1a237e;
}

.identity-button.receiver {
  background: #00a6ff;
  border-color: #1a237e;
}

.button-text {
  font-size: clamp(60px, 12vw, 68px);
  font-weight: 700;
  color: #f6f6f6;
  position: relative;
  z-index: 1;
  letter-spacing: 1px;
}

.divider {
  width: 4px;
  height: clamp(120px, 25vw, 180px);
  background: #1a237e;
  opacity: 0.2;
  border-radius: 2px;
}

@media (max-width: 768px) {
  .identity-buttons {
    flex-direction: column;
    gap: clamp(40px, 8vw, 60px);
  }

  .divider {
    width: clamp(200px, 40vw, 300px);
    height: 4px;
  }

  .identity-button {
    width: clamp(180px, 35vw, 250px);
    height: clamp(80px, 15vw, 120px);
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .identity-buttons {
    gap: 60px;
  }

  .identity-button {
    width: 240px;
    height: 120px;
  }
}

@media (min-width: 1025px) {
  .identity-buttons {
    gap: 80px;
  }

  .identity-button {
    width: 300px;
    height: 150px;
  }
}
</style> 
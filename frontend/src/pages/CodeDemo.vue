<template>
  <div class="receiver-page">
    <Banner />
    <dev class="main-content">
      <p class="instruction">Enter the code from the SENDER's device to start file transmission:</p>
      <VerificationCode ref="verificationCodeRef" v-model="vCode" @input="showError = false" />
      <div class="error-message">
        <p v-show="showError">{{ errorMessage }}</p>
      </div>
      <div class="button-group">
        <button class="join-button" :disabled="vCode.length !== 6" @click="joinSession">
          Join Session
        </button>
        <button class="cancel-button" @click="cancel">Cancel</button>
      </div>
    </dev>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Banner from '../components/Banner.vue';
import VerificationCode from '../components/VerificationCode.vue';
import io from 'socket.io-client';

const vCode = ref('');
const errorMessage = ref('');
const showError = ref(false);
const router = useRouter();
const verificationCodeRef = ref(null);

const joinSession = () => {
  fetch('http://localhost:3000/api/receiver_join', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ vCode: vCode.value }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('vCode does not exist');
      }
      return response.json();
    })
    .then(data => {
      console.log('API response:', data);
      const socket = io('http://localhost:3000');

      socket.on('connect', () => {
        console.log('Receiver side Socket.io connection established');
        socket.emit('receiver_join', vCode.value);
      });

      socket.on('message', (message) => {
        console.log('Message from server:', message);
      });

      socket.on('disconnect', () => {
        console.log('Socket.io connection closed');
      });
    })
    .catch(error => {
      if (error.message === 'vCode does not exist') {
        errorMessage.value = 'Connection does not exist';
        showError.value = true;
        vCode.value = '';
        verificationCodeRef.value?.clear();
      } else {
        console.error('Error:', error);
      }
    });
};

const cancel = () => {
  router.push('/'); // 返回首页
};
</script>

<style scoped>
.receiver-page {
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
  gap: clamp(40px, 8vw, 60px);
  padding: clamp(40px, 10vw, 80px) 20px;
}

.instruction {
  font-size: clamp(20px, 4vw, 24px);
  color: #333;
  text-align: center;
  margin-bottom: 5%;
}

.error-message {
  color: red;
  font-size: clamp(16px, 3vw, 20px);
  height: 0px; /* Ensure space is reserved */
  margin-top: -5%;
}

.button-group {
  display: flex;
  gap: 100px;
  margin-top: 5%;
}

.join-button {
  width: clamp(150px, 30vw, 250px);
  height: clamp(80px, 16vw, 120px);
  border-radius: clamp(15px, 3vw, 20px);
  background: #4CAF50;
  color: #fff;
  font-size: clamp(20px, 4vw, 28px);
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease;
}

.join-button:disabled {
  background: #e0e0e0;
  color: #666;
  cursor: not-allowed;
}

.cancel-button {
  width: clamp(150px, 30vw, 250px);
  height: clamp(80px, 16vw, 120px);
  border-radius: clamp(15px, 3vw, 20px);
  background: #f44336;
  color: #fff;
  font-size: clamp(20px, 4vw, 28px);
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease;
}

.cancel-button:hover {
  background: #d32f2f;
}
</style> 
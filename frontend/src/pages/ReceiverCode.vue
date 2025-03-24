<template>
  <div class="receiver-page">
    <Banner />
    <div class="code-content" v-if="stage === 'code'">
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
    </div>

    <div v-else-if="stage === 'file'" class="file-content">
      <p class="instruction">{{ uploadStatus }}</p>
      <p v-if="fileName" :style="{ color: 'black' }">{{ fileName }} ({{ (fileSize / 1024).toFixed(2) }} KB)</p>
      <div class="file-upload" :class="{ disabled: receivedChunks !== totalChunks }" @click="handleDownload">
        <div class="upload-icon">
          <img src="../assets/file.png" alt="File Icon" />
        </div>
      </div>
      <div v-if="receivedChunks > 0" class="progress-bar">
        <div class="progress" :style="{ width: 100 * receivedChunks / totalChunks + '%' }">{{ (100 * receivedChunks / totalChunks).toFixed(2) }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Banner from '../components/Banner.vue';
import VerificationCode from '../components/VerificationCode.vue';
import io from 'socket.io-client';

const vCode = ref('');
const errorMessage = ref('');
const showError = ref(false);
const router = useRouter();
const verificationCodeRef = ref(null);
const stage = ref('code');
const uploadStatus = ref('Waiting for the sender to upload a file...');
const receivedChunks = ref(0);
const totalChunks = ref(1);
const fileName = ref('');
const fileSize = ref(0);
let socket;

const handleDownload = () => {
  if (receivedChunks.value === totalChunks.value) {
    socket.emit('request_download', { vCode: vCode.value });
    uploadStatus.value = 'Preparing file for download...';
  }
};

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
      socket = io('http://localhost:3000');

      socket.on('connect', () => {
        console.log('Receiver side Socket.io connection established');
        socket.emit('receiver_join', vCode.value);
      });

      socket.on('message', (message) => {
        console.log('Message from server:', message);
      });

      socket.on('match_success', (data) => {
        console.log('Match success:', data.message);
        stage.value = 'file';
      });

      socket.on('disconnect', () => {
        console.log('Socket.io connection closed');
      });

      socket.on('file_info', (data) => {
        fileName.value = data.name;
        fileSize.value = data.size;
        totalChunks.value = data.totalChunks;
        receivedChunks.value = 0;
        uploadStatus.value = 'Sender is uploading the file...';
      });

      socket.on('file_chunk_received', () => {
        receivedChunks.value++;
        if (receivedChunks.value === totalChunks.value) {
          console.log('File received completely');
          uploadStatus.value = 'Press the button to download the file';
        }
      });

      socket.on('file_ready', (data) => {
        const blob = new Blob([data.fileData], { type: 'application/octet-stream' });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName.value;
        
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        uploadStatus.value = 'File downloaded successfully!';
      });

      socket.on('download_error', (error) => {
        uploadStatus.value = 'Error downloading file: ' + error.message;
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

.code-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(40px, 8vw, 60px);
  padding: clamp(40px, 10vw, 80px) 20px;
}

.file-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(20px, 2vh, 40px);
  padding: clamp(10px, 5vw, 40px) 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 600px;
  margin-top: 5%;
}

.file-upload {
  width: 200px;
  height: 200px;
  border: 20px double #ff793b;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  margin-bottom: 3vh;
}

.file-upload:not(.disabled):hover {
  border-color: #00a6ff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.file-upload img {
  width: 200px;
  height: 250px;
}

.file-upload span {
  flex: auto;
  font-size: 150px;
  color: #ff793b;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  color: #333;
}

.file-icon {
  font-size: 24px;
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

.send-button {
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

.send-button:disabled {
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

.file-upload.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.progress-bar {
  width: 75%;
  background-color: #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  height: 20px;
  color: black;
  font-weight: bold;
  font-size: 15px;
}

.progress {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s ease;
}
</style> 
<template>
  <div class="sender-page">
    <Banner />
    <div v-if="stage === 'code'" class="code-content">
      <p class="instruction">Enter this code on the RECEIVER's device to start file transmission:</p>
      <DisplayCode :code="vCode" />
      <div class="button-group">
        <button class="send-button" disabled>
          Waiting for Receiver
          <span class="loading-dots">
            <span>.</span><span>.</span><span>.</span>
          </span>
        </button>
        <button class="cancel-button" @click="cancel">Cancel</button>
      </div>
    </div>

    <div class="file-content" v-else-if="stage === 'file'">
      <p class="instruction">Please upload the file you want to send:</p>
      <div class="file-upload" @click="triggerFileInput">
        <input type="file" ref="fileInput" @change="handleFileChange" style="display: none;" />
        <div class="upload-icon">
          <img v-if="selectedFile" src="../assets/file.png" alt="File Icon" />
          <img v-else src="../assets/plus.svg" alt="Plus Icon" />
        </div>
      </div>
      <div class="file-info">
        <span v-if="selectedFile" class="file-name">(SandBoxBlockedPath)/{{selectedFile.name }}</span>
        <span v-if="selectedFile"class="file-size">({{ (selectedFile.size / 1024).toFixed(2) }} KB)</span>
      </div>
      <button 
        class="send-button" 
        :disabled="!selectedFile || isSending || isUploaded"
        @click="sendFile"
      >
        {{ sendButtonText }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Banner from '../components/Banner.vue';
import DisplayCode from '../components/DisplayCode.vue';
import io from 'socket.io-client';

// 生成六位数字的验证码
const vCode = ref(Math.floor(100000 + Math.random() * 900000).toString());

const router = useRouter();

let socket;
const stage = ref('code');
const selectedFile = ref(null);
const fileInput = ref(null);
const isSending = ref(false);
const isUploaded = ref(false);

// 计算属性：根据发送状态显示不同的按钮文本
const sendButtonText = computed(() => {
  if (isUploaded.value) return 'File Uploaded';
  if (isSending.value) return 'Sending...';
  return 'Send File';
});

const cancel = () => {
  if (socket) {
    socket.close();
    console.log('WebSocket connection closed on cancel');
  }
  router.push('/'); // 返回首页
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
  }
};

const sendFile = () => {
  if (selectedFile.value) {
    isSending.value = true;
    isUploaded.value = false;
    const file = selectedFile.value;
    const chunkSize = 1024 * 1;
    const totalChunks = Math.ceil(file.size / chunkSize);
    
    socket.emit('file_info', { name: file.name, size: file.size, totalChunks: totalChunks });

    const reader = new FileReader();
    let currentChunk = 0;

    reader.onload = (e) => {
      if (e.target.readyState === FileReader.DONE) {
        socket.emit('file_chunk', { chunk: e.target.result, currentChunk: currentChunk });
        currentChunk++;
        if (currentChunk < totalChunks) {
          readNextChunk();
        } else {
          console.log('File transfer complete');
          isSending.value = false;
          isUploaded.value = true;
        }
      }
    };

    const readNextChunk = () => {
      const start = currentChunk * chunkSize;
      const end = Math.min(file.size, start + chunkSize);
      reader.readAsArrayBuffer(file.slice(start, end));
    };

    readNextChunk();
  }
};

onMounted(() => {
  // 调用 API
  fetch('http://localhost:3000/api/sender_join', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ vCode: vCode.value }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('vCode already exists');
      }
      return response.json();
    })
    .then(data => {
      console.log('API response:', data);

      // 使用 socket.io 建立 WebSocket 连接
      socket = io('http://localhost:3000');

      socket.on('connect', () => {
        console.log('Sender side Socket.io connection established', socket.id);
        // 发送 vCode 作为标识符
        socket.emit('sender_join', vCode.value);
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

      socket.on('error', (error) => {
        if (error.message === 'vCode already exists') {
          alert('Error: vCode already exists. Returning to home page.');
          router.push('/');
        }
      });
    })
    .catch(error => {
      if (error.message === 'vCode already exists') {
        alert('Error: vCode already exists. Returning to home page.');
        router.push('/');
      } else {
        console.error('Error:', error);
      }
    });
});
</script>

<style scoped>
.sender-page {
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
  gap: clamp(10px, 2vw, 40px);
  padding: clamp(20px, 5vw, 40px) 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 600px;
  margin-top: 40px;
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
}

.file-upload:hover {
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
  height: 20px;
}

.file-icon {
  font-size: 24px;
}

.instruction {
  font-size: clamp(20px, 4vw, 24px);
  color: #333;
  text-align: center;
  margin-bottom: 1%;
}

.button-group {
  display: flex;
  gap: 100px; /* 增加按钮之间的间距 */
  margin-top: 8%;
}

.send-button {
  width: clamp(150px, 30vw, 250px); /* 缩小宽度 */
  height: clamp(40px, 8vw, 120px); /* 缩小高度 */
  border-radius: clamp(15px, 3vw, 20px); /* 缩小圆角 */
  background: #4CAF50;
  color: #fff;
  font-size: clamp(20px, 4vw, 28px); /* 缩小字体 */
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
  width: clamp(150px, 30vw, 250px); /* 缩小宽度 */
  height: clamp(80px, 16vw, 120px); /* 缩小高度 */
  border-radius: clamp(15px, 3vw, 20px); /* 缩小圆角 */
  background: #f44336;
  color: #fff;
  font-size: clamp(20px, 4vw, 28px); /* 缩小字体 */
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease;
}

.cancel-button:hover {
  background: #d32f2f;
}

.loading-dots {
  display: inline-block;
  margin-left: 10px;
}

.loading-dots span {
  animation: blink 1.4s infinite both;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%, 20%, 50%, 80%, 100% {
    opacity: 1;
  }
  40% {
    opacity: 0;
  }
  60% {
    opacity: 0;
  }
}
</style> 
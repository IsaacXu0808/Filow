# AI 使用报告

## 1. AI 工具选型

### 1.1 ChatGPT 4o Web App
**优点**：
- 对问题的理解和解释比较细致，思考问题更全面。
- 生成的技术方案有充分的说明，能够一次给出多个可能的解决方案。

**缺点**：
- 生成的代码较为碎片化，使用仍需要很多调整。
- 无法阅读整个项目的代码，需要手动附加且数量有限。
- 无法直接在源代码上应用改动，导致开发者需要手动整合。

### 1.2 Cursor
**优点**：
- 可以阅读整个项目，生成回答时会参考整体的业务逻辑和代码上下文，同时参考和修改多个文件。
- 可以直接在源代码上应用改动，支持大量生成源文件和代码。

**缺点**：
- 会重复生成已经被开发者弃用的解决方案，增加工作量。
- 有时生成的代码对部分技术细节把握不精准，如报错的原因、变量的作用域、组件的样式。

## 2. 使用过程

### 2.1 过程简述

#### 2.1.1 ChatGPT 4o Web App
在开发过程中，ChatGPT 4o 主要用于解决一般性的技术问题和生成素材。它帮助解决了跨域传输的配置问题，生成应用的 logo，以及回答通用技术问题如 Vue.js 和 Express.js 的项目初始化，解释 WebSocket 的工作流程等。

#### 2.1.2 Cursor
Cursor 被广泛用于快速生成和编辑代码，包括源文件、函数、组件、样式和页面路由配置。几乎所有源代码的最初版本都由 Cursor 生成，极大地提高了开发效率。

### 2.2 场景和代码示例

#### 2.2.1 Cursor 优点示例

**（1）代码生成**
Cursor 能够快速生成代码并应用改动。例如，在实现 `VerificationCode` 和 `Banner` 组件时，通过描述组件的外观，Cursor 生成了以下代码：

```vue
<template>
  <div class="verification-code">
    <input type="text" v-model="code" maxlength="6" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const code = ref('');
</script>

<style scoped>
.verification-code {
  /* 样式定义 */
}
</style>
```

**（2）多文件理解和生成**
Cursor 可以理解项目的整体结构，并在多个文件中进行修改。例如，在实现文件传输的过程中，Cursor 能够一次性生成 `Sender`、`Server`和 `Receiver` 三者的文件信息传输代码：

```javascript
// Sender 发送文件信息
socket.emit('file_info', { name: file.name, size: file.size, totalChunks: totalChunks });

// Server 处理文件信息
socket.on('file_info', (data) => {
  // 处理逻辑
  const vCode = socketIdToVCode[socket.id];
  console.log('File info received from sender');
  const receiverSocketId = vCodeToReceiverSocketId[vCode];
  fileChunks[vCode] = [];
  fileInfo[vCode] = data;
  ioServer.to(receiverSocketId).emit('file_info', data);
});

// Receiver 接收文件信息
socket.on('file_info', (data) => {
  fileName.value = data.name;
  totalChunks.value = data.totalChunks;
});
```

#### 2.2.2 Cursor 缺点示例

**（1）无法实现视觉方案**
Cursor 在处理视觉方案时存在局限性。例如，在实现一个错误提示语在不显示时也占据页面高度时，Cursor 提供的样式未能完全解决问题，最终需要手动调整。

Cursor生成的代码：
```html
<p v-show="showError"class="error-message">{{ errorMessage }}</p>
```
```css
.error-message {
  height: 20px;
  min-height: 20px;
}
```

template部分手动处理后：
```html
<div class="error-message">
  <p v-show="showError">{{ errorMessage }}</p>
</div>
```

**（2）重复出现已经弃用的方案**
在某些情况下，Cursor 会重复生成已经被开发者弃用的解决方案。例如，在 `ReceiverCode.vue` 页面挂载时建立 WebSocket 连接的逻辑，尽管开发者已将其改为按按钮建立连接，Cursor 仍然在后续的自动代码编辑中**多次**将其改回挂载时建立连接，。

```javascript
// 错误的连接方式：挂载时连接
onMounted(() => {
  socket = io('http://localhost:3000');
});

```
```javascript
// 正确方式：确认验证码正确后再连接
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
    // 后续逻辑
  })
```


## 总结
AI 工具在本项目开发中发挥了重要作用，帮助解决了多个技术问题，提高了开发效率。但是，开发者仍需对生成的代码进行审查和调整，以确保其符合项目需求。这意味着开发者仍需要充足的专业知识来支持项目的完成，AI工具暂时不具备端到端的完成工程代码的准确性和鲁棒性。然而，在AI辅助开发日渐盛行的背景下，学习者和开发者实践的机会被AI工具压缩，开发过程中必要的知识和经验储备是否足够与AI互补，是值得探讨的问题。
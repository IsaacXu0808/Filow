// Global objects to store vCodes and socket IDs for senders
const vCodeToSocketId = {};
const socketIdToVCode = {};

// Global objects to store vCodes and socket IDs for receivers
const vCodeToReceiverSocketId = {};
const receiverSocketIdToVCode = {};
const fileChunks = {};
const fileInfo = {};
module.exports = { vCodeToSocketId, socketIdToVCode, vCodeToReceiverSocketId, receiverSocketIdToVCode, fileChunks, fileInfo }; 
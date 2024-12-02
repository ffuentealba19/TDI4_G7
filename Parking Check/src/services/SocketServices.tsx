// src/services/SocketService.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket;

export const initiateSocketConnection = () => {
  socket = io('https://parkingcheck.onrender.com', { transports: ['websocket'] });
  console.log('Conectado a Socket.io');
};

export const disconnectSocket = () => {
  console.log('Desconectando de Socket.io...');
  if (socket) socket.disconnect();
};

export const subscribeToParkingUpdates = (cb: (availableSpots: number) => void) => {
  if (!socket) return;
  socket.on('updateAvailableSpots', (availableSpots) => {
    console.log('Espacios disponibles actualizados:', availableSpots);
    cb(availableSpots);
  });
};

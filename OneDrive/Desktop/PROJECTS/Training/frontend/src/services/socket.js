let socket = null;
let reconnectTimeout = null;
let reconnectAttempts = 0;
let manuallyDisconnected = false;

const listeners = new Set();

const callbacks = {
  onOpen: null,
  onClose: null,
  onMessage: null,
  onError: null,
};

const getSocketUrl = () =>
  import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws";

const setCallbacks = ({
  onOpen,
  onClose,
  onMessage,
  onError,
} = {}) => {
  callbacks.onOpen = onOpen || callbacks.onOpen;
  callbacks.onClose = onClose || callbacks.onClose;
  callbacks.onMessage = onMessage || callbacks.onMessage;
  callbacks.onError = onError || callbacks.onError;
};

const clearReconnectTimer = () => {
  if (!reconnectTimeout) {
    return;
  }

  clearTimeout(reconnectTimeout);
  reconnectTimeout = null;
};

const scheduleReconnect = () => {
  if (manuallyDisconnected || reconnectTimeout) {
    return;
  }

  const delay = Math.min(
    1000 * 2 ** reconnectAttempts,
    15000
  );

  reconnectAttempts += 1;

  reconnectTimeout = setTimeout(() => {
    reconnectTimeout = null;
    connectSocket(callbacks);
  }, delay);
};

export const connectSocket = (nextCallbacks = {}) => {
  setCallbacks(nextCallbacks);

  if (
    socket &&
    (socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING)
  ) {
    return socket;
  }

  manuallyDisconnected = false;

  socket = new WebSocket(getSocketUrl());

  socket.onopen = () => {
    reconnectAttempts = 0;
    clearReconnectTimer();
    callbacks.onOpen?.();
  };

  socket.onerror = (error) => {
    callbacks.onError?.(error);
  };

  socket.onclose = (event) => {
    socket = null;
    callbacks.onClose?.(event);
    scheduleReconnect();
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      callbacks.onMessage?.(data);

      listeners.forEach((listener) => {
        listener(data);
      });
    } catch (error) {
      callbacks.onError?.(error);
    }
  };

  return socket;
};

export const disconnectSocket = ({ clearListeners = false } = {}) => {
  manuallyDisconnected = true;
  clearReconnectTimer();

  if (socket) {
    socket.onopen = null;
    socket.onclose = null;
    socket.onerror = null;
    socket.onmessage = null;
    socket.close();
    socket = null;
  }

  if (clearListeners) {
    listeners.clear();
  }
};

export const getSocket = () => socket;

export const sendSocketMessage = (payload) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return false;
  }

  socket.send(JSON.stringify(payload));
  return true;
};

export const subscribeToSocket = (callback) => {
  listeners.add(callback);

  return () => {
    listeners.delete(callback);
  };
};

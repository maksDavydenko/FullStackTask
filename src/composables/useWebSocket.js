import { ref, onUnmounted } from "vue";

export default function useWebSocket() {
  const socket = ref(null);
  const messages = ref([]);
  const reconnectInterval = 5000;
  let isConnecting = false;
  let updateQueue = [];
  let isUpdateScheduled = false;

  // Establishes the WebSocket connection
  const connect = () => {
    if (isConnecting) return; // Avoid duplicate connections
    isConnecting = true;

    socket.value = new WebSocket("WebSocket URL"); // Provide your WebSocket URL

    socket.value.onopen = () => {
      console.log("WebSocket connected.");
      isConnecting = false; // Reset flag after successful connection
    };

    // Handle incoming messages
    socket.value.onmessage = (event) => {
      const update = JSON.parse(event.data); // Parse message data
      updateQueue.push(update); // Add the message to the queue
      scheduleUpdate(); // Schedule an update to apply changes
    };

    // Handle WebSocket errors
    socket.value.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Handle WebSocket closure and initiate reconnection
    socket.value.onclose = () => {
      console.log("WebSocket closed. Attempting to reconnect...");
      isConnecting = false; // Reset the connection flag
      setTimeout(connect, reconnectInterval); // Attempt to reconnect
    };
  };

  // Schedule a single update using requestAnimationFrame to batch state changes
  const scheduleUpdate = () => {
    if (!isUpdateScheduled) {
      isUpdateScheduled = true; // Prevent multiple scheduled frames
      requestAnimationFrame(() => {
        messages.value = [...messages.value, ...updateQueue]; // Apply all queued updates
        updateQueue = []; // Clear the queue
        isUpdateScheduled = false; // Reset the flag for future updates
      });
    }
  };

  // Send a message through the WebSocket
  const sendMessage = (message) => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send(JSON.stringify(message)); // Send the message if socket is open
    } else {
      console.error("WebSocket is not open. Cannot send message.");
    }
  };

  // Clean up resources when the component is unmounted
  onUnmounted(() => {
    if (socket.value) socket.value.close(); // Close the WebSocket connection
  });

  connect(); // Initialize WebSocket connection

  return { messages, sendMessage }; // Expose messages and sendMessage function
}

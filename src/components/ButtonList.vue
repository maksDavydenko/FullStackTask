<template>
  <div class="button-list">
    <!-- Button to add a new button to the list -->
    <button class="add-button" @click="addButton">Add</button>

    <!-- Button to refresh the list of buttons (e.g., by fetching from the server) -->
    <button class="refresh-button" @click="fetchButtons">Refresh</button>

    <!-- Using transition-group for animated button display -->
    <transition-group name="fade" tag="div" class="button-container">
      <!-- Looping through the buttons array to render each button -->
      <div v-for="button in buttons" :key="button.id" class="button-item">
        {{ button.label }}
        <!-- Display the label of each button -->
      </div>
    </transition-group>
  </div>
</template>

<script>
import { ref } from "vue";
import useWebSocket from "../composables/useWebSocket"; // Importing a custom WebSocket composable

export default {
  setup() {
    const buttons = ref([]);

    const { sendMessage } = useWebSocket(); // Get the sendMessage function from the WebSocket composable

    // Function to add a new button to the list
    const addButton = () => {
      const newButton = { id: Date.now(), label: "New Button" }; // Create a new button with a unique ID
      buttons.value.push(newButton); // Add the new button to the array
      sendMessage(newButton); // Send the new button data through WebSocket
    };

    // Function to refresh the list of buttons (e.g., fetch data from the server)
    const fetchButtons = async () => {
      try {
        // Simulating an API call to fetch button data
        const response = await fetch("API");
        const data = await response.json();
        buttons.value = data; // Update the buttons array with the fetched data
      } catch (error) {
        console.error("Failed to fetch", error);
      }
    };

    return { buttons, addButton, fetchButtons }; // Return state and functions to the template
  },
};
</script>

<style scoped>
.button-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.add-button,
.refresh-button {
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  color: white;
  background-color: #007bff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-button:hover,
.refresh-button:hover {
  background-color: #0056b3;
}

.button-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button-item {
  padding: 10px;
  margin: 5px;
  width: 100%;
  border-radius: 5px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.button-item:hover {
  transform: scale(1.05);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

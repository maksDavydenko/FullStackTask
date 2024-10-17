<template>
  <div class="virtual-scroll">
    <!-- Check if data is still loading -->
    <div v-if="isLoading" class="loading">Loading...</div>

    <!-- Show error message if fetching fails -->
    <div v-if="error" class="error">Failed to load data. Please try again.</div>

    <!-- Render virtual list only if data is loaded successfully -->
    <virtual-list
      v-if="!isLoading && !error"
      :data-sources="dataSources"
      :item-size="50"
    >
      <!-- Slot template to render each individual item -->
      <template #default="{ item }">
        <div class="virtual-item">{{ item.label }}</div>
        <!-- Display item label -->
      </template>
    </virtual-list>
  </div>
</template>

<script>
import { useQuery } from "@tanstack/vue-query"; // Importing useQuery for data fetching and caching

export default {
  setup() {
    // Async function to fetch buttons from the server
    const fetchButtons = async () => {
      const response = await fetch("API");
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json(); // Replace with the actual API endpoint
    };

    // Using useQuery to fetch data with caching and error handling
    const {
      data: dataSources,
      error,
      isLoading,
    } = useQuery("buttons", fetchButtons);

    return { dataSources, error, isLoading }; // Expose dataSources, error, and isLoading to the template
  },
};
</script>

<style scoped>
.virtual-scroll {
  max-height: 400px;
  border: 1px solid #ced4da;
  border-radius: 5px;
}

.loading,
.error {
  text-align: center;
  padding: 20px;
  font-size: 16px;
}

.virtual-item {
  padding: 10px;
  margin: 5px;
  background-color: #e9ecef;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, background-color 0.3s;
}

.virtual-item:hover {
  transform: scale(1.1);
  background-color: #dee2e6;
}
</style>

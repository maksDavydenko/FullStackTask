import { createApp } from "vue";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";
import App from "./App.vue";

const app = createApp(App);

// Create a new Query Client
const queryClient = new QueryClient();

// Use VueQueryPlugin with the created Query Client
app.use(VueQueryPlugin, { queryClient });

app.mount("#app");

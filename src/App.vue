<template>
  <div id="app">
    <h1>Vue + Node.js + Render Demo</h1>
    
    <div class="add-item">
      <h2>Add New Item</h2>
      <input v-model="newItem.name" placeholder="Item name">
      <input v-model="newItem.description" placeholder="Item description">
      <button @click="addItem">Add Item</button>
    </div>
    
    <div class="items-list">
      <h2>Items from Database</h2>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <div v-for="item in items" :key="item.id" class="item">
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      items: [],
      loading: true,
      newItem: {
        name: '',
        description: ''
      }
    };
  },
  async created() {
    // 在 created() 或 methods 中添加基础 URL
    const api = axios.create({
      baseURL: 'https://vue-node-demo-backend.onrender.com' // 替换为您的后端服务 URL
    });

    await this.fetchItems();
  },
  methods: {
    async fetchItems() {
      try {
        const response = await api.get('/api/items');
        this.items = response.data;
        this.loading = false;
      } catch (error) {
        console.error('Error fetching items:', error);
        this.loading = false;
      }
    },
    async addItem() {
      if (!this.newItem.name) return;
      
      try {
        await api.post('/api/items', this.newItem);
        this.newItem = { name: '', description: '' };
        await this.fetchItems();
      } catch (error) {
        console.error('Error adding item:', error);
      }
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.add-item {
  margin-bottom: 30px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 5px;
}

.add-item input {
  display: block;
  margin-bottom: 10px;
  padding: 8px;
  width: 100%;
  max-width: 400px;
}

button {
  padding: 8px 16px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #369f6e;
}

.items-list {
  margin-top: 20px;
}

.item {
  padding: 15px;
  margin-bottom: 10px;
  background: #f9f9f9;
  border-radius: 5px;
}
</style>
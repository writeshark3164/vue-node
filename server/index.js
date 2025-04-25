const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// 数据库配置 - 我们将在Render上创建后更新这些
// 使用环境变量配置数据库
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// 创建表（如果不存在）
async function createTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT
      );
    `);
    console.log('Table created or already exists');
  } catch (err) {
    console.error('Error creating table', err);
  }
}

createTable();

// 添加一些示例数据
async function seedData() {
  try {
    const res = await pool.query('SELECT COUNT(*) FROM items');
    if (parseInt(res.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO items (name, description) VALUES 
        ('Item 1', 'This is the first item'),
        ('Item 2', 'This is the second item'),
        ('Item 3', 'This is the third item');
      `);
      console.log('Sample data inserted');
    }
  } catch (err) {
    console.error('Error seeding data', err);
  }
}

seedData();

// 获取所有项目
app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// 添加新项目
app.post('/api/items', async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
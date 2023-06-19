const express = require('express')
const path = require('path')
const cool = require('cool-ascii-faces')
const cors = require('cors');

const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

const PORT = process.env.PORT || 5001

const corsOptions = {
  origin: '*', // 设置允许的源
  methods: 'GET,POST,PUT,DELETE', // 设置允许的请求方法
  allowedHeaders: '*', // 设置允许的请求头
};

express()
  .use(cors(corsOptions))
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null };
      res.render('pages/db', results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get('/cool', (req, res) => res.send(cool()))
  .get('/times', (req, res) => res.send(showTimes()))
  .get('/jsontest', (req, res) => res.send({
    code: 200,
    "codes": {
      "oms/b2c/order/write": true,
      "oms/b2c/order/read": true,
      "oms/b2c/order/hold": true,
      "oms/b2c/order/import": true,
      "oms/b2b": true,
      "ass/ticket/write": true,
      "ass/ticket/delete": true,
      "ass/ticket/read": true,
      "pis/product/read": true,
      "pis/product/write": false,
      "fms": true,
      "wf": true,
      "pms": true,
      "ims": true,
    }
  }))
  .get('/new', (req, res) => {
    res.send('123123')
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`))


function showTimes() {
  const times = process.env.TIMES || 5
  let result = ''
  for (i = 0; i < times; i++) {
    result += i + ' '
  }
  return result
}
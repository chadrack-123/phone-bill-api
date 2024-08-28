import express from 'express';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const cors = require("cors");



const app = express();
const PORT = process.env.PORT || 4011;

app.use(cors()); // Enable CORS for all origins

app.use(express.json()); // Parse JSON bodies

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const db = await sqlite.open({
    filename: './price_plans/data_plan.db',
    driver: sqlite3.Database
});

// Point to the correct migrations directory
await db.migrate({ migrationsPath: join(__dirname, 'price_plans/migrations') });


app.use(express.static('public'));
app.use(express.json());



app.get('/api/price_plans', async (req, res) => {
    const pricePlans = await db.all('SELECT * FROM price_plan');
    res.json(pricePlans);
});


app.post('/api/price_plan/create', async (req, res) => {
    const { name, call_cost, sms_cost } = req.body;
    await db.run('INSERT INTO price_plan (plan_name, sms_price, call_price) VALUES (?, ?, ?)', [name, sms_cost, call_cost]);
    res.status(201).send('Price plan created');
});


app.post('/api/price_plan/update', async (req, res) => {
    const { name, call_cost, sms_cost } = req.body;
    await db.run('UPDATE price_plan SET sms_price = ?, call_price = ? WHERE plan_name = ?', [sms_cost, call_cost, name]);
    res.send('Price plan updated');
});


app.post('/api/price_plan/delete', async (req, res) => {
    const { id } = req.body;
    await db.run('DELETE FROM price_plan WHERE id = ?', [id]);
    res.send('Price plan deleted');
});


app.post('/api/phonebill', async (req, res) => {
    const { price_plan, actions } = req.body;
    const plan = await db.get('SELECT * FROM price_plan WHERE plan_name = ?', [price_plan]);

    if (!plan) {
        return res.status(404).send('Price plan not found');
    }

    let total = 0;
    for (const action of actions.split(', ')) {
        if (action === 'sms') {
            total += plan.sms_price;
        } else if (action === 'call') {
            total += plan.call_price;
        }
    }

    res.json({ total: total.toFixed(2) });
});

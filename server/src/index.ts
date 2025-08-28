import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import knex, { Knex } from 'knex'
import nodemailer from 'nodemailer'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

app.use(cors({ origin: clientOrigin }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

let db: Knex
let dbReady = false

async function initDb() {
  const client = (process.env.DB_CLIENT || 'mysql2') as 'mysql2' | 'mssql'
  if (client !== 'mysql2' && client !== 'mssql') {
    throw new Error('DB_CLIENT must be mysql2 or mssql')
  }

  const connection: Knex.MySql2ConnectionConfig | Knex.MsSqlConnectionConfig = client === 'mysql2'
    ? {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'portfolio',
      }
    : {
        server: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 1433),
        user: process.env.DB_USER || 'sa',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'portfolio',
        options: { encrypt: false, trustServerCertificate: true },
      }

  try {
    db = knex({ client, connection })
    const hasTable = await db.schema.hasTable('contact_messages')
    if (!hasTable) {
      await db.schema.createTable('contact_messages', (table) => {
        table.increments('id').primary()
        table.string('name').notNullable()
        table.string('email').notNullable()
        table.text('message').notNullable()
        table.timestamp('created_at', { useTz: false }).notNullable()
      })
    }
    dbReady = true
    console.log(`[db] Connected using ${client}`)
  } catch (e) {
    dbReady = false
    console.warn('[db] Failed to connect. API will run without DB. Set env to enable DB.')
  }
}

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body as { name?: string; email?: string; message?: string }
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' })

  const createdAt = new Date().toISOString()
  try {
    if (dbReady) {
      await db('contact_messages').insert({ name, email, message, created_at: createdAt })
    }

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.MAIL_TO) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Boolean(process.env.SMTP_SECURE === 'true'),
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      })

      await transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to: process.env.MAIL_TO,
        subject: `New contact from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      })
    }

    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to save message' })
  }
})

initDb().then(() => {
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
  })
})



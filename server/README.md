# Server environment

Create a `.env` file in `server/` with:

```
PORT=5000
CLIENT_ORIGIN=http://localhost:5173

# DB config
DB_CLIENT=mysql2 # or mssql
DB_HOST=localhost
DB_PORT=3306      # 1433 for mssql
DB_USER=root      # or sa for mssql
DB_PASSWORD=
DB_NAME=portfolio

# SMTP (optional)
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
MAIL_TO=
```

- For MySQL, ensure the database exists (e.g., create database `portfolio`).
- For SQL Server, ensure login/user has rights to the `DB_NAME` database.
- If SMTP is not configured, messages are saved to the DB without email notifications.

require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://dunder-mifflin@localhost/just-a-calendar',
  CLIENT_ORIGIN: '*',
  JWT_SECRET: process.env.JWT_SECRET
}
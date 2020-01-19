module.exports = {
  development: { 
    user: process.env.DEV_USER,
    host: process.env.DEV_HOST,
    password: process.env.DEV_PASSWORD, 
    database: process.env.DEV_DATABASE
  },
  production: {
    host: '',
    user: '',
    password: ''
  }
}

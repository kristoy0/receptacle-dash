const express = require('express')
const app = express()

app.use(express.static('dist'))
app.listen(8080, () => console.log('Application started on port: ' + 8080))
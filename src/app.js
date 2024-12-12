const express = require("express");
const dotenv = require("dotenv");
const { ConnectToMongo } = require("./config/db");
const officeRouter = require("./routes/office-route");
const doctypeRouter = require("./routes/doctype-route");
const docRouter = require("./routes/doc-route");
const movementRouter = require("./routes/movement-route");
const docLogRouter = require("./routes/doclog-route");
const cors = require("cors")

dotenv.config();


const PORT = process.env.PORT || 8000
const app = express()

app.use(cors({ origin: ['http://localhost:80', 'https://localhost:443'] }))

ConnectToMongo()
app.use(express.json())

// Office route
app.use('/', officeRouter);

// Doctype related endpoints
app.use('/', doctypeRouter);

// Document related endpoints
app.use('/', docRouter);

// Movement related endpoints
app.use('/', movementRouter);

app.use('/', docLogRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});



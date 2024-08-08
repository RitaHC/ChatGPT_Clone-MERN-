// import express from "express";
const express = require("express");
const morgan = require('morgan');
const cors = require('cors')
const bodyParser = require('body-parser')
const colors = require('colors')
const dotenv = require('dotenv');
const connectDB = require("./config/db");

// routes path
const authRoutes = require('./routes/authRoutes')

// dotenv
dotenv.config()

// mongo connection
connectDB()


// res object
const app = express()

// Middleware
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(morgan('dev'))
app.use(express.json())

const PORT = process.env.PORT || 8080

// API Routes
app.use("/api/v1/auth", authRoutes)

// listen to the server
app.listen(PORT, ()=>{
    console.log(`Server Running in ${process.env.DEV_MODE} on${PORT}`.bgCyan.white)
})
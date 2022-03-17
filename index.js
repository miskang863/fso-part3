require("dotenv").config()
const express = require("express")
const res = require("express/lib/response")
const cors = require("cors")
const app = express()
var morgan = require("morgan")
const Person = require("./models/person")
const mongoose = require("mongoose")

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method)
  console.log("Path:  ", request.path)
  console.log("Body:  ", request.body)
  console.log("---")
  next()
}

app.use(cors())
app.use(express.static("build"))
app.use(express.json())
app.use(requestLogger)
morgan.token("body", (req, res) => JSON.stringify(req.body))
app.use(morgan(":method :url :status :response-time ms - :body"))

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => {
    res.json(person)
  })
})

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

app.post("/api/persons", (req, res, next) => {
  const body = req.body
  let id = 1

  Person.find({}).then((result) => {
    id = result.length

    if (result.find((p) => p.name === body.name)) {
      return res.status(400).json({
        error: "name must be unique",
      })
    }
  })

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((result) => {
      res.json(result)
      console.log("result", result)
      console.log(`added ${body.name} number ${body.number} to phonebook`)
    })
    .catch((error) => next(error))
})

app.get("/info", (req, res) => {
  Person.find({}).then((result) => {
    res.send(`<p>Phonebook has info for ${result.length} people </br>
    ${new Date()}</p>`)
  })
})

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  console.log('res sent')
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

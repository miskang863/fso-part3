const express = require('express')
const res = require('express/lib/response')
const cors = require('cors')
const app = express()
var morgan = require('morgan')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms - :body'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-1234123"
    },
    {
        id: 2,
        name: "Keijo Kiiski",
        number: "040-12341123"
    },
    {
        id: 3,
        name: "Minna Muikea",
        number: "040-123412311"
    },
    {
        id: 4,
        name: "Pekka Puupaa",
        number: "040-1234123"
    },
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }

    if (persons.find(p => p.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 99999999),
    }

    persons = persons.concat(person)

    res.json(person)
})




app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people </br>
    ${new Date()}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
const express = require('express');
const app = express();
const port = 3001;

const morgan = require('morgan');
const cors = require('cors');

app.use(cors());
app.use(morgan('tiny'));

morgan.token('req-body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
});

const morganFormat = ':method :url :status :res[content-length] - :response-time ms :req-body';

app.use(morgan(morganFormat));

app.use(express.json());

let persons = [
   { 
    "name": "Arto Hellas", 
    "number": "040-123456",
    "id": 1
   },

    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": 2
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": 3
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": 4
    }
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.use(express.static('build'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/info', (req, res) => {
  const currentTime = new Date();
  const numPersons = persons.length;

  res.send(`<p>Phonebook has info for ${numPersons} people</p>
            <p>${currentTime}</p>`);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' });
  }

  const nameExists = persons.find(p => p.name === body.name);
  if (nameExists) {
    return res.status(400).json({ error: 'name must be unique' });
  }

  const person = {
    id: Math.floor(Math.random() * 100000),
    name: body.name,
    number: body.number
  };

  persons = persons.concat(person);

  res.json(person);
});




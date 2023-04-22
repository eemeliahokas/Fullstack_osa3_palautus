const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]


const url = 'mongodb+srv://eemeliahokas:${password}@cluster0.vmfniuu.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Error connecting to MongoDB:', error.message))

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  console.log('Phonebook:')
  Person.find({})
    .then((persons) => {
      persons.forEach((person) => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
    .catch((error) => console.log('Error:', error.message))
} else if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save()
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
}




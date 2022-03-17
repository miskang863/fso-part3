const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

let id = 1;

const url = `mongodb+srv://miska:${password}@cluster0.p4bvv.mongodb.net/luetteloApp?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

Person.find({}).then((result) => {
  id = result.length;

  if(!name){
      console.log('phonebook:')
  result.forEach((person) => {
    console.log(`${person.name} ${person.number}`);
  });
}
 mongoose.connection.close();
});

const person = new Person({
  id: id,
  name: name,
  number: number,
});

if(name && number){
  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
  
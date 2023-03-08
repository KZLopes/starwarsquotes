const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const client = require('mongodb').MongoClient;
const uri = 'mongodb+srv://KZLopes:156987@cluster0.p9xtkfo.mongodb.net/?retryWrites=true&w=majority'

client.connect(uri, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')

    //Middlewares
    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({ extended: true}));
    app.use(bodyParser.json());
    app.use(express.static('public'));

    //Routes
    app.get('/', (req, res) => {
      db.collection('quotes').find().toArray()
        .then(results => {
          res.render('index.ejs', {quotes: results})
        })  
        .catch(error => console.error(error))
      
    });

    app.post('/quotes', (req, res) => {
      quotesCollection.insertOne(req.body)
        .then( () => {
          res.redirect('/')
        })
        .catch(error => console.error(error))
    });

    app.put('/quotes',(req, res) => {
      quotesCollection.findOneAndUpdate(
        {name: 'Yoda'},
        {$set: {
          name: req.body.name,
          quote: req.body.quote
          }
        },
        {upsert: true}
      )
        .then(result => res.json('Success'))
        .catch(error => console.error(error))
    })

    app.delete('/quotes',(req, res) => {
      quotesCollection.deleteOne({name: req.body.name})  
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No quotes to delete')
          }
          res.json(`Deleted Darth Vader's quote`)
        })
        .catch(error => console.error(error))
    })
  })
  .catch(console.error);
app.listen(3000, () => console.log('listening on 3000'));


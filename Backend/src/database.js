const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/seguridadInformaticaSimetrico', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(db => console.log(`Database ⚡`))
    .catch(err => console.log(err));
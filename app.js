const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const routes = require('../Feedback_Folketingets/routes/personRoutes');
const errorHandler = require('../Feedback_Folketingets/middlewares/globalErrorHandler');
const notFound = require('../Feedback_Folketingets/middlewares/notFound');
const app = express();


app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/Folketinget',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }). then(()=> console.log('Connected to database successfully.'))
    .catch(err => console.error("MongoDB connection error: ", err));

app.use('/api/persons', routes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})

module.exports = app;
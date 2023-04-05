import express from 'express';
import { engine } from 'express-handlebars';

const app = express();


app.engine("hbs",
    engine({
        extname: "hbs",
        defaultLayout: false
    })
);

app.set('trust proxy', 1);
app.set("view engine", "hbs");    
app.set('views','./views');
app.disable('x-powered-by');

app.use('/dist', express.static('dist'));
app.use('/', express.static('public'));

app.get('/', function(req, res) {
    res.render('index')
});

app.listen(9018, err => {
    console.log(`[ + ] The server is running.`);
});
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
//conexión a base de datos local


//mongoose.connect('localhost:27017/test');

//conexion a base de datos remota
mongoose.connect('mongodb://test:test01@ds145369.mlab.com:45369/iot');
var Schema = mongoose.Schema;
var Schema1 = mongoose.Schema;

var prestamosSchema = new Schema1({
    //Esto representa la llave foranea que hace referencia a los alumnos
    /****
    alumnosArray: [
            {type: Schema.Types.ObjectId, ref: 'Alumnos', required: false}
        ],
     *****/
    //Llave foranea a profesor
    profesorEncargado: String, //{type: Schema.Types.ObjectId, ref: 'Profesores' , required: false},

    materia: String,
    dentroDelCampus: Boolean,
    nombreProyecto: {type: String, required: false},
    descripcion: String,

    fechaPrestamo: {type: Date, default: Date.now},

    fechaEntrega: {type: Date, required: false},
    /****
    //llave foranea a materiales
    materialArray: [
        {type: Schema.Types.ObjectId, ref: 'Material', required: false}
    ],
     ***/
    // AQUI SE GUARDARA EL DF PARA IMPRESIÓN PERO POR EL MOMENTO ES DE TIPO STRING
    fichaImpresion: String

}, {collection: 'prestamos'});

var Prestamos = mongoose.model('PrestamosSch', prestamosSchema);


// -----PRUEBA-------
var userDataSchema = new Schema({


    title: {type: String, required: true},
    content: String,
    author: String
}, {collection: 'pruebaFer'});

var UserData = mongoose.model('UserData', userDataSchema);

//----PRESTAMOS-----
router.get('/prestamos', function(req, res, next) {


    UserData.find()
        .then(function(doc) {
            res.render('prestamos', {items: doc, title: "Prestamos"} );
        });
});

router.post('/prestamos/insert', function (req, res, next) {
    var item = {
        //------LO QUE SE ENCUENTRA COMENTADO ES PORQUE SE REQUIERE DE LLAVES FORANEAS QUE AÚN
        //------NO SE IMPLEMENTAN

        //alumnosArray: req.body.alumnosArray,
        profesorEncargado: req.body.profesor,
        materia: req.body.materia,
        dentroDelCampus: true, //req.getElementById("fuera").checked,// .body.fuera.checked,
        nombreProyecto: req.body.nombrePro,
        descripcion: req.body.descripcion,
        fechaPrestamo: Date.now(),
        fechaEntrega: req.body.fechaEntrega,
        //materialArray: ,
        fichaImpresion: "prestamo001.pdf"
    };
    var data = new Prestamos(item);
    data.save();

    res.redirect('/prestamos');
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.get('/get-data', function(req, res, next){


    UserData.find()
        .then(function(doc) {
            res.render('index', {item: doc, title: "CRUD"});
        });
});

router.post('/insert', function(req, res, next){
    var item = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };

    var data = new UserData(item);
    //data.author = req.body.author;
    data.save();

    res.redirect('/get-data');
});

router.post('/update', function(req, res, next){
    var id = req.body.id;

    UserData.findById(id, function(err, doc) {
        if (err) {
            console.error('error, no entry found');
        }
        doc.title = req.body.title;
        doc.content = req.body.content;
        doc.author = req.body.author;
        doc.save();
    })
    res.redirect('/');
});

router.post('/delete', function(req, res, next){
    var id = req.body.id;
    UserData.findByIdAndRemove(id).exec();
    res.redirect('/');
});

module.exports = router;

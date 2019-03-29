const Rx 	= require("rxjs")
const express 	= require('express')
const cors 	= require("cors")
const app 	= express()
const http 	= require('http').Server(app)

const mongoose 	= require("mongoose")
const Schema 	= mongoose.Schema

const PORT 		= process.env.PORT || 8080
const HomePage 		= new Rx.Subject()
const IndexPage 	= new Rx.Subject()

const ProductListPage 		= new Rx.Subject()
const ProductCreatePage 	= new Rx.Subject()


// conexion base de datos
mongoose.connect("mongodb://173.17.0.10:27017/portafolio", { useNewUrlParser: true })


// esquemas de base de datos
const ProductSchema = new Schema({
	name: String,
	cost: Number
})


// modelos de base de datos
const ProductModel = mongoose.model('product', ProductSchema)


// listamos los productos de la tabla de mongo
ProductListPage.subscribe( ([req, res]) => {
	ProductModel.find({}, (err, docs) => {
		res.json({data: docs})
	})
})

ProductCreatePage.subscribe( ([req, res]) => {
	const newProduct = new ProductModel({name: "Foo", cost: 2500})
	newProduct.save()
	res.json({message: "saved!"})
})

HomePage.subscribe( ([req, res]) => {
	res.send("Hi I am home!")
})

IndexPage.subscribe( ([req, res]) => {
	res.send("Hi I am home!")
})



// Asociar Rutas a las "funciones"
app.get('/home', 		(req, res) => HomePage.next([req, res]))
app.get('/products', 		(req, res) => ProductListPage.next([req, res]))
app.get('/products/create', 	(req, res) => ProductCreatePage.next([req, res]))
app.get('/', 			(req, res) => IndexPage.next([req, res]))



http.listen(PORT, () => {
	console.log(`Listen in ${PORT}`)
})

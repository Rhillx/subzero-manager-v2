const express = require('express');
const sql = require('mysql')
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

const port = 5000;

const connection = sql.createConnection({
    host: "localhost",
    database: "subzero_db",
    user: "rhillx",
    password: "rhillx305"
})

connection.connect();


app.get('/api/users', (req, res)=>{
    const GET_USERS = "SELECT * FROM users AS Team";

  connection.query(GET_USERS, (err, results)=>{
        const users = results
        if(err) throw err;

        res.json(users)
    })

});


//Fetch products api
app.get('/api/product', (req, res)=>{
    const GET_PRODUCTS = "SELECT * FROM product_inventory";

    connection.query(GET_PRODUCTS, (err, data)=>{
        const products = data;
        if(err) throw err;

        res.json(products)
    })
})

//Add new product API

app.post('/api/product/add', (req, res)=>{

console.log(req.body)
    const product = {
        flavor: req.body.flavor,
        quanity: req.body.quanity
    }
 
    const ADD_PRODUCT = "INSERT INTO product_inventory SET ?";

    connection.query(ADD_PRODUCT, product, (err, data)=>{
        if(err) throw err;
        console.log(data)
    });

});

//Update product api
app.put('/api/product/update', (req, res)=>{

    const flavor = req.body.flavor;
    const val = req.body.valChanged;

    const UPDATE_PRODUCT1 = "SELECT SUM(quanity + ?) AS newVal FROM product_inventory WHERE flavor = ?";
    const UPDATE_PRODUCT2 = "UPDATE product_inventory SET quanity = ? WHERE flavor = ?";

    connection.query(UPDATE_PRODUCT1, [val, flavor] ,(err, data)=>{
        if (err) throw err;
        const newVal = data[0].newVal
        connection.query(UPDATE_PRODUCT2, [newVal, flavor], (err, data)=>{
            if(err) throw err;
            console.log(data)
        })
    })
})

//Delete product api
app.delete('/api/product/delete', (req, res)=>{
    console.log(req.body)
    const fv = req.body.fv;
    const DELETE_PRODUCT = "DELETE FROM product_inventory WHERE flavor = ?";

    connection.query(DELETE_PRODUCT, [fv], (err, data)=>{
        if (err) throw err;
        console.log(data)
    })
})


app.listen(port, ()=> console.log(`server started on port ${port}`));
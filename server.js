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


//FETCH PRODUCTS API
app.get('/api/product', (req, res)=>{
    const GET_PRODUCTS = "SELECT * FROM product_inventory";

    connection.query(GET_PRODUCTS, (err, data)=>{
        const products = data;
        if(err) throw err;

        res.json(products)
    })
})
////////////////////

//POST PRODUCT API
    app.post('/api/product/add', (req, res)=>{
        
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
////////////////
//UPDATE PRODUCT BY ADDING INVENTORY API
    app.put('/api/product/update-add', (req, res)=>{

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
/////////////////////////////////////
//UPDATE PRODUCT BY SUBTRACTING INVENTORY
    app.put('/api/product/update-subtract', (req, res)=>{

        const flavor = req.body.flavor;
        const val = req.body.valChanged;

        const UPDATE_PRODUCT1 = "SELECT quanity - ? AS newVal FROM product_inventory WHERE flavor = ?";
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
/////////////////////////////////////////
//DELETE PRODUCT API
    app.delete('/api/product/delete', (req, res)=>{
        console.log(req.body)
        const fv = req.body.fv;
        const DELETE_PRODUCT = "DELETE FROM product_inventory WHERE flavor = ?";

        connection.query(DELETE_PRODUCT, [fv], (err, data)=>{
            if (err) throw err;
            console.log(data)
        })
    })
/////////////////

//FETCH MATERIAL INVENTORY API
    app.get('/api/materials', (req, res) => {

        const GET_MATERIAL = "SELECT * FROM material_inventory";

        connection.query(GET_MATERIAL, (err, data)=>{
            const materials = data;
            if(err) throw err;

            res.json(materials)
        })
    })
////////////////////////////

//POST MATERIAL INVENTORY API
    app.post('/api/material/add', (req, res)=>{
        const stock = {
            item: req.body.item,
            quanity: req.body.quanity
        };

        const NEW_STOCK = "INSERT INTO material_inventory SET ?";

        connection.query(NEW_STOCK, stock, (err, data)=>{
            if (err) throw err;

            console.log(data)
        }) 
    })
////////////////////////////









//GET TRANSACTIONS
app.get('/api/transactions', (req, res)=>{

    const GET_TRANS  = 'SELECT * FROM transactions';

    connection.query(GET_TRANS, (err, data)=>{
        if(err) throw err;
        res.json(data);
    })
})

//POST TRANSACTION && UPDATE PRODUCT INVENTORY
app.post('/api/post/transactions', (req, res)=>{
    const quanity = req.body.quanity;
    const flavor = req.body.flavor;
    const trans = {
        customer_name: req.body.customer,
        flavor_purchased: req.body.flavor,
        quanity_purchased: req.body.quanity,
        amount_paid: req.body.amount,
    };
    const NEW_TRANSACTION = 'INSERT INTO transactions SET ?';
    const UPDATE_PRODUCT = "UPDATE product_inventory SET quanity = ? WHERE flavor = ?";

    connection.query(NEW_TRANSACTION, trans, (err, data)=>{
        if (err) throw err;
        console.log(data)
    })
})


app.listen(port, ()=> console.log(`server started on port ${port}`));
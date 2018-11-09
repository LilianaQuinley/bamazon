var mysql = require ('mysql');
var inquirer = require ('inquirer');

var connection =  mysql.createConnection ({
    host: "localhost", 
    port: 3306,
    user: 'root',
    password: "password",
    database:"bamazon_DB"
});

connection.connect (function (err){
 console.log("connected as id: " + connection.threadId);
    manager();
})

function manager() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "View Products for Sale":
          productsForSale();
          break;
  
        case "View Low Inventory":
          lowInventory();
          break;
  
        case "Add to Inventory":
          addToInventory();
          break;
  
        case "Add New Product":
            addNewProduct();
            break;
        }
      });
  }

function productsForSale() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.log(res);
     // connection.end();
      manager();
    });
  }


function addNewProduct() {
    inquirer
    .prompt([
    {
    name: "product",
    type: "input",
    message: "Enter Product: "
    },
    {
    name: "department",
    type: "input",
    message: "Enter Department: "
    },
    {
    name: "price",
    type: "input",
    message: "Enter Price: "
    },
    {
    name: "quantity",
    type: "input",
    message: "Enter quantity: "
    }
    ])
    .then(function(answer) {
    
    console.log("Inserting a new product...\n");
    var query = connection.query(
        "INSERT INTO products SET ?",
        {
        product: answer.product,
        department: answer.department,
        price: answer.price,
        stock: answer.quantity
        },
        function(err, res) {
            console.log(err)
            console.log(res)
        console.log(res.affectedRows + " product inserted!\n");
        //Call updateProduct AFTER the INSERT completes
        //updateProduct();
        }
        );
    })
      // logs the actual query being run
      console.log(query.sql);
      manager();
}
  












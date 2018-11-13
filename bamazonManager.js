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
      manager();
    });
  }

  function lowInventory() {
    connection.query("SELECT product, stock FROM products WHERE stock <=5", function(err, res) {     
        if (err) throw err;
        console.log(res);
        manager();
      });    
}

function addToInventory() {   
    inquirer.prompt([
        {
        name: "product",
        type: "input",
        message: "Enter Product: "
        },
        {
        name: "quantity",
        type: "input",
        message: "Enter quantity: "
        }
    ])  
    .then(function(answer) {
        console.log(answer);
        connection.query("SELECT product, stock FROM products WHERE product='" + answer.product + "'", function(err, res) {     
            if (err) throw err;       
            console.log(res);
            console.log(' ');
            var addMore = parseInt(res[0].stock) + parseInt(answer.quantity);
            console.log("the new quantity is " + addMore + +" " + "\n");
            
            console.log("Updated a new quantity...\n");    
            connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                    stock: addMore
                    },
                    {
                    product: answer.product,
                    }
                ],
                function(err, res) {
                    console.log(err)
                    console.log(res)
                console.log(res.affectedRows + " product updated!\n");
                manager();
                }
            );
        })   
    })
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
             // connection.end();
            manager();
            }
        );
    })   
}
  












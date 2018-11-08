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
 //createProduct();
 afterConnection();

})

var start = function () { 
    inquirer.prompt (
      [{
        name:"productID",
        type:"input",
        message:"Enter the ID of the product that you would like to buy"
      },
      {
        name:"order",
        type:"input",
        message:"how many units of the product you would like to buy ?"
      }])
      .then (function (answer){
        console.log(answer)
        if(answer.order=="we have it on stock"){
          console.log('we do have it !')
            //fullfil();           
        }else {
          console.log("we do NOT have it")
            //reorder();
        }
    }) 
 }



function createProduct() {
  console.log("Inserting a new product...\n");
  var query = connection.query(
    "INSERT INTO products SET ?",
    {
      product: "bedroom set",
      department: "furniture",
      price: 5500.00,
      stock: 5
    },
    function(err, res) {
      console.log(res.affectedRows + " product inserted!\n");
      //Call updateProduct AFTER the INSERT completes
     //updateProduct();
    }
  );

  // logs the actual query being run
  console.log(query.sql);
}
function updateProduct() {
  
    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          department: "school supplies"
        },
        {
          product: "calculators",
        }
      ],
      function(err, res) {
        console.log(res.affectedRows + " products updated!\n");
        // Call deleteProduct AFTER the UPDATE completes
       // deleteProduct();
      }
    );
  
    // logs the actual query being run
    console.log(query.sql);
  }

  function deleteProduct() {

    connection.query(
      "DELETE FROM products WHERE ?",
      {
        product: "bedroom set"
      },
      function(err, res) {
        console.log(res.affectedRows + " products deleted!\n");
        // Call readProducts AFTER the DELETE completes
        //readProducts();
      }
    );
  }

function afterConnection() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log(res);
    start();
    connection.end();
  });
}

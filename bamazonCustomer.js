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

function afterConnection() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log(res);
    start();
    //connection.end();
  });
}

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
        connection.query("SELECT stock, product FROM products WHERE  item_id=" + answer.productID , function (err,res){
          console.log(answer);
          console.log(res[0]);  
         if (err) throw err;
         if (answer.order <= res[0].stock) {
          console.log("Congratulations your " + answer.order + " " + res[0].product + " are on your way")
          var remaning = res[0].stock - answer.order
          console.log("Our remaining is " + remaning);
          fullfil(answer, remaning);
         } else {
           console.log("Insufficient quantity of " +res[0].product + " in stock");
         }
         connection.end();
        })
      })
  }
     
  function fullfil(answer,remaining) {
    console.log("Going to fulfil with " + answer.productID + " and " + remaining);
    connection.query("UPDATE products SET ? WHERE ?",
        [
            {
            stock: remaining 
            },
            {
            item_id: answer.productID,
            }
        ],
        function(err, res) {
            console.log(err)
            console.log(res)
        console.log(res.affectedRows + " product updated!\n");
        start();
        }
    );  
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



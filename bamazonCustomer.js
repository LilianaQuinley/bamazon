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
      .then (function(answer){
        console.log(answer);
        connection.query("SELECT stock FROM products WHERE item_id=" + answer.productID , function (err, res){
          console.log("Got stock and look below: " + res[0].stock + " and ordered " + answer.order);
          console.log(res)
          if (err) throw err;
          console.log("we have " + res);
          //fullfil();`
        }
      )}
    )
  }
  
    
function fullfil(){
   //if (quantity_ID is under the quantity of the ID dispach the order)
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



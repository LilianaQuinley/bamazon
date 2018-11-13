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
 afterConnection();

})

function afterConnection() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log(res);
    console.log(" ");
    start();

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
        
        message:"how many units  you would like to buy ?"
      }])
      .then (function (answer){
        connection.query("SELECT stock, product, price FROM products WHERE  item_id=" + answer.productID , function (err,res){
          
            console.log(" ");
            console.log(answer);
            console.log(res[0]);  
            console.log(" ");
         if (err) throw err;
         if (answer.order <= res[0].stock) {
           var total = answer.order * res[0].price;
            console.log("Congratulations your " + answer.order + " " + res[0].product + " are on your way")
            console.log("Please pay $" + total +" " +"US dollars")
            console.log(" ");
          var remaning = res[0].stock - answer.order
            console.log("Our remaining is " + remaning);
            console.log(" ");
          fullfil(answer, remaning);
         } else {
            console.log("Insufficient quantity of " +res[0].product + " in stock");
            
         } 
         connection.end();
        })
      })
  }
     
  function fullfil(answer,remaining) {
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
            console.log(err);
            console.log(res);
            console.log(" ");
        console.log(res.affectedRows + " product updated!\n");  
       // afterConnection(); 
        //connection.end();
        }
    );  
}





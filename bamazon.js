var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon"
});

purchases();

function purchases() {
    connection.connect(function(err) {
        if (err) throw err;
              connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, result) {
                if (err) throw err;
                console.log("Bamazon is open for business!");
                console.log("Currently in stock:  ");
                for (var i = 0; i < result.length; i++) {
                  console.log("ID: " + result[i].item_id + " || Product: " + result[i].product_name + " || Price: $" + result[i].price + " || Quantity: " + result[i].stock_quantity);
                }
          
              }); 
         //  purchases();   
      });
      
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "Would you like to purchase something?",
        choices: [
          "Yes",
          "Exit"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "Yes":
          selectItem();
          break;
  
        case "Exit":
          connection.end();
          break;
        }
      });
  }
  

function selectItem() {
  inquirer
    .prompt({
      name: "itemID",
      type: "input",
      message: "Enter the ID number of the item you would like to purchase."
    })
    .then(function(answer) {
        var ID = answer;
        inquirer
        .prompt({
            name: "quantity",
            type: "input",
            message: "Enter the quantity you would like to purchase."
          })
          .then(function(answer){
            var quantity = answer;
           // var query = 12;
            console.log("You have purchased " + JSON.stringify(quantity) + " unit(s) of " + JSON.stringify(ID));
            var sql = "UPDATE products SET stock_quantity = stock_quantity - " + quantity.propertyName +  "WHERE item_ID = " + ID.propertyName;
          
                console.log("Updating database.....")
              
            connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log(result.affectedRows + " record(s) updated");
                purchases();
              });
            });
            
          });

        
       
      }

    
 



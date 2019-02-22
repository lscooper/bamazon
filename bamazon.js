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
  connection.connect(function (err) {
    if (err) throw err;
    connection.query("SELECT `item_id`, `product_name`, `price`, `stock_quantity` FROM `products`", function (err, result) {
      if (err) throw err;
      console.log("\n Bamazon is open for business!");
      console.log("\n Currently in stock:  ");
      for (var i = 0; i < result.length; i++) {
        console.log("ID: " + result[i].item_id + " || Product: " + result[i].product_name + " || Price: $" + result[i].price + " || Quantity: " + result[i].stock_quantity);
      }

    });
    // purchases();   
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
    .then(function (answer) {
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
    .then(function (itemAnswer) {
      inquirer
        .prompt({
          name: "quantity",
          type: "input",
          message: "Enter the quantity you would like to purchase."
        })
        .then(function (quantityAnswer) {

          connection.query("SELECT product_name, stock_quantity FROM products WHERE item_ID = " + itemAnswer.itemID, function (err, result) {
            if (err) throw err;
            console.log(result);
           // var idName = JSON.stringify(itemAnswer.itemID);
            for (var i = 0; i < result.length; i++) {
              // console.log("ID: " + result[i].item_id + " || Product: " + result[i].product_name + " || Price: $" + result[i].price + " || Quantity: " + result[i].stock_quantity);
              var name = result[i].product_name;
              var quantity = result[i].stock_quantity;
              console.log("Item is:" + name + " Quantity is: " + quantity);
            }
          
            if (quantity <= quantityAnswer.quantity) {
              console.log("We do not have that many items in stock. Please try again.");
              purchases();
              return;
            }   

              console.log("You have purchased " + JSON.stringify(quantityAnswer.quantity) + " unit(s) of " + itemAnswer.itemID);
              var sql = "UPDATE `products` SET `stock_quantity` = `stock_quantity` - " + JSON.stringify(quantityAnswer.quantity) + "WHERE `item_ID` = " + itemAnswer.itemID;
              // console.log(sql);
              console.log("Updating database.....")
              purchases();
            connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log(result.affectedRows + " record(s) updated");
                
              });
                        
            });
            
         

        });

    });



}
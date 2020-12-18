const express = require("express");
 
const app = express();
 
app.set("view engine", "hbs");
 
app.use("/contact", function(request, response){
     
    response.render("contact.hbs", {
      title: "Мои контакты",
      email: "savant.87@mail.ru",
      phone: "+996557950950"
  });
});
app.use("/", function(request, response){
     
    response.send("Главная страница");
});
app.listen(3000);
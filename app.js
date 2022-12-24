const express = require("express");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//POST request
app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  //Converte em string
  const jsonData = JSON.stringify(data);

  //URL endpoint para POST
  const url = "https://us18.api.mailchimp.com/3.0/lists/10f2b2fe6a";

  //javascript object POST
  const options = {
    method: "POST",
    auth: "unityashh:661687b87e8d3c0799b292ae9f2c7b52-us18"
  };

const request = https.request(url, options, function (response) {
 console.log(response.statusCode);
 response.on("data", function (data) {
   const receivedData = JSON.parse(data);
   if (receivedData.error_count === 0) {
     res.sendFile(__dirname + "/success.html");
   } else {
     res.sendFile(__dirname + "/failure.html");
   }
   console.log(receivedData.error_count);
 });
  });

  //Add string data
  request.write(jsonData);
  request.end();

});

//Returns login
app.post("/failure", function (req, res) {
  res.redirect("/");
})

//Returns login
app.post("/success", function (req, res) {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});

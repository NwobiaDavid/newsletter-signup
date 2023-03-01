const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.post('/', (req, res) => {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let Email = req.body.email;
  console.log(firstName, lastName, Email);

  let data = {
    members: [
      {
        email_address: Email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  let jsonData = JSON.stringify(data);

  const url = 'https://us21.api.mailchimp.com/3.0/lists/3c4b05276d';

  const options = {
    method: 'POST',
    auth: 'dave:1e46acdffe0aaa9552835ae9586dda82-us21',
  };


  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname+"/success.html");
    } else {
      res.sendFile(__dirname+"/failure.html");
    }

    res.on('data', (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure",(req,res)=>{
    res.redirect("/");
})





app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

app.listen(port, () => {
  console.log(`listening on port:${port}...`);
});

// api key
// 1e46acdffe0aaa9552835ae9586dda82-us21

// list id
// 3c4b05276d

// Export the Express API
module.exports = app;

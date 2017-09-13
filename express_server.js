var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs")

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
   let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//This displays the template urls_index which shows the objects in the database aswell as
// delete and update functions and a link to shorten a new long url. to do this
// it passes the whole data base into the template named as urls

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// this renders the urls_new template which allows the user to ONLY enter a long url and
// shorten it. the shortening comes below. when the long url is submitted. it is marked as
// method post with the /urls path which activates the below router

app.post("/urls", (req, res) => {
  let result = generateRandomString(6, possibleValues)
  urlDatabase[result] = req.body.longURL
  res.redirect("http://localhost:8080/urls/");
});

// this router generates a new random string to represent the shortened url and adds
// both the short url (key) and long url (value) in the database

app.post("/urls/:shortUrl/delete", (req, res) => {
  delete urlDatabase[req.params.shortUrl]
  res.redirect("http://localhost:8080/urls/")
});

// notice that shortUrl here is a variable and takes in anything. if the variable matches
// the key in the database the code will work on that key else it will not work
//this does not require a form, it only is a router which activates when the delete button
// button is clicked. the delete button is linked to the pat specified and the deleting
// occurs and immediately the user is redirected to urls which renders urls_index

app.get("/urls/:shortUrl", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    longUrl: urlDatabase[req.params.shortUrl],
    shortUrl: req.params.shortUrl
  }
  res.render("urls_show", templateVars  );
});

// this router recieves a short url (denoted by the semicolon), stores the database,
// longUrl and the short url into the templatevars and passes it to urls_show.
//** remember that url info is in the params and everything submitted in the form is body
// urls_show lets the user enter a new url which is stored as updatedLongURL

app.post("/urls/:shortUrl/updated", (req, res) => {
  urlDatabase[req.params.shortUrl] = req.body.UpdatedLongURL;
  res.redirect("http://localhost:8080/urls/")
});

//the urls_show template indicates method post and path /urls/:shortUrl/updated which
// activates this router which updates the key with the entered link
// the user is redirected to urls becasue /urls/:shortUrl/updated has not template rendered

// app.get("/urls/:shortUrl", (req, res) => {
//   let longURL = urlDatabase[req.params.shortUrl]
//   res.redirect(longURL);
// });



const possibleValues = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

function generateRandomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i){
      result += chars[Math.floor(Math.random() * chars.length)];}
    return result;
}


app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});


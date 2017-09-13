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
  res.end("Hello!");
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

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  let result = generateRandomString(6, possibleValues)
  urlDatabase[result] = req.body.longURL
  res.redirect("http://localhost:8080/urls/"+ result);
});

app.get("/urls/:shortUrl", (req, res) => {
  let longURL = urlDatabase[req.params.shorUrl]
  res.redirect(longURL);
  console.log(url)
});

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


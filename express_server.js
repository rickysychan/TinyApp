var PORT = process.env.PORT || 8080; // default port 8080

var express = require("express");
var bcrypt = require('bcrypt');
var app = express();
var cookieSession = require('cookie-session')

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ["pepsicola"],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.set("view engine", "ejs")

let userURLs = ''

var urlDatabase = {
  "b2xVn2": {userId: "userRandomID", url: "http://www.lighthouselabs.ca"},
  "9sm5xK": {userId: "userRandomID", url: "http://www.google.com"}
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

app.get("/", (req, res) => {
res.end("<html><body>Hello <b>World</b></body></html>\n")
})

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

//==========================================================================================

app.get("/urls", (req, res) => {
  var myUrls = {};
    for(var i in urlDatabase){
    if(urlDatabase[i].userId === req.session.user_id)
      {
        myUrls[i] = urlDatabase[i];
  }
}
// this checks to see if the database has the same id properties for the urls liste
// as the one in the cookies, if it does, add the urls to the page and display it
//

 const userId = req.session.user_id;
  let templateVars = {
    urls: myUrls,
    user: users[userId]
  };
  res.render("urls_index", templateVars);
});

//This displays the template urls_index which shows the objects in the database aswell as
// delete and update functions and a link to shorten a new long url. to do this
// it passes the whole data base into the template named as urls

app.get("/urls/new", (req, res) => {
const userId = req.session.user_id;
if(users[req.session.user_id] == undefined){
  console.log(users[req.session.user_id] === undefined)
  console.log("cookie user id: ", req.session.user_id)
  console.log("users ", users);
  res.redirect("/login")
  return;
} else {
    let templateVars = {
      user: users[userId]
      };
    res.render("urls_new", templateVars);
    return;
  }
});

// this renders the urls_new template which allows the user to ONLY enter a long url and
// shorten it. the shortening comes below. when the long url is submitted. it is marked as
// method post with the /urls path which activates the below router

app.post("/urls", (req, res) => {
  console.log("post /urls")
  let result = generateRandomString(6, possibleValues)
  urlDatabase[result] = { userId: req.session.user_id, url: req.body.longURL };
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
const userId = req.session.user_id;

if(users[req.session.user_id] == undefined){
  res.status(403).send('You do not own this short url so you cannot update it')
}

  let templateVars = {
    objectOwner: urlDatabase[req.params.shortUrl].userId,
    cookieId: users[userId].id,
    user: users[userId],
    urls: urlDatabase,
    longUrl: urlDatabase[req.params.shortUrl].url,
    shortUrl: req.params.shortUrl
  }
  res.render("urls_show", templateVars);
});

app.get("/u/:shortUrl", (req, res) => {
res.redirect(urlDatabase[req.params.shortUrl].url)
})
// this router recieves a short url (denoted by the semicolon), stores the database,
// longUrl and the short url into the templatevars and passes it to urls_show.
//** remember that url info is in the params and everything submitted in the form is body
// urls_show lets the user enter a new url which is stored as updatedLongURL

app.post("/urls/:shortUrl/updated", (req, res) => {
  urlDatabase[req.params.shortUrl].url = req.body.UpdatedLongURL;
  res.redirect("http://localhost:8080/urls/")
});

//the urls_show template indicates method post and path /urls/:shortUrl/updated which
// activates this router which updates the key with the entered link
// the user is redirected to urls becasue /urls/:shortUrl/updated has not template rendered

app.get("/register", (req, res) => {
  const userId = req.session.user_id;
  let templateVars = {
    user: users[userId]
   };
  res.render("urls_email_form", templateVars);
});

// renders the email form page with forms for email and password

app.post("/register", (req, res) => {

for(var i in users){
  if(req.body.email.toLowerCase() == users[i].email.toLowerCase())
  {
    res.status(400).send("e-mail is already existing in user's database.");
    res.redirect("/register");
    return;
    }
  }

// this checks to see if the email entered into the form already exist in users or not
// if it does exist, it sends a status400 code

if (req.body.email === '' || req.body.password === '')
    {
    res.status(400).send("No email or password has been entered.");
    return;
    }

      let result = generateRandomString(4, possibleValues);
      let password = req.body.password;
      let hashedPassword = bcrypt.hashSync(password, 10);
      users[result] = {id: result, email: req.body.email, password: hashedPassword}
      req.session.user_id = result;
      console.log(users);
      res.redirect("/urls");
      return;

});

// this first part checks to see if the user enters nothing and if they do it sends a
// status code400, if the global object users is empty than it will add the object to users
// and sets the cookie to the random user generated id which is called by other get routers
// to be interepreted as an object by referencing it as const userId = req.session["user_id"];
// which is interpolated in user: users[userId] to represent the user object. but the header
// only displays the random id



app.post("/login", (req, res) => {
  var check = false;
  for(var i in users) {
    if(req.body.email === users[i].email) {
      check = true;
    }

    if(check) {
      bcrypt.compare(req.body.password, users[i].password, (err, matched) => {
        if (matched) {
          res.cookie('user_id', users[i].id)
          res.redirect('/urls')
        } else {
          res.status(403).send('password or email does not match please try again.');
        }
      });
    }
  }

  if(check === false) {
    res.status(403).send('password or email does not match please try again.')
  }

});


//this checks to see if the email and password entered into the login page exists in the
//users object, if it does it sets the cookie to the id of the user object, if not look below


//if email and password not found, statuscode 403 if pass redirects to /

app.post("/logout", (req, res) => {
  delete req.session.user_id;
  res.redirect("http://localhost:8080/urls/");
});

//this clears the cookie when you click logout and redircts to urls

app.get("/login", (req, res) => {
  const userId = req.session.user_id;
  let templateVars = {
    user: users[userId]
   };
  res.render("login_page", templateVars);
});

//

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

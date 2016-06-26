How to use our system
The login and register button are in the top left corner of the site. 
In order to sign in with google, you must register first.

In the register page, you can generate your data from google, but you must also fill out other fields.

Then you can use your email as your username.

After you are logged in, you can add things into your cart. And by clicking cart in the right top corner you can view things in your cart.

What the REST interface is
We have used client-server architecture for our RESTful web service. We are making ajax calls using GET and POST methods. 
Our application uses the ajax calls to generate http requests to send data to the server, such as sending login data to the server in order to verify login details. 
This will ensure our application stays stateless. 

What error handling has been implemented in our system

For every API function, we send back a status and a message. 
If the function was successful, we will send back a status 200, and a message that it was ok.
If there was an error, the status and message would be different according to what error has occurred.

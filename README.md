# Node Express and Passport test bed
## Local Authentication

I have used this to test various configurations for using the Passport module for local authentication of Usernane and Password.

I am not a Node expert, hence why I created this test bed to try to understand how it works better, hopefully it will be of use to others.

I generally run a browser and a shell session side by side so that I can see the output from node at the same time as I use the app.

I have put loads of *console.log* lines in, its ip to you to add or remove these and implement a properlogging module is you want.

It Allows for:

- Testing HTTP and HTTPS (see below about certificates)
- Login of existing users
- Logout
- Registration of new users
  - currently set to not automatically log new users in 

### Running

To install and run, download this to a folder of your choice then run:

``` bash
npm install
cd certs
./createkeys.sh
cd ..
npm start
```

### Certificates

You need to add some keys into the certs folder, it currently expects the files *cert.pem* and *keys.pem*.
There is a *createkeys.sh* script to generate self signed certificates.

### Database

In this example I store *uid*, *username* and *passord* in a Javascript object that allows me to look up by *name* and also by *uid*.

The data is not persisted so is lost as soon as you stop the app, and is recreated from scratch when you run the app again.

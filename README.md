Dev-Fortress Server
=======
Server for Dev-Fortress Security Game

Overview
----
This is the server-side component of the Dev-Fortress Security Game originally created by [Andy Meneely](https://github.com/andymeneely).

The project is designed to be consumed by [dev-fortress-client](https://github.com/andymeneely/dev-fortress-client).

Getting Started
----

### Dependencies
- NodeJS v6.0+
- Node Package Manager v4.2.0+
- OpenSSL

The project expects there to be a `privkey.pem` and `pubkey.pem` in the `resources/` directory. These files make up the public/private keypair used to sign and validate the JSON Web Tokens used in authenticating requests. You can easily generate these files by running an included script `node ./scripts/generate_jwt_keys.js`. (all this script does is make system calls to [openssl](https://github.com/openssl/openssl), so you'll need that installed.)

### Running the server
1. `npm install` to install project dependencies.
2. `npm run migrate` to initialize the database for the project.
3. `npm run seed` to seed the database with required data.
4. `npm start` to start the server.

Migrations are written in the `migrations/` directory.

Once this is done you should now have a `databse.sqlite3` file in your project root. This is your project's development database.

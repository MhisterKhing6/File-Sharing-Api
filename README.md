


# File Storage and Sharing


## Description 
<hr />

A simple file storage api that generate url for files and hence gives online access to files and enable file sharing. It also provide download url that makes file sharing easy. The project can handles all file uploads including images, videos, pds, document and generate sharable and downloadable url.
The project was buile using node eviroment and hance makes it easy for deployment.
This apps makes it easy for:
  - online access
  - file sharing
  - file storage
  


## Intallation
<hr />



### Dependencies

- Node 
- Mongo db Community Server 
- Redis storage (stable 7.2)
#### Installing Dependencies
<hr>
  <p>Node <br>Downlod node js for your operating system <a href="https://nodejs.org/en/download" target="_blank">Downlod Node</a> </p>
  <p>
  Mongo Db community server
   <br>Downlod mongod db comunity for your os  here<a href="https://www.mongodb.com/try/download/community" target="_blank"> Downlod Mongodb</a>
  </p>
  <p>
    Redis storage stable 7.2
   <br>Downlod redis storage for your os here<a href="https://redis.io/download/" target="_blank"> Download Redis</a>
  </p>
  
  ### Starting Server
  <hr />
<li>Ensure all dependecies are installed and running </li>
<li> After clone or download the repository </li>
<ul>
 <li> cd ml-fellowhsip-2 </li>
 <li> npm install </li>
 <li> npm start </li>
</ul>
 There will be console log specifying the address the server is on



<br />
<br />
<h3> Server Configuration </h3>
<hr />
At the root of the project is config/default.json. This file contains the configuration of the file.<br>
<p><h4><b>test</b> : accept a boolean which put the server in testing mode, if true the mongodb and redis uses the testDatabase provided for file storage </p>
<p><h4><b>mongodbConfig </b>: use to setup options for mongodb connection, such as conneting to instance on a different server,
connecting to instance with a specific password and user name. <em> fields </em>
<ul>
<li> <b>host </b>: contains the address of the server mongodb is installed on defualt is localhost </li>
<li><b>port </b>: the port the instance is working, default is mongodb defualt port </li>
<li> <b>userName </b>: username of the user in the mongodb</li>
<li> <b>password </b>: password of the user in mongodb</li>
<li><b>databaseDeploy </b>: set the database for the deployment default is fileStorage </li>
<li><b>databaseTest </b>: set the database when testing default is testFileStorage </li>
<li><b>userTable</b>: the collection for users registrations and operation</li>
<li><b>fileTalbe </b>: a collection for file operations</li>
</ul>
<h4>NB: no configuration is required if you are using the default port and mongodb is installed locally on the machine the server is running </h4>
</p>


<p><h4><b>redisConfig </b>: use to setup options for redis connection, such as conneting to instance on a different server,
connecting to instance with a specific password and user name. <em> fields </em>
<ul>
<li> <b>host </b>: contains the address of the server redis is installed on defualt is localhost </li>
<li><b>port </b>: the port the instance is working, default is redis defualt port </li>
<li> <b>userName </b>: username of the user in the redis</li>
<li> <b>password </b>: password of the user in redis</li>
<li><b>dbNumber </b>: set the redis database number default is 0</li>
</ul>
<h4>NB: no configuration is required if you are using the default port and redis is installed locally on the machine the server is running </h4>
</p>

<p><h4><b>expressConfig </b>: use to setup options for express api intances. <em> fields </em>
<ul>
<li> <b>host </b>: the host server will be  on , default is "localhost"</li>
<li><b>port </b>: the port the server will be listenig on default "3000"</li>
</ul>
</p>

<p><h4><b>fileConfig </b>: use to setup options for file uploading and disk storage <em> fields </em>
<ul>
<li> <b>encoding </b>: set up the file encoding for the file uploads, supported are base64, base64url, hex,binary, ascii, latin1, ucs-2, ucs2,utf-8, utf-16l, utf-8, utf16le, utf-16le. <br>
default is base64. for binary files encoding we recomend base64 or base64url </li>
<li><b>folder </b>: folder to save file uploads</li>
</ul>
</p>

### Usage Note
<hr />
user must first register and login into the service to get token. the token uniquely identify each user and is use in for server request.
<p><b>Uploading File </b>: To upload a file the must be encoded with the same encoding as the one set in the file config attribute. the encoded data is then pass as a data in the request. example if the server is set to with base64 encoding then all files must be encoded as base64. if the ecoding is hex then the file being uploading must be encoded as hex </p>

### Usage Interfaces
<hr />
<p><b>/register </b> : rester user to the service.
<li><b>method</b>:  post </li> 
<li><b>application type</b> : json </li>
<li><b>required fields </b> : 
<ul>
    <li><i>email</i>: email of the user </li>
    <li><i>password</i>: password of the user</li>
    <li><i>name</i>:  name of the user</li>
 </ul>
</li>
</p>

<p><b>/login </b> : for user login.
<li><b>method</b>:  post </li> 
<li><b>application type</b> : json </li>
<li><b>required fields </b> :
  <ul>
    <li><i>email</i>: email use for registration</li>
    <li><i>password</i>: password use for registration</li>
 </ul>
 </li>
<li><b>response: </b>:
  <ul>
    <li><i>email</i>: user email </li>
    <li><i>name</i>: user name</li>
    <li><i>Id</i>: user id</li>
    <li><i>token</i>: user token</li>
    <li><i>sId </i>: session id </li>
 </ul>
</li>
</p>

<p><b>/currentuser </b> : get currently loged in user details 
<li><b>method</b>:  get </li> 
<li><b>response: </b>: the same response as /login
</li>
</p>

<p><b>/uploadfile </b> : use for file uploading 
<li><b>method</b>:  post </li> 
<li><b>application type</b> : json </li>
<li><b>required fields </b>: 
 <ul>
    <li><i>fileNaame</i>: name of the file </li>
    <li><i>parentFoder</i>: parent folder for the file</li>
    <li><i>data</i>: the encoded data of the file, the type of encoding should be the same as the one set in the file configuration in configs/default.json</li>
    <li><i>token</i>: user token</li>
 </ul>
<p>
<li><b>response: </b>:
  <ul>
    <li><i>url</i>: url of the uploaded file for internet access</li>
    <li><i>token</i>: user that uploaded the file token</li>
    <li><i>fileId</i>: the id of the uploaded file</li>
 </ul>
</li>
</p>


<p><b>/downloadfile/:token/:fileId </b> : download a file with file Id of the user wit token
<li><b>method</b>:  get</li> 
<li><b>url params </b>: 
 <ul>
    <li><i>token</i>: user token </li>
    <li><i>fileId</i>: fileId to download</li>
    </li>
 </ul>
<p>
<li><b>response: </b> file with file id download</li>
</p>

<p><b>/filedetails</b> : get the details of the file
<li><b>method</b>:  post </li> 
<li><b>required fields</b>:
 <ul>
    <li><i>token</i>: user token </li>
    <li><i>fileId</i>: fileId to to get deals</li>
    </li>
 </ul>
<p>
<li><b>response: </b> details of the including url, download url, token, fildId</li>
</p>

<p><b>/userdetails</b> : get user details of a file
<li><b>method</b>:  post </li> 
<li><b>required fields</b>:
 <ul>
    <li><i>token</i>: user token </li>
    </li>
 </ul>
<p>
<li><b>response: </b> details of the user including number of files uploaded</li>
</p>

### Contacts
<hr>
<li>Kingsley Botchway - kingsleybotchwayedu11@gmail.com</li>
<li>project Link -  https://github.com/MhisterKhing6/ml-Fellowship-2</li>


This end point provides authentication to 3rd party applications (machines)
based on the so-called `Clients` and their Key/Secret pair.

1. Create a `Client` by using the coresponding pages in the using
2. Authenticate the client and get the authentication token

##Example##
###authentication###
URL: http://localhost:9000/client
Method: POST
URL parameters: client_id, client_secret

eg: http://localhost:9000/auth/client?client_id=b9acdae5-d525-4b07-941a-53e980ff225b&client_secret=123

###Articles###
Once you have get your authentication token you could get a list off all the
articles created by this user

URL: http://localhost:9000/api/articles
Header: Authorization: Bearer {token}

# Url-Shortner
## This project is to implement
>shortning of url
>Redirection to actual address with shortCode

##Additionally to make work faster we also implemented caching through redis
>Used SET and GET commands of redis

###Two api's 
>POST APi:it receive original url in request and returns short url in response
>GET API:it takes shortcode in path params and redirects to its corresponding original url if exist

##packages involved
>Multer:to facilitate file/transfer
>util:To write promises
>redis:for purpose of caching
>express
>mongoose
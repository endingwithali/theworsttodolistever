
# Commands 

run server
```
go run main
```


# POSTGRES STRUCTURE
DB Name: commulistDB 

CREATE TABLE tasks (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    string text not null,
    createDate timestamp DEFAULT CURRENT_TIMESTAMP,
    updateDate timestamp default current_timestamp,
    creator uuid, 
    status boolean SET DEFAULT false
);

curl -X POST 0.0.0.0:8080/task/create -H "Content-Type: application/x-www-form-urlencoded" -d "task='TASK STRING'"

curl -X DELETE 0.0.0.0:8080/task/delete -H "Content-Type: application/json" -d '{"taskID":"9615cce1-f377-48f0-9cf5-9ccb731764fb"}'

curl -X PUT 0.0.0.0:8080/task/update -H "Content-Type: application/json" -d '{"taskID":"1926be6a-ae62-43ef-a805-94dfd1efb468", "taskString":"Updated task information"}'

curl -X GET 0.0.0.0:8080/task/get




Gin body: fmt.Println(c.Request.Body)


https://blog.logrocket.com/building-simple-app-go-postgresql/


# Postgres documentation

from installing on homebrew
```
To start postgresql@14 now and restart at login:
  brew services start postgresql@14

Or, if you don't want/need a background service you can just run:
  /usr/local/opt/postgresql@14/bin/postgres -D /usr/local/var/postgresql@14
```

https://wiki.postgresql.org/wiki/Homebrew



## POSTGRES 

https://www.postgresql.org/docs/current/tutorial-createdb.html
Create a new db
` $ createdb <dbname> `

Connecting to the db
` $ psql <dbname>`




# Gin Library Notes:

Documentation - https://gin-gonic.com/docs/examples/bind-form-data-request-with-custom-struct/
Go Docs - https://pkg.go.dev/github.com/gin-gonic/gin
Root - https://github.com/gin-gonic/gin/tree/master

How to handle cookies in GIN - https://github.com/gin-gonic/examples/blob/master/cookie/main.go
How to pass values to Gin Router Functions  - https://github.com/gin-gonic/gin/issues/932




# DB SECURITY
- "look up database/sql prepared statements - it's the only way to securely interface with your database" - digital_sparky




# How to Query DB results
```
    // An album slice to hold data from returned rows.
    var albums []Album

    // Loop through rows, using Scan to assign column data to struct fields.
    for rows.Next() {
        var alb Album
        if err := rows.Scan(&alb.ID, &alb.Title, &alb.Artist,
            &alb.Price, &alb.Quantity); err != nil {
            return albums, err
        }
        albums = append(albums, alb)
    }
```
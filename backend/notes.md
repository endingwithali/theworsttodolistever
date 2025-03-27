
# Commands 

run server
```
go run main
```


# POSTGRES STRUCTURE
DB Name: commulistDB 

```
CREATE TABLE tasks (
    id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    string text not null,
    createDate timestamp DEFAULT CURRENT_TIMESTAMP,
    updateDate timestamp default current_timestamp,
    creator uuid, 
    status boolean SET DEFAULT false
);
```

## Rules:



```
CREATE  FUNCTION update_task_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updateDate = now();
    RETURN NEW;
END;
$$ language 'plpgsql';
```
```
CREATE TRIGGER update_task_row
    BEFORE UPDATE
    ON
        tasks
    FOR EACH ROW
EXECUTE PROCEDURE update_task_time();
```
credit: https://aviyadav231.medium.com/automatically-updating-a-timestamp-column-in-postgresql-using-triggers-98766e3b47a0


# Testing Calls:

## Get All Tasks
curl -X GET 0.0.0.0:8080/task/get

## Get One Task
curl -X GET "0.0.0.0:8080/task/get?taskID=1926be6a-ae62-43ef-a805-94dfd1efb468"
curl -X GET "0.0.0.0:8080/task/get?taskID=e32ec77e-931a-4694-a38f-9a407614dd30"
curl -X GET "0.0.0.0:8080/task/get?taskID=164ba7fa-5e46-4551-9a4a-d7aa18fa0cdd"

curl -X GET "0.0.0.0:8080/task/get?taskID=08a8931e-3182-44ca-a656-0de4ddf64435"




## Create Tasks
curl -X POST 0.0.0.0:8080/task/create -H "Content-Type: application/x-www-form-urlencoded" -d "task='TASK STRING'"

curl -X POST 0.0.0.0:8080/task/create -H "Content-Type: application/json" -d '{"task":"TESTTASK"}'

## Delete Task

curl -X DELETE 0.0.0.0:8080/task/delete -H "Content-Type: application/json" -d '{"taskID":"9615cce1-f377-48f0-9cf5-9ccb731764fb"}'

curl -X DELETE 0.0.0.0:8080/task/delete -H "Content-Type: application/json" -d '{"taskID":"8f8e1880-bf86-4311-8303-91a64a186e12"}'




## Update Task
curl -X PUT 0.0.0.0:8080/task/update -H "Content-Type: application/json" -d '{"taskID":"1926be6a-ae62-43ef-a805-94dfd1efb468", "taskString":"Updated task information"}'


curl -X PUT 0.0.0.0:8080/task/update -H "Content-Type: application/json" -d '{"taskID":"08a8931e-3182-44ca-a656-0de4ddf64435", "taskString":"Updated task information"}'






## Toggle Task Status

curl -X PUT 0.0.0.0:8080/task/toggle -H "Content-Type: application/json" -d '{"taskID":"1926be6a-ae62-43ef-a805-94dfd1efb468"}'

curl -X PUT 0.0.0.0:8080/task/toggle -H "Content-Type: application/json" -d '{"taskID":"a08a8931e-3182-44ca-a656-0de4ddf64435"}'





# Notes

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

How to create triggers in postgres that will update time and date automatically on column based on update function being executed - https://www.reddit.com/r/PostgreSQL/comments/10shxej/how_to_update_a_timestamp_automatically/ 


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

# PSQL 





# Brainstorming Fun

## Name Suggestions

- Task manifesto
- Communistodo
- SociaLIST
- Commulist
- 

can we make this as a twitch chat interactive experience (utilize twitch moderation to moderate the inputs)




# Resources 
- Explanation of CORS - https://www.concordusa.com/blog/what-is-cors-and-why-does-it-keep-coming-up-in-my-projects 
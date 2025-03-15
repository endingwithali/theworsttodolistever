
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
curl -X POST 0.0.0.0:8080/task/create -H "Content-Type: application/x-www-form-urlencoded" -d "task='TASK STRING'"

curl -X POST 0.0.0.0:8080/task/create -H "Content-Type: application/json" -d '{"task":"TESTTASK"}'


curl -X DELETE 0.0.0.0:8080/task/delete -H "Content-Type: application/json" -d '{"taskID":"9615cce1-f377-48f0-9cf5-9ccb731764fb"}'

curl -X PUT 0.0.0.0:8080/task/update -H "Content-Type: application/json" -d '{"taskID":"1926be6a-ae62-43ef-a805-94dfd1efb468", "taskString":"Updated task information"}'

curl -X GET 0.0.0.0:8080/task/get

curl -X PUT 0.0.0.0:8080/task/toggle -H "Content-Type: application/json" -d '{"taskID":"1926be6a-ae62-43ef-a805-94dfd1efb468"}'

 curl -X GET "0.0.0.0:8080/task/get?taskID=1926be6a-ae62-43ef-a805-94dfd1efb468"


curl -X PUT 0.0.0.0:8080/task/toggle -H "Content-Type: application/json" -d '{"taskID":"ab010555-f156-4ba2-95e6-74353d1da8f4"}'

 curl -X GET "0.0.0.0:8080/task/get?taskID=164ba7fa-5e46-4551-9a4a-d7aa18fa0cdd"



 curl -X GET "0.0.0.0:8080/task/get?taskID=e32ec77e-931a-4694-a38f-9a407614dd30"
{"uuid":"e32ec77e-931a-4694-a38f-9a407614dd30","text":"asdfasfds","createDate":"2025-03-15T15:51:38.182005Z","updateDate":"2025-03-15T15:51:38.182005Z","creator":"00000000-0000-0000-0000-000000000000","status":false}%

{"taskStatus":true,"updateDate":"2025-03-15T17:53:10.719678Z"}%                                                                        ~|⇒

curl -X PUT 0.0.0.0:8080/task/toggle -H "Content-Type: application/json" -d '{"taskID":"e32ec77e-931a-4694-a38f-9a407614dd30"}'





** must put get query in quotes because ? is a shell escape character





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









[{"uuid":"e32ec77e-931a-4694-a38f-9a407614dd30","text":"asdfasfds","createDate":"2025-03-15T15:51:38.182005Z","updateDate":"2025-03-15T15:51:38.182005Z","creator":"00000000-0000-0000-0000-000000000000","status":false},{"uuid":"500ef0cc-7231-4704-bf69-22a49efba090","text":"asdfasdf","createDate":"2025-03-15T15:51:39.298887Z","updateDate":"2025-03-15T15:51:39.298887Z","creator":"00000000-0000-0000-0000-000000000000","status":false},{"uuid":"42b2ef9d-1376-4d5b-9390-6696ff124d9d","text":"asfdasdf","createDate":"2025-03-15T15:51:40.348678Z","updateDate":"2025-03-15T15:51:40.348678Z","creator":"00000000-0000-0000-0000-000000000000","status":false},{"uuid":"c8f580d6-ca0f-45d1-bdb6-d4170ffdd4ed","text":"asdfasdf","createDate":"2025-03-15T15:51:41.41705Z","updateDate":"2025-03-15T15:51:41.41705Z","creator":"00000000-0000-0000-0000-000000000000","status":false},{"uuid":"11924fd2-e3d4-4f61-9a9d-094cac4499d0","text":"TESTTASK","createDate":"2025-03-15T15:50:59.453207Z","updateDate":"2025-03-15T15:50:59.453207Z","creator":"00000000-0000-0000-0000-000000000000","status":false},{"uuid":"79a57a88-0adf-4fea-a9c7-cbb39f06365c","text":"sdfasdfa","createDate":"2025-03-15T15:51:35.986336Z","updateDate":"2025-03-15T15:51:35.986336Z","creator":"00000000-0000-0000-0000-000000000000","status":false},{"uuid":"1ae93156-9f86-4cdb-a18e-8b0266f955ce","text":"asdfasdf","createDate":"2025-03-15T15:51:34.799498Z","updateDate":"2025-03-15T15:51:34.799498Z","creator":"00000000-0000-0000-0000-000000000000","status":false},{"uuid":"64a6d028-8fbd-4490-a555-e16c7f0852f1","text":"asdfasdf","createDate":"2025-03-15T15:51:33.666756Z","updateDate":"2025-03-15T15:51:33.666756Z","creator":"00000000-0000-0000-0000-000000000000","status":false},{"uuid":"7c7858bf-85f1-4515-ba40-99760dca6085","text":"asdfasdf","createDate":"2025-03-15T15:51:32.302446Z","updateDate":"2025-03-15T15:51:32.302446Z","creator":"00000000-0000-0000-0000-000000000000","status":false},{"uuid":"534f9b72-3a1f-49ef-b513-c80e76af6147","text":"adsfasdf","createDate":"2025-03-15T15:51:30.902021Z","updateDate":"2025-03-15T15:51:30.902021Z","creator":"00000000-0000-0000-0000-000000000000","status":false},{"uuid":"66e67511-cb42-4ad4-8b8f-b9eef7dac47b","text":"asdfasdf","createDate":"2025-03-15T15:51:28.838781Z","updateDate":"2025-03-15T15:51:28.838781Z","creator":"00000000-0000-0000-0000-000000000000","status":false},{"uuid":"eeac4063-502a-4e1e-b2dd-4293336dc363","text":"TASK STRING","createDate":"2025-03-15T15:37:58.57097Z","updateDate":"2025-03-15T15:37:58.57097Z","creator":"00000000-0000-0000-0000-000000000000","status":false},{"uuid":"9f88916f-828b-47c4-ab48-bd6f5c9ae3e6","text":"asdfasdf","createDate":"2025-03-15T15:51:36.982075Z","updateDate":"2025-03-15T15:51:36.982075Z","creator":"00000000-0000-0000-0000-000000000000","status":false},{"uuid":"d45fa900-95f3-417e-a4d5-60e35d11dc85","text":"nenwienweinew","createDate":"2025-03-15T15:11:55.597168Z","updateDate":"2025-03-15T15:11:55.597168Z","creator":"00000000-0000-0000-0000-000000000000","status":false},{"uuid":"164ba7fa-5e46-4551-9a4a-d7aa18fa0cdd","text":"task 2","createDate":"2025-01-31T10:10:21.11597Z","updateDate":"2025-01-31T10:10:21.11597Z","creator":"00000000-0000-0000-0000-000000000000","status":false},{"uuid":"ab010555-f156-4ba2-95e6-74353d1da8f4","text":"task 1","createDate":"2025-01-31T10:10:16.089964Z","updateDate":"2025-01-31T10:10:16.089964Z","creator":"00000000-0000-0000-0000-000000000000","status":false},{"uuid":"eca3d954-d865-4ff3-8b77-f48f94da8180","text":"task 3","createDate":"2025-01-31T10:10:26.559895Z","updateDate":"2025-01-31T10:10:26.559895Z","creator":"00000000-0000-0000-0000-000000000000","status":false}]%
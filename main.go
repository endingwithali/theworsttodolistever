package main

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	_ "github.com/lib/pq"
)

type RouterEnv struct {
	db *sql.DB
}

func main() {
	connectionString := "postgresql://twitch:twitch@127.0.0.1/commulistDB?sslmode=disable"

	db, err := sql.Open("postgres", connectionString)
	if err != nil {
		log.Fatalf("Error %s", err)
	}
	fmt.Println(db)

	router := gin.Default()

	routerFunctions := &RouterEnv{
		db: db,
	}
	//Testing Endpoints
	{
		router.GET("/ping", func(c *gin.Context) {
			fmt.Println("In the Router")
		})
	}

	{
		taskRouter := router.Group("/task")
		taskRouter.POST("/create", routerFunctions.createTask)
		taskRouter.GET("/get", routerFunctions.getTasks)
		taskRouter.DELETE("/delete", routerFunctions.deleteTask)
		taskRouter.PUT("/update", routerFunctions.updateTask)
		taskRouter.PUT("/toggle", routerFunctions.toggleTaskStatus)
	}

	router.Run()
}

// type Task struct {
// uuid uuid
// 	taskInfo   string
// 	createDate time.Time
// 	updateDate time.Time
// 	creator    string
// }

type CreateTaskStruct struct {
	Task string `form:"task"`
}

func (env *RouterEnv) createTask(c *gin.Context) {
	fmt.Println("Create New To DO Task")
	var input CreateTaskStruct
	c.Bind(&input)
	fmt.Println(input)
	sqlStatement := fmt.Sprintf("INSERT INTO tasks (string) VALUES (%s);", input.Task)
	_, err := env.db.Exec(sqlStatement)
	if err != nil {
		log.Fatalln(err)
		c.JSON(500, "An error occured")
	}
	c.JSON(200, nil)
}

type GetTaskOutputStruct struct {
	Uuid       uuid.UUID `json:"uuid"`
	Text       string    `json:"text"`
	CreateDate time.Time `json:"createDate"`
	UpdateDate time.Time `json:"updateDate"`
	Creator    uuid.UUID `json:"creator"`
	Status     bool      `json:"status"`
}

func (env *RouterEnv) getTasks(c *gin.Context) {
	fmt.Println("We are getting all the tasks")
	rows, err := env.db.Query("SELECT * FROM tasks;")
	if err != nil {
		log.Fatalln(err)
		c.JSON(500, "An error occured")
	}
	defer rows.Close()

	var allTasks []GetTaskOutputStruct
	var task GetTaskOutputStruct

	for rows.Next() {
		rows.Scan(&task.Uuid, &task.Text, &task.CreateDate, &task.UpdateDate, &task.Creator, &task.Status)
		allTasks = append(allTasks, task)
	}

	fmt.Println(allTasks)
	c.JSON(200, allTasks)
}

type DeleteTaskStruct struct {
	Uuid string `json:"taskID"`
}

func (env *RouterEnv) deleteTask(c *gin.Context) {
	fmt.Println("(delete tasks)")
	var input DeleteTaskStruct
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request format"})
		return
	}
	sqlStatement := fmt.Sprintf("DELETE FROM tasks where id='%s';", input.Uuid)
	_, err := env.db.Exec(sqlStatement)
	if err != nil {
		log.Fatalln(err)
		c.JSON(500, "An error occured")
	}
	c.JSON(200, nil)
}

type UpdateTaskStruct struct {
	Uuid          string `json:"taskID"`
	NewTaskString string `json:"taskString"`
}

func (env *RouterEnv) updateTask(c *gin.Context) {
	fmt.Println("updating text of task")
	var input UpdateTaskStruct
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request format"})
		return
	}

	sqlSatement := fmt.Sprintf("UPDATE tasks SET string='%s', updateDate='%s' WHERE id='%s';", input.NewTaskString, time.Now(), input.Uuid)
	_, err := env.db.Exec(sqlSatement)
	if err != nil {
		log.Fatalln(err)
		c.JSON(500, "An error occured")
	}

	c.JSON(200, gin.H{
		"status": true,
	})
}

type ToggleTaskStruct struct {
	Uuid string `json:"taskID"`
}

func (env *RouterEnv) toggleTaskStatus(c *gin.Context) {
	fmt.Println("Toggle Tasks")
	var input ToggleTaskStruct
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request format"})
		return
	}

	sqlSatement := fmt.Sprintf("UPDATE tasks SET status = NOT status WHERE id='%s';", input.Uuid)
	_, err := env.db.Exec(sqlSatement)
	if err != nil {
		log.Fatalln(err)
		c.JSON(500, "An error occured")
	}

	c.JSON(200, gin.H{
		"status": true,
	})

}

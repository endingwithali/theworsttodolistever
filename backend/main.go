package main

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/gin-contrib/cors"
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

	corsPolicy := cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"GET", "PATCH", "PUT", "POST", "DELETE"},
		AllowHeaders: []string{"Origin", "Content-Type"},
		// ExposeHeaders:    []string{"Content-Length"},
		// AllowCredentials: true,
		// AllowOriginFunc: func(origin string) bool {
		// 	return origin == "https://github.com"
		// },
		MaxAge: 12 * time.Hour,
	})

	router := gin.Default()

	router.Use(corsPolicy)
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

type CreateTaskReturnStruct struct {
	Uuid       uuid.UUID `json:"uuid"`
	Text       string    `json:"text"`
	CreateDate time.Time `json:"createDate"`
	UpdateDate time.Time `json:"updateDate"`
	Creator    uuid.UUID `json:"creator"`
	Status     bool      `json:"status"`
}

func (env *RouterEnv) createTask(c *gin.Context) {

	fmt.Println("Create New To DO Task")
	var input CreateTaskStruct
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request format"})
		return
	}

	rows, err := env.db.Query("INSERT INTO tasks (string) VALUES ($1) RETURNING *;", input.Task)
	if err != nil {
		log.Fatalln(err)
		c.JSON(500, "An error creating new task occured")
	}
	defer rows.Close()

	var task CreateTaskReturnStruct

	for rows.Next() {
		rows.Scan(&task.Uuid, &task.Text, &task.CreateDate, &task.UpdateDate, &task.Creator, &task.Status)
	}

	fmt.Println(task)
	c.JSON(200, task)

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
	// gets one specific task
	taskID := c.Query("taskID")
	if taskID != "" {
		fmt.Println("We are getting just one task")
		rows, err := env.db.Query("SELECT * FROM tasks where id=$1;", taskID)
		if err != nil {
			log.Fatalln(err)
			c.JSON(500, "An error occured")
		}
		defer rows.Close()

		var task GetTaskOutputStruct

		for rows.Next() {
			rows.Scan(&task.Uuid, &task.Text, &task.CreateDate, &task.UpdateDate, &task.Creator, &task.Status)
		}

		fmt.Println(task)
		c.JSON(200, task)
	} else {
		// Gets all existing tasks
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
	_, err := env.db.Exec("DELETE FROM tasks where id=$1;", input.Uuid)
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

	_, err := env.db.Exec("UPDATE tasks SET string = $1 WHERE id= $2;", input.NewTaskString, input.Uuid)
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

type ToggleTaskResponseStruct struct {
	Status     bool      `json:"status"`
	UpdateDate time.Time `json:"updateDate"`
}

func (env *RouterEnv) toggleTaskStatus(c *gin.Context) {
	fmt.Println("Toggle Tasks")
	var input ToggleTaskStruct
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request format"})
		return
	}

	row, err := env.db.Query("UPDATE tasks SET status = NOT status WHERE id = $1 RETURNING status, updateDate;", input.Uuid)
	if err != nil {
		log.Fatalln(err)
		c.JSON(500, "An error occured")
	}

	defer row.Close()
	var task ToggleTaskResponseStruct
	row.Next()
	row.Scan(&task.Status, &task.UpdateDate)

	fmt.Println(task)

	c.JSON(200, gin.H{
		"taskStatus": task.Status,
		"updateDate": task.UpdateDate,
	})

}

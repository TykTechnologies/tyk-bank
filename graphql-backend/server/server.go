package main

import (
	"bytes"
	"database/sql"
	"fmt"
	"graphql_backend"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/handler"
	"github.com/go-chi/chi"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
)

const (
	defaultDatabaseHost = "server-db"
	defaultDatabasePort = "15432"
	defaultServerPort   = "18080"

	DB_USER     = "postgres"
	DB_PASSWORD = "postgres"
	DB_NAME     = "postgres"
)

func main() {

	log.Output(1, "hello")

	dbhost := os.Getenv("DB_HOST")
	if dbhost == "" {
		dbhost = defaultDatabaseHost
	}

	dbport := os.Getenv("DB_PORT")
	if dbport == "" {
		dbport = defaultDatabasePort
	}

	dbinfo := fmt.Sprintf("user=%s password=%s host=%s port=%s dbname=%s sslmode=disable", DB_USER, DB_PASSWORD, dbhost, dbport, DB_NAME)
	db, err := sql.Open("postgres", dbinfo)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err = db.Ping(); err != nil {
		log.Fatal(err)
	}

	log.Printf("migrating database...\n")

	if err = migrateDatabase(db); err != nil {
		log.Fatal(err)
	}

	log.Printf("database migration complete!\n")

	router := chi.NewRouter()
	// Add CORS middleware around every request
	// See https://github.com/rs/cors for full option listing

	router.Handle("/", handler.Playground("GraphQL playground", "/query"))
	router.Handle("/query", handler.GraphQL(graphql_backend.NewExecutableSchema(graphql_backend.Config{Resolvers: graphql_backend.NewResolver(db)})))

	h := cors.AllowAll().Handler(router)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground\n", defaultServerPort)
	log.Fatal(http.ListenAndServe(":"+defaultServerPort, h))
}

func migrateDatabase(db *sql.DB) error {

	migration, err := ioutil.ReadFile("./database.sql")
	if err != nil {
		return err
	}

	tx, err := db.Begin()
	if err != nil {
		return err
	}

	for _, statement := range bytes.Split(migration, []byte(";")) {
		_, err := tx.Exec(string(statement))
		if err != nil {
			tx.Rollback()
			return err
		}
	}

	return tx.Commit()
}

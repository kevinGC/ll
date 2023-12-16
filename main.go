package main

import (
	"log"
	"net/http"
)

func main() {
	http.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir("./static"))))

	log.Printf("Starting...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

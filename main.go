package main

import (
	"html/template"
	"log"
	"net/http"
)

var (
	smbTemplate    = template.Must(template.ParseFiles("templates/smb.html", "templates/base.html"))
	maddenTemplate = template.Must(template.ParseFiles("templates/madden.html", "templates/base.html"))
)

func main() {
	http.HandleFunc("/", index)
	http.HandleFunc("/madden", madden)
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))

	log.Printf("Starting...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func index(response http.ResponseWriter, request *http.Request) {
	smbTemplate.Execute(response, nil)
}

func madden(response http.ResponseWriter, request *http.Request) {
	maddenTemplate.Execute(response, nil)
}

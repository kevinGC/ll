package main

import (
	_ "embed"
	"html/template"
	"log"
	"net/http"
	"strings"
)

type HeaderData struct {
	Active string
}

var (
	smbTemplate    = template.Must(template.ParseFiles("templates/smb.html", "templates/base.html"))
	maddenTemplate = template.Must(template.ParseFiles("templates/madden.html", "templates/base.html"))
	ff2023Template = template.Must(template.ParseFiles("templates/ff2023.html", "templates/base.html"))
)

//go:embed ff2023_stats.txt
var ff2023Stats string

type PlayerStats struct {
	Rank          string
	Name          string
	WinLossTie    string
	PointsFor     string
	PointsAgainst string
	Streak        string
	WaiverBudget  string
	Waiver        string
	Moves         string
}

var players []PlayerStats

func main() {
	// Skip the first line, which is just column headers.
	for _, line := range strings.Split(ff2023Stats, "\n")[1:] {
		log.Printf("processing line %q", line)
		fields := strings.Split(line, "\t")
		if len(fields) != 9 {
			log.Printf("expected to find 9 fields, but %d for line: %q", len(fields), line)
			continue
		}

		player := PlayerStats{
			Rank:          fields[0],
			Name:          fields[1], // Note: This always starts with the useless string "logo".
			WinLossTie:    fields[2],
			PointsFor:     fields[3],
			PointsAgainst: fields[4],
			Streak:        fields[5],
			WaiverBudget:  fields[6],
			Waiver:        fields[7],
			Moves:         fields[8],
		}
		players = append(players, player)
	}

	http.HandleFunc("/", index)
	http.HandleFunc("/madden", madden)
	http.HandleFunc("/ff2023", ff2023)
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))

	log.Printf("Starting...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func index(response http.ResponseWriter, request *http.Request) {
	var data = &struct {
		HeaderData HeaderData
	}{
		HeaderData: HeaderData{
			Active: "smb",
		},
	}
	smbTemplate.ExecuteTemplate(response, "base", data)
}

func madden(response http.ResponseWriter, request *http.Request) {
	var data = &struct {
		HeaderData HeaderData
	}{
		HeaderData: HeaderData{
			Active: "madden",
		},
	}
	maddenTemplate.ExecuteTemplate(response, "base", data)
}

func ff2023(response http.ResponseWriter, request *http.Request) {
	var data = &struct {
		Players    []PlayerStats
		HeaderData HeaderData
	}{
		HeaderData: HeaderData{
			Active: "ff2023",
		},
	}
	maddenTemplate.ExecuteTemplate(response, "base", data)
}

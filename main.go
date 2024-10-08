package main

import (
	_ "embed"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strings"
	"time"
)

type BaseData struct {
	Active string
	Year   int
}

var (
	smbTemplate      = template.Must(template.ParseFiles("templates/smb.html", "templates/base.html"))
	maddenTemplate   = template.Must(template.ParseFiles("templates/madden.html", "templates/base.html"))
	ff2023Template   = template.Must(template.ParseFiles("templates/ff2023.html", "templates/base.html"))
	ff2024Template   = template.Must(template.ParseFiles("templates/ff2024.html", "templates/base.html"))
	basementTemplate = template.Must(template.ParseFiles("templates/basement.html", "templates/base.html"))
)

//go:embed ff2023_stats.txt
var ff2023Stats string

//go:embed static/bracket.svg
var bracketSVG string

type PlayerStats struct {
	Rank          string
	Name          template.HTML
	WinLossTie    string
	PointsFor     string
	PointsAgainst string
	Streak        string
	WaiverBudget  string
	Waiver        string
	Moves         string
}

var players []PlayerStats

var playerLinks = map[template.HTML]string{
	"Goin rogue": "https://www.youtube.com/watch?v=aX97OF1p4nU&t=48s",
}

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
			Rank:          strings.ReplaceAll(fields[0], "*", ""),
			Name:          template.HTML(fields[1][5:]), // Note: This always starts with the useless string "logo".
			WinLossTie:    fields[2],
			PointsFor:     fields[3],
			PointsAgainst: fields[4],
			Streak:        fields[5],
			WaiverBudget:  fields[6],
			Waiver:        fields[7],
			Moves:         fields[8],
		}
		if link, ok := playerLinks[player.Name]; ok {
			player.Name = template.HTML(fmt.Sprintf(`<a href="%s">%s</a>`, link, player.Name))
		}
		players = append(players, player)
	}

	http.HandleFunc("/", index)
	http.HandleFunc("/madden", madden)
	http.HandleFunc("/ff2023", ff2023)
	http.HandleFunc("/ff2024", ff2024)
	http.HandleFunc("/basement", basement)
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))

	log.Printf("Starting...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func index(response http.ResponseWriter, request *http.Request) {
	var data = &struct {
		BaseData BaseData
	}{
		BaseData: BaseData{
			Active: "smb",
			Year:   time.Now().Year(),
		},
	}
	smbTemplate.ExecuteTemplate(response, "base", data)
}

func madden(response http.ResponseWriter, request *http.Request) {
	var data = &struct {
		BaseData BaseData
	}{
		BaseData: BaseData{
			Active: "madden",
			Year:   time.Now().Year(),
		},
	}
	maddenTemplate.ExecuteTemplate(response, "base", data)
}

func ff2023(response http.ResponseWriter, request *http.Request) {
	var data = &struct {
		Players  []PlayerStats
		Bracket  template.HTML
		BaseData BaseData
	}{
		Players: players,
		BaseData: BaseData{
			Active: "ff2023",
			Year:   time.Now().Year(),
		},
		Bracket: template.HTML(bracketSVG),
	}
	ff2023Template.ExecuteTemplate(response, "base", data)
}

func ff2024(response http.ResponseWriter, request *http.Request) {
	var data = &struct {
		BaseData BaseData
	}{
		BaseData: BaseData{
			Active: "ff2024",
			Year:   time.Now().Year(),
		},
	}
	ff2024Template.ExecuteTemplate(response, "base", data)
}

func basement(response http.ResponseWriter, request *http.Request) {
	var data = &struct {
		BaseData BaseData
	}{
		BaseData: BaseData{
			Active: "basement",
			Year:   time.Now().Year(),
		},
	}
	basementTemplate.ExecuteTemplate(response, "base", data)
}

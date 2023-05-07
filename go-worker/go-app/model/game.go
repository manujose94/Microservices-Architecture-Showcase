package model

type Game struct {
	GameID         string `json:"gameID"`
	SteamAppID     string `json:"steamAppID"`
	Cheapest       string `json:"cheapest"`
	CheapestDealID string `json:"cheapestDealID"`
	External       string `json:"external"`
	InternalName   string `json:"internalName"`
	Thumb          string `json:"thumb"`
}

type GameList struct {
	Games []Game `json:"games"`
	Total int    `json:"total"`
}

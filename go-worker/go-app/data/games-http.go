package data

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"

	"microservice-steam-games/model"
)

func GetGames(title, steamAppID string, limit int, exact bool) ([]model.Game, error) {
	// Construct the URL and query parameters
	queryParams := url.Values{}
	queryParams.Set("title", title)
	if steamAppID != "" {
		queryParams.Set("steamAppID", steamAppID)
	}

	queryParams.Set("limit", fmt.Sprintf("%d", limit))
	queryParams.Set("exact", fmt.Sprintf("%t", exact))
	url := "https://www.cheapshark.com/api/1.0/games?" + queryParams.Encode()

	// Send the HTTP request and read the response body
	resp, err := http.Get(url)
	if err != nil {
		//It's better to use fmt.Errorf() instead of errors.New(fmt.Sprintf()) to create an error message with formatted values.
		// This improves readability and maintainability of the code
		return nil, fmt.Errorf("HTTP request failed: %v", err)
	}
	// Close the response body when this function returns
	defer resp.Body.Close()

	// Check the status code of the response
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("HTTP request failed with status code %d", resp.StatusCode)

	}

	// Unmarshal the JSON response into a slice of Game objects
	var games []model.Game
	if err := json.NewDecoder(resp.Body).Decode(&games); err != nil {
		return nil, fmt.Errorf("failed to decode response body: %v", err)
	}

	return games, nil
}

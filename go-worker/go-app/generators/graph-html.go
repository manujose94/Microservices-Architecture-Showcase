package generators

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"unicode"

	"microservice-steam-games/model"
)

func GenerateChart(vgList []model.Game) string {
	// Prepare the labels and data for the chart
	labels := []string{}
	prices := []float64{}
	for _, vg := range vgList {
		labels = append(labels, vg.External)
		price, _ := strconv.ParseFloat(vg.Cheapest, 64)
		prices = append(prices, price)
	}

	// Convert the labels and data to JSON format
	labelBytes, _ := json.Marshal(labels)
	priceBytes, _ := json.Marshal(prices)

	// Generate the HTML string with the chart
	chartHTML := fmt.Sprintf(`
        <canvas id="myChart" width="400" height="400"></canvas>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js"></script>
        <script>
            var ctx = document.getElementById('myChart').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: %s,
                    datasets: [{
                        label: 'Prices',
                        data: %s,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        </script>
    `, labelBytes, priceBytes)
	minify := minifyChartHTML(chartHTML)
	return minify
}

// Remove whitespace and comments from string
func minifyChartHTML(chartHTML string) string {
	inComment := false
	inQuotes := false
	out := []rune{}

	for _, r := range chartHTML {
		if inComment {
			if r == '*' {
				if strings.HasPrefix(chartHTML, "*/") {
					inComment = false
				}
			}
			continue
		}

		if r == '"' {
			if !inQuotes {
				inQuotes = true
			} else if inQuotes {
				inQuotes = false
			}
		}

		if !inQuotes {
			if unicode.IsSpace(r) {
				continue
			}
			if strings.HasPrefix(chartHTML, "//") {
				continue
			}
			if strings.HasPrefix(chartHTML, "/*") {
				inComment = true
				continue
			}
		}

		out = append(out, r)
	}

	return string(out)
}

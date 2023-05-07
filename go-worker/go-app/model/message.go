package model

import "time"

type Message struct {
	TaskID     string    `json:"taskID"`
	Created_at time.Time `json:"created_at"`
	Result     string    `json:"result,omitempty"`
	Success    bool      `json:"success,omitempty"`
}

func NewMessage(taskID string, result string, success bool) *Message {
	return &Message{
		TaskID:     taskID,
		Created_at: time.Now().UTC(),
		Result:     result,
		Success:    success,
	}
}

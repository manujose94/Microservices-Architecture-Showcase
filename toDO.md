# to DO

## Pending task

- [x] Docker Nodejs best practices and multistage
- [x] Documentation and schemes
- [x] Implement communication between services ( rest-api and go-micro )
- [ ] Add some task to stress traffic
- [ ] Implement auth via Auth0
- [ ] Best practice for production [Production best practices](http://expressjs.com/en/advanced/best-practice-performance.html#production-best-practices-performance-and-reliability) and [Express_Nodejs/deployment](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/deployment)



### Possibles new routes

- GET /tasks/search?q=:query: Search for tasks by a query string. For example, searching for all tasks that contain the word "urgent".
- GET /tasks?sortBy=:field&sortOrder=:order: Get a sorted list of tasks by a specified field and order. For example, sorting tasks by due date in descending order.
- GET /users/:userId/tasks: Get a list of all tasks assigned to a specific user by their user ID.
- GET /tasks/:taskId/history: Get a list of all history entries for a specific task by its task ID.

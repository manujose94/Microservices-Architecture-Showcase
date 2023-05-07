db.createUser({
    user: "mamarbao",
    pwd: "m4n56l",
    roles: [
      {
        role: "readWrite",
        db: "mydb",
      },
    ],
  });
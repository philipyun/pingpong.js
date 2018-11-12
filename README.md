pingpong.js


# API

## Players API

base path: `{server}/api/v1/players`

### Get Players

Request: GET `/api/v1/players`

Response: `[{Players}]`

Player Object format:

```
{
    playerID: <int (unique)>,
    name: <string>,
    nickname: <string>,
    elo: <int>
}
```

### Get Player

***Not implemented yet***

### Create Player

Request: POST `/api/v1/players`

Request Body:
```
{
    playerName: <string | required>
    nickname: <string | optional>
}
```

Response: `true` on success, `false` on failure

### Delete Player

Request: DELETE `/api/v1/players/<playerID | int>`

Response: `true` on success, `false` on failure

### Delete All Players

Request: DELETE `/api/v1/players`

Response: `true` on success, `false` on failure



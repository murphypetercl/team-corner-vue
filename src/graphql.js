import gql from 'graphql-tag'

export const SIGNUP_MUTATION = gql`mutation ($data: UserCreateInput!) {
    createUser(data: $data ) {
        id
        email
    }
}`

export const ALL_USER_REGISTRATIONS_QUERY = gql`query AllUserRegistrationsQuery {
    allUserRegistrations {
        id
        firstName
        lastName
        email
        status
    }
}`

export const UPDATE_USER_MUTATION = gql`mutation ($id: ID!, $data: UserUpdateInput!) {
    updateUser(id: $id, data: $data ) {
        id
        email
    }
}`

export const LOGIN_MUTATION = gql`mutation authenticate($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password ) {
        item{ id, firstName, lastName, email, isAdmin },
        token
    }
}`

export const LOGOUT_MUTATION = gql`mutation unauthenticate {
    unauthenticateUser {
        success
    }
}`

export const AUTHENTICATED_USER_QUERY = gql`query AuthenticatedUserQuery {
    authenticatedUser {
        id
        firstName
        lastName
        email
        isAdmin
        isMember
    }
}`

export const ALL_USERS_QUERY = gql`query AllUsersQuery {
    allUsers {
        id
        firstName
        lastName
        email
        isMember
    }
}`

export const ALL_ORG_QUERY = gql`query AllOrganizationsQuery($where: OrganizationWhereInput!) {
    allOrganizations(where: $where) {
        id,
        name,
        webSite,
        teams {
            name
        }
    }
}`

export const CREATE_GAME_MUTATION = gql`mutation ($data: GameCreateInput!) {
    createGame(data: $data ) {
        id,
        competition,
        opposition,
        venue,
        date,
        gameStatSummary {
            goalsForSelf,
            pointsForSelf,
            goalsForOpposition,
            pointsForOpposition
        }
    }
}`

export const ALL_GAMES_QUERY = gql`query AllGames {
    allGames { 
        id,
        competition,
        opposition,
        venue,
        date,
        gameStatSummary {
            id,
            goalsForSelf,
            pointsForSelf,
            goalsForOpposition,
            pointsForOpposition,
            hookBlock,
            turnover,
            turnoverWon,
            turnoverLost,
            interception,
            looseBall,
            homePuckoutWonH1,
            homePuckoutLostH1,
            homePuckoutWonH2,
            homePuckoutLostH2,
            oppositionPuckoutWonH1,
            oppositionPuckoutLostH1,
            oppositionPuckoutWonH2,
            oppositionPuckoutLostH2,
            scoresFromPlayH1,
            shotsFromPlayH1,
            scoresFromPlayH2,
            shotsFromPlayH2,
            scoresFromFrees,
            shotsFromFrees,
            scoresFrom65s,
            shotsFrom65s,
            freesWon,
            freesConceded,
            yellowCards,
            redCards,
            gameId
        }
        gameLineOut{
            number,
            player{
                firstName,
                lastName
            }
        }
    }
}`

export const GAME_QUERY = gql`query gameQuery($id: ID!) {
    Game(where: {id: $id}){
        id,
        competition,
        opposition,
        venue,
        date,
        gameStatSummary {
            id,
            goalsForSelf,
            pointsForSelf,
            goalsForOpposition,
            pointsForOpposition,
            hookBlock,
            turnover,
            turnoverWon,
            turnoverLost,
            interception,
            looseBall,
            homePuckoutWonH1,
            homePuckoutLostH1,
            homePuckoutWonH2,
            homePuckoutLostH2,
            oppositionPuckoutWonH1,
            oppositionPuckoutLostH1,
            oppositionPuckoutWonH2,
            oppositionPuckoutLostH2,
            scoresFromPlayH1,
            shotsFromPlayH1,
            scoresFromPlayH2,
            shotsFromPlayH2,
            scoresFromFrees,
            shotsFromFrees,
            scoresFrom65s,
            shotsFrom65s,
            freesWon,
            freesConceded,
            yellowCards,
            redCards,
            gameId
        }
        gameLogs{
          id,
          team,
          playerNumber,
          playerName,
          stat,
          gameTimeMin,
          gameTimeSec,
          formattedTime,
          half,
          x,
          y
        }
        gameLineOut{
            number,
            player{
                firstName,
                lastName
            }
        }
    }
}`

export const GAME_UPDATE = gql`mutation ($id: ID!, $data: GameUpdateInput!) {
    updateGame(id: $id, data: $data ) {
        id,
        competition,
        opposition,
        venue,
        date,
        gameStatSummary {
            id,
            goalsForSelf,
            pointsForSelf,
            goalsForOpposition,
            pointsForOpposition,
            hookBlock,
            turnover,
            turnoverWon,
            turnoverLost,
            interception,
            looseBall,
            homePuckoutWonH1,
            homePuckoutLostH1,
            homePuckoutWonH2,
            homePuckoutLostH2,
            oppositionPuckoutWonH1,
            oppositionPuckoutLostH1,
            oppositionPuckoutWonH2,
            oppositionPuckoutLostH2,
            scoresFromPlayH1,
            shotsFromPlayH1,
            scoresFromPlayH2,
            shotsFromPlayH2,
            scoresFromFrees,
            shotsFromFrees,
            scoresFrom65s,
            shotsFrom65s,
            freesWon,
            freesConceded,
            yellowCards,
            redCards,
            gameId
        }
        gameLogs{
            id,
            team,
            playerNumber,
            playerName,
            stat,
            gameTimeMin,
            gameTimeSec,
            formattedTime,
            half
        }
    }
}`

export const GAME_DELETE = gql`mutation ($id: ID!) {
    deleteGame(id: $id){
        id
    }
}`

export const CREATE_GAME_LOG_MUTATION = gql`mutation ($data: GameLogCreateInput!) {
    createGameLog(data: $data ) {
        team,
        playerNumber,
        playerName,
        stat,
        gameTimeMin,
        gameTimeSec,
        formattedTime,
        half,
        gameId
    }
}`

export const CREATE_GAME_LOGS_MUTATION = gql`mutation ($data: [GameLogsCreateInput!]) {
    createGameLogs(data: $data ) {
        team,
        playerNumber,
        playerName,
        stat,
        gameTimeMin,
        gameTimeSec,
        formattedTime,
        half,
        gameId
    }
}`

export const ALL_GAME_LOGS_QUERY = gql`query AllGameLogs($id: ID!) {
    allGameLogs(where: {gameId: $id}, orderBy: "id_ASC") { 
        id,
        team,
        playerNumber,
        playerName,
        stat,
        gameTimeMin,
        gameTimeSec,
        formattedTime,
        half,
        gameId
    }
}`

export const GAMELOG_QUERY = gql`query gameLogQuery($id: ID!) {
    GameLog(where: {id: $id}){
        id,
        team,
        playerNumber,
        playerName,
        stat,
        gameTimeMin,
        gameTimeSec,
        formattedTime,
        half,
        gameId
    }
}`

export const GAMELOG_UPDATE = gql`mutation ($id: ID!, $data: GameLogUpdateInput!) {
    updateGameLog(id: $id, data: $data ) {
        id,
        team,
        playerNumber,
        playerName,
        stat,
        gameTimeMin,
        gameTimeSec,
        formattedTime,
        half,
        gameId
    }
}`

export const GAMELOGS_UPDATE = gql`mutation ($data: [GameLogsUpdateInput]) {
    updateGameLogs(data: $data ) {
        id,
        team,
        playerNumber,
        playerName,
        stat,
        gameTimeMin,
        gameTimeSec,
        formattedTime,
        half,
        gameId,
        x,
        y
    }
}`

export const GAMELOG_DELETE = gql`mutation ($id: ID!) {
    deleteGameLog(id: $id){
        id
    }
}`

export const GAMELOGS_DELETE = gql`mutation ($ids: [ID!]) {
    deleteGameLogs(ids: $ids){
        id
    }
}`

export const GAMESTATS_UPDATE = gql`mutation ($id: ID!, $data: GameStatSummaryUpdateInput!) {
    updateGameStatSummary(id: $id, data: $data ) {
        goalsForSelf,
        pointsForSelf,
        goalsForOpposition,
        pointsForOpposition,
        hookBlock,
        turnover,
        turnoverWon,
        turnoverLost,
        interception,
        looseBall,
        homePuckoutWonH1,
        homePuckoutLostH1,
        homePuckoutWonH2,
        homePuckoutLostH2,
        oppositionPuckoutWonH1,
        oppositionPuckoutLostH1,
        oppositionPuckoutWonH2,
        oppositionPuckoutLostH2,
        scoresFromPlayH1,
        shotsFromPlayH1,
        scoresFromPlayH2,
        shotsFromPlayH2,
        scoresFromFrees,
        shotsFromFrees,
        scoresFrom65s,
        shotsFrom65s,
        freesWon,
        freesConceded,
        yellowCards,
        redCards,
        gameId
    }
}`

export const GAMESTATSUMMARY_DELETE = gql`mutation ($id: ID!) {
    deleteGameStatSummary(id: $id){
        id
    }
}`

export const ALL_PLAYERS_QUERY = gql`query AllPlayers {
    allPlayers { 
        id,
        firstName,
        lastName
        }
}`

export const ALL_EVENTS_QUERY = gql`query AllEvents {
    allEvents { 
        id,
        eventType,
        dateTime,
        location,
        notes
    }
}`

export const CREATE_EVENT_MUTATION = gql`mutation ($data: EventCreateInput!) {
    createEvent(data: $data ) {
        id,
        eventType,
        dateTime,
        location,
        notes
    }
}`

export const UPDATE_EVENT_MUTATION = gql`mutation ($id: ID!, $data: EventUpdateInput!) {
    updateEvent(id: $id, data: $data ) {
        id,
        eventType,
        dateTime,
        location,
        notes
    }
}`

export const EVENT_QUERY = gql`query eventQuery($id: ID!) {
    Event(where: {id: $id}){
        id,
        eventType,
        dateTime,
        location,
        notes
    }
}`

export const EVENT_DELETE = gql`mutation ($id: ID!) {
    deleteEvent(id: $id){
        id
    }
}`

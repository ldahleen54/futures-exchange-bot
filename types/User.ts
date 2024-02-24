export interface User {
    inGameName: string
    discordId: string
    discordName: string
    settledBalance: number
}

export interface UserResult {
    UserId: number
    InGameName: string
    DiscordId: string
    DiscordName: string
    SettledBalance: number
    UnSettledBalance: number
    Frozen: number
}

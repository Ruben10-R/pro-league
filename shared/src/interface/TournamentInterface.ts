import {TournamentFormat} from '@shared/enum'
import {TournamentStatus} from '@shared/enum'

export interface ITournament {
    id: number
    name: string
    description: string | null
    gameType: string
    format: TournamentFormat
    status: TournamentStatus
    maxParticipants: number | null
    isTeamBased: boolean
    teamSize: number | null
    rules: string | null
    prizes: string | null
    registrationStart: string | null
    registrationEnd: string | null
    startDate: string | null
    endDate: string | null
    createdBy: number
    createdAt: string
    updatedAt: string
}

export interface ICreateTournamentDTO {
    name: string
    description?: string
    gameType: string
    format: TournamentFormat
    maxParticipants?: number
    isTeamBased: boolean
    teamSize?: number
    rules?: string
    prizes?: string
    registrationStart?: string
    registrationEnd?: string
    startDate?: string
    endDate?: string
}

export interface IUpdateTournamentDTO extends Partial<ICreateTournamentDTO> {
    status?: TournamentStatus
}


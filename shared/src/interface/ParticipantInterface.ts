import { ParticipantStatus } from '../enum'

export interface ITournamentParticipant {
  id: number
  tournamentId: number
  userId: number | null
  teamId: number | null
  seed: number | null
  status: ParticipantStatus
  registeredAt: string
  createdAt: string
  updatedAt: string
}

export interface IRegisterParticipantDTO {
  tournamentId: number
  userId?: number
  teamId?: number
}

export interface IUpdateParticipantDTO {
  seed?: number
  status?: ParticipantStatus
}


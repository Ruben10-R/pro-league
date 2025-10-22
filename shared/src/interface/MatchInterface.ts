import { MatchStatus } from '../enum'

export interface IMatch {
  id: number
  tournamentId: number
  round: number
  bracketPosition: string | null
  participant1Id: number | null
  participant2Id: number | null
  winnerId: number | null
  participant1Score: number | null
  participant2Score: number | null
  status: MatchStatus
  scheduledAt: string | null
  startedAt: string | null
  completedAt: string | null
  location: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface ICreateMatchDTO {
  tournamentId: number
  round: number
  bracketPosition?: string
  participant1Id?: number
  participant2Id?: number
  scheduledAt?: string
  location?: string
  notes?: string
}

export interface IUpdateMatchDTO extends Partial<ICreateMatchDTO> {
  winnerId?: number
  participant1Score?: number
  participant2Score?: number
  status?: MatchStatus
  startedAt?: string
  completedAt?: string
}


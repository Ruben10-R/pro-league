export interface ITeam {
  id: number
  name: string
  description: string | null
  logoUrl: string | null
  captainId: number | null
  createdAt: string
  updatedAt: string
}

export interface ICreateTeamDTO {
  name: string
  description?: string
  logoUrl?: string
}

export interface IUpdateTeamDTO extends Partial<ICreateTeamDTO> {
  captainId?: number
}


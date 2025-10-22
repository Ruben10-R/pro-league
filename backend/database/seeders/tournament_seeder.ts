import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Tournament from '#models/tournament'
import Team from '#models/team'
import TournamentParticipant from '#models/tournament_participant'
import Match from '#models/match'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    // Create users
    const users = await User.createMany([
      {
        fullName: 'John Organizer',
        email: 'organizer@proleague.com',
        password: 'password123',
      },
      {
        fullName: 'Alice Player',
        email: 'alice@proleague.com',
        password: 'password123',
      },
      {
        fullName: 'Bob Player',
        email: 'bob@proleague.com',
        password: 'password123',
      },
      {
        fullName: 'Charlie Player',
        email: 'charlie@proleague.com',
        password: 'password123',
      },
      {
        fullName: 'Diana Player',
        email: 'diana@proleague.com',
        password: 'password123',
      },
    ])

    const [organizer, alice, bob, charlie, diana] = users

    // Create an individual tournament
    const fifaTournament = await Tournament.create({
      name: 'FIFA 24 Championship',
      description: 'Annual FIFA tournament for the best players',
      gameType: 'FIFA 24',
      format: 'single_elimination',
      status: 'registration_open',
      maxParticipants: 8,
      isTeamBased: false,
      rules: '1. Best of 3 matches\n2. No pausing allowed\n3. Standard settings',
      prizes: '1st: $1000, 2nd: $500, 3rd: $250',
      registrationStart: DateTime.now().minus({ days: 7 }),
      registrationEnd: DateTime.now().plus({ days: 7 }),
      startDate: DateTime.now().plus({ days: 14 }),
      endDate: DateTime.now().plus({ days: 21 }),
      createdBy: organizer.id,
    })

    // Create a team-based tournament
    const lolTournament = await Tournament.create({
      name: 'League of Legends Spring Split',
      description: '5v5 competitive tournament',
      gameType: 'League of Legends',
      format: 'double_elimination',
      status: 'registration_open',
      maxParticipants: 8,
      isTeamBased: true,
      teamSize: 5,
      rules: '1. Draft pick mode\n2. Standard tournament realm settings',
      prizes: '1st: $5000, 2nd: $2500, 3rd: $1000',
      registrationStart: DateTime.now().minus({ days: 3 }),
      registrationEnd: DateTime.now().plus({ days: 10 }),
      startDate: DateTime.now().plus({ days: 20 }),
      endDate: DateTime.now().plus({ days: 30 }),
      createdBy: organizer.id,
    })

    // Create teams
    const team1 = await Team.create({
      name: 'Thunder Gaming',
      description: 'Professional esports team',
      captainId: alice.id,
    })

    await team1.related('members').attach({
      [alice.id]: {
        role: 'captain',
        joined_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
        created_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
        updated_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
      },
      [bob.id]: {
        role: 'member',
        joined_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
        created_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
        updated_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
      },
    })

    const team2 = await Team.create({
      name: 'Phoenix Squad',
      description: 'Rising stars in competitive gaming',
      captainId: charlie.id,
    })

    await team2.related('members').attach({
      [charlie.id]: {
        role: 'captain',
        joined_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
        created_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
        updated_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
      },
      [diana.id]: {
        role: 'member',
        joined_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
        created_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
        updated_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
      },
    })

    // Register individual players for FIFA tournament
    const participant1 = await TournamentParticipant.create({
      tournamentId: fifaTournament.id,
      userId: alice.id,
      registeredAt: DateTime.now(),
      status: 'confirmed',
      seed: 1,
    })

    const participant2 = await TournamentParticipant.create({
      tournamentId: fifaTournament.id,
      userId: bob.id,
      registeredAt: DateTime.now(),
      status: 'confirmed',
      seed: 2,
    })

    const participant3 = await TournamentParticipant.create({
      tournamentId: fifaTournament.id,
      userId: charlie.id,
      registeredAt: DateTime.now(),
      status: 'confirmed',
      seed: 3,
    })

    const participant4 = await TournamentParticipant.create({
      tournamentId: fifaTournament.id,
      userId: diana.id,
      registeredAt: DateTime.now(),
      status: 'confirmed',
      seed: 4,
    })

    // Register teams for LoL tournament
    await TournamentParticipant.create({
      tournamentId: lolTournament.id,
      teamId: team1.id,
      registeredAt: DateTime.now(),
      status: 'confirmed',
      seed: 1,
    })

    await TournamentParticipant.create({
      tournamentId: lolTournament.id,
      teamId: team2.id,
      registeredAt: DateTime.now(),
      status: 'confirmed',
      seed: 2,
    })

    // Create some matches for FIFA tournament
    await Match.create({
      tournamentId: fifaTournament.id,
      round: 1,
      bracketPosition: 'semifinal-1',
      participant1Id: participant1.id,
      participant2Id: participant2.id,
      status: 'scheduled',
      scheduledAt: DateTime.now().plus({ days: 14 }),
    })

    await Match.create({
      tournamentId: fifaTournament.id,
      round: 1,
      bracketPosition: 'semifinal-2',
      participant1Id: participant3.id,
      participant2Id: participant4.id,
      status: 'scheduled',
      scheduledAt: DateTime.now().plus({ days: 14, hours: 2 }),
    })

    console.log('✅ Database seeded successfully!')
    console.log('📧 Test users created:')
    console.log('   - organizer@proleague.com (Tournament Organizer)')
    console.log('   - alice@proleague.com (Player)')
    console.log('   - bob@proleague.com (Player)')
    console.log('   - charlie@proleague.com (Player)')
    console.log('   - diana@proleague.com (Player)')
    console.log('🔑 All passwords: password123')
  }
}


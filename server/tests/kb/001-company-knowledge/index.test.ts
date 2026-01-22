import { describe, it, expect, beforeAll } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('KB 001: Company Knowledge', () => {
  let userId: string
  let cianId: string
  let leaderId: string

  beforeAll(async () => {
    // Create test user
    const user = await prisma.user.create({
      data: {
        username: 'kb-test-user',
        email: 'kb-test@example.com',
      },
    })
    userId = user.id
  })

  describe('Data Loading', () => {
    it('should create concepts', async () => {
      // Create concepts
      const cian = await prisma.kBConcept.create({
        data: {
          type: 'organization',
          name: 'Renault',
          createdById: userId,
        },
      })
      cianId = cian.id

      const leader = await prisma.kBConcept.create({
        data: {
          type: 'position',
          name: 'Market Leader',
          createdById: userId,
        },
      })
      leaderId = leader.id

      expect(cian.type).toBe('organization')
      expect(leader.type).toBe('position')
    })

    it('should create labels for cian', async () => {
      const labels = await prisma.kBLabel.createMany({
        data: [
          {
            conceptId: cianId,
            text: 'Renault',
            language: 'fr',
            role: 'primary',
            createdById: userId,
          },
          {
            conceptId: cianId,
            text: 'Renault SA',
            language: 'en',
            role: 'primary',
            createdById: userId,
          },
          {
            conceptId: cianId,
            text: 'Regie Nationale',
            language: 'fr',
            role: 'alias',
            createdById: userId,
          },
        ],
      })

      expect(labels.count).toBe(3)

      const allLabels = await prisma.kBLabel.findMany({
        where: { conceptId: cianId },
      })
      expect(allLabels).toHaveLength(3)
    })

    it('should create facts with participations', async () => {
      // Fact 1: Renault is market leader (2012-2015)
      const fact1 = await prisma.kBFact.create({
        data: {
          type: 'market_position',
          statement: 'Renault holds market leader position',
          validFrom: new Date('2012-01-01'),
          validTo: new Date('2015-12-31'),
          confidence: 0.9,
          status: 'verified',
          source: 'annual_report_2016',
          createdById: userId,
          Participations: {
            create: [
              { conceptId: cianId, role: 'subject', localImportance: 0.8 },
              { conceptId: leaderId, role: 'object', localImportance: 0.3 },
            ],
          },
        },
      })

      // Fact 2: Renault is market leader (2016-2020)
      const fact2 = await prisma.kBFact.create({
        data: {
          type: 'market_position',
          statement: 'Renault holds market leader position',
          validFrom: new Date('2016-01-01'),
          validTo: new Date('2020-12-31'),
          confidence: 0.85,
          status: 'verified',
          source: 'market_analysis_2021',
          createdById: userId,
          Participations: {
            create: [
              { conceptId: cianId, role: 'subject', localImportance: 0.7 },
              { conceptId: leaderId, role: 'object', localImportance: 0.3 },
            ],
          },
        },
      })

      // Fact 3: Renault market share 25% (2020)
      const fact3 = await prisma.kBFact.create({
        data: {
          type: 'market_share',
          statement: 'Renault has 25% market share',
          validFrom: new Date('2020-01-01'),
          validTo: new Date('2020-12-31'),
          confidence: 0.7,
          status: 'tentative',
          source: 'industry_report',
          createdById: userId,
          Participations: {
            create: [
              {
                conceptId: cianId,
                role: 'subject',
                value: '25%',
                localImportance: 0.6,
              },
            ],
          },
        },
      })

      expect(fact1.confidence).toBe(0.9)
      expect(fact2.confidence).toBe(0.85)
      expect(fact3.statement).toContain('25%')
    })
  })

  describe('Queries', () => {
    it('should get all facts about company sorted by validFrom', async () => {
      const facts = await prisma.kBFact.findMany({
        where: {
          Participations: {
            some: { conceptId: cianId, role: 'subject' },
          },
        },
        orderBy: { validFrom: 'asc' },
      })

      expect(facts).toHaveLength(3)
      expect(facts[0].validFrom?.getFullYear()).toBe(2012)
      expect(facts[1].validFrom?.getFullYear()).toBe(2016)
      expect(facts[2].validFrom?.getFullYear()).toBe(2020)
    })

    it('should get facts active on specific date (2018-01-01)', async () => {
      const targetDate = new Date('2018-01-01')

      const facts = await prisma.kBFact.findMany({
        where: {
          Participations: {
            some: { conceptId: cianId },
          },
          validFrom: { lte: targetDate },
          validTo: { gte: targetDate },
        },
      })

      expect(facts).toHaveLength(1)
      expect(facts[0].type).toBe('market_position')
      expect(facts[0].validFrom?.getFullYear()).toBe(2016)
    })

    it('should get facts with confidence >= 0.8', async () => {
      const facts = await prisma.kBFact.findMany({
        where: {
          Participations: {
            some: { conceptId: cianId },
          },
          confidence: { gte: 0.8 },
        },
        orderBy: { confidence: 'desc' },
      })

      expect(facts).toHaveLength(2)
      expect(facts[0].confidence).toBe(0.9)
      expect(facts[1].confidence).toBe(0.85)
    })

    it('should get concept with all labels and fact participations', async () => {
      const concept = await prisma.kBConcept.findUnique({
        where: { id: cianId },
        include: {
          Labels: true,
          FactParticipations: {
            include: { Fact: true },
            orderBy: { Fact: { validFrom: 'asc' } },
          },
        },
      })

      expect(concept).not.toBeNull()
      expect(concept?.type).toBe('organization')
      expect(concept?.Labels).toHaveLength(3)
      expect(concept?.FactParticipations).toHaveLength(3)

      // Check labels
      const primaryLabels = concept?.Labels.filter((l) => l.role === 'primary')
      expect(primaryLabels).toHaveLength(2)

      // Check facts order
      expect(concept?.FactParticipations[0].Fact.validFrom?.getFullYear()).toBe(
        2012,
      )
    })
  })
})

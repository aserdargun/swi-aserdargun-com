import { describe, expect, it } from 'vitest'
import { catalog } from '@/research/raw-content'
import { buildSearchDocuments, parseExploreState, searchEntities, serializeExploreState } from '@/research/search'

const en = () => buildSearchDocuments(catalog, 'en')
const tr = () => buildSearchDocuments(catalog, 'tr')

describe('localized catalog search', () => {
  it.each([
    ['en', 'ANTS', 'ant'], ['tr', 'karınca', 'ant'], ['tr', 'KARINCA', 'ant'],
    ['tr', 'KARİNCA', 'ant'], ['en', 'stigmergy', 'stigmergy'],
    ['tr', 'STİGMERJİ', 'stigmergy'], ['tr', 'stigmerji', 'stigmergy'],
    ['en', 'pheromone', 'stigmergy'], ['tr', 'feromon', 'stigmergy'],
  ] as const)('finds %s %s through localized indexed content', (locale, query, id) => {
    expect(searchEntities(locale === 'en' ? en() : tr(), query, [])[0]?.entityId).toBe(id)
  })

  it('filters types before ranking and returns no matches for absent types', () => {
    expect(searchEntities(en(), 'pheromone', ['algorithm']).map(result => result.entityId)).toEqual(['ant-colony-optimization'])
    expect(searchEntities(en(), '', ['robotics-system'])).toEqual([])
  })

  it('keeps empty results in the first-chain order and query ties independent of input order', () => {
    expect(searchEntities(en(), '  ', []).map(result => result.entityId)).toEqual(['ant', 'stigmergy', 'ant-colony-optimization', 'artificial-agent-coordination'])
    expect(searchEntities(en(), 'environment', []).map(result => result.entityId)).toEqual(searchEntities(en().reverse(), 'environment', []).map(result => result.entityId))
  })

  it('ranks exact title before prefixes, tokens, topics and body matches', () => {
    expect(searchEntities(en(), 'ant', []).map(result => result.entityId).slice(0, 2)).toEqual(['ant', 'ant-colony-optimization'])
    expect(searchEntities(en(), 'optimization', [])[0]?.entityId).toBe('ant-colony-optimization')
    expect(searchEntities(en(), 'no-such-result', [])).toEqual([])
  })

  it('uses topics, claims and related titles without adding foreign-language content', () => {
    expect(searchEntities(en(), 'probabilistic', [])[0]?.entityId).toBe('ant-colony-optimization')
    expect(searchEntities(en(), 'Nature', []).map(result => result.entityId)).toEqual(['stigmergy', 'ant'])
    expect(searchEntities(en(), 'Stigmergy', ['species'])[0]?.entityId).toBe('ant')
    expect(searchEntities(en(), 'karınca', [])).toEqual([])
  })
})

describe('Explore URL contract', () => {
  it('drops unknown types/parameters, deduplicates and sorts types, trims query whitespace', () => {
    const state = parseExploreState(new URLSearchParams('type=species&type=bogus&type=algorithm,species&q=++Ant+++colony++&junk=1'))
    expect(state).toEqual({ query: 'Ant colony', types: ['algorithm', 'species'] })
    expect(serializeExploreState(state)).toBe('q=Ant+colony&type=algorithm&type=species')
  })
  it('omits empty defaults and round-trips Turkish and reserved text without double encoding', () => {
    expect(serializeExploreState({ query: '   ', types: [] })).toBe('')
    expect(parseExploreState(new URLSearchParams('type=species%3Balgorithm&q=%26+kar%C4%B1nca'))).toEqual({ query: '& karınca', types: [] })
    expect(serializeExploreState({ query: '& karınca', types: [] })).toBe('q=%26+kar%C4%B1nca')
  })
})

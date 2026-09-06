import { describe, expect, it } from 'vitest'
import { dossiers, studies } from '@/research/workbench'
import { validateWorkbench } from '@/research/workbench-schema'
import { buildRecipePackage, RecipeConfigSchema, recipeMarkdown } from '@/research/recipe'

describe('research to experiment contracts',()=>{
  it('resolves every source and dossier in both directions',()=>{
    expect(()=>validateWorkbench(studies,dossiers)).not.toThrow()
    for(const study of studies) for(const id of study.dossierIds) {
      expect(dossiers.find(dossier=>dossier.id===id)?.studyIds).toContain(study.id)
    }
    const broken=structuredClone(dossiers)
    broken[0]!.studyIds.push('missing-source')
    expect(()=>validateWorkbench(studies,broken)).toThrow('unknown study')
  })
  it.each(dossiers.map(dossier=>[dossier.id,dossier] as const))('%s exports the exact task and bounded roster in both languages',(_,dossier)=>{
    for(const locale of ['tr','en'] as const) for(const agents of [3,7,32]) {
      const pkg=buildRecipePackage(dossier,studies.filter(study=>dossier.studyIds.includes(study.id)),locale,{task:'  Evaluate the supplied task using its acceptance tests.  ',agents,rounds:5,tokenBudget:12001})
      expect(pkg.task).toBe('Evaluate the supplied task using its acceptance tests.')
      expect(pkg.agents).toHaveLength(agents)
      expect(new Set(pkg.agents.map(agent=>agent.id)).size).toBe(agents)
      expect(new Set(pkg.agents.map(agent=>agent.role)).size).toBe(3)
      expect(pkg.agents.reduce((total,agent)=>total+agent.tokenCap,0)).toBe(12001)
      expect(pkg.budget).toMatchObject({scope:'entire-swarm',aggregateTokenLimit:12001,roundLimit:5,agentCount:agents,enforcement:'host-orchestrator-required'})
      expect(pkg.experiment.controls).toEqual(['single-agent','independent-parallel','coordinated-swarm'])
      expect(pkg.experiment.result).toBeNull()
      expect(pkg.executionStatus).toBe('not-executed')
      expect(pkg.biology.boundary).toBe(dossier.boundary[locale])
      const md=recipeMarkdown(pkg)
      expect(md).toContain(pkg.task)
      expect(md).toContain('12001')
      expect(md).toContain(dossier.protocol.ablation[locale])
      for(const source of pkg.sources) expect(md).toContain(source.url)
      expect(JSON.parse(JSON.stringify(pkg))).toEqual(pkg)
    }
  })
  it('rejects fractional, absent and excessive configuration values',()=>{
    const valid={task:'A concrete research task',agents:6,rounds:3,tokenBudget:12000}
    for(const invalid of [{task:'short'},{agents:2},{agents:33},{agents:4.5},{rounds:0},{rounds:13},{tokenBudget:999},{tokenBudget:1_000_001},{tokenBudget:NaN}]) {
      expect(RecipeConfigSchema.safeParse({...valid,...invalid}).success).toBe(false)
    }
  })
})

import type { Relationship } from '@/research/schema'

export interface GraphNode { readonly id: string; readonly label: string; readonly type: string; readonly href: string }
export interface GraphEdge { readonly id: string; readonly source: string; readonly target: string; readonly label: string; readonly inverseLabel: string; readonly status: Relationship['status']; readonly statusLabel: string; readonly note: string }
export interface KnowledgeGraph { readonly nodes: readonly GraphNode[]; readonly edges: readonly GraphEdge[] }
export interface GraphNeighbor { readonly node: GraphNode; readonly edge: GraphEdge; readonly label: string; readonly direction: 'incoming' | 'outgoing' }

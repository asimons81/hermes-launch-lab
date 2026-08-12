export type ProjectProof = {
  name: string
  category: string
  description: string
  tags: string[]
  sourceUrl: string
  image: string
  imageAlt: string
}

// These are intentionally static, source-backed records. Do not add live GitHub
// metrics here: stars, releases, and activity counts become stale public claims.
export const projectProof: ProjectProof[] = [
  {
    name: 'Hermes Vault',
    category: 'CREDENTIAL CONTROL',
    description: 'A Hermes-native local-first credential broker, scanner, and encrypted vault for agent workflows.',
    tags: ['Local-first', 'Credential controls', 'Encrypted vault'],
    sourceUrl: 'https://github.com/asimons81/hermes-vault',
    image: '/media/projects/hermes-vault.jpg',
    imageAlt: 'Hermes Vault project visual',
  },
  {
    name: 'NexusOS',
    category: 'DURABLE CONTEXT',
    description: 'A local-first context and memory environment for durable agent work.',
    tags: ['Local-first', 'Agent memory', 'Context'],
    sourceUrl: 'https://github.com/asimons81/nexusos',
    image: '/media/projects/nexusos.jpg',
    imageAlt: 'NexusOS project visual',
  },
  {
    name: 'Hardproof',
    category: 'VERIFICATION',
    description: 'A persistent, risk-aware engineering protocol for Hermes Agent that requires evidence before work is called done.',
    tags: ['Evidence', 'Risk-aware', 'Verification'],
    sourceUrl: 'https://github.com/asimons81/hardproof',
    image: '/media/projects/hardproof.jpg',
    imageAlt: 'Hardproof project visual',
  },
]

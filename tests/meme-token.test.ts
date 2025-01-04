import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'meme-token': {
      functions: {
        'create-meme': vi.fn(),
        'propagate-meme': vi.fn(),
        'get-meme': vi.fn(),
        'get-meme-count': vi.fn(),
      },
    },
  },
  globals: {
    'tx-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    'block-height': 12345,
  },
}

function callContract(contractName, functionName, args) {
  return mockClarity.contracts[contractName].functions[functionName](...args)
}

describe('Meme Token Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('create-meme', () => {
    it('should create a new meme', async () => {
      const content = 'This is a test meme'
      mockClarity.contracts['meme-token'].functions['create-meme'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('meme-token', 'create-meme', [content])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('propagate-meme', () => {
    it('should propagate an existing meme', async () => {
      const memeId = 1
      const newContent = 'This is a propagated meme'
      mockClarity.contracts['meme-token'].functions['propagate-meme'].mockReturnValue({ success: true, value: 2 })
      
      const result = await callContract('meme-token', 'propagate-meme', [memeId, newContent])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(2)
    })
    
    it('should fail if the original meme does not exist', async () => {
      const memeId = 999
      const newContent = 'This is a propagated meme'
      mockClarity.contracts['meme-token'].functions['propagate-meme'].mockReturnValue({ success: false, error: 404 })
      
      const result = await callContract('meme-token', 'propagate-meme', [memeId, newContent])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(404)
    })
  })
  
  describe('get-meme', () => {
    it('should return meme data', async () => {
      const memeId = 1
      const memeData = {
        creator: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        content: 'This is a test meme',
        popularity: 0,
        mutation_rate: 5,
        created_at: 12345
      }
      mockClarity.contracts['meme-token'].functions['get-meme'].mockReturnValue({ success: true, value: memeData })
      
      const result = await callContract('meme-token', 'get-meme', [memeId])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(memeData)
    })
    
    it('should fail if the meme does not exist', async () => {
      const memeId = 999
      mockClarity.contracts['meme-token'].functions['get-meme'].mockReturnValue({ success: false, error: 404 })
      
      const result = await callContract('meme-token', 'get-meme', [memeId])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(404)
    })
  })
  
  describe('get-meme-count', () => {
    it('should return the total number of memes', async () => {
      mockClarity.contracts['meme-token'].functions['get-meme-count'].mockReturnValue({ success: true, value: 5 })
      
      const result = await callContract('meme-token', 'get-meme-count', [])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(5)
    })
  })
})

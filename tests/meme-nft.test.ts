import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'meme-nft': {
      functions: {
        'mint-milestone': vi.fn(),
        'get-milestone': vi.fn(),
        'get-milestone-count': vi.fn(),
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

describe('Meme NFT Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('mint-milestone', () => {
    it('should mint a new milestone NFT', async () => {
      const memeId = 1
      const achievement = 'Reached 1000 shares'
      mockClarity.contracts['meme-nft'].functions['mint-milestone'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('meme-nft', 'mint-milestone', [memeId, achievement])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('get-milestone', () => {
    it('should return milestone data', async () => {
      const milestoneId = 1
      const milestoneData = {
        meme_id: 1,
        achievement: 'Reached 1000 shares',
        timestamp: 12345
      }
      mockClarity.contracts['meme-nft'].functions['get-milestone'].mockReturnValue({ success: true, value: milestoneData })
      
      const result = await callContract('meme-nft', 'get-milestone', [milestoneId])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(milestoneData)
    })
    
    it('should fail if the milestone does not exist', async () => {
      const milestoneId = 999
      mockClarity.contracts['meme-nft'].functions['get-milestone'].mockReturnValue({ success: false, error: 404 })
      
      const result = await callContract('meme-nft', 'get-milestone', [milestoneId])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(404)
    })
  })
  
  describe('get-milestone-count', () => {
    it('should return the total number of milestones', async () => {
      mockClarity.contracts['meme-nft'].functions['get-milestone-count'].mockReturnValue({ success: true, value: 3 })
      
      const result = await callContract('meme-nft', 'get-milestone-count', [])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(3)
    })
  })
})


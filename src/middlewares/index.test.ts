import { describe, expect, it } from '@jest/globals'
import type express from 'express'
import lodash from 'lodash'
import { isAuthenticated, isOwner } from './index'

/** Mocking express-like objects */
function createMockRequest(
  id: string,
  userId: string,
  body?: { sessionToken?: string }
) {
  return {
    params: { id },
    identity: { _id: userId },
    get: () => {}, // add a mock get method
    header: () => {}, // add a mock header method
    accepts: () => {}, // add a mock accepts method
    // add other missing properties and methods...
  } as unknown as express.Request // cast the object to Express Request type
}

interface MockResponse extends express.Response {
  statusSent: boolean
}

function createMockResponse() {
  const mockResponse = {
    statusSent: false,
    statusCode: 0,
    status: (statusCode: number) => {
      mockResponse.statusSent = true
      mockResponse.statusCode = statusCode
      return mockResponse
    },
    sendStatus: (statusCode: number) => {
      mockResponse.statusSent = true
      mockResponse.statusCode = statusCode
      return mockResponse
    },
    // add other required properties and methods...
  } as unknown as MockResponse
  return mockResponse
}

describe('isOwner', () => {
  it('should call next() when currentUserId matches params.id', async () => {
    const req = createMockRequest('123', '123')
    const res = createMockResponse()
    let nextCalled = false

    const next = () => {
      nextCalled = true
    }

    await isOwner(req, res, next)

    expect(nextCalled).toBe(true)
    expect(res.statusSent).toBe(false)
  })

  it('should call sendStatus(403) when currentUserId does not match params.id', async () => {
    const req = createMockRequest('123', '456')
    const res = createMockResponse()
    let nextCalled = false

    const next = () => {
      nextCalled = true
    }

    await isOwner(req, res, next)

    expect(nextCalled).toBe(false)
    expect(res.statusCode).toBe(403)
  })

  it('should return 400 status code if an error occurs', async () => {
    const req = createMockRequest('123', '456')
    const res = createMockResponse()
    const next = () => {
      // do nothing
    }

    // Mock the get function to throw an error
    jest.spyOn(lodash, 'get').mockImplementationOnce(() => {
      throw new Error('Mock error')
    })

    await isOwner(req, res, next)

    expect(res.statusSent).toBe(true)
    expect(res.statusCode).toBe(400)
  })
})

describe('isAuthenticated', () => {
  it.skip('should call next() when sessionToken is present', async () => {
    const req = createMockRequest('123', '456', {
      sessionToken: 'some-token-value',
    })
    const res = createMockResponse()
    let nextCalled = false

    const next = () => {
      nextCalled = true
    }

    await isAuthenticated(req, res, next)

    expect(nextCalled).toBe(true)
    expect(res.statusSent).toBe(false)
  })

  it.skip('should call sendStatus(403) when sessionToken is not present', async () => {
    const req = createMockRequest('123', '456')
    const res = createMockResponse()
    let nextCalled = false

    const next = () => {
      nextCalled = false
    }

    await isAuthenticated(req, res, next)

    expect(nextCalled).toBe(false)
    expect(res.statusCode).toBe(403)
  })
})

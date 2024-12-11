import type express from 'express'
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { isOwner } from './index'

/** Mocking express-like objects */
function createMockRequest(id: string, userId: string) {
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
  return {
    status: (statusCode: number) => {
      this.statusSent = statusCode
      return this
    },
    send: (_body: unknown) => {
      // implementation
    },
    json: (_body: unknown) => {
      // implementation
    },
    // add other required properties and methods...
    statusSent: false,
  } as unknown as MockResponse
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

    assert.equal(nextCalled, true, 'next() was not called')
    assert.equal(
      res.statusSent,
      false,
      'sendStatus() should not have been called'
    )
  })

  it('should call sendStatus(403) when currentUserId does not match params.id', async () => {
    const req = createMockRequest('123', '456')
    const res = createMockResponse()
    let nextCalled = false

    const next = () => {
      nextCalled = true
    }

    await isOwner(req, res, next)

    assert.equal(nextCalled, false, 'next() should not have been called')
    assert.equal(res.statusSent, true, 'sendStatus() was not called')
  })
})

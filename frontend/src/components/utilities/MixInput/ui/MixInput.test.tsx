import { type MixInputValue } from 'react-mix-tag-input'

import { cleanup } from '@testing-library/react'
import { mappedToMixInput, mixInputToMapped } from '@utilities/MixInput/helpers/mixInputHelpers'
import { beforeEach, describe, expect, it } from 'vitest'

const mixInputValue: MixInputValue[] = [
  'hello',
  { type: 'tag', label: 'uppercase(', data: { tagType: 'function', slug: 'uppercase' } },
  'Bangladesh',
  { type: 'tag', label: 'lowercase(', data: { tagType: 'function', slug: 'lowercase' } },
  'Bangladesh',
  { type: 'tag', label: 'replace(', data: { tagType: 'function', slug: 'replace' } },
  'hi',
  { type: 'tag', label: ')', data: { tagType: 'operator', value: ')' } },
  'Bangladesh',
  { type: 'tag', label: ')', data: { tagType: 'operator', value: ')' } },
  { type: 'tag', label: ')', data: { tagType: 'operator', value: ')' } },
  'world',
  { type: 'tag', label: 'pi', data: { tagType: 'common-variable', slug: 'pi', dType: 'number' } },
  {
    type: 'tag',
    label: 'first_name',
    data: { tagType: 'variable', nodeId: '1-1', path: 'name.first_name', dType: 'string' }
  }
]

const structuredValue: MappedValueType[] = [
  {
    type: 'string',
    value: 'hello'
  },
  {
    type: 'function',
    slug: 'uppercase',
    args: [
      {
        type: 'string',
        value: 'Bangladesh'
      },
      {
        type: 'function',
        slug: 'lowercase',
        args: [
          {
            type: 'string',
            value: 'Bangladesh'
          },
          {
            type: 'function',
            slug: 'replace',
            args: [
              {
                type: 'string',
                value: 'hi'
              }
            ]
          },
          {
            type: 'string',
            value: 'Bangladesh'
          }
        ]
      }
    ]
  },
  {
    type: 'string',
    value: 'world'
  },
  {
    type: 'common-variable',
    label: 'pi',
    slug: 'pi',
    dType: 'number'
  },
  {
    type: 'variable',
    nodeId: '1-1',
    label: 'first_name',
    path: 'name.first_name',
    dType: 'string'
  }
]

describe('test mix input structured value', () => {
  beforeEach(cleanup)

  it('mix input value to structured data', () => {
    const newValue = mixInputToMapped(mixInputValue)
    expect(structuredValue).toEqual(newValue)
  })

  it('structured data to mix input value', () => {
    const newValue = mappedToMixInput(structuredValue)
    expect(mixInputValue).toEqual(newValue)
  })
})

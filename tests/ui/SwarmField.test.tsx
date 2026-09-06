import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { SwarmField } from '@/ui/SwarmField'

beforeEach(() => {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} }))
  Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' })
})
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

it('pauses on user command and while the document is hidden, then resumes only when permitted', () => {
  const { container } = render(<SwarmField locale="en" />)
  const field = container.firstElementChild!
  expect(field).toHaveAttribute('data-running', 'true')
  fireEvent.click(screen.getByRole('button', { name: 'Pause motion' }))
  expect(field).toHaveAttribute('data-running', 'false')
  fireEvent.click(screen.getByRole('button', { name: 'Resume motion' }))
  expect(field).toHaveAttribute('data-running', 'true')
  Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' })
  act(() => document.dispatchEvent(new Event('visibilitychange')))
  expect(field).toHaveAttribute('data-running', 'false')
})

it('keeps reduced-motion content static and its decorative art inaccessible', () => {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduced-motion'), media: query, addEventListener() {}, removeEventListener() {} }))
  const { container } = render(<SwarmField locale="tr" />)
  expect(container.firstElementChild).toHaveAttribute('data-running', 'false')
  expect(screen.queryByRole('button')).not.toBeInTheDocument()
  expect(screen.getByText('Hareket duraklatıldı')).toBeVisible()
  expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
})

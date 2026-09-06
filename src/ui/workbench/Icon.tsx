import type { SVGProps } from 'react'

const paths = {
  home: 'm3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9',
  book: 'M12 5v16M12 5C8 2 5 3 2 4v16c4-2 7-2 10 1 3-3 6-3 10-1V4c-3-1-6-2-10 1Z',
  search: 'M21 21l-6-6M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z',
  flask: 'M9 3h6M10 3v7L4 20q-1 1 1 1h14q2 0 1-1l-6-10V3M8 15h8M9 18h1m4-1h1',
  calendar: 'M4 5h16v16H4V5Zm0 5h16M8 2v6m8-6v6',
  network: 'M12 10V5m-2 8-5 4m9-4 5 4M14 11l5-5M10 11 5 6M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM14 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM5 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm18 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM5 19a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm18 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z',
  method: 'M9 3h6l1 4 4 1v6l-4 1-1 4H9l-1-4-4-1V8l4-1 1-4Zm6 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  arrow: 'M3 12h18m-7-7 7 7-7 7',
  download: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
  upload: 'M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5',
  plus: 'M12 4v16M4 12h16',
  check: 'm5 12 4 4L19 6',
  external: 'M14 3h7v7M21 3 10 14M10 4H4v16h16v-6',
  chevron: 'm9 5 7 7-7 7',
  document: 'M5 2h9l5 5v15H5V2Zm9 0v6h5M8 12h8M8 16h8',
} as const
export type IconName = keyof typeof paths
export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name]} /></svg>
}

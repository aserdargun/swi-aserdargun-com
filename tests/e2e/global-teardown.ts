import { execFileSync } from 'node:child_process'
export default function teardown() { execFileSync('npm', ['run', 'preview:stop'], { stdio: 'inherit' }) }

import { execFileSync } from 'node:child_process'
export default function setup() {
  if (process.env.SWI_EXPORT_READY !== '1') execFileSync('npm', ['run', 'build'], { stdio: 'inherit' })
  execFileSync('npm', ['run', 'preview:start'], { stdio: 'inherit' })
}

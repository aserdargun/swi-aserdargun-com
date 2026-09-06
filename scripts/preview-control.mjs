import { spawn, execFileSync } from 'node:child_process'
import { createServer } from 'node:http'
import { readFile, writeFile, mkdir, unlink, realpath, stat } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const cwd = await realpath(resolve(fileURLToPath(new URL('..', import.meta.url))))
const script = fileURLToPath(import.meta.url)
const statePath = resolve(cwd, '.codex/runtime/preview.json')
const port = Number(process.env.SWI_PREVIEW_PORT || 4173)
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('SWI_PREVIEW_PORT must be an integer from 1024 through 65535')
const origin = `http://127.0.0.1:${port}`
const delay = ms => new Promise(done => setTimeout(done, ms))
async function state() { try { return JSON.parse(await readFile(statePath, 'utf8')) } catch (error) { if (error.code === 'ENOENT') return null; throw error } }
function alive(pid) { if (!Number.isInteger(pid) || pid < 2) throw new Error('Invalid recorded PID; refusing process operations'); try { process.kill(pid, 0); return true } catch (error) { if (error.code === 'ESRCH') return false; throw error } }
async function owned(record) {
  if (!record || record.cwd !== cwd || !Number.isInteger(record.pid) || record.pid < 2 || record.command !== `${process.execPath} ${script} serve`) return false
  if (!alive(record.pid)) return false
  let liveCwd
  if (process.platform === 'linux') liveCwd = await realpath(`/proc/${record.pid}/cwd`)
  else {
    const output = execFileSync('/usr/sbin/lsof', ['-a', '-p', String(record.pid), '-d', 'cwd', '-Fn'], { encoding: 'utf8' })
    liveCwd = output.split('\n').find(line => line.startsWith('n'))?.slice(1)
  }
  const command = execFileSync('ps', ['-p', String(record.pid), '-o', 'command='], { encoding: 'utf8' }).trim()
  return liveCwd === cwd && command === record.command
}
async function stop() {
  const record = await state()
  if (!record) { console.log('SWI preview stopped'); return }
  if (!alive(record.pid)) { await unlink(statePath); console.log('Removed stale preview record; stopped'); return }
  if (!await owned(record)) throw new Error('Preview ownership could not be verified; no process was signaled')
  process.kill(record.pid, 'SIGTERM')
  for (let i = 0; i < 50 && alive(record.pid); i++) await delay(100)
  if (alive(record.pid)) throw new Error('Owned preview did not stop; no forced termination attempted')
  await unlink(statePath).catch(error => { if (error.code !== 'ENOENT') throw error })
  console.log('SWI preview stopped')
}
async function start() {
  const record = await state()
  if (record && alive(record.pid)) {
    if (!await owned(record)) throw new Error('Existing preview record is not owned by this checkout')
    if (record.port !== port) throw new Error('Owned preview uses another port; stop it before changing SWI_PREVIEW_PORT')
    console.log(`SWI preview already running at ${origin}`); return
  }
  await readFile(resolve(cwd, 'out/index.html'))
  await mkdir(resolve(cwd, '.codex/runtime'), { recursive: true })
  const child = spawn(process.execPath, [script, 'serve'], { cwd, env: process.env, detached: true, stdio: ['ignore', 'ignore', 'pipe', 'ipc'] })
  let errors = ''
  child.stderr.on('data', chunk => { errors += chunk })
  try { await new Promise((done, reject) => {
    const timeout = setTimeout(() => reject(new Error('Preview startup timed out')), 10000)
    child.once('error', error => { clearTimeout(timeout); reject(error) })
    child.once('exit', code => { clearTimeout(timeout); reject(new Error(`Preview startup failed (${code}): ${errors}`)) })
    child.once('message', () => { clearTimeout(timeout); done() })
  })
  await writeFile(statePath, JSON.stringify({ pid: child.pid, port, command: `${process.execPath} ${script} serve`, cwd, startedAt: new Date().toISOString() }, null, 2))
  } catch (error) { child.kill('SIGTERM'); throw error }
  child.disconnect(); child.stderr.destroy(); child.unref()
  console.log(`SWI preview running at ${origin}`)
}
async function serve() {
  const out = resolve(cwd, 'out')
  const config = JSON.parse(await readFile(resolve(out, 'staticwebapp.config.json'), 'utf8'))
  const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.woff2': 'font/woff2', '.png': 'image/png', '.ico': 'image/x-icon' }
  const server = createServer(async (request, response) => {
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return }
    let candidate, body, code = 200
    try {
      const pathname = decodeURIComponent(new URL(request.url, origin).pathname)
      candidate = resolve(out, `.${pathname.endsWith('/') ? `${pathname}index.html` : pathname}`)
      if (!candidate.startsWith(out + sep)) throw new Error('Outside export')
      if ((await stat(candidate)).isDirectory()) {
        response.writeHead(308, { Location: `${pathname}/${new URL(request.url, origin).search}` }); response.end(); return
      }
      body = await readFile(candidate)
    } catch { code = 404; candidate = resolve(out, '404.html'); body = await readFile(candidate) }
    const hashed = candidate.startsWith(resolve(out, '_next/static') + sep) && /[a-z0-9_-]{8,}\.(?:js|css|woff2?|png)$/i.test(candidate)
    response.writeHead(code, { ...config.globalHeaders, 'Content-Type': mime[extname(candidate)] || 'application/octet-stream', 'Cache-Control': hashed ? 'public, max-age=31536000, immutable' : extname(candidate) === '.json' ? 'no-store' : 'no-cache', 'Content-Length': body.length })
    response.end(request.method === 'HEAD' ? undefined : body)
  })
  server.listen(port, '127.0.0.1', () => process.send?.('ready'))
  process.on('SIGTERM', () => { server.close(() => process.exit(0)); server.closeAllConnections() })
}
async function command(binary, args) {
  await new Promise((done, reject) => { const child = spawn(binary, args, { cwd, env: process.env, stdio: 'inherit' }); child.on('error', reject); child.on('exit', code => code === 0 ? done() : reject(new Error(`${binary} ${args.join(' ')} exited ${code}`))) })
}
try {
  switch (process.argv[2]) {
    case 'serve': await serve(); break
    case 'start': await start(); break
    case 'stop': await stop(); break
    case 'status': { const record = await state(); console.log(record && await owned(record) ? `SWI preview running at http://127.0.0.1:${record.port} (PID ${record.pid})` : 'SWI preview stopped or ownership unverified'); break }
    case 'validate':
      try { await stop(); await command('npm', ['run', 'check']); process.env.SWI_EXPORT_READY = '1'; await command('npm', ['run', 'test:e2e']); await command('git', ['diff', '--check']) }
      finally { await stop() }
      break
    default: throw new Error('Use start, status, stop, serve, or validate')
  }
} catch (error) { console.error(error.message); process.exitCode = 1 }

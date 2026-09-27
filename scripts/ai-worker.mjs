#!/usr/bin/env node
/**
 * Sammy First LLC — Zero-Cost AI Worker
 * Dual-Engine Architecture:
 * 1. Local NVIDIA GPU (Ollama) when available: 100% free, infinite tokens, zero latency
 * 2. OpenRouter free cloud tier as fallback: openrouter/free, google/gemma, qwen
 */

import fs from 'fs'
import path from 'path'

function loadApiKey() {
  if (process.env.OPENROUTER_API_KEY) return process.env.OPENROUTER_API_KEY

  const candidates = [
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), '.env'),
    'C:\\Users\\sammy\\snapchef-ai\\.env.local',
    'C:\\Users\\sammy\\plainnews\\.env.local',
  ]

  for (const envPath of candidates) {
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, 'utf8')
        const match = content.match(/OPENROUTER_API_KEY=["']?([^"'\r\n]+)["']?/)
        if (match && match[1]) {
          return match[1].trim()
        }
      } catch {}
    }
  }

  return null
}

export const CLOUD_FREE_MODELS = [
  'openrouter/free',
  'google/gemma-4-31b-it:free',
  'google/gemma-4-26b-a4b-it:free',
  'qwen/qwen3.8-27b:free',
]

/**
 * Check if local Ollama server is running on PC
 */
async function checkOllamaAvailable() {
  try {
    const res = await fetch('http://127.0.0.1:11434/api/tags', { signal: AbortSignal.timeout(1000) })
    return res.ok
  } catch {
    return false
  }
}

async function getAvailableOllamaModel() {
  try {
    const res = await fetch('http://127.0.0.1:11434/api/tags', { signal: AbortSignal.timeout(1000) })
    if (res.ok) {
      const data = await res.json()
      const models = (data.models || []).map((m) => m.name)
      if (models.length > 0) return models[0]
    }
  } catch {}
  return 'qwen2.5-coder:1.5b'
}

/**
 * Run task on local Ollama server (NVIDIA GPU accelerated)
 */
async function runOllamaTask(prompt, system, model) {
  const chosenModel = model || (await getAvailableOllamaModel())
  const res = await fetch('http://127.0.0.1:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: chosenModel,
      prompt: `${system}\n\nTask:\n${prompt}`,
      stream: false,
    }),
  })

  if (!res.ok) {
    throw new Error(`Ollama returned status ${res.status}`)
  }

  const data = await res.json()
  return {
    content: data.response?.trim() || '',
    model: `local/ollama/${chosenModel}`,
    cost: 0.0,
    engine: 'local-nvidia-gpu',
  }
}

/**
 * Run task on OpenRouter free tier
 */
async function runCloudTask(prompt, system, requestedModel, json, temperature, apiKey) {
  const modelsToTry = requestedModel
    ? [requestedModel, ...CLOUD_FREE_MODELS.filter((m) => m !== requestedModel)]
    : CLOUD_FREE_MODELS

  let lastError = null

  for (const candidateModel of modelsToTry) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/sammyfirst722-oss',
          'X-Title': 'Sammy First Free AI Worker',
        },
        body: JSON.stringify({
          model: candidateModel,
          temperature,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: prompt },
          ],
          response_format: json ? { type: 'json_object' } : undefined,
        }),
      })

      if (!response.ok) {
        const errText = await response.text()
        lastError = new Error(`HTTP ${response.status}: ${errText}`)
        continue
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content

      if (!content) {
        lastError = new Error(`Empty response from ${candidateModel}`)
        continue
      }

      return {
        content: content.trim(),
        model: candidateModel,
        tokensUsed: data.usage?.total_tokens || 0,
        cost: 0.0,
        engine: 'cloud-openrouter-free',
      }
    } catch (err) {
      lastError = err
    }
  }

  throw lastError || new Error('All cloud models failed')
}

export async function runWorkerTask({
  prompt,
  system = 'You are a fast, precise code generation assistant. Output only the requested code or content without conversational filler.',
  model,
  json = false,
  temperature = 0.2,
  preferLocal = true,
}) {
  // 1. Try local Ollama if running
  if (preferLocal) {
    const isLocalUp = await checkOllamaAvailable()
    if (isLocalUp) {
      try {
        return await runOllamaTask(prompt, system, model)
      } catch (err) {
        console.warn('[Worker Notice] Local Ollama failed, falling back to cloud free tier:', err.message)
      }
    }
  }

  // 2. Try OpenRouter cloud free tier
  const apiKey = loadApiKey()
  if (apiKey) {
    return await runCloudTask(prompt, system, model, json, temperature, apiKey)
  }

  throw new Error('No worker engine available. Please start Ollama locally or provide an active OPENROUTER_API_KEY.')
}

async function main() {
  const args = process.argv.slice(2)
  let prompt = ''
  let system = undefined
  let model = undefined
  let outFile = undefined
  let isJson = false

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--prompt' || args[i] === '-p') {
      prompt = args[++i]
    } else if (args[i] === '--system' || args[i] === '-s') {
      system = args[++i]
    } else if (args[i] === '--model' || args[i] === '-m') {
      model = args[++i]
    } else if (args[i] === '--out' || args[i] === '-o') {
      outFile = args[++i]
    } else if (args[i] === '--json') {
      isJson = true
    }
  }

  if (!prompt) {
    console.log('Sammy First AI Worker Ready.')
    console.log('Engines supported: Local NVIDIA GPU (Ollama) + OpenRouter Free Tier.')
    console.log('Usage: node scripts/ai-worker.mjs --prompt "task" [--out file]')
    process.exit(0)
  }

  try {
    const result = await runWorkerTask({ prompt, system, model, json: isJson })
    console.log(`[Worker Success] Generated using ${result.model} (${result.engine}) — 0 tokens billed to Sammy`)

    if (outFile) {
      const targetPath = path.isAbsolute(outFile) ? outFile : path.join(process.cwd(), outFile)
      fs.mkdirSync(path.dirname(targetPath), { recursive: true })
      fs.writeFileSync(targetPath, result.content, 'utf8')
      console.log(`[Worker Output] Written to ${targetPath}`)
    } else {
      console.log('\n--- WORKER OUTPUT ---\n')
      console.log(result.content)
    }
  } catch (err) {
    console.error('[Worker Fatal Error]:', err.message)
    process.exit(1)
  }
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  main()
}

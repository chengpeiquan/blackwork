import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
)
const skillDir = path.join(rootDir, '.agents/skills/blackwork-ui')

const readSkillFile = (relativePath) =>
  readFile(path.join(skillDir, relativePath), 'utf8')

test('provides valid Blackwork skill metadata and references', async () => {
  const skill = await readSkillFile('SKILL.md')

  assert.match(skill, /^---\nname: blackwork-ui\ndescription: .+\n---/u)

  const references = [...skill.matchAll(/\]\(references\/(.+?\.md)\)/gu)].map(
    ([, filename]) => filename,
  )

  assert.deepEqual(references, [
    'package-contract.md',
    'content-and-product.md',
    'workbench.md',
  ])

  await Promise.all(
    references.map(async (filename) => {
      const content = await readSkillFile(`references/${filename}`)
      assert.ok(content.trim().length > 0, `${filename} must not be empty`)
    }),
  )
})

test('keeps skill interface and evaluations discoverable', async () => {
  const [openaiConfig, evalSource] = await Promise.all([
    readSkillFile('agents/openai.yaml'),
    readSkillFile('evals/evals.json'),
  ])
  const evaluations = JSON.parse(evalSource)

  assert.match(openaiConfig, /display_name: ['"]Blackwork UI['"]/u)
  assert.match(openaiConfig, /\$blackwork-ui/u)
  assert.equal(evaluations.skill_name, 'blackwork-ui')
  assert.ok(evaluations.evals.length >= 3)
  assert.ok(
    evaluations.evals.every(
      (evaluation) => evaluation.prompt && evaluation.expectations.length > 0,
    ),
  )
})

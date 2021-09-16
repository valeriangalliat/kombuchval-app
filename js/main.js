/* eslint-env browser */

import Alpine from 'alpinejs'
import 'emojicon-big/auto'

async function fetchBottle (number) {
  const bottleUrl = `https://raw.githubusercontent.com/valeriangalliat/kombuchval/master/bottles/${number}.md`
  const bottleRes = await fetch(bottleUrl)

  if (bottleRes.status === 404) {
    return 'This bottle does not exist!'
  }

  if (!bottleRes.ok) {
    throw new Error('Error fetching batch')
  }

  const batchLink = await bottleRes.text()
  const batchUrl = new URL(batchLink, bottleUrl)
  const batchRes = await fetch(batchUrl)

  if (!batchRes.ok) {
    throw new Error('Error fetching batch')
  }

  const batch = await batchRes.text()
  const lines = batch.split('\n')
  const props = {}

  const rawProps = lines.slice(1, lines.findIndex(line => line.startsWith('## ')))
    .filter(line => line.startsWith('* '))

  for (const line of rawProps) {
    const [start, value] = line.split(':** ')
    const name = start.split('**').pop()
    props[name] = value
  }

  const bottlesIndex = lines.findIndex(line => line.startsWith('## ') && line.endsWith(' Bottles'))
  const bottles = lines.slice(bottlesIndex).filter(line => line.startsWith('* '))

  const batchViewUrl = new URL(batchLink, 'https://github.com/valeriangalliat/kombuchval/blob/master/bottles/0.md')

  const html = `Bottle <strong>#${number}</strong> is part of a
<a href="${batchViewUrl}">batch</a> of ${bottles.length} bottles with label
<strong>${props.Label}</strong>, started on <strong>${props.Brewing}</strong>
and bottled on <strong>${props.Bottling}</strong>.<br>
Check out the <a class="text-blue-600 hover:text-blue-800" href="https://github.com/valeriangalliat/kombuchval#readme">other recipes</a>!`

  return html
}

function submit () {
  if (`${Number(this.number)}` !== this.number) {
    this.result = 'Not a number.'
    return
  }

  fetchBottle(this.number)
    .then(html => {
      this.result = html
    })
    .catch(err => {
      console.error(err)
      this.result = 'An error occurred. If you\'re Val, check out the console!'
    })
}

Alpine.data('bottle', () => ({
  number: null,
  result: null,
  submit
}))

Alpine.start()

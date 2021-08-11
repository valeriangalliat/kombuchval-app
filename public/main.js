const form = document.getElementById('form')
const result = document.getElementById('result')

function showResult (message) {
  result.innerHTML = message
  result.classList.remove('d-none')
}

async function onSubmit () {
  const number = form.elements.number.value

  if (`${Number(number)}` !== number) {
    return showError(`Not a number.`)
  }

  const bottleUrl = `https://raw.githubusercontent.com/valeriangalliat/kombuchval/master/bottles/${number}.md`
  const bottleRes = await fetch(bottleUrl)

  if (bottleRes.status === 404) {
    result.classList.remove('d-none')
    result.textContent = 'This bottle does not exist!'
    return
  }

  if (!bottleRes.ok) {
    result.classList.remove('d-none')
    result.textContent = 'Error fetching batch'
  }

  const batchLink = await bottleRes.text()
  const batchUrl = new URL(batchLink, bottleUrl)
  const batchRes = await fetch(batchUrl)

  if (!batchRes.ok) {
    throw new Error('Error fetching batch')
  }

  const batch = await batchRes.text()
  const lines = batch.split('\n')

  const [ date, title ] = lines[0].slice(2).split(' - ')
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

  const html = `Bottle <strong>#${number}</strong> is part of a batch of ${bottles.length} bottles with label <strong>${props.Label}</strong>, started on <strong>${props.Brewing}</strong> and bottled on <strong>${props.Bottling}</strong>.`

  showResult(html)
}

form.addEventListener('submit', e => {
  e.preventDefault()

  onSubmit()
    .catch(err => {
      console.error(err)
      showResult(`An error occurred. If you're Val, check out the console!`)
    })
})

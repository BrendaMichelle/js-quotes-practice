const quotesUl = document.querySelector('#quote-list')
const url = 'http://localhost:3000/quotes'
const addQuoteForm = document.querySelector('#new-quote-form')

addQuoteForm.addEventListener('submit', (event) => {
    event.preventDefault()

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            quote: event.target.quote.value,
            author: event.target.author.value
        })
    })
        .then(response => response.json())
        .then(newQuote => {
            renderOneQuote(newQuote)
            addQuoteForm.reset()
        })
})

quotesUl.addEventListener('click', (event) => {

    if (event.target.className === 'btn-danger') {
        const li = event.target.closest('li')
        const id = li.dataset.id

        fetch(`${url}/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    li.remove()
                }
            })
    }
    else if (event.target.matches('.btn-success')) {
        const li = event.target.closest('li')

        fetch('http://localhost:3000/likes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                quoteId: parseInt(li.dataset.id),
                createdAt: Date.now()
            })
        })
            .then(response => {
                if (response.ok) {
                    const likesSpan = li.querySelector('span')
                    likesSpan.textContent = parseInt(likesSpan.textContent) + 1
                }
            })
    }
})


function renderOneQuote(quoteObject) {
    const li = document.createElement('li')
    let likes = quoteObject.likes ? quoteObject.likes.length : 0
    li.classList.add('quote-card')
    li.dataset.id = quoteObject.id

    li.innerHTML = `
        <blockquote class="blockquote">
            <p class="mb-0">${quoteObject.quote}</p>
            <footer class="blockquote-footer">${quoteObject.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>${likes}</span></button>
            <button class='btn-danger'>Delete</button>
        </blockquote>`
    quotesUl.append(li)
}

function renderAllQuotes(quotesArray) {
    quotesArray.forEach(quoteObject => {
        renderOneQuote(quoteObject)
    })
}

function initializeProgram() {
    fetch(`${url}?_embed=likes`)
        .then(response => response.json())
        .then(quotesArray => renderAllQuotes(quotesArray))
}

initializeProgram()
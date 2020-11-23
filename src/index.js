const url = `http://localhost:3000/quotes`
const quotesUl = document.querySelector('#quote-list')
const newQuoteForm = document.querySelector('#new-quote-form')

const getData = () => {
    fetch(`${url}?_embed=likes`)
        .then(r => r.json())
        .then(quotes => {
            quotes.forEach(quote => {
                renderQuote(quote)
            })
        })
}

function renderQuote(quote) {
    // find where to append to ✅
    // create li element
    const li = document.createElement('li')
    // li.className = 'quote-card'
    li.classList.add('quote-card')
    li.dataset.id = quote.id
    let likes = 0
    if (quote.likes) {
        console.log(quote.likes)
        likes = quote.likes.length
        // debugger
    }
    li.innerHTML = `
        <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>${likes}</span></button>
            <button class='btn-danger'>Delete</button>
        </blockquote>`
    quotesUl.append(li)
}


newQuoteForm.addEventListener('submit', (event) => {
    event.preventDefault()

    // send fetch post request
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            quote: newQuoteForm.quote.value,
            author: newQuoteForm.author.value
        })
    })
        .then(response => response.json())
        .then(newQuote => {
            // render quote
            renderQuote(newQuote)
        })
})

// quotesUl.addEventListener('click', increaseLikes)

function increaseLikes(event) {
    const li = event.target.closest('.quote-card')
    const id = parseInt(li.dataset.id)
    const likeNumber = li.querySelector('span')

    console.log('like button clicked')
    fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            quoteId: id,
            createdAt: new Date(Date.now())
        })
    })
        .then(response => response.json())
        .then(likeObj => {
            console.log(likeObj)
            likes = parseInt(likeNumber.textContent) + 1
            likeNumber.textContent = likes
        })
}

quotesUl.addEventListener('click', (event) => {
    if (event.target.matches('.btn-danger')) {
        console.log('delete!')
        // figure out which quote we want to delete
        // (i.e. figure out the ID of the quote)
        const li = event.target.closest('.quote-card')
        const id = li.dataset.id
        console.log('id? - ', id)
        // li.remove()
        // url/:id
        fetch(`${url}/${id}`, {
            method: 'DELETE'
        })
            .then(response => response.json)
            .then(item => {
                li.remove()
            })
    }
    else if (event.target.matches('.btn-success')) {
        increaseLikes(event)
    }
})


getData()
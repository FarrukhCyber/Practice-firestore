const cafeList = document.querySelector('#cafe-list')
const form = document.querySelector("#add-cafe-form")

// to modify the elements on the page
function renderCafe(doc) {
    let li = document.createElement('li')
    let name = document.createElement('span')
    let city = document.createElement('span')
    let cross = document.createElement('div')

    li.setAttribute('data-id', doc.id)
    name.textContent = doc.data().name 
    city.textContent = doc.data().city
    cross.textContent = 'x'
    
    li.appendChild(name) 
    li.appendChild(city)
    li.appendChild(cross)

    cafeList.appendChild(li)

    //deleting the element
    cross.addEventListener('click', (e) => {
        let id = e.target.parentElement.getAttribute('data-id')
        db.collection('Cafes').doc(id).delete()
    })
}

// getting the data from the firestore, not real time changes
// db.collection("Cafes").get().then((snapshot) => {
//     snapshot.docs.forEach(doc => {
//         renderCafe(doc)
//     })
// })

// adding the data from the front end on the firestore
form.addEventListener("submit", (e) =>{
    e.preventDefault()
    db.collection("Cafes").add({
        name: form.name.value,
        city: form.city.value 
    })

    // setting the input values to empty
    form.city.value= ""
    form.name.value= ""
})


// realtime listener
db.collection('Cafes').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges()
    changes.forEach(change => {
        if (change.type == 'added') {
            renderCafe(change.doc)
        }
        else if (change.type == 'removed') {
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']')
            li.remove(li)
        }
        
    });
})

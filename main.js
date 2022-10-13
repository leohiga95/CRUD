'use strict'


const openModal = () => document.getElementById('modal').classList.add('active')    
const openModal2 = () => document.getElementById('modal2').classList.add('active')
        

const closeModal = () => {
        clearFields()
        document.getElementById('modal').classList.remove('active')
}

const closeModal2 = () => {
        document.getElementById('modal2').classList.remove('active')
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))

// Create 
const createClient = (client) => {
        const dbClient = getLocalStorage()
        dbClient.push(client)
        setLocalStorage(dbClient)        
}

// Read
const readClient = () => getLocalStorage()

// Update
const updateClient = (index, client) => {
        const dbClient = readClient()
        dbClient[index] = client 
        setLocalStorage(dbClient)
}

// Delete
const deleteClient = (index) => {
        const dbClient = readClient()
        dbClient.splice(index, 1)
        setLocalStorage(dbClient)
}

const validFields = () => {
        return document.getElementById('form').reportValidity()
}

// Interação com layout
const clearFields = () => {
        const fields = document.querySelectorAll('.modalField')
        fields.forEach(field => field.value = "")
        document.getElementById('nome').dataset.index = 'new'
}

const saveClient = () => {
      if (validFields()) {
          const client = {
                nome: document.getElementById('nome').value,     
                email: document.getElementById('email').value,
                cpf: document.getElementById('cpf').value,
                cidade: document.getElementById('cidade').value
          }
          const index = document.getElementById('nome').dataset.index
          if (index == 'new') {
                createClient(client)
                updateTable()
                closeModal()
          } else {
                updateClient(index, client)
                updateTable()
                closeModal()
          }      
      }  
}

const createRow = (client, index) => {
        const newRow = document.createElement('tr')
        newRow.innerHTML = `
                <td>${client.nome}</td>
                <td>${client.email}</td>
                <td>${client.cpf}</td>
                <td>${client.cidade}</td>
                <td>
                        <button type="button" class="button green" id="edit-${index}">Editar</button>
                        <button type="button" class="button red" id="delet-${index}">Excluir</button>
                </td>
        `
        document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
        const rows = document.querySelectorAll('#tableClient>tbody tr')
        rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
        const dbClient = readClient()
        clearTable()
        dbClient.forEach(createRow)
}

const fillFields = (client) => {
        document.getElementById('nome').value = client.nome
        document.getElementById('email').value = client.email
        document.getElementById('cpf').value = client.cpf
        document.getElementById('cidade').value = client.cidade
        document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {
        const client = readClient()[index]
        client.index = index
        fillFields(client)
        openModal()
}

const editDelete = (event) => {
        if (event.target.type == 'button') {
                const [action, index] = event.target.id.split('-')

                if (action == 'edit') {
                        editClient(index)
                } else {
                        const client = readClient()[index]
                        let alertDelete = document.querySelector('#alertDelete')
                       
                        alertDelete.textContent = `Deseja exluir o(a) cliente ${client.nome} ?`
                        openModal2()

                        document.getElementById('delete').addEventListener('click', () => {
                                deleteClient(index)
                                updateTable()
                                closeModal2()
                        })                      
                        
                }
        }                
}        


updateTable()

// Eventos     
document.getElementById('addClient')
        .addEventListener('click', openModal)

document.getElementById('modalClose')     
        .addEventListener('click', closeModal)

document.getElementById('modalClose2')
        .addEventListener('click', closeModal2)        

document.getElementById('save')       
        .addEventListener('click', saveClient)

document.querySelector('#tableClient>tbody')
        .addEventListener('click', editDelete) 
        
document.getElementById('cancel') 
        .addEventListener('click', closeModal2)
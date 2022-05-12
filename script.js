Parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL
// Remember to inform BOTH the Back4App Application ID AND the JavaScript KEY
Parse.initialize(
  '2YpzgFhWw0IRkLXmL7nqRLsVPvECAxiGmgB0sp9o', // This is your Application ID
  'OpjKHryPhWCOVLCaXbmsIBMj9GW1FaTPdyGj9P9h' // This is your Javascript key
);

const inputDescription = document.getElementById('item');
const btn = document.getElementById('btn');
const list = document.getElementById('list');
const listFinished = document.getElementById('listFinished');

let div;
let btnDelete;
let btnUpdate;
let btnFinish;
let li;

const Add = async () => {
    const myNewObject = new Parse.Object('listaDeTarefas');
    myNewObject.set('Descricao', inputDescription.value);
    myNewObject.set('Concluido', false);
    try {
        const result = await myNewObject.save();
        location.reload();
    } catch (error) {
        alert('Preencha os campos de Descrição!')
        console.error('Error while creating listaDeTarefas: ', error);
    }
};


const ShowList = async () => {
    const listaDeTarefas = Parse.Object.extend('listaDeTarefas');
    const query = new Parse.Query(listaDeTarefas);

    try {
        const results = await query.find();
        for (const object of results) {
            const id = object.id
            const Descricao = object.get('Descricao')
            const Concluido = object.get('Concluido')

            li = document.createElement('li');
            btnFinish = document.createElement('button')
            btnFinish.innerText = 'Feito'
            li.innerHTML = `${Descricao}`;
            btnDelete = document.createElement('button') 
            btnUpdate = document.createElement('button')
            btnUpdate.innerText = 'Editar'
            btnDelete.innerText = 'Remover'
            if(Concluido){
                listFinished.appendChild(li);
            }else{
                list.appendChild(li);
                list.appendChild(btnFinish);
                list.appendChild(btnDelete);
                list.appendChild(btnUpdate);
            }

            btnDelete.onclick = async function DeleteItem() {
                const query = new Parse.Query('listaDeTarefas');
                try {

                    const object = await query.get(id);
                    try {
                        const response = await object.destroy();
                        alert('Item deletado com sucesso!')
                        location.reload();
                    } catch (error) {
                        console.error('Error while deleting ParseObject', error);
                    }
                } catch (error) {
                    console.error('Error while retrieving ParseObject', error);
                }
            }

            btnUpdate.onclick = async function UpdateItem() {
                const query = new Parse.Query(listaDeTarefas);
                try {
                    let newDescription = window.prompt('Digite a nova descrição!')

                    const object = await query.get(id);
                    object.set('Descricao', newDescription);
                    try {
                        const response = await object.save();
                        alert('Descrição editada!')
                        location.reload();
                    } catch (error) {
                        console.error('Error while updating listaDeTarefas', error);
                    }
                } catch (error) {
                    console.error('Error while retrieving object listaDeTarefas', error);
                }
            }

            btnFinish.onclick = async function finish() {
                const query = new Parse.Query(listaDeTarefas);
                try {
                    const object = await query.get(id);
                    object.set('Concluido', true);
                    try {
                        if(Concluido == false){
                            const response = await object.save();
                            location.reload();
                        }
                    } catch (error) {
                        console.error('Error while updating listaDeTarefas', error);
                    }
                } catch (error) {
                    console.error('Error while retrieving object listaDeTarefas', error);
                }
            }

        }
    } catch (error) {
        console.error('Error while fetching listaDeTarefas', error);
    }
}

btn.onclick = Add;
ShowList();
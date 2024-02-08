import { githubApi } from "./conect.js"

export class Favorites{
    constructor(root){
        this.root=document.querySelector(root)
        this.load()
    }   

    load(){
        this.arrayUsers=JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }
    save(){
        localStorage.setItem('@github-favorites:',JSON.stringify(this.arrayUsers))
    }

   async addsearch(username){
    try{
        const userExists = this.arrayUsers.find(array => array.login === username)
        
        if(userExists) {
            throw new Error('Usuário já cadastrado')
        }
        /**recebe as informações da api */
        const user=await githubApi.search(username)

        if(user.login===undefined){
            throw new Error('Usuario não encontrado')
        }

        this.arrayUsers=[user, ...this.arrayUsers]
        this.update()
        this.save()

         
    }catch(error){

        alert(error.message)
        
    }
    }

    selectDelete(user){
        const filtred=this.arrayUsers.filter(entry=>entry.login!==user.login)
        this.arrayUsers=filtred
        this.update()
        this.save

    }
}

export class FavoritesView extends Favorites{
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.onAddUser()
    }

    onAddUser(){
        const input=document.querySelector('.search input')
        const button=document.querySelector('.search button')

        button.onclick=()=>{
            const{value}=this.root.querySelector('.search input')
            this.addsearch(value)
        }

    }

    update(){
        this.removeAll()

        this.arrayUsers.forEach(user=> {
            
            const row=this.createRow()
            row.querySelector('.user-profile img').src=`https://github.com/${user.login}.png`
            row.querySelector('.user-profile a').href=`https://github.com/${user.login}`
            row.querySelector('.user-profile p').textContent=user.name
            row.querySelector('.user-profile span').textContent=user.login
            row.querySelector('.repositories').textContent=user.public_repos
            row.querySelector('.followers').textContent=user.followers
            
            row.querySelector('.remove').onclick= () =>{
                const isOK= confirm('Tem certeza que deseja deletar essa linha ?')
    
                    if(isOK){
                        this.selectDelete(user)
                    }
                }
                /**recebe um elemento HTML criado com a DOM*/
                this.tbody.append(row)
        });    



    }

    createRow(){
        const newTr=document.createElement('tr')
        newTr.innerHTML=`<td class="user-profile">
        <img src="https://github.com/Rickccastro.png" alt="Imagem Ricardo">
        <a href="https://github.com/Rickccastro" target="_blank">
            <p>Ricardo Castro</p>
            <span>/rickccastro</span>
        </a>
    </td>
    <td class="repositories">
        484848
    </td>
    <td class="followers">
        8898998989
    </td>
    <td class="remove">
        <button>Remover</button>
    </td>`

    return newTr
    }

    removeAll(){
        const tr=document.querySelectorAll("table tbody tr").forEach((tr)=>{
            tr.remove()
        })

        return this.tr
    }
    
}
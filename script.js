const button = document.querySelector("form button")
const $faturamento = document.querySelector("#faturamento")
const $boxCreditos = document.querySelector("#creditos p")
const $boxDebitos = document.querySelector("#debitos p")

let accounts = []

button.addEventListener("click", function(e){
    e.preventDefault()
    
    getInformations()
    calcAccount(accounts)
})


function getInformations(){
    const $getName = document.querySelector("input[name='conta']").value
    const $getValue = document.querySelector("input[name='valor']").value

    if($getName === '' || $getValue === '') {
        alert('Todos os campos precisam estar preenchidos!')
        return
    }

    const getValueModified = parseFloat($getValue.replace(".", "")) 
    const formattingValues = new SaveAccounts(getValueModified, $getName)

    accounts.push(formattingValues)   
}


class SaveAccounts{                                  
    
    constructor(getValueModified, $getName){
        this.nome = $getName,
        this.valor = Math.abs(getValueModified)
        this.valueParam = getValueModified
        this.id = accounts.indexOf(accounts[accounts.length-1])+1
        this.insertAccount()
    }

    checkerNumberFormatting(){
        return this.valueParam > 0 ? '+' : '-' 
    }

    insertAccount(){
        const containerContas = document.querySelector("#contas")

        const boxConta = document.createElement("div")
        boxConta.classList.add('box-conta')
        boxConta.style.cssText = `position: relative; z-index: 1;`

        const imgTrash = document.createElement("img")
        imgTrash.src = "lixeira.png"
        imgTrash.alt = "ilustração lixeira"
        imgTrash.style.cssText = `
        position: absolute;
        top: -2px;
        left: 0px;
        z-index: 2;
        `
        boxConta.appendChild(imgTrash)

        const conta = document.createElement("p")
        conta.insertAdjacentText('afterbegin', `${this.nome} R$ ${this.checkerNumberFormatting()} ${this.valor}`)
        conta.classList.add(`${this.id}`)
        boxConta.appendChild(conta)

        containerContas.insertAdjacentElement('beforeend', boxConta)

        if(this.checkerNumberFormatting() === '+'){
            conta.classList.add("conta-credito")
        }else{
            conta.classList.add("conta-debito")
        }

        imgTrash.addEventListener('click', function(e){
            const clickedElement = e.target
            const boxClickedElement = clickedElement.parentNode

            let clickedElementId = clickedElement.nextSibling.classList[0]
            
            containerContas.removeChild(boxClickedElement)

            const novoTeste = accounts.filter(e => e.id != clickedElementId)       
            accounts = novoTeste
            calcAccount(accounts)  
        })        
    }
}


function calcAccount(accounts){
    let calcfaturamento = 0
    for(let account of accounts){
        calcfaturamento += account.valueParam
    } 

    if(calcfaturamento > 0){
        $faturamento.textContent = `R$ + ${(calcfaturamento).toLocaleString('pt-BR')}`
    }else if(calcfaturamento < 0){
        $faturamento.textContent = `R$ - ${(Math.abs(calcfaturamento)).toLocaleString('pt-BR')}`
    }else{
        $faturamento.textContent = `R$ 0,00`
    }


    const accountsCreditos = accounts.filter(el => el.valueParam > 0)
    let calcCreditos = 0
    for(let accountCred of accountsCreditos){
        calcCreditos += Number(accountCred.valueParam)
    }
    if(accountsCreditos.length != 0){
        $boxCreditos.textContent = `R$ + ${(calcCreditos).toLocaleString('pt-BR')}`
    }else{
        $boxCreditos.textContent = ''
    }


    const accountsDebitos = accounts.filter(el => el.valueParam < 0)
    let calcDebitos = 0
    for(let accountDeb of accountsDebitos){
        calcDebitos += Number(accountDeb.valueParam)
    }
    if(accountsDebitos.length != 0){
        $boxDebitos.textContent = `R$ - ${(Math.abs(calcDebitos)).toLocaleString('pt-BR')}`
    }else{
        $boxDebitos.textContent = ''
    }
}
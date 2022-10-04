const divTreinos = document.querySelector(".treinos")
const spanBadge = document.querySelector("span.position-absolute")

const myModal = new bootstrap.Modal(document.getElementById('carrinhoModal'))

const btnCarrinho = document.querySelector("#btCarrinho")
const btnFinalizar = document.querySelector("#btFinalizar")

const tabTreinos = document.querySelector("#tbTreinos")

let itemsComprados
let treinos

const carregaAcad= async () => {

    const dados = await axios.get("https://dode2511.github.io/disp-moveis/trab/treinos")


  
   treinos = dados.data

  let resp = ""

  for (const treino of treinos) {
    resp += 
      `
    <div class="col-6 col-sm-4 col-md-3">
      <div class="card border-secondary mb-3" style="max-width: 20rem;">
      <img src="${treino.foto}" class="card-img-top" alt="roupa">
        <div class="card-body">
          <h5 class="card-title">${treino.id} - ${treino.nome}</h5>
          <p class="card-text">${treino.desc}</p>
          <p class="card-text">R$: 
${treino.preco.toLocaleString("pt-br", { minimumFractionDigits: 2 })}</p>
          <button class="btn btn-primary btAdicionar">Comprar</button>
        </div>
      </div>    
    </div>  
    `
  }

  divTreinos.innerHTML = resp

  itemsComprados = localStorage.getItem("treinos") ?
    localStorage.getItem("treinos").split(";") : []

  spanBadge.innerText = itemsComprados.length
}

window.addEventListener("load", carregaAcad)

divTreinos.addEventListener("click", e => {
  if (e.target.classList.contains("btAdicionar")) {
 
    const div = e.target.parentElement
    
    const tagH5 = div.querySelector("h5")

    const idNome = tagH5.innerText
    

    const partes = idNome.split("-")

    const id = partes[0]

    itemsComprados.push(id)

    spanBadge.innerText = itemsComprados.length

    localStorage.setItem("treinos", itemsComprados.join(";"))



  }
})

btnCarrinho.addEventListener("click", () => {
  myModal.show()

  
  for (let i = tabTreinos.rows.length - 1; i >= 1; i--) {
    tabTreinos.deleteRow(i)
  }

  let total = 0

  for (const item of itemsComprados) {


    const treino = treinos.filter(aux => aux.id == item)[0]

  
    const linha = tabTreinos.insertRow(-1)

    
    const col1 = linha.insertCell(0)
    const col2 = linha.insertCell(1)
    const col3 = linha.insertCell(2)

   
    col1.innerHTML = `<img src="${treino.foto}" alt="${treino.nome}" width="80">`
    col2.innerText = treino.nome
    col3.innerText = treino.preco.toLocaleString("pt-br", { minimumFractionDigits: 2 })
    col3.classList.add("text-end")

    total = total + treino.preco
  }

  const linha = tabTreinos.insertRow(-1)

  const col1 = linha.insertCell(0)
  const col2 = linha.insertCell(1)
  const col3 = linha.insertCell(2)


  col2.innerText = "Total R$: "
  col3.innerText = total.toLocaleString("pt-br", { minimumFractionDigits: 2 })

  col2.classList.add("text-end")
  col3.classList.add("text-end")
})

btnFinalizar.addEventListener("click", () => {
 
  myModal.hide()

  localStorage.removeItem("treinos")

  // exibe mensagem
  alert("Obrigado! Seu  treino foi computado com sucesso!")

  
  carregaAcad()
})
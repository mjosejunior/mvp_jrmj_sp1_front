/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  const url = 'http://127.0.0.1:5001/atividades';

  try {
    const response = await fetch(url, { method: 'get' });
    const data = await response.json();

    console.log(data.atividades);
    data.atividades.forEach(item =>
      insertList(
        item.id,
        item.data,
        item.start_time,
        item.end_time,
        item.duracao,
        item.publicacoes,
        item.videos,
        item.revisitas,
        item.estudos
      )
    );
  } catch (error) {
    console.error('Error:', error);
  }
};
/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const API_URL = 'http://127.0.0.1:5001/atividade';

const handleErrors = (status) => {
  switch (status) {
    case 409:
      alert('Atividade de mesma data já cadastrada.');
      break;
    case 400:
      alert('Atividade não cadastrada. Verifique os campos e tente novamente.');
      break;
    default:
      alert('Ocorreu um erro na requisição. Por favor, tente novamente.');
  }
};

const postItem = async (activityData) => {
  const formData = new FormData();
  for (const key in activityData) {
    formData.append(key, activityData[key]);
  }

  try {
    const response = await fetch(API_URL, {
      method: 'post',
      body: formData
    });

    if (!response.ok) {
      handleErrors(response.status);
      throw new Error('Error in response');
    } else {
      const createdItem = await response.json();
      console.log(response.json().FormData);

      
      // Add the new ID to the activity data
      activityData.id = createdItem.id;
      
      if(response.status === 200) {
        insertList(
          activityData.id,
          activityData.data,
          activityData.start_time,
          activityData.end_time,
          activityData.duracao,
          activityData.publicacoes,
          activityData.videos,
          activityData.revisitas,
          activityData.estudos
        );

        alert('Atividade Cadastrada com sucesso!');
      }
       
      //}
    }

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

/*
  --------------------------------------------------------------------------------------
  Função para atualizar um item na lista do servidor via requisição PUT
  --------------------------------------------------------------------------------------
*/
const updateItem = async (inputId, inputData, inputStartTime, inputEndTime, inputDuracao, inputPublicacoes, inputVideos, inputRevisitas, inputEstudos) => {
  const formData = new FormData();
  formData.append('id', inputId);
  formData.append('data', inputData);
  formData.append('start_time', inputStartTime);
  formData.append('end_time', inputEndTime);
  formData.append('duracao', inputDuracao);
  formData.append('publicacoes', inputPublicacoes);
  formData.append('videos', inputVideos);
  formData.append('revisitas', inputRevisitas);
  formData.append('estudos', inputEstudos);

  let url = 'http://127.0.0.1:5001/atividade?id=' + inputId;

  fetch(url, {
    method: 'put',
    body: formData
  })
    .then((response) => {
      //console.log(response);
      return response.json();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertDeleteButton = (parent) => {
  let deleteButton = document.createElement("span");
  let txt = document.createTextNode("\uD83D\uDDD1");
  deleteButton.className = "delete";
  deleteButton.appendChild(txt);
  parent.appendChild(deleteButton);
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um botão "Editar" para cada item da lista
  --------------------------------------------------------------------------------------
*/

const insertEditButton = (parent) => {
  let editButton = document.createElement("span");
  let buttonText = document.createTextNode("\u270E");
  editButton.className = "edit";
  editButton.appendChild(buttonText);
  parent.appendChild(editButton);
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um botão "Adicionar Observação" para cada item da lista
  --------------------------------------------------------------------------------------
*/

const insertObservacaoButton = (parent, id) => {
  //console.log(id);
  let observacaoButton = document.createElement("span");
  let buttonText = document.createTextNode("\u{1F4AC}");  // Escolha o símbolo que preferir
  observacaoButton.className = "observacao";
  observacaoButton.appendChild(buttonText);
  observacaoButton.addEventListener('click', () => openObservacaoModal(id));
  parent.appendChild(observacaoButton);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("delete");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza que deseja excluir essa atividade?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Atividade removida com sucesso!")
        // Verificar se há dados no formulário
        const form = document.getElementById("activity-form");
        const inputs = form.querySelectorAll("input");
        let hasData = false;
        inputs.forEach((input) => {
          if (input.value.trim() !== "") {
            hasData = true;
          }
        });

        // Limpar o formulário caso haja dados nele
        if (hasData) {
          form.reset();
        }
        // Restaurando o botão de submissão para permitir a inserção
        restoreSubmitButton("insert");


      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para atualizar um item da lista de acordo com o click no botão "Editar"
  --------------------------------------------------------------------------------------
*/
// Adiciona evento de click aos botões de edição

const updateElement = () => {
  let edit = document.getElementsByClassName("edit");
  for (let i = 0; i < edit.length; i++) {
    edit[i].onclick = function () {
      let div = this.parentElement.parentElement;
      console.log(div);

      // Obter o ID da atividade da primeira célula da linha
      const id = div.getElementsByTagName('td')[0].innerHTML;
      console.log(id);

      // Obtendo os campos do formulário
      const form = document.getElementById("activity-form");
      const inputs = {
        id: id, // Utilizar o ID da div      
        data: form.querySelector("#data"),
        startTime: form.querySelector("#start_time"),
        endTime: form.querySelector("#end_time"),
        duration: form.querySelector("#duracao"),
        publications: form.querySelector("#publicacoes"),
        videos: form.querySelector("#videos"),
        revisits: form.querySelector("#revisitas"),
        studies: form.querySelector("#estudos")
      };

      // Preenchendo os campos do formulário com os valores atuais do item
      Object.keys(inputs).forEach((key, index) => {
        inputs[key].value = div.getElementsByTagName('td')[index].innerHTML;
        console.log(inputs[key].value);
      });



      // Habilitando os campos do formulário para edição
      const formInputs = form.querySelectorAll("input");
      formInputs.forEach((input) => {
        if (input !== inputs.duration) {
          input.removeAttribute("disabled");

        }
      });
      // Desabilitar o campo de data pois esse campo não deve ser editável.
      //inputs.data.disabled = true;

      // Adicionando o evento de atualização ao botão de submissão do formulário
      const submitButton = form.querySelector("button[type='submit']");
      submitButton.textContent = "Atualizar";
      submitButton.onclick = function (e) {
        e.preventDefault();

        updateItem(inputs.id, inputs.data.value, inputs.startTime.value, inputs.endTime.value, inputs.duration.value, inputs.publications.value, inputs.videos.value, inputs.revisits.value, inputs.studies.value);
        alert("Atividade atualizada com sucesso!");


        // Limpar a tabela
        const table = document.getElementById('myTable');
        while (table.rows.length > 1) {
          table.deleteRow(1);
        }
        getList();

        // Restaurando o botão de submissão para permitir a inserção
        restoreSubmitButton("insert");

        // Limpar o formulário para novas inserções
        form.reset();
      };
    }
  }
};

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5001/atividade?id=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });

}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com data, start_time, end_time, duração, publicações, videos, revisitas e estudos
  --------------------------------------------------------------------------------------
*/

const newItem = () => {
  let inputData = document.getElementById("data").value;
  let inputStartTime = document.getElementById("start_time").value;
  let inputEndTime = document.getElementById("end_time").value;
  let inputDuracao = document.getElementById("duracao").value;
  let inputPublicacoes = document.getElementById("publicacoes").value;
  let inputVideos = document.getElementById("videos").value;
  let inputRevisitas = document.getElementById("revisitas").value;
  let inputEstudos = document.getElementById("estudos").value;

  if (inputData === '') {
    alert("Escolha a data da atividade!");
  } else if (
    (inputPublicacoes === '') ||
    (inputVideos === '') ||
    (inputRevisitas === '') ||
    (inputEstudos === '')
  ) {
    alert("Os campos precisam ser preenchidos corretamente!");
  } else {
    postItem({
      id: 0,
      data: inputData,
      start_time: inputStartTime,
      end_time: inputEndTime,
      duracao: inputDuracao,
      publicacoes: inputPublicacoes,
      videos: inputVideos,
      revisitas: inputRevisitas,
      estudos: inputEstudos,
    });
    //alert("Atividade cadastrada com sucesso!");
  }
};

/*
  --------------------------------------------------------------------------------------
  Função para limpar o formulário e restaurar o botão de submissão para permitir a inserção
  --------------------------------------------------------------------------------------
*/
const clearForm = () => {
  const form = document.getElementById("activity-form");
  const inputs = form.querySelectorAll("input");

  inputs.forEach((input) => {
    input.value = "";
  });
  restoreSubmitButton("insert");
};

/*
  --------------------------------------------------------------------------------------
  Função para calcular duração da atividade
  --------------------------------------------------------------------------------------
*/

// Esta função é chamada sempre que a hora de início ou fim é alterada
function calculateDuration() {
  // Obtenha a hora de início e fim como timestamps
  const startTime = document.getElementById('start_time').valueAsNumber;
  const endTime = document.getElementById('end_time').valueAsNumber;

  // Verifique se ambas as horas são válidas
  if (startTime && endTime) {
    // Verifique se a hora de início é menor que a hora de fim
    if (startTime < endTime) {
      // Calcule a duração em horas
      const duration = (endTime - startTime) / (1000 * 60 * 60);
      // Mostre a duração no campo correspondente
      document.getElementById('duracao').value = duration.toFixed(2);
    } else {
      // Se a hora de início não for menor que a de fim, mostre um alerta
      alert('A hora de início deve ser menor que a hora de fim!');
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (id, data, start_time, end_time, duracao, publicacoes, videos, revisitas, estudos) => {
  const item = [id, data, start_time, end_time, duracao, publicacoes, videos, revisitas, estudos];
  const table = document.getElementById('myTable');
  const row = table.insertRow();

  item.forEach((itemData, i) => {
    const cell = row.insertCell(i);
    cell.textContent = itemData;
  });

  insertDeleteButton(row.insertCell(-1));
  insertEditButton(row.insertCell(-1));
  insertObservacaoButton(row.insertCell(-1), id);


  const form = document.getElementById("activity-form");
  const inputs = {

    data: form.querySelector("#data"),
    startTime: form.querySelector("#start_time"),
    endTime: form.querySelector("#end_time"),
    duration: form.querySelector("#duracao"),
    publications: form.querySelector("#publicacoes"),
    videos: form.querySelector("#videos"),
    revisits: form.querySelector("#revisitas"),
    studies: form.querySelector("#estudos")
  };

  Object.keys(inputs).forEach((key) => {
    inputs[key].value = "";
  });


  removeElement();
  updateElement();
};



/*
  --------------------------------------------------------------------------------------
  Função para restaurar botão Submit para inserção, caso esteja em modo de edição, e vice-versa
  --------------------------------------------------------------------------------------
*/
const restoreSubmitButton = (action) => {
  const form = document.getElementById("activity-form");
  const submitButton = form.querySelector("button[type='submit']");
  const dateField = document.getElementById("data");

  switch (action) {
    case "insert":
      submitButton.textContent = "Submeter";
      submitButton.onclick = function (e) {
        e.preventDefault();
        newItem();
      };
      // Habilita o campo de data quando o caso for "insert"
      dateField.disabled = false;
      break;
    case "update":
      submitButton.textContent = "Atualizar";
      submitButton.onclick = function (e) {
        e.preventDefault();
        updateItem();
      };

      break;

    default:
      // Ação desconhecida, restaurar para inserção
      submitButton.textContent = "Submeter";
      submitButton.onclick = function (e) {
        e.preventDefault();
        newItem();
      };
      // Habilitar campo de data para ação padrão
      dateField.disabled = false;
      break;
  }
};

let atividadeId; // Variável global para armazenar o id da atividade

const openObservacaoModal = (id) => {
  console.log(id);
  // Pegar o modal
  let modal = document.getElementById("observacaoModal");

  // Mostrar o modal
  modal.style.display = "block";

  // Armazenar o id da atividade
  atividadeId = id;
};

// Fecha o modal quando o usuário clicar no botão "X" (span) ou fora do modal.
let span = document.getElementsByClassName("close")[0];
span.onclick = function () {
  let modal = document.getElementById("observacaoModal");
  modal.style.display = "none";
};

window.onclick = function (event) {
  let modal = document.getElementById("observacaoModal");
  if (event.target == modal || event.target == span) {
    modal.style.display = "none";
  }
};



/*
  --------------------------------------------------------------------------------------
  Função para enviar uma solicitação assíncrona para adicionar uma observação ao formulário, 
  tratando a resposta da solicitação e realizando ações correspondentes. 
  Também inclui a lógica para fechar o modal e limpar o campo de texto da observação após 
  o envio do formulário.
  --------------------------------------------------------------------------------------
*/

const form = document.getElementById("observacao-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let texto = document.getElementById("observacao-texto").value;
  console.log(texto);

  let formData = new FormData();
  formData.append("atividade_id", atividadeId);
  formData.append("texto", texto);

  let response = await fetch("http://127.0.0.1:5001/observacao", {
    method: "POST",
    headers: {
      accept: "application/json",
    },
    body: formData,
  });

  if (response.ok) {
    alert("Observação adicionada com sucesso!");
  } else {
    alert("Erro ao adicionar observação");
  }

  // Fechar o modal e limpar o campo de texto
  let modal = document.getElementById("observacaoModal");
  modal.style.display = "none";
  document.getElementById("observacao-texto").value = "";
});













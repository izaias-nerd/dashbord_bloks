// script.js

jsPlumb.ready(function() {
  jsPlumb.setContainer('workspace');

  // Código para arrastar blocos da sidebar
  const sidebarBlocks = document.querySelectorAll('.sidebar .block');

  sidebarBlocks.forEach(block => {
    block.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('blockType', block.getAttribute('data-type'));
    });
  });

  const workspace = document.getElementById('workspace');

  workspace.addEventListener('dragover', function(e) {
    e.preventDefault();
  });

  workspace.addEventListener('drop', function(e) {
    e.preventDefault();

    const blockType = e.dataTransfer.getData('blockType');
    const newBlock = document.createElement('div');
    newBlock.classList.add('block');
    newBlock.setAttribute('data-type', blockType);
    newBlock.innerText = blockType.charAt(0).toUpperCase() + blockType.slice(1);

    newBlock.style.position = 'absolute';
    newBlock.style.left = `${e.clientX - workspace.offsetLeft}px`;
    newBlock.style.top = `${e.clientY - workspace.offsetTop}px`;

    workspace.appendChild(newBlock);

    makeBlockConnectable(newBlock);

    // Adicionar campos de entrada para o nome do bloco e quantidade de conexões
    const blockConfig = document.createElement('div');
    blockConfig.innerHTML = `
      <label for="nome-bloco">Nome do bloco:</label>
      <input type="text" id="nome-bloco" value="${blockType}">
      <br>
      <label for="conexoes">Quantidade de conexões:</label>
      <input type="number" id="conexoes" value="1">
    `;
    newBlock.appendChild(blockConfig);

    // Adicionar opções de bloco funcional
    const functionalBlockOptions = document.createElement('div');
    functionalBlockOptions.innerHTML = `
      <label for="enviar-whatsapp">Enviar mensagem via WhatsApp:</label>
      <input type="checkbox" id="enviar-whatsapp">
      <br>
      <label for="enviar-email">Enviar mensagem via e-mail:</label>
      <input type="checkbox" id="enviar-email">
    `;
    newBlock.appendChild(functionalBlockOptions);

    // Adicionar campos de entrada para o formulário de envio de mensagem
    const whatsappForm = document.createElement('div');
    whatsappForm.innerHTML = `
      <label for="numero-destinatario">Número do destinatário:</label>
      <input type="tel" id="numero-destinatario">
      <br>
      <label for="mensagem">Mensagem:</label>
      <textarea id="mensagem"></textarea>
    `;
    newBlock.appendChild(whatsappForm);

    const emailForm = document.createElement('div');
    emailForm.innerHTML = `
      <label for="email-destinatario">E-mail do destinatário:</label>
      <input type="email" id="email-destinatario">
      <br>
      <label for="mensagem-email">Mensagem:</label>
      <textarea id="mensagem-email"></textarea>
    `;
    newBlock.appendChild(emailForm);
  });

  function makeBlockConnectable(block) {
    jsPlumb.draggable(block, { containment: true });

    // Adicionar vários pontos de conexão para permitir múltiplas conexões
    const commonEndpoint = {
      isSource: true,
      isTarget: true,
      maxConnections: 1, // Permite conexões ilimitadas
      connector: ['Flowchart', { curviness: 50 }],
      endpoint: 'Dot',
      paintStyle: { fill: '#337ab7', radius: 5 },
      hoverPaintStyle: { fill: '#5bc0de' },
      connectorStyle: { stroke: '#5bc0de', strokeWidth: 2 },
      connectorHoverStyle: { stroke: '#d9534f', strokeWidth: 2 }
    };

    // Adicionar pontos de conexão nos lados esquerdo, direito, superior e inferior
    jsPlumb.addEndpoint(block, { anchor: 'TopCenter' }, commonEndpoint);
    jsPlumb.addEndpoint(block, { anchor: 'BottomCenter' }, commonEndpoint);
    jsPlumb.addEndpoint(block, { anchor: 'RightMiddle' }, commonEndpoint);
  }

  // Lidar com a criação de conexões entre blocos
  jsPlumb.bind('connection', function(info) {
    console.log('Conexão criada:', info.sourceId, '->', info.targetId);
  });

  // Lidar com o formulário de envio de mensagem
  function lidarComFormulario(event) {
    event.preventDefault();

    // Obtenha os valores do formulário
    const blockType = event.target.getAttribute('data-type');
    const nomeBloco = document.querySelector(`#${blockType} #nome-bloco`).value;
    const quantidadeConexoes = document.querySelector(`#${blockType} #conexoes`).value;
    const enviarWhatsApp = document.querySelector(`#${blockType} #enviar-whatsapp`).checked;
    const numeroDestinatario = document.querySelector(`#${blockType} #numero-destinatario`).value;
    const mensagem = document.querySelector(`#${blockType} #mensagem`).value;
    const enviarEmail = document.querySelector(`#${blockType} #enviar-email`).checked;
    const emailDestinatario = document.querySelector(`#${blockType} #email-destinatario`).value;
    const mensagemEmail = document.querySelector(`#${blockType} #mensagem-email`).value;

    // Crie o bloco
    criarBloco(blockType, quantidadeConexoes, nomeBloco, enviarWhatsApp, numeroDestinatario, mensagem, enviarEmail, emailDestinatario, mensagemEmail);
  }

  function criarBloco(blockType, quantidadeConexoes, nomeBloco, enviarWhatsApp, numeroDestinatario, mensagem, enviarEmail, emailDestinatario, mensagemEmail) {
    // Implemente a lógica para criar o bloco aqui
    console.log(`Criando bloco ${nomeBloco} do tipo ${blockType} com ${quantidadeConexoes} conexões`);

    if (enviarWhatsApp) {
      // Implemente a lógica para enviar mensagem via WhatsApp aqui
      console.log(`Enviando mensagem via WhatsApp para ${numeroDestinatario}: ${mensagem}`);
    }

    if (enviarEmail) {
      // Implemente a lógica para enviar mensagem via e-mail aqui
      console.log(`Enviando mensagem via e-mail para ${emailDestinatario}: ${mensagemEmail}`);
    }
  }

  // Adicione um listener ao formulário
  document.querySelectorAll('.block').forEach(block => {
    block.addEventListener('submit', lidarComFormulario);
  });
});
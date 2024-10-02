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
  });

  function makeBlockConnectable(block) {
    jsPlumb.draggable(block, { containment: true });

    // Adicionar vários pontos de conexão para permitir múltiplas conexões
    const commonEndpoint = {
      isSource: true,
      isTarget: true,
      maxConnections: -1, // Permite conexões ilimitadas
      //connector: ['Flowchart', { curviness: 1 }],
      //endpoint: 'Dot',
      //paintStyle: { fill: '#337ab7', radius: 5 },
      //hoverPaintStyle: { fill: '#5bc0de' },
      //connectorStyle: { stroke: '#5bc0de', strokeWidth: 1 },
      //connectorHoverStyle: { stroke: '#d9534f', strokeWidth: 2 }
    };

    // Adicionar pontos de conexão nos lados esquerdo, direito, superior e inferior
    jsPlumb.addEndpoint(block, { anchor: 'TopCenter' }, commonEndpoint);
    jsPlumb.addEndpoint(block, { anchor: 'BottomCenter' }, commonEndpoint);
  }

  // Lidar com a criação de conexões entre blocos
  jsPlumb.bind('connection', function(info) {
    console.log('Conexão criada:', info.sourceId, '->', info.targetId);
  });

  // Configurar zoom
  let zoomLevel = 1; // Use 'let' para poder alterar o valor

  document.getElementById('zoom-in').addEventListener('click', function() {
    zoomLevel += 0.1;
    document.querySelectorAll('#workspace .block').forEach(function(block) {
      block.style.transform = 'scale(' + zoomLevel + ')';
    });
  });

  document.getElementById('zoom-out').addEventListener('click', function() {
    zoomLevel = Math.max(0.1, zoomLevel - 0.1);
    document.querySelectorAll('#workspace .block').forEach(function(block) {
      block.style.transform = 'scale(' + zoomLevel + ')';
    });
  });
});

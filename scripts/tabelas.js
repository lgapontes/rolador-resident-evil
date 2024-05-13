let DEBUG = false;

function rolar(elemento,callback) {
  if (elemento.includes('#')) {
    let tipo = elemento.split('#')[1];
    sortearLugar(tipo,callback);
  } else if (elemento == 'itens') {
    let quantidade = Math.floor(Math.random() * 3) + 1;

    let itens = ELEMENTOS['explosivos']
      .concat(ELEMENTOS['municao'])
      .concat(ELEMENTOS['brancas'])
      .concat(ELEMENTOS['armaduras'])
      .concat(ELEMENTOS['fogo_pequenas'])
      .concat(ELEMENTOS['fogo_metralhadoras'])
      .concat(ELEMENTOS['fogo_fuzil'])
      .concat(ELEMENTOS['fogo_shotgun'])
      .concat(ELEMENTOS['fogo_pesadas'])
      .concat(ELEMENTOS['itens']);

    rolarItens(itens, quantidade, retorno=>{
      formatar(retorno,true,callback);
    });

  } else if (elemento == 'walkers') {
    let index_walkers_past = Math.floor(Math.random() * WALKERS_PAST.length);
    let index_walkers_wounds = Math.floor(Math.random() * WALKERS_WOUNDS.length);
    callback(`${WALKERS_PAST[index_walkers_past]}\n${WALKERS_WOUNDS[index_walkers_wounds]}`);
  } else if (elemento == 'npc') {
    rolarNPC(callback);
  } else if (elemento == 'tabela_itens') {
    criarTabelaItens(callback);
  } else if (elemento == 'tabela_issues') {
    criarTabelaIssues(callback);
  } else if (elemento == 'quadros') {
    rolarQuadro(callback);
  } else if (elemento == 'estatuas') {
    rolarEstatua(callback);
  } else if (elemento == 'taxidermia') {
    rolarTaxidermia(callback);
  } else if (elemento == 'personagens') {
    rolarPersonagem(callback);
  } else if (elemento == 'issues') {
    let issues = NPC_SECRET_ISSUES.concat(NPC_ISSUES);
    let index = Math.floor(Math.random() * issues.length);
    callback(issues[index]);
  } else {
    let index = Math.floor(Math.random() * ELEMENTOS[elemento].length);
    callback(ELEMENTOS[elemento][index]);
  }
}

function rolarItens(itens, quantidade, callback) {
  let vetor = [...Array(quantidade).keys()];
  let lista = [];

  vetor.forEach((item, i) => {
    let index = Math.floor(Math.random() * itens.length);
    lista.push(itens[index]);

    if (i == (vetor.length - 1)) {
      verificarQualidade(lista,retorno=>{
        callback(retorno);
      });
    }
  });
}

function rolarItensBasicos(callback) {
  let quantidade = Math.floor(Math.random() * 2) + 1;
  rolarItens(ELEMENTOS['itens'], quantidade, itens=>{

    let armas = [];
    let qual = Math.floor(Math.random() * 6);

    if (qual < 3) {
      armas = ELEMENTOS['brancas'];
    } else if (qual < 6) {
      armas = ELEMENTOS['fogo_pequenas'];
    } else {
      armas = ELEMENTOS['fogo_shotgun'];
    }

    rolarItens(armas, 1, arma=>{
      formatar(itens.concat(arma),false,callback);
    });
  });
}

function criarTabelaItens(callback) {
  let quantidade = Math.floor(Math.random() * 3) + 3;
  rolarItens(ELEMENTOS['itens'], quantidade, itens=>{

    let quantidade_armas = 6 - quantidade;

    let armas = ELEMENTOS['brancas']
      .concat(ELEMENTOS['fogo_pequenas'])
      .concat(ELEMENTOS['fogo_shotgun']);

    rolarItens(armas, quantidade_armas, arma=>{
      let final = itens.concat(arma);
      let texto = `1- ${final[0]}\n2- ${final[1]}\n3- ${final[2]}\n4- ${final[3]}\n5- ${final[4]}\n6- ${final[5]}\n`;

      callback(texto);
    });
  });
}

function criarTabelaIssues(callback) {
  let issues = NPC_ISSUES.concat(NPC_SECRET_ISSUES);
  let vetor = [...Array(6).keys()];
  let final = [];

  vetor.forEach((item, i) => {

    let issue_index = Math.floor(Math.random() * issues.length);
    let issue = issues[issue_index];
    issues.splice(issue_index, 1);

    let issue_eh_secreta = (Math.floor(Math.random() * 3) == 2);
    if (issue_eh_secreta) {
      issue += ' (segredo)';
    }
    final.push(issue);

    if (i == (vetor.length - 1)) {
      let texto = `1- ${final[0]}\n2- ${final[1]}\n3- ${final[2]}\n4- ${final[3]}\n5- ${final[4]}\n6- ${final[5]}\n`;
      callback(texto);
    }
  });
}

function formatar(itens,duas_linhas,callback) {
  let retorno = '';
  let quebra = '\n';
  if (duas_linhas) quebra = '\n\n';

  itens.forEach((item, i) => {
    retorno += `${item}${quebra}`;

    if (i == (itens.length - 1)) {
      callback(retorno);
    }
  });
}

function verificarQualidade(lista,callback) {
  if (lista.length == 0) {
    callback([]);
  }

  let retorno = [];

  let armas = ELEMENTOS['explosivos']
    .concat(ELEMENTOS['brancas'])
    .concat(ELEMENTOS['armaduras'])
    .concat(ELEMENTOS['fogo_pequenas'])
    .concat(ELEMENTOS['fogo_metralhadoras'])
    .concat(ELEMENTOS['fogo_fuzil'])
    .concat(ELEMENTOS['fogo_shotgun'])
    .concat(ELEMENTOS['fogo_pesadas']);

  lista.forEach((item, i) => {
    let eh_arma = false;
    if (armas.includes(item)) {
      eh_arma = true;
    }

    if (eh_arma) {
      let qualidade = Math.floor(Math.random() * QUALIDADE_ARMAS.length);
      retorno.push(`${item}, ${QUALIDADE_ARMAS[qualidade]}`);
    } else {
      retorno.push(item);
    }

    if (i == (lista.length - 1)) {
      callback(retorno);
    }

  });
}

function selecionarSkills(skills,quantidade,callback) {
  if (quantidade == 0) {
    callback(skills,'');
  } else {
    let vetor = [...Array(quantidade).keys()];
    skills = JSON.parse(JSON.stringify(skills));
    let retorno = '';

    vetor.forEach((item, i) => {
      let index = Math.floor(Math.random() * skills.length);
      retorno += (retorno == '') ? skills[index] : `, ${skills[index]}`;
      skills.splice(index, 1);

      if (i == (vetor.length - 1)) {
        callback(skills,retorno);
      }
    });
  }
}

const ATTRIBUTES = [
  'Strength', // 0
  'Agility', // 1
  'Wits', // 2
  'Empathy', // 3
];

const SKILLS = [
  'Close Combat', // 0
  'Endure', // 1
  'Force', // 2
  'Mobility', // 3
  'Ranged Combat', // 4
  'Stealth', // 5
  'Scout', // 6
  'Survival', // 7
  'Tech', // 8
  'Leadership', // 9
  'Manipulation', // 10
  'Medicine', // 11
];

const CARACTERISTICAS = [
  'Agente S.W.A.T.', // 0
  'Escritório Umbrella', // 1
  'Cientista Umbrella', // 2
  'Staff Umbrella', // 3
  'Político Umbrella', // 4
  'Agente UBCS', // 5
  'Escritório UBCS', // 6
  'Agente U.S.S.', // 7
  'Agente F.B.I.', // 8
  'Médico', // 9
  'Policial Raccoon City', // 10
  'Bombeiro Raccoon City', // 11
  'Civil', // !2
  'Civil', // 13
  'Civil', // 14
  'Civil', // 15
  'Civil', // 16
  'Motorista Caminhão', // 17
  'Motorista Ambulância', // 18
  'Adestrador Animais', // 19
  'Vendedor', // 20
  'Vendedor', // 21
  'Vendedor', // 22
  'Staff Hospital', // 23
  'Staff Delegacia', // 24
  'Staff Parlamento', // 25
  'Administrador Parlamento', // 26
  'Político Parlamento', // 27
  'Fazendeiro', // 28
  'Motodista Ônibus', // 29
  'Cientista', // 30
  'Morador de Rua', // 31
  'Paciente Hospital', // 32
  'Paciente Hospital', // 33
  'Administrador Orfanato', // 34
  'Staff Raccoon City', // 35
  'Veterinário', // 36
];

const CARACTERISTICAS_CRIANCA = [
  'Filho(a) de Cientista Umbrella', // 0
  'Filho(a) de Político Umbrella', // 1
  'Filho(a) de Agente UBCS', // 2
  'Filho(a) de Motorista Caminhão', // 3
  'Adestrador Animais', // 4
  'Filho(a) de Administrador Parlamento', // 5
  'Filho(a) de Político Parlamento', // 6
  'Filho(a) de Fazendeiro', // 7
  'Filho(a) de Motodista Ônibus', // 8
  'Filho(a) de Cientista', // 9
  'Morador de Rua', // 10
  'Morava no Orfanato', // 11
  'Filho(a) de Veterinário', // 12
  'Civil', // 13
  'Civil', // 14
  'Civil', // 15
];

const ARQUETIPOS = {
  'CRIMINOSO (THE CRIMINAL) - Ex: Billy Coen, RE0': {
    attribute: ATTRIBUTES[0],
    skill: SKILLS[0],
    talents: ['Threatening Posture', 'Fixer', 'Fights Dirty',],
    caracteristicas: CARACTERISTICAS,
  },
  'MÉDICO (THE DOCTOR) - Ex: Rebecca Chambers, RE0': {
    attribute: ATTRIBUTES[3],
    skill: SKILLS[11],
    talents: ['Emergency Medicine', 'Doctor/Patient Hierarchy', 'Seen it All',],
    caracteristicas: CARACTERISTICAS,
  },
  'FAZENDEIRO (THE FARMER) - Ex: Luis Sera, RE4': {
    attribute: ATTRIBUTES[0],
    skill: SKILLS[2],
    talents: ['Tracker', 'Tough as Nails', 'Living off the Land',],
    caracteristicas: CARACTERISTICAS,
  },
  'DONO DE CASA (THE HOMEMAKER) - Ex: Ethan Winters, RE7': {
    attribute: ATTRIBUTES[0],
    skill: SKILLS[1],
    talents: ['Innocent Face', 'Back Against the Wall', 'Rather Die than Break',],
    caracteristicas: CARACTERISTICAS,
  },
  'CRIANÇA (THE KID) - Ex: Ashley Graham, RE4': {
    attribute: ATTRIBUTES[1],
    skill: SKILLS[3],
    talents: ['Knife Fighter', 'Stubborn', 'A Child of this World',],
    caracteristicas: CARACTERISTICAS_CRIANCA,
  },
  'APLICADOR DA LEI (THE LAW ENFORCER) - EX: Leon S. Kennedy, RE2': {
    attribute: ATTRIBUTES[2],
    skill: SKILLS[6],
    talents: ['Steady Hands', 'Watchful', 'Moral Compass',],
    caracteristicas: CARACTERISTICAS,
  },
  'NINGUÉM (THE NOBODY) - Ex: Ada Wong, RE4': {
    attribute: ATTRIBUTES[1],
    skill: SKILLS[5],
    talents: ['Speed Freak', 'Wallflower', 'Gatherer',],
    caracteristicas: CARACTERISTICAS,
  },
  'EXPLORADOR (THE OUTCAST) - Ex: Claire Redfield, RE2': {
    attribute: ATTRIBUTES[2],
    skill: SKILLS[7],
    talents: ['Knows All the Tricks', 'Scavenger', 'Lone Wolf',],
    caracteristicas: CARACTERISTICAS,
  },
  'POLÍTICO (THE POLITICIAN) - Ex: Brian Irons, RE2 (inimigo no jogo)': {
    attribute: ATTRIBUTES[3],
    skill: SKILLS[10],
    talents: ['Recruiter', 'Mind Games', 'Right Word at the Right Time',],
    caracteristicas: CARACTERISTICAS,
  },
  'PREGADOR (THE PREACHER) - Ex: Osmund Saddler, RE4 (inimigo no jogo)': {
    attribute: ATTRIBUTES[3],
    skill: SKILLS[9],
    talents: ['Shepherd', 'Guarded by a Higher Power', 'Preacher',],
    caracteristicas: CARACTERISTICAS,
  },
  'CIENTISTA (THE SCIENTIST) - Ex: Mia Winters, RE7': {
    attribute: ATTRIBUTES[2],
    skill: SKILLS[8],
    talents: ['Intuition', 'Techno Babbler', 'Handy',],
    caracteristicas: CARACTERISTICAS,
  },
  'SOLDADO (THE SOLDIER) - Ex: Jill Valentine, RE1': {
    attribute: ATTRIBUTES[2],
    skill: SKILLS[4],
    talents: ['Disillusioned', 'Eye on the Ball', 'Suppressive Fire',],
    caracteristicas: CARACTERISTICAS,
  },
};

const TALENTS = {
  'Threatening Posture': 'Você pode usar Force em vez de Manipulation ao ameaçar alguém. Você arruinou a vida de alguém.',
  'Fixer': 'Você ganha +2 em Manipulation quando negocia um acordo. Você foi muito bem em uma negociação.',
  'Fights Dirty': 'Quando você luta desarmado, você causa +1 de dano. Você matou alguém com as próprias mãos.',
  'Emergency Medicine': 'Ganhe +2 em Medicine ao estabilizar um ferimento crítico que precise de equipamento médico básico. Você trabalhava em um pronto-socorro.',
  'Doctor/Patient Hierarchy': 'Quando você usa Manipulation contra alguém que está ferido, você recebe um bônus igual ao número de Pontos de Vida que ele sofreu em dano. De alguma forma, você usou um de seus pacientes para seu próprio benefício.',
  'Seen it All': 'Você não fica estressado ao ver alguém ser ferido, atormentado ou até mesmo quebrado. Você tentou salvar seu amigo ferido.',
  'Innocent Face': 'Você ganha +2 em Manipulation quando age inocentemente na frente de um estranho. Você fez alguém acreditar que você era fraco.',
  'Back Against the Wall': 'Quando você luta contra todas as probabilidades e os inimigos parecem estar vencendo, você causa +1 de dano em todos os ataques. Você revidou.',
  'Rather Die than Break': 'Uma vez por sessão, depois de testar uma perícia, você pode optar por perder um ponto de Saúde para obter um sucesso (extra) naquele teste de perícia. Você precisa ser capaz de explicar, no jogo, como você foi prejudicado pela situação. Você se sacrificou por um propósito maior.',
  'Knife Fighter': 'Você inflige +1 de dano quando luta com uma faca. Você esfaqueou alguém.',
  'Stubborn': 'Seu Drive lhe dá um bônus de +3 em vez de +2. Você não desistiu.',
  'A Child of this World': 'Você não fica estressado quando vê alguém ser mordido. Alguém que você amava foi mordido.',
  'Steady Hands': 'Uma vez em cada sessão você pode optar por não lançar nenhum dado de estresse em um teste de perícia. Você se manteve firme apesar da extrema pressão.',
  'Watchful': 'Você pode usar o Scout para aprender a dinâmica de um grupo de pessoas e as oportunidades e riscos nele contidos. Você precisa passar algum tempo com eles. Dessa forma, você poderá aprender tanto sobre problemas regulares quanto sobre problemas secretos. Você previu o perigo.',
  'Moral Compass': 'Quando você se coloca em perigo para defender o que é certo, você alivia um ponto do estresse. Você fez o que tinha que fazer.',
  'Tracker': 'Ganhe +2 em Survival ao rastrear alguém ou tentar esconder seus próprios rastros. Você rastreou alguém ou algo assim.',
  'Tough as Nails': 'Ganhe +2 para Endure quando você passar fome ou trabalhar duro. Você teve que se esforçar além de seus próprios limites.',
  'Living off the Land': 'Ganhe +2 em Tech ao trabalhar em projetos que aumentam a Capacity do seu refúgio. Você ganhava a vida com a terra.',
  'Speed Freak': 'Ganhe +2 ao usar Mobility para dirigir um veículo. Você ganhou uma corrida.',
  'Wallflower': 'Você não precisa escolher um único NPC como seu NPC Âncora. Em vez disso, todo o grupo é a sua âncora. Você não precisa lidar com seu medo se algum deles morrer, desde que pelo menos um deles permaneça de pé. Você fazia parte de um grupo, sem que nenhum deles realmente notasse você.',
  'Gatherer': 'Você ganha +2 em Stealth quando está sozinho. Você trouxe comida que manteve outros vivos.',
  'Knows All the Tricks': 'Você pode usar Stealth em vez de Manipulation quando mente. Você enganou alguém que tentou dominar você.',
  'Scavenger': 'Quando você vasculha e testa Survival, você recebe +2 rações para cada sucesso extra em vez de +1. Você sobreviveu com nada.',
  'Lone Wolf': 'Você pode ter a si mesmo como uma de suas duas âncoras. Você foi traído por alguém em quem confiava.',
  'Recruiter': 'Você pode usar Leadership em vez de Manipulation quando falar em defesa de sua causa. Você conquistou alguém para o seu lado.',
  'Mind Games': 'Você alivia um estresse quando consegue manipular alguém com sucesso. Você quebrou seu oponente em um debate.',
  'Right Word at the Right Time': 'Quando você tem sucesso com Leadership, você obtém um sucesso extra automático. Você os tinha na palma da sua mão.',
  'Shepherd': 'Qualquer pessoa pode usá-lo como âncora quando precisar aliviar o estresse, mesmo que você não seja a âncora deles. Você cuidava do seu rebanho.',
  'Guarded by a Higher Power': 'Quando você lança um dado aleatório para ver se foi atingido ou mordido, você pode jogar novamente uma vez. Você foi salvo contra todas as probabilidades.',
  'Preacher': 'Ganhe +2 em Leadership ao tentar influenciar um grupo de pessoas. Eles seguiram você.',
  'Intuition': 'Uma vez por sessão de jogo, você pode perguntar ao Mestre sobre como as coisas no mundo do jogo funcionam e estão relacionadas, para obter algumas informações úteis ou sugestões sobre como proceder. Você enfrentou um desafio impossível.',
  'Techno Babbler': 'Você pode usar Tech em vez de Manipulation ao discutir assuntos complexos. Você usou a ciência para conseguir o que queria.',
  'Handy': 'Com um pouco de tempo e algumas ferramentas, você pode consertar a maioria das coisas – mesmo que não tenha as peças certas. Você também ganha +2 em Tech ao consertar coisas como um projeto. Alguém lhe ensinou a consertar e construir coisas.',
  'Disillusioned': 'Você não se estressa ao ver outras pessoas cometerem atos brutais de violência, ou quando você mesmo os comete. Você viu um grande sofrimento.',
  'Eye on the Ball': 'Alivie um estresse toda vez que uma ameaça ou inimigo for derrotado ou superado. Você fez o que tinha que ser feito.',
  'Suppressive Fire': 'Você pode atacar até três inimigos com o mesmo ataque ao usar o Combate à Distância, mas todos eles sofrem um ponto a menos de dano e você não pode adicionar dano de sucessos extras. Você foi treinado para ser um soldado.',
};

const DRIVES = [
  'Cumprir a missão',
  'Proteger o grupo',
  'Sobreviver, mesmo que sozinho',
  'Meu treinamento me salvou',
  'Descobrir a verdade',
  'Tenho medo de morrer aqui',
  'Ninguém me engana',
  'Sou eu quem manda aqui',
  'Preciso sair daqui',
  'Sou inabalável',
  'Quero provar que eles estão errados',
  'Eu tenho certeza disso',
  'Preciso salvar todos',
  'Quero voltar para casa',
  'Sigo meus instintos',
  'Sinto que vou enlouquecer',
];

function rolarAtributos(eh_5,principal,callback) {
  let atributos = JSON.parse(JSON.stringify(ATTRIBUTES));
  let valor_principal = (eh_5 ? 5 : 4);
  let pontos = 13 - valor_principal;
  let retorno = {};
  retorno[principal] = valor_principal;

  // debug
  let soma = 0;
  soma = soma + valor_principal;

  let index_principal = atributos.indexOf(principal);
  atributos.splice(index_principal, 1);

  atributos.forEach((atributo, i) => {
    let valor = pontos;
    if (i < (atributos.length - 1)) {
      valor = Math.floor(Math.random() * 3) + 2;
    }

    pontos = pontos - valor;
    if (i == (atributos.length - 2)) {
      if (pontos == 1) {
        pontos = pontos + 1;
        valor = valor - 1;
      }
    }

    retorno[atributo] = valor;
    soma = soma + valor;

    if (i == (atributos.length - 1)) {
      let texto = `Strength: ${retorno['Strength']}, Agility: ${retorno['Agility']}, Wits: ${retorno['Wits']}, Empathy: ${retorno['Empathy']}`;
      if (DEBUG) {
        texto += `, P: ${pontos}, S: ${soma}`;
      }
      callback(texto);
    }
  });
}

function rolarSkills(principal,callback) {
  let skills = JSON.parse(JSON.stringify(SKILLS));
  let valor_principal = 3;
  let pontos = 12 - valor_principal;
  let retorno = {};
  retorno[principal] = valor_principal;

  // debug
  let soma = 0;
  soma = soma + valor_principal;

  let index_principal = skills.indexOf(principal);
  skills.splice(index_principal, 1);

  //let vetor = [...Array(skills).keys()];

  //vetor.forEach((elemento, i) => {
  while (skills.length > 0) {

    let index = Math.floor(Math.random() * skills.length);
    let skill_sorteada = skills[index];
    skills.splice(index, 1);

    let valor = 0;
    if (pontos > 0) {
      if (skills.length < 4) {
        valor = 2;
      } else {
        valor = Math.floor(Math.random() * 2) + 1;
      }
    }

    pontos = pontos - valor;

    if (pontos < 0) {
      valor = valor - Math.abs(pontos);
      pontos = 0;
    }

    retorno[skill_sorteada] = valor;
    soma = soma + valor;

    //if (i == (vetor.length - 1)) {
    if (skills.length == 0) {

      let formatar = JSON.parse(JSON.stringify(SKILLS));
      let texto = '';

      formatar.forEach((skill_formatada, j) => {
        texto += `${skill_formatada}: ${retorno[skill_formatada]}`;

        if (j == (formatar.length - 1)) {
          if (DEBUG) {
            texto += `, P: ${pontos}, S: ${soma}`;
          }
          callback(texto);
        } else {
          texto += ', ';
        }
      });

    }
  };
}

function rolarPersonagem(callback) {
  var arquetipos = Object.keys(ARQUETIPOS);
  let arquetipo = arquetipos[Math.floor(Math.random() * arquetipos.length)];
  let nome = NOMES[Math.floor(Math.random() * NOMES.length)];
  let index_caracteristica = Math.floor(Math.random() * ARQUETIPOS[arquetipo].caracteristicas.length);
  let caracteristicas = ARQUETIPOS[arquetipo].caracteristicas[index_caracteristica];
  let drive = DRIVES[Math.floor(Math.random() * DRIVES.length)];
  let index_talento = Math.floor(Math.random() * ARQUETIPOS[arquetipo].talents.length);
  let talento = ARQUETIPOS[arquetipo].talents[index_talento];
  talento += '\n' + TALENTS[talento];

  let issues = NPC_ISSUES.concat(NPC_SECRET_ISSUES);
  let issue = issues[Math.floor(Math.random() * issues.length)];
  let issue_eh_secreta = (Math.floor(Math.random() * 3) == 2);
  if (issue_eh_secreta) {
    issue += ' (segredo)';
  }

  let atributo_eh_5 = (Math.floor(Math.random() * 3) < 2);

  rolarAtributos(atributo_eh_5,ARQUETIPOS[arquetipo].attribute,atributos=>{
    rolarSkills(ARQUETIPOS[arquetipo].skill,skills=>{
      rolarItensBasicos(npc_gear=>{
        let personagem = `Nome: ${nome}\n`;
        personagem += `Arquetipo: ${arquetipo}\n\n`;
        personagem += `Atributos: ${atributos}\n\n`;
        personagem += `Skills: ${skills}\n\n`;
        personagem += `Talento: ${talento}\n\n`;
        personagem += `Drive: ${drive}\n`;
        personagem += `História: ${caracteristicas}\n`;
        personagem += `Issue: ${issue}\n\n`;
        personagem += `Equipamentos:\n${npc_gear}\n`;

        callback(personagem);
      });
    });
  });
}

function rolarNPC(callback) {
  let dado = Math.floor(Math.random() * 6) + 1;
  let trained = 0;
  let expert = 0;

  if (dado == 1) {
    // zerado
  } else if (dado == 2) {
    trained = 1;
  } else if (dado == 3) {
    trained = 2;
  } else if (dado == 4) {
    trained = 1;
    expert = 1;
  } else if (dado == 5) {
    trained = 2;
    expert = 1;
  } else {
    trained = 3;
    expert = 2;
  }

  let nome = NOMES[Math.floor(Math.random() * NOMES.length)];
  let caracteristicas = CARACTERISTICAS[Math.floor(Math.random() * CARACTERISTICAS.length)];
  let npc_issues = NPC_ISSUES[Math.floor(Math.random() * NPC_ISSUES.length)];
  let npc_secret_issues = NPC_SECRET_ISSUES[Math.floor(Math.random() * NPC_SECRET_ISSUES.length)];

  rolarItensBasicos(npc_gear=>{
    selecionarSkills(SKILLS,trained,(skills,trained_skills)=>{
      selecionarSkills(skills,expert,(skills,expert_skills)=>{
        let npc = `Nome: ${nome}\n`;
        npc += `Skills (4 dados): ${skills.join(', ')}\nTrained skills (5 dados): ${(trained_skills == '') ? 'Nenhuma' : trained_skills}\nExpert skills (8 dados): ${(expert_skills == '') ? 'Nenhuma' : expert_skills}\n`;
        npc += `Caracteristicas: ${caracteristicas}\n`;
        npc += `Issues: ${npc_issues}\n`;
        npc += `Secret Issues: ${npc_secret_issues}\n`;
        npc += `Gear:\n${npc_gear}\n`;

        callback(npc);
      });
    });
  });
}

const WALKERS_PAST = [
  'Professor hippie',
  'Criança com brinquedo',
  'Roqueiro punk',
  'Vendedor de carros',
  'Professor de jardim de infância',
  'Paciente de asilo',
  'Nerd da informática',
  'Entusiasta de OVNIs',
  'Avó',
  'Político',
  'Policial',
  'Membro do culto',
  'Caçador',
  'Carpinteiro',
  'Babá',
  'Adolescente gótico',
  'Fanático por esportes',
  'Rico esnobe',
  'Morador de rua',
  'Velho roqueiro',
  'Viciado',
  'Zelador',
  'Garçom',
  'Padre',
  'Entrega de pizza',
  'Coletor de lixo',
  'Celebridade',
  'Carteiro',
  'Jornalista',
  'Soldado',
  'Criança com tiara',
  'Gângster',
  'Adolescente com aparelho',
  'Pregador do Juízo Final',
  'Pessoa excêntrica',
  'Motorista de caminhão',
];

const WALKERS_WOUNDS = [
  'Braço arrancado do corpo',
  'Buraco na barriga, intestinos para fora',
  'Olho comido por pássaros',
  'Um pé pendurado por um fio de músculo',
  'Crânio aberto, com cérebro à mostra',
  'Partes do abdômen comidas',
  'Carne da garganta pendurada',
  'Ferimentos de arma de fogo por toda a parte superior do corpo',
  'Algemas presas a um braço e cortes de faca no rosto',
  'Feridas de lança nas pernas',
  'Ferimento de arma de fogo no peito',
  'Pescoço quebrado',
  'Nariz e lábios arrancados',
  'Podre e quase desmoronando',
  'Corpo seco, esqueleto visível através da pele',
  'Coberto de feridas abertas',
  'Inchado como um balão',
  'Sem braços',
  'Sem maxilar inferior',
  'Quase despedaçado, corpo prestes a desabar',
  'Seta na garganta',
  'Queimado por eletricidade',
  'Muitas feridas de faca',
  'Bandagens podres',
  'Pele comida do rosto',
  'Falta uma mão',
  'Sem cabelo, sem dentes, apenas pele e osso',
  'Pele cozida em água quente',
  'Mofado e cheio de vermes',
  'Meio queimado',
  'Lança quebrada saindo do corpo',
  'Corpo esmagado',
  'Recém-afogado',
  'Carne faltando nas costas e no pescoço (parece bem visto de frente)',
  'Mãos amarradas, tiro no peito',
  'Morreu no leito de doença, com gotejamento de infusão ainda preso',
];

const NPC_ISSUES = [
  'Covarde',
  'Nunca desiste',
  'Busca afirmação',
  'Quer ser o líder',
  'Sempre à procura de problemas',
  'Nunca para de falar',
  'Depressivo',
  'Nervoso',
  'Facilmente insultado',
  'Alcoólico',
  'Sempre procurar armas',
  'Valentão',
  'Pega o que ele quer',
  'Religioso',
  'Abundante',
  'Coração frio',
  'Obcecado fotos',
  'Sacrifica qualquer coisa para sobreviver',
  'Ri do mundo',
  'Esquisito',
  'Defende a Umbrella',
  'Não confia em ninguém',
  'Não quer sair de Raccoon City',
  'Passado criminoso',
  'Pacifista',
  'Se importa apenas com os seus',
  'Quer fugir de Raccoon City',
  'Espera o pior de todos',
  'Enlouquece facilmente',
  'Solitário',
  'Quer fazer o que é certo',
  'Gosta de mentir',
  'Ferido mortalmente',
  'Não segue regras',
  'Questiona o líder',
];

const NPC_SECRET_ISSUES = [
  'Suicida',
  'Assassino',
  'Viciado em drogas',
  'Mantém alguém trancado em algum lugar',
  'Adora os mortos',
  'Quer matar alguém',
  'Loucamente apaixonado por alguém que não sente o mesmo',
  'Psicopata',
  'Quer ver o mundo queimar',
  'Puni-se',
  'Ouve vozes de comando',
  'Traumatizado',
  'Adora lutar',
  'Traidor',
  'Mentiroso compulsivo',
  'Plano secreto',
  'Quer alguém no grupo',
  'Mentira sobre tudo',
  'Finge ser habilidoso',
  'Mentiras sobre as atrocidades que cometeram',
  'Espalha rumores para ganhar poder',
  'Trabalha secretamente para a Umbrella',
  'Piromaníaco',
  'Mata seus oponentes',
  'Não se lembra de sua verdadeira identidade',
  'Mentiras sobre o que fez',
  'Mantém um parente morto',
  'Treinou alguém para matar',
  'Sabe que algo vai acontecer em Raccoon City',
  'Acredita que os zumbis são um castigo de Deus',
  'Ladrão',
  'Gosta de atormentar os adversários',
  'Sabe sobre túneis secretos cheios de recursos',
  'Esta infectado com o vírus',
  'Tem uma doença contagiosa',
  'Droga as pessoas e leva seus equipamentos ou as aprisiona',
  'Deseja matar alguém em particular',
  'Vai roubar os alimentos e fugir sozinho',
  'Vai roubar as armas e fugir sozinho',
  'Matou todos que conhecia',
  'Não consegue dormir',
  'Tem dupla personalidade, mas não sabe disso',
  'Sonâmbulo',
  'Não tem coragem para atacar ninguém, nem zumbis',
  'Era militar e cumpriu ordens horríveis',
  'Tem ataques de pânico',
  'Fala mal de todos pelas costas',
  'Fala que vai ajudar mas na hora foge',
  'Não confia em ninguém',
  'Não fala a verdade quase nunca',
  'Gasta recursos de forma irresponsável',
  'Não cumpre suas obrigações',
  'Amigo dos Zumbis',
  'Cleptomaníaco',
  'Diz ser médico, mas não conhece nada sobre medicina ou primeiros socorros',
  'Bate nos mais fracos',
  'Vai matar alguém dormindo por raiva',
  'Nunca sai da base, nem para protegê-la',
];

const QUALIDADE_ARMAS = [
  'Qualidade: Quebrado (Tech para consertar)',
  'Qualidade: Ruin (1 no Dado de Stress quebra)',
  'Qualidade: Bom',
  'Qualidade: Ótima qualidade',
];

const ELEMENTOS = {
  explosivos: [
    'Granada Atordoante (Alvos perdem ação)',
    'Coquetel Molotov (Blast Power 6)',
    'Granada de Mão (Blast Power 8)',
    'Mina de contato direto (Blast Power 8)',
    'Bomba caseira (Blast Power 6)',
    'Granada Pesada (Blast Power 10)',
    'Bomba Remota (Blast Power 8)',
  ],
  municao: [
    'Virotes',
    'Projéteis 9mm',
    'Cartucho Calibre 12',
    'Projéteis .44',
    '1x Projétil Ácido (lança-granadas)',
    '1x Projétil Fogo (lança-granadas)',
    'Combustível Lança-chamas (3 usos)',
    'Projéteis .38',
    '1x Míssil',
  ],
  brancas: [
    'Machado (Bônus +1, Dano 2)',
    'Canivete (Bônus +0, Dano 1)',
    'Faca de Sobrevivência (Bônus +1, Dano 1)',
    'Pé de Cabra (Bônus +1, Dano 2)',
    'Serra Elétrica (10 usos, Bônus +2, Dano 3)',
    'Serra Circular (5 usos, Bônus +0, Dano 3)',
    'Faca de Combate (Bônus +1, Dano 1)',
    'Faca de Luta (Bônus +1, Dano 1)',
    'Faca de Cozinha (Bônus +0, Dano 1)',
    'Faca Curta (Bônus +0, Dano 1)',
    'Faca Retaliadora LZ (Lâmina de particulas, BSAA, Bônus +1, Dano 1)',
    'Faca Karambit (Lâmina curvada, Bônus +1, Dano 1)',
    'Machado Pequeno (Bônus +2, Dano 1)',
    'Machado de Bombeiro (Bônus +1, Dano 2)',
    'Taco de Baseball (Bônus +1, Dano 2)',
    'Cano de Ferro (Bônus +1, Dano 1)',
    'Corrente (Bônus +1, Dano 1)',
    'Espada decorativa (Bônus +1, Dano 1)',
    'Espada militar (Bônus +2, Dano 1)',
    'Cacetete Policial (Bônus +1, Dano 1)',
    'Cacetete S.W.A.T. (Bônus +1, Dano 1)',
    'Spray Atordoantes (1 uso, Bônus +1, Alvos perdem ação)',
    'Balestra (Munição: Virotes, Bônus +2, Dano 2, Distância Longa)',
    'Besta (Munição: Virotes, Bônus +1, Dano 2, Distância Curta)',
    'Besta Decoração (Munição: Virotes, Bônus +1, Dano 1, Distância Curta)',
  ],
  armaduras: [
    'Escudo Policial (Armor Level 2, -1 Mobility)',
    'Colete S.W.A.T. (Armor Level 8, -3 Mobility)',
    'Colete Policial (Armor Level 4, -2 Mobility)',
    'Macacão Bombeiro (Armor Level 4, -2 Mobility)',
    'Macacão Perigo Biológico (-4 Virulence, -1 Mobility)',
    'Capacete S.W.A.T. (Armor Level 2, -1 Mobility)',
  ],
  fogo_pequenas: [
    'Pistola LEMI (Munição: .38, Bônus +1, Dano 1, Distância Curta)',
    'Pistola M1911 (Munição: 9mm, Bônus +2, Dano 2, Distância Curta)',
    'Pistola SG-09 R (Munição: 9mm, Bônus +2, Dano 1, Distância Curta)',
    'Pistola Blacktail (Munição: 9mm, Bônus +2, Dano 1, Distância Curta)',
    'Pistola Punisher (Munição: 9mm, Bônus +2, Dano 2, Distância Curta)',
    'Pistola Matilda (Munição: .38, Bônus +2, Dano 1, Distância Curta)',
    'Pistola G17 (Munição: 9mm, Bônus +1, Dano 2, Distância Curta)',
    'Pistola MPM (Munição: 9mm, Bônus +1, Dano 2, Distância Curta)',
    'Revólver Raspado (Munição: .38, Bônus +1, Dano 2, Distância Curta)',
    'Revólver Antigo (Munição: .38, Bônus +1, Dano 2, Distância Curta)',
    'Revólver Policial (Munição: .38, Bônus +1, Dano 2, Distância Curta)',
    'Magnum (Munição: .44, Bônus +2, Dano 3, Distância Curta)',
    'Revólver Magnum (Munição: .44, Bônus +3, Dano 3, Distância Curta)',
    'M1851 Mata Lobos (Munição: .44, Bônus +2, Dano 3, Distância Curta)',
    'Pistola M1911 com Silenciador (Munição: 9mm, Bônus +2, Dano 2, Distância Curta)',
    'Pistola Matilda com Silenciador (Munição: .38, Bônus +2, Dano 1, Distância Curta)',
  ],
  fogo_metralhadoras: [
    'Metralhadora USM-AI (Munição: .38 (3 por tiro), Bônus +2, Dano 2, Distância Longa)',
    'Metralhadora P19 (Munição: .38 (3 por tiro), Bônus +2, Dano 2, Distância Longa)',
    'Sub-Machine Gun (Munição: .38 (4 por tiro), Bônus +2, Dano 2, Distância Longa)',
  ],
  fogo_fuzil: [
    'Rifle Dragão (Munição: 9mm, Bônus +3, Dano 2, Distância Longa)',
    'Rifle de Assalto WCX (Munição: 9mm, Bônus +3, Dano 2, Distância Longa)',
    'Rifle Stingray (Munição: 9mm, Bônus +3, Dano 2, Distância Longa)',
    'Fuzil SR M1903 (Munição: 9mm, Bônus +2, Dano 2, Distância Longa)',
    'Fuzil F2 (Munição: 9mm, Bônus +2, Dano 2, Distância Longa)',
    'Fuzil de Assalto CQBR (Munição: 9mm, Bônus +3, Dano 2, Distância Longa)',
  ],
  fogo_shotgun: [
    'Escopeta W870 TAC (Munição: Calibre 12, Bônus +3, Dano 2, Distância Curta)',
    'Escopeta Motim (Munição: Calibre 12, Bônus +3, Dano 2, Distância Curta)',
    'Escopeta Striker (Munição: Calibre 12, Bônus +3, Dano 2, Distância Curta)',
    'Espingarda M21 (Munição: Calibre 12, Bônus +2, Dano 3, Distância Curta)',
    'Espingarda M37 (Munição: Calibre 12, Bônus +2, Dano 2, Distância Curta)',
    'Espingarda de Caça (Munição: Calibre 12, Bônus +2, Dano 2, Distância Curta)',
    'Shotgun (Munição: Calibre 12, Bônus +3, Dano 2, Distância Curta)',
    'Assault Shotgun (Munição: Calibre 12, Bônus +3, Dano 2, Distância Curta)',
  ],
  fogo_pesadas: [
    'Lança-granadas GM 79 (Munição: Projétil, Bônus +3, Dano 3, Distância Curta)',
    'Lança-chamas (Munição: Combustível, Bônus +3, Dano 3, Distância Curta)',
    'Lança-mísseis (Munição: Míssil, Bônus +3, Dano 3, Distância Longa)',
  ],
  itens: [
    'Algema com chaves',
    'Algema sem chaves',
    'Fogão portátil',
    'Fogão portátil quebrado',
    'Fogão portátil enferrujado',
    'Pratos',
    'Pratos quebrados',
    'Garfo enferrujado',
    'Garfo quebrado',
    'Garfo',
    'Faca de cozinha',
    'Faca de cozinha enferrujada',
    'Faca de pão',
    'Xícara quebrada',
    'Xícara',
    'Copo grande',
    'Copo de criança',
    'Copo quebrado',
    'Copo',
    'Panela',
    'Frigideira',
    'Panela de Pressão',
    'Panela de ferro',
    'Panela de cerâmica',
    'Panela de inox',
    'Panela de vidro',
    'Panela de alumínio',
    'Pano de prato',
    'Pano de mesa',
    'Escorredor de louça',
    'Tábua',
    'Tábua mofada',
    'Tigela pequena de ferro',
    'Tigela pequena de cerâmica',
    'Tigela pequena de vidro',
    'Tigela pequena de plástico',
    'Tigela grande de ferro',
    'Tigela grande de cerâmica',
    'Tigela grande de vidro',
    'Tigela grande de plástico',
    'Espátula',
    'Pegadores de cozinha',
    'Colher de cozinha',
    'Concha de cozinha',
    'Abridor de lata',
    'Detergente',
    'Esponja',
    'Ralador',
    'Lixeira de cozinha',
    'Lixeira de banheiro',
    'Jarra de Vidro',
    'Jarra de Plástico',
    'Forma de gelo',
    'Rodo de banheiro',
    'Rodo de casa',
    'Espelho pequeno',
    'Espelho de parede médio',
    'Espelho de mão',
    'Prateleira de madeira',
    'Prateleira de ferro',
    'Calendário de papel',
    'Porta escova',
    'Escova de dente',
    'Pasta de dente',
    'Tapete de banheiro',
    'Tapete de porta',
    'Tapete grande',
    'Toalha de mão',
    'Toalha de banho',
    'Roupão de banho',
    'Chinelo',
    'Extensão de tomadas',
    'Adaptador de tomadas',
    'Lâmpada de LED',
    'Lâmpada fluorescente',
    'Lâmpada incandescente',
    'Termômetro',
    'Lençol de solteiro',
    'Lençol de casal',
    'Edredom de solteiro',
    'Edredom de casal',
    'Travesseiro de criança',
    'Travesseiro',
    'Fronha',
    'Frauda de pano',
    'Frauda descartável',
    'Ventilador',
    'Ventilador de teto quebrado',
    'Cabide de plástico',
    'Cabide de ferro',
    'Caixa de joias',
    'Caixa organizadora',
    'Caixa de papéis',
    'Folha de papel',
    'Documentos queimados',
    'Clips de ferro',
    'Clips de plástico',
    'Lata de refrigerante',
    'Lata de molho de tomate',
    'Lata de atum',
    'Lata  tomate',
    'Lata de creme de leite',
    'Lata grão de bico',
    'Lata de milho',
    'Lata de Atum',
    'Lata de sopa',
    'Lata de vegetais',
    'Frutas enlatadas',
    'Lata de Cereais',
    'Saco de Cereais',
    'Macarrão instantâneo',
    'Lata de manteiga de amendoim',
    'Lata de geleia',
    'Saco de balas',
    'Lata de nozes',
    'Caixa de Vitaminas',
    'Vassoura',
    'Vassoura quebrado',
    'Sabão em pó',
    'Sabão de coco',
    'Sabonete',
    'Sabonete de criança',
    'Shampoo',
    'Condicionador',
    'Escovão',
    'Pano de chão',
    'Pá pequena',
    'Pá grande',
    'Pregador de roupa',
    'Varal de fibra',
    'Varal de metal',
    'Balde pequeno de plástico',
    'Balde grande de plástico',
    'Balde pequeno de metal',
    'Balde grande de metal',
    'Esfregão',
    'Esfregão quebrado',
    'Airfryer',
    'Lascas de madeira',
    'Pregos',
    'Parafusos',
    'Cacos de vidro',
    'Rolha',
    'Peneira',
    'Garrada de água vazia',
    'Garrada de água',
    'Porta temperos',
    'Isqueiro',
    'Dr Pepper (refrigerante)',
    'Root Beer (não alcoólica)',
    'Cherry Coke',
    'Vinho',
    'Whisky',
    'Vodka',
    'Cerveja',
    'Tequila',
    'Champanhe',
    'Maço de cigarro fechado',
    'Maço de cigarro aberto',
    'Bicicleta quebrada',
    'Bicicleta de criança',
    'Bicicleta',
    'Furadeira quebrada',
    'Furadeira',
    'Parafusadeira quebrada',
    'Parafusadeira',
    'Serra de mão',
    'Serra grande',
    'Lixadeira',
    'Ferro de solda',
    'Chave de fenda',
    'Chave phillips',
    'Martelo',
    'Alicate',
    'Chave allen',
    'Chave biela',
    'Chave de boca',
    'Chave de grifo',
    'Chave inglesa',
    'Espátula',
    'Estilete',
    'Formão',
    'Lata de tinta branca',
    'Lata de tinta preta',
    'Lata de tinta vermelha',
    'Lata de tinta vazia',
    'Serrote',
    'Bloco de motor de carro',
    'Cilindros (motor de carro)',
    'Pistão (motor de carro)',
    'Anéis de Vedação (motor de carro)',
    'Cabeçote (motor de carro)',
    'Biela (motor de carro)',
    'Virabrequim (motor de carro)',
    'Válvulas (motor de carro)',
    'Vela de ignição (motor de carro)',
    'Correia dentada (motor de carro)',
    'Mangueira de injeção (motor de carro)',
    'Pneu de carro',
    'Pneu de moto',
    'Pneu de bicicleta',
    'Pneu furado de carro',
    'Pneu furado de moto',
    'Pneu furado de bicicleta',
    'Guidão de bicicleta',
    'Aro de bicicleta',
    'Motor de moto',
    'Guidão de moto',
    'Manopla de moto',
    'Freios de moto',
    'Suspensão de moto',
    'Oxímetro',
    'Estetoscópio',
    'Balança de alimentos',
    'Balança de chão',
    'Balança de farmácia',
    'Luvas hospitalares',
    'Máscara hospitalar',
    'Touca hospitalar',
    'Óculos hospitalar',
    'Avental cirúrgico',
    'Desfibriladores',
    'Carrinho de emergência',
    'Maca hospitalar',
    'Termômetro clínico',
    'Tesoura escolar',
    'Tesoura hospitalar',
    'Tesoura de escritório',
    'Papel sulfite',
    'Papel higiênico',
    'Papel de cozinha',
    'Guardanapo',
    'Canetas esferográficas',
    'Lápis',
    'Borracha',
    'Caixa de Grampos',
    'Grampeador',
    'Fita adesiva',
    'Bloco de notas',
    'Agenda',
    'Post-it',
    'Envelope',
    'Dobradiças',
    'Fechadura',
    'Chave',
    'Grampo de cabelo',
    'Gazua',
    'Álcool 70',
    'Algodão',
    'Lixa de unha',
    'Repelente',
    'Medicamento injetável',
    'Antibióticos',
    'Amoxicilina',
    'Antialérgico',
    'Antitérmico',
    'Gaze',
    'Antisséptico',
    'Esparadrapo',
    'Curativos',
    'Analgésicos',
    'Anti-inflamatórios',
    'Medicamento injetável',
    'Antibióticos',
    'Amoxicilina',
    'Antialérgico',
    'Antitérmico',
    'Gaze',
    'Antisséptico',
    'Esparadrapo',
    'Curativos',
    'Analgésicos',
    'Anti-inflamatórios',
    'Antibióticos',
    'Antibióticos',
    'Antibióticos',
    'Antibióticos',
    'Curativos',
    'Curativos',
    'Curativos',
    'Abacaxi',
    'Abacate',
    'Amora',
    'Banana',
    'Caju',
    'Cacau',
    'Damasco',
    'Figo',
    'Alecrim',
    'Tomilho',
    'Sálvia',
    'Orégano',
    'Louro',
    'Salsinha',
    'Cebolinha',
    'Coentro',
    'Livro: Ilíada, de Homero',
    'Livro: Odisseia, de Homero',
    'Livro: Hamlet, de William Shakespeare',
    'Livro: A Divina Comédia, de Dante Alighieri',
    'Livro: Em Busca do Tempo Perdido, de Marcel Proust',
    'Livro: Ulisses, de James Joyce',
    'Livro: Guerra e Paz, de Leon Tosltói',
    'Livro: Crime e Castigo, de Fiódor Dostoiévski',
    'Livro: Os Ensaios, de Michel de Montaigne',
    'Livro: Édipo Rei, de Sófocles',
    'Livro: Otelo, de William Shakespeare',
    'Livro: Madame Bovary, de Gustave Flaubert',
    'Livro: Uma Temporada no Inferno, de Arthur Rimbaud',
    'Livro: Noite de Reis, de William Shakespeare',
    'Livro: Histórias Extraordinárias, de Edgar Allan Poe',
    'Livro: As viagens de Gulliver, de Jonathan Swift',
    'Livro: 1984, de George Orwell',
    'Livro: O Livro das Mil e Uma Noites',
    'Livro: Os Moedeiros Falsos, de André Gide',
    'Livro',
    'Livro',
    'Livro',
    'Livro',
    'Livro',
    'Livro queimado',
    'Livro todo rasgado',
    'Bíblia',
    'Alcorão',
    'Bíblia',
    'Alcorão',
    'Computador',
    'Tela de Computador',
    'Mouse de Computador',
    'Teclado de Computador',
    'Notebook',
    'Cabo de rede de Computador',
    'Telefone de mesa antigo',
    'Telefone de mesa',
    'Celular',
    'Computador',
    'Tela de Computador',
    'Mouse de Computador',
    'Teclado de Computador',
    'Notebook',
    'Cabo de rede de Computador',
    'Telefone de mesa antigo',
    'Telefone de mesa',
    'Celular',
    'Violino',
    'Viola',
    'Violão',
    'Guitarra',
    'Violoncelo',
    'Contrabaixo',
    'Harpa',
    'Piano',
    'Violino quebrado',
    'Viola quebrada',
    'Violão quebrado',
    'Guitarra quebrada',
    'Violoncelo quebrado',
    'Contrabaixo quebrado',
    'Harpa quebrada',
    'Piano quebrado',
    'Braço decepado',
    'Perna decepada',
    'Cabeça decepada',
    'Dedo decepado',
    'Pé decepado',
    'Orelha decepada',
    'Osso humano da perna',
    'Osso humano do braço',
    'Crânio humano',
    'Cachorro Shih Tzu',
    'Cachorro Yorkshire',
    'Cachorro Poodle',
    'Cachorro Buldogue francês',
    'Cachorro Maltês',
    'Cachorro Golden Retriever',
    'Cachorro Labrador Retriever',
    'Cachorro de rua',
    'Gato de rua',
    'Gato caseiro',
    'Mata mosca',
    'Tênis',
    'Sapato masculino',
    'Sapato feminino',
    'Meias',
    'Camiseta',
    'Regatas',
    'Calça',
    'Calça jeans',
    'Short',
    'Blazer',
    'Vestido',
    'Casaco',
    'Sobretudo',
    'Jaqueta jeans',
    'Jaqueta couro',
    'Camiseta',
    'Regatas',
    'Calça',
    'Calça jeans',
    'Short',
    'Blazer',
    'Vestido',
    'Casaco',
    'Sobretudo',
    'Jaqueta jeans',
    'Jaqueta couro',
    'Bola de vôlei',
    'Bola de futebol',
    'Bola de futebol Americano',
    'Bola de golfe',
    'Bola de basquete',
    'Bola de sinuca',
    'Fio elétrico pequeno',
    'Fio elétrico grande',
    'Fio elétrico alta tensão',
    'Vaso de Filodendro',
    'Vaso de Singônio',
    'Vaso de Cactos',
    'Vaso de Pacová',
    'Vaso de bromélia',
    'Vaso de Lírio',
    'Vaso de Orquídeas',
    'Vaso de Samambaia',
    'Corda de 3 metros',
    'Corda de 10 metros',
    'Corda de 20 metros',
    'Cabo de aço de freio',
    'Cabo de aço de 3 metros',
    'Cabo de aço de 10 metros',
    'Arame farpado',
    'Caixa de fósforos',
    'Vela',
    'Caixa de velas',
    'Sineta',
    'Algibeira',
    'Talha',
    'Tecido Comum',
    'Tecido Fino',
    'Lona',
    'Giz',
    'Ganchos de Ferro',
    'Rede de Pesca',
    'Pederneira',
    'Garrafa de Vidro',
    'Ampulheta',
    'Farolete',
    'Cadeado',
    'Lente de Aumento',
    'Flauta Doce',
    'Tambor',
    'Trombeta',
    'Xilofone',
    'Perfume',
    'Pitons',
    'Faca de escoteiro',
    'Faca de açougueiro',
    'Saco Grande',
    'Saco Pequeno',
    'Agulha de Costura',
    'Apito de Advertência',
    'Anel',
    'Pequeno Telescópio',
    'Tenda',
    'Saco de Dormir',
    'Esmeril',
    'Botas de Montaria',
    'Calças',
    'Botas Normais',
    'Vestido Ornamentado',
    'Cinto',
    'Sandálias',
    'Botas de Montaria',
    'Calças',
    'Botas Normais',
    'Vestido Ornamentado',
    'Cinto',
    'Sandálias',
    'Botas de Montaria',
    'Calças',
    'Botas Normais',
    'Vestido Ornamentado',
    'Cinto',
    'Sandálias',
    'Botas de Montaria',
    'Calças',
    'Botas Normais',
    'Vestido Ornamentado',
    'Cinto',
    'Sandálias',
    'Pão',
    'Queijo',
    'Queijo estragado',
    'Queijo mofado',
    'Ovos',
    'Verduras Frescas',
    'Legumes Frescos',
    'Frutas Secas',
    'Frutas Vermelhas',
    'Garrafa de Mel',
    'Coldre de Água',
    'Coldre de Água',
    'Coldre de Água',
    'Coldre de Água',
    'Peixe estragado',
    'Peixe salgado',
    'Peixe fresco',
    'Peixe queimado',
    'Peixe',
    'Peixe',
    'Aquário quebrado',
    'Aquário',
    'Uvas Passas',
    'Saco de Arroz',
    'Saco de Sal',
    'Saco de Arroz',
    'Saco de Sal',
    'Saco de Arroz',
    'Saco de Sal',
    'Pote de Pimenta',
    'Saquinho de Canela',
    'Garrafa de Cidra',
    'Raízes Medicinais',
    'Folhas Medicinais',
    'Frutas Medicinais',
    'Brinco de prata',
    'Colar de prata',
    'Pulseira de prata',
    'Anel de prata',
    'Brinco de ouro',
    'Colar de ouro',
    'Pulseira de ouro',
    'Anel de ouro',
    'Aliança de casamento',
    'Aliança de casamento',
    'Porta retratos',
    'Álbum de retratos queimado',
    'Álbum de retratos',
    'Gaiola',
    'Gaita',
    'Isopor de mantimentos',
    'Macaco de carro',
    'Binóculos',
    'Mapas de Georgia',
    'Câmera fotográfica',
    'Câmera de filmagem',
    'Bússola',
    'Pé de cabra',
    'Lockpicks (gazua)',
    'Walkie-talkies',
    'Binóculos',
    'Mapas de Georgia',
    'Câmera fotográfica',
    'Câmera de filmagem',
    'Bússola',
    'Lockpicks (gazua)',
    'Walkie-talkies',
    'Espanador',
    'Coronha do rifle',
    'Relógio de pulso',
    'CD de música',
    'DVD de filme',
    'Cartucho de Vídeo Game',
    'Vídeo Game',
    'Vídeo Game quebrado',
    'Cabo de vídeo',
    'Cabo de áudio',
    'Arame farpado',
    'Ferradura',
    'Pé de mesa',
    'Estaca',
    'Poster de Rock',
    'Bandeira EUA',
    'Bandeira Internacional',
    'Bandeira ONU',
    'Taça de Cristal',
    'Ataduras',
    'Ataduras',
    'Vidros quebrados',
    'Entulhos de obra',
    'Tijolo',
    'Saco de areia',
    'Enxada',
    'Ancinho',
    'Pássaro morto',
    'Pássaro pequeno',
    'Coruja',
    'Rato morto',
    'Rato',
    'Barata',
    'Inseticida',
    'Escova de dentes',
    'Escova de cabelo',
    'Pasta de dentes',
    'Pasta de dentes',
    'Quadro de parede queimado',
    'Quadro de parede',
    'Pintura de arte',
    'Tinta de pintura',
    'Tinta de criança',
    'Pincel pequeno',
    'Rolo de tinta',
    'Fiação elétrica curta',
    'Fiação elétrica longa',
    'Motor de elevador',
    'Motor a combustão',
    'Motor elétrico',
    'Motor de elevador quebrado',
    'Motor a combustão quebrado',
    'Motor elétrico quebrado',
    'Galão de combustível',
    'Galão de óleo',
    'Lata de óleo de cozinha',
    'Rádio amador',
    'Rádio de caminhão',
    'Rádio de polícia',
    'Farda militar',
    'Farda de policial',
    'Jaleco médico',
    'Sementes de vegetais',
    'Sementes de frutas',
    'Coco de passarinho',
    'Fezes humanas',
    'Fezes de animais',
    'Ladrilho de parede',
    'Livro de RPG',
    'Jogo de cartas',
    'Boneca',
    'Boneco de criança',
    'Carrinho',
    'Massinha de modelar',
    'Jogo de tabuleiro',
    'Bicho de pelúcia',
    'Quebra-cabeça',
    'Manequim',
    'Lanterna pequena',
    'Lanterna grande',
    'Lanterna militar',
    'Mochila de criança',
    'Mochila grande',
    'Mochila militar',
    'Mochila militar rasgada',
    'Bolsa de sangue',
    'Tubo de oxigênio',
    'Tubo de oxigênio',
    'Machado',
    'Lixo orgânico',
    'Lixo hospitalar',
    'Impressora quebrada',
    'Impressora',
    'Alarme de casa',
    'Lata de alumínio',
    'Lata de alumínio',
    'Telha',
    'Telha quebrada',
    'Microfone',
    'Óculos escuros',
    'Óculos de grau',
    'Tesoura de unha',
    'Dentes humanos',
    'Barbante',
    'Vara de pescar',
    'Linha de pescar',
    'Anzol',
    'Escorredor de pratos',
    'Bumerangue',
    'Haste de ferro',
    'Brinquedo de cachorro',
    'Coleira de cachorro',
    'Barbeador',
    'Lâmina de barbear',
    'Cortador de grama',
    'Cortador de grama quebrado',
    'Lascas de vidro',
    'Lascas de ossos',
    'Cifre de animal',
    'Óleo de bronzear',
    'Protetor solar',
    'Revista queimada',
    'Revista rasgada',
    'Revista',
    'Cinto',
    'Soco inglês',
    'Par de Cadarços',
    'Cartão de crédito',
    'Notas de Dólar',
    'Carteira',
    'Armadilha de Urso',
    '3 metros de arame',
    '1 metro de arame',
    'Spray de Tinta',
  ],
};

const NOMES = [
  'Charlie Cole',
  'Zac Clark',
  'Cody Shaw',
  'Jay Richards',
  'Joel Lowe',
  'Jackson Owen',
  'Matthias Duke',
  'Brenden Sargent',
  'Ezekiel Goff',
  'Jeffery Fowler',
  'Jude Patel',
  'Ryan Miller',
  'Ryan Burton',
  'Adam Saunders',
  'Kai Gibson',
  'Junior Haynes',
  'Carlos Pruitt',
  'Brock Solomon',
  'Jayce Mckee',
  'Jabari Robbins',
  'Jordan Grant',
  'Ollie Bell',
  'Peter Barnes',
  'Zac Foster',
  'Brandon Jenkins',
  'Conner Fuller',
  'Jaxton Wilkinson',
  'Karsen Frank',
  'Callan Mcconnell',
  'Korbin Wooten',
  'Aaron Foster',
  'Ryan Riley',
  'Kyle Porter',
  'Kieran King',
  'Bradley Parry',
  'Derrick Blanchard',
  'Jael Lowe',
  'Darrell Hunt',
  'Zachary Slater',
  'Rohan Gill',
  'Luke Booth',
  'Spencer Bennett',
  'William Read',
  'Anthony Kaur',
  'Owen Carter',
  'Rodrigo Rivera',
  'Jarrett Trevino',
  'Anders Gibbs',
  'Jamison Compton',
  'Hunter Bird',
  'Nathan Miller',
  'Bobby Jenkins',
  'Jayden Palmer',
  'Joshua Brooks',
  'Harvey Austin',
  'Misael Guzman',
  'Ian Thomas',
  'Devin Long',
  'Osvaldo Stanley',
  'Anderson Fischer',
  'Declan Barnes',
  'Jenson Cook',
  'Tom Hopkins',
  'Max Burton',
  'Aaron Mitchell',
  'Finn Snyder',
  'Cedric Carpenter',
  'Beau O\'neal',
  'Darien Terrell',
  'Cash Shelton',
  'Josh Powell',
  'Benjamin Watts',
  'Leo Rees',
  'Aaron Lewis',
  'Tommy Scott',
  'London Charles',
  'Angelo Dawson',
  'Raul Flowers',
  'Davian Aguirre',
  'Kylen Reese',
  'Zac Burke',
  'Benjamin Hunter',
  'Jack Thomson',
  'Alex Phillips',
  'James Lewis',
  'Skylar Walls',
  'Brandon Walls',
  'Bruno George',
  'Donte Fuller',
  'Hezekiah Meadows',
  'William Price',
  'Mason Hill',
  'Billy Price',
  'Andrew Porter',
  'Bradley Owen',
  'Jakob Hanson',
  'Nickolas Vazquez',
  'Camren Caldwell',
  'Christopher Long',
  'Leo O\'neill',
  'Bennie Bell',
  'Ash Lawson',
  'Elliot West',
  'Jody Johnson',
  'Willy Hall',
  'Brynn Goodwin',
  'Rene Norton',
  'Mell Simmons',
  'Ashley Clayton',
  'Carmen Wynn',
  'Leslie Pearce',
  'Kai Duncan',
  'Terry Perry',
  'Eli Scott',
  'Ashley Pearce',
  'Eli Lawrence',
  'Charlie Thornton',
  'Jaime Logan',
  'Caden Thompson',
  'Tanner Roach',
  'Frankie Marsh',
  'Caden Baker',
  'Gene Smith',
  'Rory Jones',
  'Phoenix Reid',
  'Mell Raymond',
  'Charlie Ellison',
  'Raylee Nash',
  'Caden Cook',
  'Blair Walker',
  'Emerson Hawkins',
  'Frankie Smith',
  'Kerry Clark',
  'Kai Phillips',
  'Casey Lloyd',
  'Aubrey Vaughan',
  'Gabe Newman',
  'Leigh Mckee',
  'Haiden Ayala',
  'Erin Ramsey',
  'Riley Kelly',
  'Phoenix Kennedy',
  'Terry Johnson',
  'Willy Andrews',
  'Blair Collins',
  'Brett Fox',
  'Carmen Luna',
  'Clem Leon',
  'Mell Nicholson',
  'Bret Keller',
  'Vic Bailey',
  'Riley Sharp',
  'Bev Stewart',
  'Brice Kennedy',
  'Ryan Matthews',
  'Skyler Hudson',
  'Riley Yates',
  'Chris Roth',
  'Billy Manning',
  'Jackie Lawson',
  'Taylor Barker',
  'Maddox Griffiths',
  'Morgan Foster',
  'Aubrey George',
  'Logan Howard',
  'Casey Leonard',
  'Maddox Klein',
  'Gail Cotton',
  'Denny Pittman',
  'Brice Emerson',
  'Bret Murray',
  'Blair Moore',
  'Phoenix Hughes',
  'Drew Matthews',
  'Vic Ward',
  'Cameron Solomon',
  'Hayden Bright',
  'Jody Sykes',
  'Ashton Battle',
  'Fran Vazquez',
  'Will Johnson',
  'Danni Burton',
  'Sammy Dawson',
  'Leslie Robertson',
  'Cory Fisher',
  'Denny Dorsey',
  'Leslie Knight',
  'Tanner O\'donnell',
  'Brynn Trevino',
  'Cameron Webster',
  'Jessie Thomas',
  'Rene Gordon',
  'Cory Lewis',
  'Lee Lawrence',
  'Taylor Carter',
  'Logan Castro',
  'Lane Cherry',
  'Ash Mcneil',
  'Rory Dean',
  'Willy Love',
  'Lily Saunders',
  'Megan Hunter',
  'Willow Scott',
  'Sarah Dixon',
  'Mollie Davidson',
  'Mikayla Barber',
  'Valerie O\'neal',
  'Lea Lewis',
  'Morgan Mccarthy',
  'Parker Barrett',
  'Hollie Booth',
  'Mia Woods',
  'Abby Green',
  'Martha Edwards',
  'Maisy Barnes',
  'Jayleen Salas',
  'Leona Warren',
  'Jenna Case',
  'Esmeralda Chase',
  'Kirsten Herrera',
  'Phoebe Taylor',
  'Sophia Hudson',
  'Maya Khan',
  'Chloe Byrne',
  'Imogen Johnston',
  'Bianca Griffin',
  'Mackenzie Horn',
  'Cynthia Bowers',
  'Makenna Suarez',
  'Amari Abbott',
  'Caitlin Riley',
  'Eva Chambers',
  'Lexie Hayes',
  'Jennifer Wright',
  'Elizabeth Matthews',
  'Dylan Colon',
  'Bryn Barry',
  'Evelynn Boyd',
  'Eliana Wiley',
  'Samantha Stark',
  'Molly Murphy',
  'Lara Marshall',
  'Freya Williamson',
  'Sienna Mills',
  'Tia Watts',
  'Giselle Cantrell',
  'Alyssa Hansen',
  'Ansley Bean',
  'Aria Doyle',
  'Alyvia Zimmerman',
  'Phoebe Wallace',
  'Jessica Austin',
  'Isabelle Morris',
  'Eve Jenkins',
  'Mia Barker',
  'Danna Santos',
  'Cambria Doyle',
  'Amani Gill',
  'Cailyn Logan',
  'Giana Davenport',
  'Sara Hudson',
  'Maisy Carr',
  'Laura John',
  'Sophia Houghton',
  'Ella Butler',
  'Zaniyah Mosley',
  'Kathleen Shields',
  'Anya Sampson',
  'London Wong',
  'Harley Hinton',
  'Jade Black',
  'Daisy Allen',
  'Demi Carter',
  'Danielle Webb',
  'Holly Cunningham',
  'Holly Wilkins',
  'Felicity Stone',
  'Alexa Reyes',
  'Farrah Reeves',
  'Naomi Ellison',
  'Cerys Ross',
  'Victoria Duncan',
  'Bethany Rees',
  'Evie Burke',
  'Maisie John',
  'Bella Bowen',
  'Dakota Hahn',
  'Maggie Walker',
  'Georgia Hutchinson',
  'Regan Burris',
  'Victoria Fraser',
  'Erin Stevens',
  'Ellie Lee',
  'Amy Marsh',
  'Niamh Patel',
  'Dayana Porter',
  'Kaelynn Hood',
  'Lara Tran',
  'Mckayla Wilkins',
  'Ciara Harper',
  'Ramone Rojas',
  'Angelito Baggio',
  'Enrrique Peralta',
  'Jerold Ferri',
  'Curcio Gershkovich',
  'Matro Martinez',
  'Arturo Baumann',
  'Oliverios Hernandez',
  'Alvino Muñoz',
  'Cayetano Li Fonti',
  'Bembe Pirozzi',
  'Bembe Pisani',
  'Iago Piazza',
  'Jerrold Cruz',
  'Cedro Autino',
  'Mariano Iadanza',
  'Bernardo Milano',
  'Suelita Santos',
  'Sal Angelo',
  'Eloy Marcelo',
  'Landrada Lorenzo',
  'Michelle Pinto',
  'Faustina Guzman',
  'Madeira Juarez',
  'Ventana Fallaci',
  'Laura Aguilar',
  'Rita Pirozzi',
  'Genevalisse Marchesi',
  'Blanca Bravo',
  'Ricarda Simone',
  'Calandria Mansilla',
  'Maja De Marco',
  'Ora Al Sadd',
  'Xevera Devia',
  'Neiva Halder',
  'Carmen Nuñez',
  'Judith Mancini',
  'Berenice Piccio',
  'Puebla Vecoli',
  'Mailen Milano',
  'Qiu Kun',
  'Hao Zan',
  'Qiao Da',
  'Zheng Jingyi',
  'Ma Huo',
  'Quan Jing',
  'Jiang Wu',
  'Yao ZhenKang',
  'Xue Gengxin',
  'Fang Jiang',
  'Wen Yimu',
  'Yuan Qigang',
  'Hou Zan',
  'Cheng Jingyi',
  'Xiong Xiuying',
  'Zhang Zhenya',
  'Ye Wu',
  'Shao Yahui',
  'Quan Guo',
  'Fan Kang',
  'Cheng Kun',
  'Yu Zhen',
  'Hu Tu',
  'Liu Hai',
  'Qiao Hua',
  'Xue Yong',
  'Liang Chan',
  'Lai Hong',
  'Zi Yating',
  'Long Cheng',
  'Marc-Antoine Subercaseaux',
  'Jérôme Philidor',
  'Olivier Rodin',
  'Jean-Noël Pichard',
  'Jacques Joguet',
  'Moïse Ouvrard',
  'Roméo Clérisseau',
  'Phil Calvet',
  'Mathias Celice',
  'Florian Jacquemin',
  'Gabriel Fournier',
  'Séverin Sartre',
  'Claude Deloffre',
  'Gwenaël Bechard',
  'Basile Milhaud',
  'Victor Plouffe',
  'Jérôme Vandame',
  'Tristan About',
  'Amand Beaugendre',
  'Alain Lahaye',
  'Daniel De Saint-Pierre',
  'Pierre-Antoine Bessette',
  'Benoît Joubert',
  'Matthieu Lahaye',
  'Roland Kaplan',
  'Thaddée Berger',
  'Sacha Deloffre',
  'Maxence Lagarde',
  'Léonard Crépin',
  'Jean-Joël Grosjean',
  'Abraham Chevalier',
  'Charles Crevier',
  'Abel Favre',
  'Didier Aubert',
  'Gustave Duval',
  'Silvain Nee',
  'François Chuquet',
  'Alexandre Boutet',
  'Bastien Dujardin',
  'Sébastien Rochefort',
  'Marine Jacquet',
  'Rébecca Tremblay',
  'Héloïse Leclère',
  'Bérengère Trouvé',
  'Sauvanne Poulin',
  'Nikita Beaugendre',
  'Jacqueline Balzac',
  'Christiane Toussaint',
  'Monique Tourneur',
  'Léa Dufresne',
  'Ange Bourgeois',
  'Lisette Popelin',
  'Nadège Philippon',
  'Capucine Chéron',
  'Diane Gérald',
  'Marine Benett',
  'Claudette Calvet',
  'Bérengère Allaire',
  'Léonie Boulle',
  'Gisèle Emmanuelli',
  'Déborah Popelin',
  'Orianne Bouchard',
  'Violette Auclair',
  'Vanessa Gavreau',
  'Francine Laflèche',
  'Catherine Regnard',
  'Débora Bozonnet',
  'Laura Bourseiller',
  'Louise Dufresne',
  'Solenne Levett',
  'Oprinchuk',
  'Vikentiy',
  'Smekhov Viktor',
  'Tikhonov',
  'Alexei',
  'Timurovich',
  'Loskutova',
  'Jereni',
  'Denisovna',
];

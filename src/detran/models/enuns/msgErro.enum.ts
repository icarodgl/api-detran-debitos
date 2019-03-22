export enum MsgErro {
  SERV_GET_DADOS_VEIC = 'Não foi possível obter os dados do veículo.',
  SERV_GET_DEB = 'Não foi possível obter os débitos.',
  SERV_GET_DEB_PREV = 'Não foi possível obter a prévia dos débitos.',
  SERV_GERAR_GUIA = 'Não foi possível gerar a guia.',
  SERV_GERAR_GUIA_DEB = 'Não foi possível obter os débitos para gerar a guia. Tente novamente mais tarde.',
  SERV_GERAR_GUIA_OBR = 'Débitos obrigatórios não foram passados.',
  SERV_GERAR_GUIA_VAL = 'Não foi possível validar os débitos. Tente novamente mais tarde.',
  SERV_GERAR_GUIA_TYP = 'Tipo não cadastrado.',
  REPO_ERR = 'Repositório inacessível no momento. Tente novamente mais tarde.',
  DEB_RET_VAZIO = 'Não foram encontrados débitos para esse veículo.',
  DEB_RET_ERR = 'Ocorreu um erro ao buscar débitos.',
  CONT_GET_GUIA = 'DUA não encontrada. Por favor, gere uma nova.',
  MODL_TIPO_DEB_ERR = 'Ocorreu um erro ao gerar a prévia.',
  FLAG_ERR = 'Ocorreu um erro desconhecido',
}

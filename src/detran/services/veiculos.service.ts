import { Injectable, HttpStatus } from '@nestjs/common';
import { DetranSoapClient } from '../repository/detran-soap-client';
import { Retorno } from '../models/retorno.model';
import { VeiculoConsulta } from '../models/veiculoConsulta.model';
import { VeiculoRetorno } from '../models/veiculoRetorno.model';
import { DebitoRetorno } from '../models/debitoRetorno.model';
import { GerarGuiaRetorno } from '../models/gerarGuiaRetorno.model';
import { TipoDebito } from '../models/tipoDebito.model';

@Injectable()
export class VeiculosService {
  detranSoapClient: DetranSoapClient;
  res: any;
  veiculoConsulta: any;
  veiculoRetorno: VeiculoRetorno;
  client: any;
  debitos: any;

  constructor() {
    this.detranSoapClient = new DetranSoapClient();
  }

  async getDadosVeiculos ( params: any ): Promise<Retorno> {

    this.veiculoConsulta = new VeiculoConsulta( params );
    this.client = await this.detranSoapClient._client;

    if ( Object.keys( this.client )[ 0 ] === 'mensagemErro' ) {
      return new Retorno( this.client );
    }

    try {
      this.res = await this.client.ObterDadosVeiculo( this.veiculoConsulta );
      this.veiculoRetorno = new VeiculoRetorno( this.res.ObterDadosVeiculoResult );
      return new Retorno( this.veiculoRetorno );
    } catch ( error ) {
      return new Retorno( {
        MensagemErro: 'Erro ao obter os dados do veiculo: ' + error,
      },
      );
    }
  }

  async getDebitos ( params: any ): Promise<Retorno> {

    this.veiculoConsulta = new VeiculoConsulta( params );
    this.client = await this.detranSoapClient._client;

    if ( Object.keys( this.client )[ 0 ] === 'mensagemErro' ) {
      return new Retorno( this.client );
    }

    try {
      this.res = await this.client.ObterDebitos( this.veiculoConsulta );
      this.debitos = new DebitoRetorno( this.res.ObterDebitosResult );
      return new Retorno( this.debitos );
    } catch ( error ) {
      return new Retorno( {
        MensagemErro: 'Erro ao obter debitos: ' + error,
      },
      );
    }
  }

  async getDebitosPreview ( params: any ): Promise<Retorno> {

    this.veiculoConsulta = new VeiculoConsulta( params );
    this.client = await this.detranSoapClient._client;

    if ( Object.keys( this.client )[ 0 ] === 'mensagemErro' ) {
      return new Retorno( this.client );
    }

    try {
      this.res = await this.client.ObterTiposDebitos( this.veiculoConsulta );
      const tipoDebito = new TipoDebito( this.res.ObterTiposDebitosResult );
      return new Retorno( this.res.ObterTiposDebitosResult );
    } catch ( error ) {
      return new Retorno( {
        MensagemErro: 'Erro ao buscar debitos: ' + error,
      },
      );
    }
  }

  async getTiposDebitos ( params: any ): Promise<Retorno> {

    this.veiculoConsulta = new VeiculoConsulta( params );
    this.veiculoConsulta.tipoSelecionado = params.tipo_debito.toUpperCase();
    this.client = await this.detranSoapClient._client;

    if ( Object.keys( this.client )[ 0 ] === 'mensagemErro' ) {
      return new Retorno( this.client );
    }

    try {
      this.res = await this.client.ObterDebitosPorTipoDebito( this.veiculoConsulta );
      this.debitos = new DebitoRetorno( this.res.ObterDebitosPorTipoDebitoResult );
      return new Retorno( this.debitos.debitos );

    } catch ( error ) {
      return new Retorno( {
        MensagemErro: 'Erro ao buscar os debitos: ' + error,
      } );
    }
  }

  async gerarGRU ( params: any ): Promise<Retorno> {

    this.veiculoConsulta = new VeiculoConsulta( params );
    this.client = await this.detranSoapClient._client;
    const array_ids: Array<string> = new Array();

    if ( Object.keys( this.client )[ 0 ] === 'mensagemErro' ) {
      return new Retorno( this.client );
    }

    try {
      const deb: Retorno = await this.getDebitos( params );
      if ( deb.res.debitos[ 0 ] === 'Não foram encontrados debitos para esse veiculo.' || deb.status !== HttpStatus.OK ) {
        return deb;
      } else {
        for ( const debito of deb.res.debitos ) {
          array_ids.push( debito.IdDebito );
        }
      }
    } catch ( error ) {
      return new Retorno( {
        MensagemErro: 'Erro ao buscar os debitos: ' + error,
      } );
    }

    this.veiculoConsulta.listaDebitos = array_ids.toString();

    try {
      this.res = await this.client.GerarGuia( this.veiculoConsulta );
      const guia: any = new GerarGuiaRetorno( this.res.GerarGuiaResult );
      return new Retorno( guia );
    } catch ( error ) {
      return new Retorno( {
        MensagemErro: 'Error ao gerar a GRU: ' + error,
      } );
    }
  }

}

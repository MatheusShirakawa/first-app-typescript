import {logarComoTempoDeExecucao, domInject, throttle} from '../helpers/decorator/index';
import { NegociacoesView, MensagemView } from "../views/index";
import { Negociacoes, Negociacao, NegociacaoParcial } from "../models/index";
import { NegociacaoService } from "../services/index";
import {imprime} from "../helpers/index";

let timer = 0;

export class NegociacaoController{

    @domInject('#data')
    private _inputData: JQuery;

    @domInject('#quantidade')
    private _inputQuantidade: JQuery;

    @domInject('#valor')
    private _inputValor: JQuery;

    private _negociacoes: Negociacoes = new Negociacoes();
    private _negociacoesView = new NegociacoesView('#negociacoesView');
    private _mensagemView = new MensagemView("#mensagemView");

    private _negociacaoService = new NegociacaoService();

    constructor(){
        this._negociacoesView.update(this._negociacoes);
    }

    @throttle(500)
    adiciona(){

        console.log(this._inputData.val().replace('/-/g',','));
        let data = new Date(this._inputData.val().replace('/-/g',','));
        console.log(data);

        if(!this._ehDiaUtil(data)){

            this._mensagemView.update('somente dias uteis');

            return;

        }

        const negociacao = new Negociacao(
            data,
            parseInt(this._inputQuantidade.val()),
            parseFloat(this._inputValor.val()),
        );

        imprime(negociacao, this._negociacoes);
        this._negociacoes.adiciona(negociacao);
        this._negociacoesView.update(this._negociacoes);
        this._mensagemView.update('Negociação adicionada com sucesso');
    }

    private _ehDiaUtil(data: Date) {
        
        return data.getDay() != diaDaSemana.Sabado && data.getDay() != diaDaSemana.Domingo;

    }

    @throttle(500) 
    async importaDados(){
        

        try {

            const negociacoesParaImportar = await this._negociacaoService
                .obterNegociacoes(res =>{
                    if(res.ok){
                        return res;
                    }else{
                        throw new Error(res.statusText);
                    }
                });

            const negociacoesJaImportadas = this._negociacoes.paraArray();

                negociacoesParaImportar
                    .filter(negociacao => 
                        !negociacoesJaImportadas.some(jaImportada => 
                            negociacao.ehIgual(jaImportada)))
                    .forEach(negociacao => 
                        this._negociacoes.adiciona(negociacao));
                        this._negociacoesView.update(this._negociacoes);            

                
        } catch (error) {
          this._mensagemView.update(error.message);  
        }
    }
}

enum diaDaSemana{
    Domingo,
    Segunda,
    Terca,
    Quarta,
    Quinta,
    Sexta,
    Sabado,
}

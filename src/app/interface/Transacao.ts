import { Data } from "@angular/router";

export interface Transacao {
    id: number;
    data: Data;
    hora: Data;
    valor: number;
    cpf: string;
    donoLoja: string;
    nomeLoja: string;
    cartao: string;
}
export class Pitanja
{
    constructor(ime,idOdgovora,id,tezina)
    {
        this._ime=ime;
        this._idOdgovora=idOdgovora;
        this._id=id;
        this._tezina=tezina;
        this._listaOdgovora=[];
    }
    get ime()
    {
        return this._ime;
    }
    set ime (x)
    {
        this._ime=x;
    }
    get idOdgovora ()
    {
        return this._idOdgovora;
    }
    set idOdgovora(x)
    {
        this._idOdgovora=x;

    }
    get id()
    {
        return this._id
    }
    set id(x)
    {
        this._id=x;
    }
    get tezina()
    {
        return this._tezina;

    }
    set tezina(x)
    {
        this._tezina=x;
    }
    dodajOdgovor(odgovor)
    {
        this._listaOdgovora.push(odgovor);
    }


}
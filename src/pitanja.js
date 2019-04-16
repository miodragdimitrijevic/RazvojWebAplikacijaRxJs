export class Pitanja
{
    constructor(ime,idOdgovora,id)
    {
        this._ime=ime;
        this._idOdgovora=idOdgovora;
        this._id=id;
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
    dodajOdgovor(odgovor)
    {
        this._listaOdgovora.push(odgovor);
    }

}
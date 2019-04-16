export class Odgovor
{
    constructor(id,tacnost,ime)
    {
        this._id=id;
        this._tacnost=tacnost;
        this._ime=ime;
    }
    get id()
    {
        return this._id;
    }
    set id(x)
    {
        this._id=x;
    }
    get tacnost()
    {
       return this._tacnost;
    }
    set tacnost (x)
    {
        this._tacnost=x;

    }
    get ime()
    {
        return this._ime;
    }
    set ime (x)
    {
        this._ime=x;
    }
    
}
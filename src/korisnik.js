export class Korisnik 
{
    constructor (ime,poeni,lozinka)
    {
        this._id=null;
        this._ime=ime;
        this._poeni=poeni;
        this._lozinka=lozinka; 
    }
    get id()
    {
        return this._id;
    }
    set id (x)
    {
        this._id=x;
    }
    get ime ()
    {
        return this._ime;
    }
    set ime (x)
    {
        this._ime=x;
    }
    get poeni()
    {
        return this._poeni;
    }
    set poeni(x)
    {
        this._poeni=x;
    }
    get lozinka()
    {
        return this._lozinka;

    }
    set lozinka (x)
    {
        this._lozinka=x;
    }

}
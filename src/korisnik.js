export class Korisnik 
{
    constructor (ime,poeni,lozinka)
    {
        this._ime=ime;
        this._poeni=poeni;
        this._lozinka=lozinka; //?
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
        return this._ime;
    }
    set poeni(x)
    {
        return this._poeni=x;
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
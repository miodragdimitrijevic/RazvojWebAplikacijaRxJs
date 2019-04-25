import {Pitanja} from "./pitanja.js"
import {  Observable, fromEvent, from, of} from "rxjs";
import { take, filter, map, takeUntil,  debounceTime,  reduce} from "rxjs/operators";
import {Korisnik} from "./korisnik.js"
import { resolve } from "url";
import { rejects } from "assert";
import { async } from "rxjs/internal/scheduler/async";


const rngListaBtn=document.getElementById("btnrnglista");




const pomocnatabela=document.getElementById("tabelabodi");
const btnPocni=document.getElementById("Prijava");
let imeKorisnik=document.getElementById("txtime");
let lozinkaKorisnik=document.getElementById("pasvord");
const buttonHard=document.createElement("button");
const buttonEasy=document.createElement("button");
buttonHard.innerHTML="Hard";
buttonEasy.innerHTML="Easy";
const nizIdentifikatoraPitanja=[];

const flagObustavljanjaKviza=0;


let trenutnikorisnik=null;


const axios=require ('axios');
function popuniRangListu()
{
axios.get('http://localhost:3000/user?_sort=points&_order=desc')
.then(resp =>{
     const data=resp.data
     
    data.forEach(el=>
        {
            pomocnatabela.innerHTML+="<tr><td>"+el.name+"</td><td>" +el.points +"</td></tr>";
        }); 
        
}).catch(error => {console.log(error);});
}
popuniRangListu();

fromEvent(btnPocni,"click")

.pipe(
    
    map(ev=>ev.target.value),
    

).subscribe(korisnik=>{vratiKorisnika(); cekaj();});

function vratiKorisnika()
{
    
   trenutnikorisnik =new Korisnik(imeKorisnik.value,0,lozinkaKorisnik.value);
    proveriBazu();
  
    return trenutnikorisnik;


}
function proveriBazu()
{
    
    return new Promise(resolve=>{
        let flagDaLipostoji=0;
        axios.get('http://localhost:3000/user')
        .then(odg=>{
            const data =odg.data;
            data.forEach(el=>
                {
                    if(el.name==trenutnikorisnik._ime && el.password==trenutnikorisnik._lozinka)
                    {
                    flagDaLipostoji=1;
                    trenutnikorisnik._poeni=el.points;
                    trenutnikorisnik._id=el.id;
                    
                    }
                }
                )
        })
        setTimeout(()=>{resolve(flagDaLipostoji)},1000);
        
        
        
    });
}
async function cekaj()
{
    let vrednost=await proveriBazu();
    if(vrednost==1)
    crtajTezinuPostojeci();
    else
    crtajTezinuNepostojeci();
    

    

}
function crtajZaPostojecegKorisnika()
{
    
    return new Promise((resolve)=>{
        
    
    console.log(trenutnikorisnik);
    const paragraf=document.getElementById("paragraf");
    paragraf.innerHTML="Vec imate nalog! Kviz pocinje..";
    setTimeout(()=>{resolve("izvrseno")},3000);

    }).catch(error=>console.log(error));
}
function crtajZaNepostojecegKorisnika()
{
    return new Promise((resolve)=>{
        izracunajId();
        
        const paragraf=document.getElementById("paragraf");
        paragraf.innerHTML="Napravili ste novi nalog! PRVO TESTIRANJE JE PROBNO, NE ULAZI U BODOVANJE ZA RANG LISTU. ";
        setTimeout(()=>{resolve("izvrseno")},3000);
    
        }).catch(error=>console.log(error));
}

async function crtajTezinuPostojeci()
{
    var promenljiva=await crtajZaPostojecegKorisnika();
    
    console.log(promenljiva);
    const paragraf=document.getElementById("paragraf");
    paragraf.hidden=true;
    const bodiKviz=document.getElementById("bodiKviz");

    const dugmadDiv=document.createElement("div");
    dugmadDiv.className="dugmad";
    bodiKviz.appendChild(dugmadDiv);

    dugmadDiv.appendChild(buttonHard);
    dugmadDiv.appendChild(buttonEasy);

    const modalNaslov=document.getElementById("naslovKviz");
    modalNaslov.innerHTML="Izaberite tezinu testa";

}
function fecuj()
{
    return from (
        fetch(`http://localhost:3000/user`)
        .then(res=>res.json())
    )
}
function izracunajId()
{
    let brojacId =0;
    const $docekajFec=fecuj();
     $docekajFec.pipe(
        map(x=>x+1),
        takeUntil($docekajFec)
    ).subscribe(x=>console.log(x));
    const subscribe=$docekajFec.subscribe(x=>{
        x.forEach(el=> {
            brojacId++;
            

        })
        ubaciKorisnikaUBazu(brojacId);
    });
    
    
    
}
function ubaciKorisnikaUBazu(noviId)
{
    axios.post('http://localhost:3000/user',
    {
        id: noviId,
        name: imeKorisnik.value ,
        password: lozinkaKorisnik.value,
        points: 0
    }).then(resp=> {console.log(resp.data);
    }).catch(error=> {console.log(error)
    });
}
async function crtajTezinuNepostojeci()
{
    var promenljiva=await crtajZaNepostojecegKorisnika();
    
    console.log(promenljiva);
    const paragraf=document.getElementById("paragraf");
    paragraf.hidden=true;
    const bodiKviz=document.getElementById("bodiKviz");

    const dugmadDiv=document.createElement("div");
    dugmadDiv.className="dugmad";
    bodiKviz.appendChild(dugmadDiv);

    dugmadDiv.appendChild(buttonHard);
    dugmadDiv.appendChild(buttonEasy);

    const modalNaslov=document.getElementById("naslovKviz");
    modalNaslov.innerHTML="Izaberite tezinu testa";
}
fromEvent(buttonHard,"click").pipe(
    map(x=>x.target.value)
).subscribe(tezina=>{pribaviTeskaPitanja();});

function randomZaTesko()
{
    return Observable.create((randomBr)=>{
        
            randomBr.next(parseInt(15*Math.random()+15));
            
        
        
    }).pipe(filter(x=>x!=14),take(5),debounceTime(50))
        
}
async function pribaviTeskaPitanja()
{
    const btnZavrsi=document.getElementById("btnZavrsi");
    let flegOdgovorio=false;
    let brojac=0;

    const divOdgovori=document.getElementById("divOdgovori");
    const bodiKviz=document.getElementById("bodiKviz");
    const dugmad=document.querySelector(".dugmad");
    dugmad.hidden=true;
    const labela=document.createElement("label");
    labela.innerHTML="Izabrali ste tezak mod kviza..";
    bodiKviz.appendChild(labela);
    const modalNaslov=document.getElementById("naslovKviz");
    modalNaslov.innerHTML="Sacekajte..";
    let trenutniPoeni=0;

    btnZavrsi.onclick =(ev) => zavrsiNaDugme();
    

    for(let i=0;i<5;i++)
    {
        brojac++;
        bodiKviz.style.backgroundColor="white";
    const sub=randomZaTesko().subscribe(x=> {nizIdentifikatoraPitanja.push(x)});
    if(i==0)
    {
        const pPitanje=await prvoPitanje();
        axios.get(`http://localhost:3000/pitanja/${nizIdentifikatoraPitanja[i]}`)
        .then(odg=>
            {
                
                let brojacZaPitanje=1;
                
                const data=odg.data;
                modalNaslov.innerHTML=data.ime;
                labela.hidden=true;
                axios.get('http://localhost:3000/odgovori')
                .then(rsp=>
                {
                    const pod=rsp.data;
                    pod.forEach((el)=>{
                        if(el.id==data.id)
                        {
                            if(el.tacnost==1)
                            {
                                const tacnoDugme=document.createElement("button");
                                tacnoDugme.setAttribute("id","1");
                                tacnoDugme.hidden=false;
                                tacnoDugme.innerHTML=el.ime;
                                divOdgovori.appendChild(tacnoDugme);
                                fromEvent(tacnoDugme,"click").pipe(map(ev=>ev.target.value)).subscribe(x=>{popuniTacno(); trenutniPoeni+=2; console.log(trenutniPoeni);flegOdgovorio=true;})
                            }
                            else
                            {
                                brojacZaPitanje++;
                                let stringZaId=""+brojacZaPitanje;
                                let netacna=document.createElement("button");
                                netacna.setAttribute("id",stringZaId);
                                netacna.hidden=false;
                                netacna.innerHTML=el.ime;
                                divOdgovori.appendChild(netacna);
                                fromEvent(netacna,"click").pipe(map(ev=>ev.target.value)).subscribe(x=>{popuninetacno();flegOdgovorio=true; trenutniPoeni--; console.log(trenutniPoeni) ;})
                            
                            }
                        }
                    })
                })  
            })
    }
    else{ 
    const cekajPromis=await vratiPromiszaDrugaPitanja();
    if(flegOdgovorio==false)
        {
            modalNaslov.innerHTML="Niste odgovorili na vreme. Kviz se zavrsio!Refresujte da pokusate ponovo.";
            modalNaslov.style.backgroundColor="tomato";
            
            
            bodiKviz.innerHTML="";
            
            break;
        }
        flegOdgovorio=false;
    axios.get(`http://localhost:3000/pitanja/${nizIdentifikatoraPitanja[i]}`)
        .then(odg=>
            {
                
                let brojacZaPitanje=1;
                const data=odg.data;
                modalNaslov.innerHTML=data.ime;
                labela.hidden=true;
                axios.get('http://localhost:3000/odgovori')
                .then(rsp=>
                {
                    const pod=rsp.data;
                    pod.forEach((el)=>{
                        if(el.id==data.id)
                        {
                            if(el.tacnost==1)
                            {
                                const tacnoDugme=document.createElement("button");
                                tacnoDugme.setAttribute("id","1");
                                tacnoDugme.hidden=false;
                                tacnoDugme.innerHTML=el.ime;
                                divOdgovori.appendChild(tacnoDugme);
                                fromEvent(tacnoDugme,"click").pipe(map(ev=>ev.target.value)).subscribe(x=>{popuniTacno(); trenutniPoeni+=2; console.log(trenutniPoeni);flegOdgovorio=true;})
                            }
                            else
                            {
                                brojacZaPitanje++;
                                let stringZaId=""+brojacZaPitanje;
                                let netacna=document.createElement("button");
                                netacna.setAttribute("id",stringZaId);
                                netacna.hidden=false;
                                netacna.innerHTML=el.ime;
                                divOdgovori.appendChild(netacna);
                                fromEvent(netacna,"click").pipe(map(ev=>ev.target.value)).subscribe(x=>{popuninetacno();flegOdgovorio=true; trenutniPoeni--; console.log(trenutniPoeni) ;})
                            
                            }
                            
                            
                        }
                    })

                })
            })
    }
    
    }
        bodiKviz.style.backgroundColor="white";
        naslovKviz.innerHTML="Nazalost,isteklo vam je vreme..Kviz je zavrsen.Racunam rezultat..";
      const cekaj=await poslednjePitanje();


    
    const source=of(trenutniPoeni,trenutnikorisnik._poeni);
    const pomocna=source.pipe(reduce((acc,val)=>acc + val));
    const subscribe=pomocna.subscribe(val=> {
        let pomocnistring=trenutnikorisnik._ime + " " + "vas trenutni rezultat je" + val + "." + "Ako zelite opet da igrate osvezite stranu.";
        naslovKviz.innerHTML= pomocnistring;
        bodiKviz.style.backgroundColor="white";
        bodiKviz.innerHTML="";
        trenutnikorisnik._poeni=val;

        
       

    })
    const sacekajObavestenje=await obavestenje();
    promeniuBazu(trenutnikorisnik._poeni);
        pomocnatabela.innerHTML="";
        popuniRangListu();
}
function zavrsiNaDugme()
{
    bodiKviz.innerHTML="";
    naslovKviz.innerHTML="";
    alert ("Iskljucili ste kviz.Ako zelite da zapocnete novi,osvezite stranicu");
}
function promisZaNovogclana()
{
    return new Promise((resolve)=>
    {
        setTimeout(()=> {resolve("drugi clan")},15000);
    })
}

function vratiPromiszaDrugaPitanja()
{
    return new Promise((resolve)=>
    {
        setTimeout(()=> {resolve("ovde crtam svako drugo pitanje")},15000);
    })
}
function prvoPitanje()
{
    return new Promise((resolve)=>
    {
        setTimeout(()=> {resolve("ovde crtam prvo pitanje")},3000);
    })
}
function poslednjePitanje()
{
    return new Promise ((resolve)=>
    {
        setTimeout(()=>{resolve("")},15000);
    })
}
function obavestenje()
{
    return new Promise ((resolve)=>
    {
        setTimeout(()=> {resolve("nesto")},3000);
    })
}
function promeniuBazu(brojPoena)
{
    axios.put(`http://localhost:3000/user/${trenutnikorisnik._id}/`, {
    id: trenutnikorisnik._id,
    name: trenutnikorisnik._ime,
    password: trenutnikorisnik._lozinka,
    points: brojPoena

}).then(resp => {

    console.log(resp.data);
}).catch(error => {

    console.log(error);
});  
}
function popuniTacno()
{
    const bodiKvizz=document.getElementById("bodiKviz");
    const naslovKviz=document.getElementById("naslovKviz");
    naslovKviz.innerHTML="Odgovorili ste tacno! Sledi sledece pitanje..";
    const btn0=document.getElementById("1");
    const btn1=document.getElementById("2");
    const btn2=document.getElementById("3");
    const btn3=document.getElementById("4");
    btn0.hidden=true;
    btn1.hidden=true;
    btn2.hidden=true;
    btn3.hidden=true;
    btn0.setAttribute("id","");
    btn1.setAttribute("id","");
    btn2.setAttribute("id","");
    btn3.setAttribute("id","");
    
   

  
    bodiKvizz.style.backgroundColor="green";


}
function popuninetacno()
{
    const bodiKvizz=document.getElementById("bodiKviz");
    const naslovKviz=document.getElementById("naslovKviz");
    naslovKviz.innerHTML="Odgovorili ste tacno! Sledi sledece pitanje..";
    const btn0=document.getElementById("1");
    const btn1=document.getElementById("2");
    
    const btn2=document.getElementById("3");
    
    const btn3=document.getElementById("4");
    btn0.hidden=true;
    btn1.hidden=true;
    btn2.hidden=true;
    btn3.hidden=true;
    btn0.setAttribute("id","");
    btn1.setAttribute("id","");
    btn2.setAttribute("id","");
    btn3.setAttribute("id","");
    bodiKvizz.style.backgroundColor="red";
}
function randomZaLako()
{
    return Observable.create((randomBr)=>{
        
        randomBr.next(parseInt(14*Math.random()));
        
    
    
}).pipe(take(5),debounceTime(50))
    
}
fromEvent(buttonEasy,"click").pipe(
    map(x=>x.target.value)
).subscribe(tezina=>{pribaviLakaPitanja();});

async function pribaviLakaPitanja ()
{
    const btnZavrsi=document.getElementById("btnZavrsi");
    let flegOdgovorio=false;
    let brojac=0;

    const divOdgovori=document.getElementById("divOdgovori");
    const bodiKviz=document.getElementById("bodiKviz");
    const dugmad=document.querySelector(".dugmad");
    dugmad.hidden=true;
    const labela=document.createElement("label");
    labela.innerHTML="Izabrali ste lak mod kviza..";
    bodiKviz.appendChild(labela);
    const modalNaslov=document.getElementById("naslovKviz");
    modalNaslov.innerHTML="Sacekajte..";
    let trenutniPoeni=0;

    btnZavrsi.onclick =(ev) => zavrsiNaDugme();
    

    for(let i=0;i<5;i++)
    {
        brojac++;
        bodiKviz.style.backgroundColor="white";
    const sub=randomZaLako().subscribe(x=> {nizIdentifikatoraPitanja.push(x)});
    if(i==0)
    {
        const pPitanje=await prvoPitanje();
        axios.get(`http://localhost:3000/pitanja/${nizIdentifikatoraPitanja[i]}`)
        .then(odg=>
            {
                
                let brojacZaPitanje=1;
                
                const data=odg.data;
                modalNaslov.innerHTML=data.ime;
                labela.hidden=true;
                axios.get('http://localhost:3000/odgovori')
                .then(rsp=>
                {
                    const pod=rsp.data;
                    pod.forEach((el)=>{
                        if(el.id==data.id)
                        {
                            if(el.tacnost==1)
                            {
                                const tacnoDugme=document.createElement("button");
                                tacnoDugme.setAttribute("id","1");
                                tacnoDugme.hidden=false;
                                tacnoDugme.innerHTML=el.ime;
                                divOdgovori.appendChild(tacnoDugme);
                                fromEvent(tacnoDugme,"click").pipe(map(ev=>ev.target.value)).subscribe(x=>{popuniTacno(); trenutniPoeni+=1; console.log(trenutniPoeni);flegOdgovorio=true;})
                            }
                            else
                            {
                                brojacZaPitanje++;
                                let stringZaId=""+brojacZaPitanje;
                                let netacna=document.createElement("button");
                                netacna.setAttribute("id",stringZaId);
                                netacna.hidden=false;
                                netacna.innerHTML=el.ime;
                                divOdgovori.appendChild(netacna);
                                fromEvent(netacna,"click").pipe(map(ev=>ev.target.value)).subscribe(x=>{popuninetacno();flegOdgovorio=true; trenutniPoeni--; console.log(trenutniPoeni) ;})
                            
                            }
                        }
                    })
                })  
            })
    }
    else{ 
    const cekajPromis=await vratiPromiszaDrugaPitanja();
    if(flegOdgovorio==false)
        {
            modalNaslov.innerHTML="Niste odgovorili na vreme. Kviz se zavrsio!Refresujte da pokusate ponovo.";
            modalNaslov.style.backgroundColor="tomato";
            
            
            bodiKviz.innerHTML="";
            
            break;
        }
        flegOdgovorio=false;
    axios.get(`http://localhost:3000/pitanja/${nizIdentifikatoraPitanja[i]}`)
        .then(odg=>
            {
                
                let brojacZaPitanje=1;
                const data=odg.data;
                modalNaslov.innerHTML=data.ime;
                labela.hidden=true;
                axios.get('http://localhost:3000/odgovori')
                .then(rsp=>
                {
                    const pod=rsp.data;
                    pod.forEach((el)=>{
                        if(el.id==data.id)
                        {
                            if(el.tacnost==1)
                            {
                                const tacnoDugme=document.createElement("button");
                                tacnoDugme.setAttribute("id","1");
                                tacnoDugme.hidden=false;
                                tacnoDugme.innerHTML=el.ime;
                                divOdgovori.appendChild(tacnoDugme);
                                fromEvent(tacnoDugme,"click").pipe(map(ev=>ev.target.value)).subscribe(x=>{popuniTacno(); trenutniPoeni+=1; console.log(trenutniPoeni);flegOdgovorio=true;})
                            }
                            else
                            {
                                brojacZaPitanje++;
                                let stringZaId=""+brojacZaPitanje;
                                let netacna=document.createElement("button");
                                netacna.setAttribute("id",stringZaId);
                                netacna.hidden=false;
                                netacna.innerHTML=el.ime;
                                divOdgovori.appendChild(netacna);
                                fromEvent(netacna,"click").pipe(map(ev=>ev.target.value)).subscribe(x=>{popuninetacno();flegOdgovorio=true; trenutniPoeni--; console.log(trenutniPoeni) ;})
                            
                            }
                            
                            
                        }
                    })

                })
            })
    }
    
    }
        bodiKviz.style.backgroundColor="white";
        naslovKviz.innerHTML="Nazalost,isteklo vam je vreme..Kviz je zavrsen.Racunam rezultat..";
      const cekaj=await poslednjePitanje();


    
    const source=of(trenutniPoeni,trenutnikorisnik._poeni);
    const pomocna=source.pipe(reduce((acc,val)=>acc + val));
    const subscribe=pomocna.subscribe(val=> {
        let pomocnistring=trenutnikorisnik._ime + " " + "vas trenutni rezultat je" + val + "." + "Ako zelite opet da igrate osvezite stranu.";
        naslovKviz.innerHTML= pomocnistring;
        bodiKviz.style.backgroundColor="white";
        bodiKviz.innerHTML="";
        trenutnikorisnik._poeni=val;

        promeniuBazu(trenutnikorisnik._poeni);
       

    })
    const sacekajObavestenje=await obavestenje();
        pomocnatabela.innerHTML="";
        popuniRangListu();
}






















   
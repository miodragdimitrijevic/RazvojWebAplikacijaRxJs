import {Pitanja} from "./pitanja.js"
import { interval, range, Subject, Observable, fromEvent, from, forkJoin, timer, zip } from "rxjs";
import { take, filter, map, takeUntil, sampleTime, debounceTime, switchMap, pairwise, scan } from "rxjs/operators";
import {Korisnik} from "./korisnik.js"
import { resolve } from "url";



const rngListaBtn=document.getElementById("btnrnglista");
const pomocnatabela=document.getElementById("tabela");
const btnPocni=document.getElementById("Prijava");
let imeKorisnik=document.getElementById("txtime");
let lozinkaKorisnik=document.getElementById("pasvord");


let trenutnikorisnik=null;



const users=[];
const imena=[];
const poeni=[];

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
    

).subscribe(korisnik=>{vratiKorisnika(); cekaj()});

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
        setTimeout(()=>{resolve(flagDaLipostoji)},500);
        axios.get('http://localhost:3000/user')
        .then(odg=>{
            const data =odg.data;
            data.forEach(el=>
                {
                    if(el.name==trenutnikorisnik._ime && el.password==trenutnikorisnik._lozinka)
                    flagDaLipostoji=1;
                    
                  
                }
                )
        })
        setTimeout(()=>{resolve(flagDaLipostoji)},500);
        
        
        
    });
}
async function cekaj()
{
    let vrednost=await proveriBazu();
    if(vrednost==1)
    {
        console.log("Kasnim");
    }

    

}















   
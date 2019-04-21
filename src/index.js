import {Pitanja} from "./pitanja.js"
import { interval, range, Subject, Observable, fromEvent, from, forkJoin, timer, zip } from "rxjs";
import { take, filter, map, takeUntil, sampleTime, debounceTime, switchMap, pairwise, scan } from "rxjs/operators";
import {Korisnik} from "./korisnik.js"



const rngListaBtn=document.getElementById("btnrnglista");
const pomocnatabela=document.getElementById("tabela");


const users=[];
const imena=[];
const poeni=[];

const axios=require ('axios');
function fecuj()
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
fecuj();












   
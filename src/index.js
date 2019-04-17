const btn=document.getElementById("Prijava");
btn.onclick = (ev) => prikazi();
function prikazi()
{
    var lozinka=document.getElementById("pasvord");
    lozinka=lozinka.value ;
    console.log(lozinka);
}
const axios = require('axios');

axios.get('http://localhost:3000/korisnik')
    .then(resp => {
        data = resp.data;
        data.forEach(e => {
            console.log(`${e.id}, ${e.ime}, ${e.lozinka}`);
        });
    })
    .catch(error => {
        console.log(error);
    });
   

axios.post('http://localhost:3000/korisnik', {
    id: 6,
    ime: 'Fred',
    lozinka: 'Blair',
    poeni: 3
}).then(resp => {
    console.log(resp.data);
}).catch(error => {
    console.log(error);
});  
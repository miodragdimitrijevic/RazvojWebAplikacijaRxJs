const btn=document.getElementById("Prijava");
btn.onclick = (ev) => prikazi();
function prikazi()
{
    var lozinka=document.getElementById("pasvord");
    lozinka=lozinka.value ;
    console.log(lozinka);
}

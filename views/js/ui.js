function w3_open() {
  document.getElementById("sidebar-wrapper").style.marginLeft = "-225px";
  document.getElementById('page-content-wrapper').style.marginLeft = "200px";

}

function w3_close() {
  document.getElementById("sidebar-wrapper").style.marginLeft = "-500px";
  document.getElementById('page-content-wrapper').style.marginLeft = "50px";
}
var calledOnce = false;

function sidebartransition() {
  if (calledOnce) {
    calledOnce = false;
    w3_close();
  } else {
    calledOnce = true;
    w3_open();
  }
}

(function(){
  "use strict";

  var Scoreboard = function(){
    //SINGELTON PATTERN
    if(Scoreboard.instance){
      return Scoreboard.instance;
    }
    Scoreboard.instance = this;

    this.routes = Scoreboard.routes;

    //Kõik muutujad, mis rakendusega on seotud defineeritakse siin
    this.currentRoute = null;

    //Siin hoitakse tulemusi
    this.results = [];

    this.init();
  };

  window.Scoreboard = Scoreboard; //mida tähendab siin see muutuja külge panemine?

  Scoreboard.routes = {
    'home-view':{
      'render': function(){
        console.log('>>>Avaleht');
      }
    },
    'list-view': {
      'render': function(){
        console.log('>>>Loend');
      }
    },
    'manage-view': {
      'render': function(){
        console.log('>>>Haldus');
      }
    }
  };

  //Kõik funktsioonid, mis Scoreboardi külge lähevad
  Scoreboard.prototype = {

    init: function(){
      console.log('Rakendus läks tööle');

      //Kuulan aadressirea vahetust
      window.addEventListener('hashchange', this.routeChange.bind(this));

      // kui aadressireal ei ole hashi siis lisan juurde
       if(!window.location.hash){
         window.location.hash = 'home-view';
         // routechange siin ei ole vaja sest käsitsi muutmine käivitab routechange event'i ikka
       }else{
         //esimesel käivitamisel vaatame urli üle ja uuendame menüüd
         this.routeChange();
       }
//SIIN JÄI POOLELI  

    },//siin lõppeb init (mis peavad initi sees olema ja mis peavad siit väljas olema?)


    routeChange: function(event){

       //kirjutan muuutujasse lehe nime, võtan maha #
       this.currentRoute = location.hash.slice(1);
       console.log(this.currentRoute);

       //kas meil on selline leht olemas?
       if(this.routes[this.currentRoute]){

         //muudan menüü lingi aktiivseks
         this.updateMenu();

         this.routes[this.currentRoute].render();


       }else{
         /// 404 - ei olnud
       }


     },
    updateMenu: function() {
       //http://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript
       //1) võtan maha aktiivse menüülingi kui on
       document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace('active-menu', '');

       //2) lisan uuele juurde
       //console.log(location.hash);
       document.querySelector('.'+this.currentRoute).className += ' active-menu';

     }
  }; //Scoreboard'i lõpp

  //Kui leht on laetud, käivitan Scoreboard rakenduse
  window.onload = function(){
    var app = new Scoreboard();
  };

})();

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

       //Kuulan hiireklikke nupul
       this.bindEvents();

    },//siin lõppeb init (mis peavad initi sees olema ja mis peavad siit väljas olema?)

    bindEvents: function(){
      document.querySelector('.add-new-entry').addEventListener('click', this.addNewClick.bind(this));
    },
    addNewClick: function(event){
      var title = document.querySelector('.title').value;
      var team_1 = document.querySelector('.team_1').value;
      var team_2 = document.querySelector('.team_2').value;
      var result_1 = document.querySelector('.result_1').value;
      var result_2 = document.querySelector('.result_2').value;
      var id = guid();

      var new_entry = new Entry(id, title, team_1, team_2, result_1, result_2);

      
    },
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

  var Entry = function(new_id, new_title, new_team_1, new_team_2, new_result_1, new_result_2){
    this.id = new_id;
    this.title = new_title;
    this.new_team_1 = new_team_1;
    this.new_team_2 = new_team_2;
    this.new_result_1 = new_result_1;
    this.new_result_2 = new_result_2;
    console.log('created new entry');
  };

  //HELPER
    function guid(){
      var d = new Date().getTime();
    if(window.performance && typeof window.performance.now === "function"){
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
    }

    //Kui leht on laetud, käivitan Scoreboard rakenduse
    window.onload = function(){
      var app = new Scoreboard();
  };

})();

(function(){
  "use strict";

  var ScoreBoard = function(){
    // SINGLETON PATTERN (4 rida)
    if(ScoreBoard.instance){
      return ScoreBoard.instance;
    }
    ScoreBoard.instance = this;

  //  this.ScoreBoard = document.getElementById('ScoreBoard');
    this.routes = ScoreBoard.routes;

    console.log(this);

    //panen rakenduse tööle
    this.init();
  };

  ScoreBoard.routes = {
    "home-view": {
      render: function(){
        // käivitan siis kui jõuan lehele
        console.log('JS avalehel');
      }
    },
    "list-view": {
      render: function(){
        console.log('JS loendi lehel');

      }
    },
    "manage-view": {
      render: function(){
        console.log('JS halduse lehel');

      }
    }
  };

  //Kõik funktsioonid tulevad siia sisse
  ScoreBoard.prototype = {
    init: function(){
      console.log("rakendus käivitus");

      window.addEventListener('hashchange', this.routeChange.bind(this));

      //vaatan mis lehel olen, kui ei ole hashi lisan avalehe
      console.log(window.location.hash);
      if(!window.location.hash){
        window.location.hash = "home-view";
      }else{
        //hash oli olemas, käivitan routeChange fn
        this.routeChange();

      }

      this.bindMouseEvents();

    },
    bindMouseEvents: function(){
      document.querySelector('.add-teams').addEventListener('click', this.addNewClick.bind(this));
    },
    addNewClick: function(event){
      // lisa uus purk
      var home_team = document.querySelector('.home_team').value;
      var away_team = document.querySelector('.away_team').value;
      console.log(home_team + '<------>' + away_team);
      if (home_team !== "" && away_team !== ""){

        var new_teams = new Teams(home_team, away_team);
    //    var li = new_jar.createHtmlElement();
    //    document.querySelector('.list-of-jars').appendChild(li);
        document.querySelector("span.home_team-error").innerHTML="";
      } else {

        //mis oli tühi
        if (home_team === ""){

          document.querySelector("span.home_team-error").innerHTML="Peab olema sisestatud";
        }

        if (away_team === ""){

          document.querySelector("span.away_team-error").innerHTML="Peab olema sisestatud";
        }

      }



    },
    routeChange: function(event){

      // slice võtab # ära #home-view >> home-view
      this.currentRoute = window.location.hash.slice(1);

      // kas leht on olemas
      if(this.routes[this.currentRoute]){
        //jah

        this.updateMenu();

        console.log('>>> ' + this.currentRoute);
        //käivitan selle lehe jaoks ettenähtud js
        this.routes[this.currentRoute].render();
      }else{
        // 404?
        console.log('404');
        window.location.hash = 'home-view';
      }

    },
    updateMenu: function(){

      //kui on mingil menüül klass active-menu siis võtame ära
      document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace(' active-menu', '');

      //käesolevale lehele lisan juurde
      document.querySelector('.' + this.currentRoute).className += ' active-menu';

    },


  };

    window.onload = function(){
      var app = new ScoreBoard();
    };



  })();

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
    this.createdTeam = null;
    this.createdScore = null;

    console.log(this);

    //panen rakenduse tööle
    this.init();
  };

  window.ScoreBoard = ScoreBoard;

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

       //saan localStoragest kätte, kui on
       if(localStorage.results){
         //võtan stringi ja teen tagasi objektideks
         this.results = JSON.parse(localStorage.saved_teams);
      //   console.log('laadisin localStorageist massiiivi ' + this.saved_teams.length);

         //tekitan htmli loendi
          this.results.forEach(function(){
        //    var new_teams = new Teams(teams.home, teams.away, teams.home_score, teams.away_score);
            var li = this.createdTeam.createHtmlElement();
            document.querySelector('.list-of-games').appendChild(li);
          });
       }


      this.bindMouseEvents();

    },
    bindMouseEvents: function(){
      document.querySelector('.add-teams').addEventListener('click', this.addNewClick.bind(this));
      document.querySelector('.add-home').addEventListener('click', this.update.bind(this));
      document.querySelector('.add-away').addEventListener('click', this.update.bind(this));
      document.querySelector('.add-home-2').addEventListener('click', this.update2.bind(this));
      document.querySelector('.add-away-2').addEventListener('click', this.update2.bind(this));
      document.querySelector('.add-home-3').addEventListener('click', this.update3.bind(this));
      document.querySelector('.add-away-3').addEventListener('click', this.update3.bind(this));
      document.querySelector('.save').addEventListener('click', this.save.bind(this));
    },
    save: function(){
      // this.results.push(this.createdTeams);
      localStorage.setItem('results', JSON.stringify(this.createdTeam));
      var li = this.createdTeam.createHtmlElement();
      document.querySelector('.list-of-games').appendChild(li);

    },
    update: function(event){
      console.log(event.target.dataset);

      console.log(event.target.dataset.name);

      if(event.target.dataset.home){
          this.createdTeam.updateScore('home');
      }else if(event.target.dataset.away){
          this.createdTeam.updateScore('away');
      }

    },
    update2: function(event){

      if(event.target.dataset.home){
          this.createdTeam.updateScore2('home');
      }else if(event.target.dataset.away){
          this.createdTeam.updateScore2('away');
      }

    },
    update3: function(event){

      if(event.target.dataset.home){
          this.createdTeam.updateScore3('home');
      }else if(event.target.dataset.away){
          this.createdTeam.updateScore3('away');
      }

    },
    addNewClick: function(event){
      // lisa uus
      var home_team = document.querySelector('.home_team').value;
      var away_team = document.querySelector('.away_team').value;
      var home_team_score = document.querySelector('.home_team_score').value;
      var away_team_score = document.querySelector('.away_team_score').value;
      console.log(home_team + '<------>' + away_team);
      console.log(home_team_score + '<------>' + away_team_score);

      if (home_team !== "" && away_team !== "" && home_team_score !== "" && away_team_score !== ""){

        var new_teams = new Teams(home_team, away_team, home_team_score, away_team_score);
        //var new_scores = new Scores(home_team_score, away_team_score);

        this.createdTeam = new_teams;
        console.log(this.createdTeam);
      //  this.createdScore = new_scores;

        var div = new_teams.generateDiv();
      //  var div2 = new_scores.generateDiv();

        document.querySelector(".names").appendChild(div);
      //  document.querySelector(".scores").appendChild(div2);


        document.querySelector("span.home_team-error").innerHTML="";
        document.querySelector("span.away_team-error").innerHTML="";
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

  var Teams = function(a, b, c, d){
    this.home = a;
    this.away = b;
    this.home_score = c;
    this.away_score = d;
    this.div = null;
  };

  // var Scores = function(a, b){
  //   this.home = a;
  //   this.away = b;
  //   this.div = null;
  // };
  // var List = function(createdTeam)
  //
  // List.prototype = {

  // };

  Teams.prototype = {
    createHtmlElement: function(){
      var li = document.createElement('li');
      var span = document.createElement('span');
      span.className = 'letter';

      var letter = document.createTextNode(this.home.charAt(0));
      span.appendChild(letter);

      li.appendChild(span);

      var span_with_content = document.createElement('span');
      span_with_content.className = 'content';

      var content = document.createTextNode(this.home + ' ' + this.home_score + ' - ' + this.away_score + ' ' + this.away);
      span_with_content.appendChild(content);

      li.appendChild(span_with_content);

      return li;
    },

    generateDiv: function(){
      var div = document.createElement('div');
      div.innerHTML = this.home+" - "+this.away +'<br>';
      div.innerHTML += this.home_score+" - "+this.away_score;
      // a = 5
      // a += 10 // a = 15 // a = a + 10
      this.div = div;
      console.log(div);
      return div;
    },
    updateScore: function(home_or_away){
      if(home_or_away == "home"){
        this.home_score++;
      //  this.div.innerHTML = this.home+" - "+this.away;
        this.div.innerHTML = this.home+" - "+this.away +'<br>';
        this.div.innerHTML += this.home_score+" - "+this.away_score;
      }

      if(home_or_away == "away"){
        this.away_score++;
      //  this.div.innerHTML = this.home+" - "+this.away;
        this.div.innerHTML = this.home+" - "+this.away +'<br>';
        this.div.innerHTML += this.home_score+" - "+this.away_score;
      }
    },
    updateScore2: function(home_or_away){
      if(home_or_away == "home"){
        this.home_score+=2;
      //  this.div.innerHTML = this.home+" - "+this.away;
        this.div.innerHTML = this.home+" - "+this.away +'<br>';
        this.div.innerHTML += this.home_score+" - "+this.away_score;
      }

      if(home_or_away == "away"){
        this.away_score+=2;
      //  this.div.innerHTML = this.home+" - "+this.away;
        this.div.innerHTML = this.home+" - "+this.away +'<br>';
        this.div.innerHTML += this.home_score+" - "+this.away_score;
      }
    },
    updateScore3: function(home_or_away){
      if(home_or_away == "home"){
        this.home_score+=3;
      //  this.div.innerHTML = this.home+" - "+this.away;
        this.div.innerHTML = this.home+" - "+this.away +'<br>';
        this.div.innerHTML += this.home_score+" - "+this.away_score;
      }

      if(home_or_away == "away"){
        this.away_score+=3;
      //  this.div.innerHTML = this.home+" - "+this.away;
        this.div.innerHTML = this.home+" - "+this.away +'<br>';
        this.div.innerHTML += this.home_score+" - "+this.away_score;
      }
    },

  };

  // Scores.prototype = {
  //   generateDiv: function(){
  //     var div = document.createElement('div');
  //     div.innerHTML = this.home+" - "+this.away;
  //     this.div = div;
  //     console.log(div);
  //     return div;
  //   },
    // updateScore: function(home_or_away){
    //   if(home_or_away == "home"){
    //     this.home++;
    //     this.div.innerHTML = this.home+" - "+this.away;
    //   }if(home_or_away == "away"){
    //     this.away++;
    //     this.div.innerHTML = this.home+" - "+this.away;
    //   }
    // }
//  };

  window.Teams = Teams;
//  window.Scores = Scores;

    window.onload = function(){
      var app = new ScoreBoard();
    };



  })();

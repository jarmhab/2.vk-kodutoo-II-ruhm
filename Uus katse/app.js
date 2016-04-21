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
    this.entries = [];

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

       //Siin saan asjad kätte localstorage'st
       if(localStorage.entries){
         this.entries = JSON.parse(localStorage.entries);

         //Siin tekitan loendi
         this.entries.forEach(function(entry){
           var new_entry = new Entry(entry.id, entry.title, entry.team_1, entry.team_2, entry.result_1, entry.result_2);
           var li = new_entry.createHtmlElement();
           document.querySelector('.list-of-entries').appendChild(li);
         });
       }
       //Kuulan hiireklikke nupul
       this.bindEvents();

    },//siin lõppeb init (mis peavad initi sees olema ja mis peavad siit väljas olema?)

    bindEvents: function(){
      document.querySelector('.add-new-entry').addEventListener('click', this.addNewClick.bind(this));
    },
    deleteEntry: function(event){
      //millele vajutati
      console.log(event.target);
      //tema parent ehk mille see ta on (li)
      console.log(event.target.parentNode);
      //mille sees omakorda see on (ul)
      console.log(event.target.parentNode.parentNode);
      //ID
      console.log(event.target.dataset.id);

      var c = confirm("Oled kindel?");
      //kui ei ole kindel
      if(!c){return;}
      //Kustutan
      console.log('kustutan');

      //Kustutan Html'i
      var ul = event.target.parentNode.parentNode;
      var li = event.target.parentNode;
      ul.removeChild(li);
      var delete_id = event.target.dataset.id;

      //Kustutan ka massiivist ja uuendan LocalStoraget
      for(var i=0; i<this.entries.length; i++){
        if(this.entries[i].id == delete_id){
          //kustutan kohal [i]
          this.entries.splice(i, 1);
          break;
        }
      }
      localStorage.setItem('entries', JSON.stringify(this.entries));
    },
    editEntry: function(event){
      var selected_id = event.target.dataset.id;
      var clicked_li = event.target.parentNode;
      $("#ModalEdit").modal({backdrop: true});

      $(document).on("click", "#edit_close", function(event){
        return;
      });

      $(document).on("click", "#save", function(event){
        console.log(clicked_li);
        var title = document.querySelector('.EditTitle').value;
        var team_1 = document.querySelector('.EditTeam_1').value;
        var team_2 = document.querySelector('.EditTeam_2').value;
        var result_1 = document.querySelector('.EditResult_1').value;
        var result_2 = document.querySelector('.EditResult_2').value;
        this.entries = JSON.parse(localStorage.entries);
        clicked_li.parentNode.removeChild(clicked_li);
        for(var i=0; i<this.entries.length; i++){
          if(this.entries[i].id == selected_id){
            this.entries[i].title = title;
            this.entries[i].team_1 = team_1;
            this.entries[i].team_2 = team_2;
            this.entries[i].result_1 = result_1;
            this.entries[i].result_2 = result_2;
            break;
          }
        }
        localStorage.setItem('entries', JSON.stringify(this.entries));
        location.reload();
      });
    },
    addNewClick: function(event){
      var title = document.querySelector('.title').value;
      var team_1 = document.querySelector('.team_1').value;
      var team_2 = document.querySelector('.team_2').value;
      var result_1 = document.querySelector('.result_1').value;
      var result_2 = document.querySelector('.result_2').value;
      var id = guid();

      if (title !== "" && team_1 !== "" && team_2 !== "" && result_1 !== "" && result_2 !== ""){

        var new_entry = new Entry(id, title, team_1, team_2, result_1, result_2);
        //Lisan andmed massiivi
        this.entries.push(new_entry);
        console.log(JSON.stringify(this.entries));
        localStorage.setItem('entries', JSON.stringify(this.entries));
        var li = new_entry.createHtmlElement();
        document.querySelector('.list-of-entries').appendChild(li);
        //document.querySelector("span.error").innerHTML="";
        window.location.reload(); //sellega puhastan väljad. avastasin, et mozillaga ei puhasta reloadimine väljasid ära.
      }else{
        document.querySelector("span.error").innerHTML="Kõik väljad on kohustuslikud";
        }
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
    this.team_1 = new_team_1;
    this.team_2 = new_team_2;
    this.result_1 = new_result_1;
    this.result_2 = new_result_2;
    console.log('created new entry');
  };

  Entry.prototype = {
    createHtmlElement: function(){
      var li = document.createElement('li');

      var span = document.createElement('span');
      span.className = 'letter';

      var letter = document.createTextNode(this.title.charAt(0));
      span.appendChild(letter);

      li.appendChild(span);

      var span_with_content = document.createElement('span');
      span_with_content.className = 'content';

      var content = document.createTextNode(this.title + ' | ' + this.team_1 + ' - ' + this.team_2 + ' | ' + this.result_1 + ' - ' + this.result_2);
      span_with_content.appendChild(content);
      li.appendChild(span_with_content);
      //console.log(li);

      //Delete nupp
      var span_delete = document.createElement('span');
      span_delete.style.color = "red";
      span_delete.style.cursor = "pointer";

      //Panen kaasa ID
      span_delete.setAttribute("data-id", this.id);
      span_delete.innerHTML = " Delete";
      li.appendChild(span_delete);

      span_delete.addEventListener("click", Scoreboard.instance.deleteEntry.bind(Scoreboard.instance));

      //Edit nupp
      var span_edit = document.createElement('span');
      span_edit.style.color = "blue";
      span_edit.style.cursor = "pointer";
      span_edit.setAttribute("data-id", this.id);
      span_edit.innerHTML = " Edit";
      li.appendChild(span_edit);
      span_edit.addEventListener('click', Scoreboard.instance.editEntry.bind(Scoreboard.instance));

      return li;
    }
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

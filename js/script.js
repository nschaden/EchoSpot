// Simple Set Clipboard System
// Author: Joseph Huckaby
window.ZeroClipboard={version:"1.0.8",clients:{},moviePath:"ZeroClipboard.swf",nextId:1,$:function(a){return typeof a=="string"&&(a=document.getElementById(a)),a.addClass||(a.hide=function(){this.style.display="none"},a.show=function(){this.style.display=""},a.addClass=function(a){this.removeClass(a),this.className+=" "+a},a.removeClass=function(a){var b=this.className.split(/\s+/),c=-1;for(var d=0;d<b.length;d++)b[d]==a&&(c=d,d=b.length);return c>-1&&(b.splice(c,1),this.className=b.join(" ")),this},a.hasClass=function(a){return!!this.className.match(new RegExp("\\s*"+a+"\\s*"))}),a},setMoviePath:function(a){this.moviePath=a},newClient:function(){return new ZeroClipboard.Client},dispatch:function(a,b,c){var d=this.clients[a];d&&d.receiveEvent(b,c)},register:function(a,b){this.clients[a]=b},getDOMObjectPosition:function(a,b){var c={left:0,top:0,width:a.width?a.width:a.offsetWidth,height:a.height?a.height:a.offsetHeight};while(a&&a!=b)c.left+=a.offsetLeft,c.left+=a.style.borderLeftWidth?parseInt(a.style.borderLeftWidth):0,c.top+=a.offsetTop,c.top+=a.style.borderTopWidth?parseInt(a.style.borderTopWidth):0,a=a.offsetParent;return c},Client:function(a){this.handlers={},this.id=ZeroClipboard.nextId++,this.movieId="ZeroClipboardMovie_"+this.id,ZeroClipboard.register(this.id,this),a&&this.glue(a)}},ZeroClipboard.Client.prototype={id:0,title:"",ready:!1,movie:null,clipText:"",handCursorEnabled:!0,cssEffects:!0,handlers:null,zIndex:99,glue:function(a,b,c){this.domElement=ZeroClipboard.$(a),this.domElement.style.zIndex&&(this.zIndex=parseInt(this.domElement.style.zIndex,10)+1),this.domElement.getAttribute("title")!=null&&(this.title=this.domElement.getAttribute("title")),typeof b=="string"?b=ZeroClipboard.$(b):typeof b=="undefined"&&(b=document.getElementsByTagName("body")[0]);var d=ZeroClipboard.getDOMObjectPosition(this.domElement,b);this.div=document.createElement("div");var e=this.div.style;e.position="absolute",e.left=""+d.left+"px",e.top=""+d.top+"px",e.width=""+d.width+"px",e.height=""+d.height+"px",e.zIndex=this.zIndex;if(typeof c=="object")for(var f in c)e[f]=c[f];b.appendChild(this.div),this.div.innerHTML=this.getHTML(d.width,d.height)},getHTML:function(a,b){var c="",d="id="+this.id+"&width="+a+"&height="+b,e=this.title?' title="'+this.title+'"':"";if(navigator.userAgent.match(/MSIE/)){var f=location.href.match(/^https/i)?"https://":"http://";c+="<object"+e+' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="'+f+'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="'+a+'" height="'+b+'" id="'+this.movieId+'"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="'+ZeroClipboard.moviePath+'" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="'+d+'"/><param name="wmode" value="transparent"/></object>'}else c+="<embed"+e+' id="'+this.movieId+'" src="'+ZeroClipboard.moviePath+'" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="'+a+'" height="'+b+'" name="'+this.movieId+'" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="'+d+'" wmode="transparent" />';return c},hide:function(){this.div&&(this.div.style.left="-2000px")},show:function(){this.reposition()},destroy:function(){if(this.domElement&&this.div){this.hide(),this.div.innerHTML="";var a=document.getElementsByTagName("body")[0];try{a.removeChild(this.div)}catch(b){}this.domElement=null,this.div=null}},reposition:function(a){a&&(this.domElement=ZeroClipboard.$(a),this.domElement||this.hide());if(this.domElement&&this.div){var b=ZeroClipboard.getDOMObjectPosition(this.domElement),c=this.div.style;c.left=""+b.left+"px",c.top=""+b.top+"px"}},setText:function(a){this.clipText=a,this.ready&&this.movie.setText(a)},setTitle:function(a){this.title=a},addEventListener:function(a,b){a=a.toString().toLowerCase().replace(/^on/,""),this.handlers[a]||(this.handlers[a]=[]),this.handlers[a].push(b)},setHandCursor:function(a){this.handCursorEnabled=a,this.ready&&this.movie.setHandCursor(a)},setCSSEffects:function(a){this.cssEffects=!!a},receiveEvent:function(a,b){a=a.toString().toLowerCase().replace(/^on/,"");switch(a){case"load":this.movie=document.getElementById(this.movieId);if(!this.movie){var c=this;setTimeout(function(){c.receiveEvent("load",null)},1);return}if(!this.ready&&navigator.userAgent.match(/Firefox/)&&navigator.userAgent.match(/Windows/)){var c=this;setTimeout(function(){c.receiveEvent("load",null)},100),this.ready=!0;return}this.ready=!0,this.movie.setText(this.clipText),this.movie.setHandCursor(this.handCursorEnabled);break;case"mouseover":this.domElement&&this.cssEffects&&(this.domElement.addClass("hover"),this.recoverActive&&this.domElement.addClass("active"));break;case"mouseout":this.domElement&&this.cssEffects&&(this.recoverActive=!1,this.domElement.hasClass("active")&&(this.domElement.removeClass("active"),this.recoverActive=!0),this.domElement.removeClass("hover"));break;case"mousedown":this.domElement&&this.cssEffects&&this.domElement.addClass("active");break;case"mouseup":this.domElement&&this.cssEffects&&(this.domElement.removeClass("active"),this.recoverActive=!1)}if(this.handlers[a])for(var d=0,e=this.handlers[a].length;d<e;d++){var f=this.handlers[a][d];typeof f=="function"?f(this,b):typeof f=="object"&&f.length==2?f[0][f[1]](this,b):typeof f=="string"&&window[f](this,b)}}},typeof module!="undefined"&&(module.exports=ZeroClipboard);

/* Author:
  nschaden
*/
UserAgent = {};
UserAgent.searchPage = null;
UserAgent.searchResultsPage = null;
UserAgent.stylesPage = null;
UserAgent.moodsPage = null;
UserAgent.topPage = null;
UserAgent.manualHistory = ['#search'];
UserAgent.miniWidth = null;
UserAgent.changePage = function(newpage)
{
  var fadeoutelements = $('div.page,#permafooter').not(newpage);
  fadeoutelements.not(':eq(0)').fadeOut(200);
  fadeoutelements.first().fadeOut(200, function() {
    $(newpage).hide().fadeIn(200,function() 
    { 
      if (newpage != '#search_results') $('#permafooter').show(); 
      if (newpage == '#copydata')
      {
        if (!Output.clipboard)
        {
          // init zero clipboard
          ZeroClipboard.setMoviePath('http://www.nickschaden.com/echospot/swf/ZeroClipboard.swf');
          Output.clipboard = new ZeroClipboard.Client();
          Output.clipboard.glue('clip_button', 'clip_container');
          Output.clipboard.addEventListener('onComplete',function() {
            $('.copy_success').addClass('active');
            setTimeout(function() { $('.copy_success').removeClass('active');},4000);
          });
          Output.clipboard.setText(Output.contentSongLinkRows.join('\n'));
        }
        else
           Output.clipboard.setText(Output.contentSongLinkRows.join('\n'));
      }
    });
  });
  if (newpage != '#search_results' && newpage != '#copydata')
    $('#permaheader').find('.csv_container,.spot_container').removeClass('active');
  if (newpage == '#search')
  {
    $('#permaheader nav a.top').removeClass('active');          
    if ($('#search-byartist')[0].checked)
      $('#permaheader nav a.artist').addClass('active');
    else if ($('#search-byplaylist')[0].checked)
      $('#permaheader nav a.playlist').addClass('active');
    else
      $('#permaheader nav a.song').addClass('active');
  }
  else if (newpage == '#top')
  {
    $('#permaheader nav a').removeClass('active');
    $('#permaheader nav a.top').addClass('active');
  }
  if (Modernizr.history)
  {
    history.pushState({page:newpage},null,'');
    UserAgent.manualHistory.push(newpage);
  }
};
if (Modernizr.history)
{
  // initial push on page load is always the search page
  window.onpopstate = function (event) 
  {
    // see what is available in the event object
    if (UserAgent.manualHistory.length > 1)
    {
      UserAgent.manualHistory.pop();
      var nextpage = UserAgent.manualHistory.pop();
      UserAgent.changePage(nextpage);
    }
  };
}

$(function() {
  UserAgent.miniWidth = ($(window).width() <= 480);
  // for hash tags that don't fall in the proper starting area, change and reload
  var splithref = document.location.href.split('#');
  if (splithref.length > 1 && splithref[1] != 'top' && splithref[1] != 'search')
  {
    document.location.href = splithref[0] + '#search';
  }
  // init core header options
  $('#permaheader').find('nav li a').click(function()
  {
    $this = $(this);
    if ($this.hasClass('active')) return false;
    if ($this.hasClass('playlist_generate'))
    {
      $('#copydata').find('textarea').val(Output.contentSongLinkRows.join('\n'));
      UserAgent.changePage('#copydata');
    }
    else if ($this.hasClass('csv'))
    {
      var data = Output.plainTextContentRows.join('\n');
      $('#save-csv input').val(data);
      $('#save-csv').submit();
    }
    else
    {
      if ($('#help').length)
      {
        if (Modernizr.sessionstorage)
        {
          if ($this.hasClass('playlist'))
            sessionStorage.setItem('startsearchsetting','playlist');
          if ($this.hasClass('artist'))
            sessionStorage.setItem('startsearchsetting','artist');
          if ($this.hasClass('song'))
            sessionStorage.setItem('startsearchsetting','song');
        }
        document.location.href = '/echospot';
      }
      if (!$('#search:visible').length && !$this.hasClass('top'))
        UserAgent.changePage('#search');
      $('#permaheader').find('nav li a').removeClass('active');
      $this.addClass('active');
      if ($this.hasClass('artist'))
        $('#search-byartist').trigger('click');
      if ($this.hasClass('song'))
        $('#search-bysong').trigger('click');
      if ($this.hasClass('playlist'))
        $('#search-byplaylist').trigger('click');
      if ($this.hasClass('help'))
        document.location.href = '/echospot/help.html';
      if ($this.hasClass('top'))
      {
        UserAgent.changePage('#top');
      }
      else
        $('#top:visible').fadeOut(200); 
    }
    return false;
  });
  
  if ($('#help').length) return;
  // init top artists
  EchoCheck.fetchTopTerms(false,function(res)
  {
    Output.setOutputToPage($('#styles'));
    Output.addCheckboxesToPage(res.terms);
    // move results to form
    EventHandler.addsearchCheckboxFunctionality('styles');
    $('#styles .content fieldset').addClass('checkbox_container').insertAfter($('#styles_container'));
    $('#search-styles').on('click',function() { $('#styles_container').next().toggle(200); return false; });      

    EchoCheck.fetchTopTerms(true,function(res)
    {
      Output.setOutputToPage($('#moods'));
      Output.addCheckboxesToPage(res.terms);
      // move results to form
      EventHandler.addsearchCheckboxFunctionality('moods');
      $('#moods .content fieldset').addClass('checkbox_container').insertAfter($('#moods_container'));
      $('#search-moods').on('click',function() { $('#moods_container').next().toggle(200); return false; });
    });
  });

  // init search terms
  $('#search').find('#search-byartist,#search-bysong').on('click',function()
  {
    $('#search').find('.playlistonly').addClass('inactive');
    $('#search').find('.hideonplaylist').removeClass('inactive');
    if ($(this).attr('id') == 'search-bysong')
      $('#search-artist').siblings('label').text('Find artist/track');
    else
      $('#search-artist').siblings('label').text('Find artist');
    if ($(this).attr('id') == 'search-bysong')
      $('#search-hotness').siblings('label').text('Song hotness');
    else
      $('#search-hotness').siblings('label').text('Artist hotness');
    if (Modernizr.sessionstorage)
      sessionStorage.setItem('startsearchsetting',$(this).attr('id').replace('search-by',''));
  });

  $('#search').find('#search-byplaylist').on('click',function()
  {
    $('#search').find('.playlistonly').removeClass('inactive');
    $('#search').find('.hideonplaylist').addClass('inactive');
    $('#search-artist').siblings('label').text('Artist(s)/Spotify URI(s)');
    $('#search-hotness').siblings('label').text('Artist hotness');
    if (Modernizr.sessionstorage)
      sessionStorage.setItem('startsearchsetting','playlist');
  });

  $('#search').find('input.reset').on('click',function()
  {
    $('#search-artist,#search-terms').removeClass('error').siblings('.errorlabel').remove();
    $('#search-artist').val('');
    Output.clearCheckboxesPage('styles');
    Output.clearCheckboxesPage('moods');
    $('#search-startyear')[0].selectedIndex = 0;
    $('#search-endyear')[0].selectedIndex = 0;
    $('#search-terms').val('');
    $('#search-playlisttype')[0].selectedIndex = 0;
    $('#search-hotness')[0].selectedIndex = 0;
    $('#search-songhotness')[0].selectedIndex = 0;
    $('#search-familiarity')[0].selectedIndex = 0;
    $('#search-sortby')[0].selectedIndex = 0;
    $('#search-sortbyplaylist')[0].selectedIndex = 0;
    $('#search-variety')[0].selectedIndex = 2;
    $('#search-distribution')[0].selectedIndex = 0;
    $('#search-mintempo').val('');
    $('#search-maxtempo').val('');
    $('#search-energy')[0].selectedIndex = 0;
    $('#search-danceability')[0].selectedIndex = 0;
    $('#search-results')[0].selectedIndex = 1;
  });
  
  $('#search').find('input.submit').on('click',function()
  {
    var searchpage = $('#search');
    var mode = 'artist';
    mode = $.trim($('#permaheader .active').attr('class').replace('active',''));

    var options = {};
    if (mode == 'song')
    {
      options.combined = jQuery.trim($('#search-artist').val());
    }
    else
    {
      options.artist = jQuery.trim($('#search-artist').val());
    }
    // simple error checking
    $('#search-artist,#search-terms').removeClass('error').siblings('.errorlabel').remove();
    if (mode != 'artist')
    {
      var checkitem = '';
      if (mode != 'playlist' || $('#search-playlisttype').val() != 'artistdescription')
        checkitem = '#search-artist';
      else
        checkitem = '#search-terms';
      if (!$.trim($(checkitem).val()).length)
      {
        $(checkitem).addClass('error').focus().after('<p class="errorlabel">Required field</p>');
        return;
      }
    }
    else
    {
      if (!$.trim($('#search-artist').val()).length && !$.trim($('#search-terms').val()).length)
      {
        $('#search-artist,#search-terms').addClass('error').focus().after('<p class="errorlabel">Required field - artist or term</p>');
        return;
      } 
    }
    Output.setOutputToPage($('#search_results'));
    $('#permaheader nav a').removeClass('active');
    $('#search_results').addClass('loading');
    var existingresults;
    existingresults = Output.content.children();
    if (existingresults.length)
    {
      existingresults.remove();
    }
    else
      EventHandler.addArtistMenusFunctionality(Output.content);
    UserAgent.changePage('#search_results');
    
    options.styles = $('#search-styles').text().replace('-','');
    options.moods = $('#search-moods').text().replace('-','');
    options.startyear = $('#search-startyear').val();
    if (options.startyear == 'Start Year')
      options.startyear = null;
    else
      options.startyear = parseInt(options.startyear,10)-1;
    options.endyear = $('#search-endyear').val();
    if (options.endyear == 'End Year')
      options.endyear = null;
    else
      options.endyear = parseInt(options.endyear,10)+1;
    options.description = jQuery.trim($('#search-terms').val());
    var hotness = $('#search-hotness').val();
    options.hotnessmin = 0;
    options.hotnessmax = 1;
    if (hotness == 'high')
    {
      options.hotnessmin = 0.7;
    }
    if (hotness == 'highaverage')
    {
      options.hotnessmin = 0.3;
      options.hotnessmax = 1;
    }
    if (hotness == 'average')
    {
      options.hotnessmin = 0.3;
      options.hotnessmax = 0.7;
    }
    if (hotness == 'lowaverage')
    {
      options.hotnessmin = 0;
      options.hotnessmax = 0.7;
    }
    if (hotness == 'low')
    {
      options.hotnessmax = 0.3;
    }
    var familiarity = $('#search-familiarity').val();
    options.familiaritymin = 0;
    options.familiaritymax = 1;
    if (familiarity == 'wellknown')
    {
      options.familiaritymin = 0.7;
    }
    if (familiarity == 'wellknownaverage')
    {
      options.familiaritymin = 0.3;
      options.familiaritymax = 1;
    }
    if (familiarity == 'average')
    {
      options.familiaritymin = 0.3;
      options.familiaritymax = 0.7;
    }
    if (familiarity == 'obscureaverage')
    {
      options.familiaritymin = 0;
      options.familiaritymax = 0.7;
    }
    if (familiarity == 'obscure')
    {
      options.familiaritymax = 0.3;
    }
    options.results = $('#search-results').val();
    options.sortby = $('#search-sortby').val();
    if (mode == 'song')
    {
      if (options.sortby == 'hotness')
        options.sortby = 'song_hotttnesss-desc';
      else
        options.sortby = 'artist_familiarity-desc';
    }
    else if (mode == 'artist')
    {
      if (options.sortby == 'hotness')
        options.sortby = 'hotttnesss-desc';
      else
        options.sortby = 'familiarity-desc';  
    }
    else
      delete options.sortby;
    if (mode == 'playlist')
    {
      options.playlisttype = $('#search-playlisttype').val();
      var variety = $('#search-variety').val();
      options.variety = 0.3;
      if (variety == 'very high')
      {
        options.variety = 1;
      }
      if (variety == 'high')
      {
        options.variety = 0.6;
      }
      if (variety == 'average')
      {
        options.variety = 0.3;
      }
      if (variety == 'low')
      {
        options.variety = 0.1;
      }
      options.distribution = $('#search-distribution').val();
      options.mintempo = $('#search-mintempo').val();
      options.maxtempo = $('#search-maxtempo').val();
      var songhotness = $('#search-songhotness').val();
      options.songhotnessmin = 0;
      options.songhotnessmax = 1;
      if (songhotness == 'high')
      {
        options.songhotnessmin = 0.7;
      }
      if (songhotness == 'highaverage')
      {
        options.songhotnessmin = 0.3;
        options.songhotnessmax = 1;
      }
      if (songhotness == 'average')
      {
        options.songhotnessmin = 0.3;
        options.songhotnessmax = 0.7;
      }
      if (songhotness == 'lowaverage')
      {
        options.songhotnessmin = 0;
        options.songhotnessmax = 0.7;
      }
      if (songhotness == 'low')
      {
        options.songhotnessmax = 0.3;
      }
      var energy = $('#search-energy').val();
      options.energymin = 0;
      options.energymax = 1;
      if (energy == 'high')
      {
        options.energymin = 0.7;
      }
      if (energy == 'highaverage')
      {
        options.energymin = 0.3;
        options.energymax = 1;
      }
      if (energy == 'average')
      {
        options.energymin = 0.3;
        options.energymax = 0.7;
      }
      if (energy == 'lowaverage')
      {
        options.energymin = 0;
        options.energymax = 0.7;
      }
      if (energy == 'low')
      {
        options.energymax = 0.3;
      }
      var danceability = $('#search-danceability').val();
      options.danceabilitymin = 0;
      options.danceabilitymax = 1;
      if (danceability == 'high')
      {
        options.danceabilitymin = 0.7;
      }
      if (danceability == 'highaverage')
      {
        options.danceabilitymin = 0.3;
        options.danceabilitymax = 1;
      }
      if (danceability == 'average')
      {
        options.danceabilitymin = 0.3;
        options.danceabilitymax = 0.7;
      }
      if (danceability == 'lowaverage')
      {
        options.danceabilitymin = 0;
        options.danceabilitymax = 0.7;
      }
      if (danceability == 'low')
      {
        options.danceabilitymax = 0.3;
      }
      options.sortbyplaylist = $('#search-sortbyplaylist').val();
    }
    EventHandler.addArtistMenusFunctionality(Output.content);
    EchoCheck.powerSearch(mode,options,function(res)
    {
      $('#search_results').removeClass('loading');
      $('#permaheader').find('.csv_container,.spot_container').addClass('active');
      if (mode == 'artist')
      {
        Output.addArtistsToPage(res.artists,$('#search-sortby').val());
        if (!res.artists.length)
        {
          Output.saveArtistRow('No artists found');
          Output.addContentRows();
        } 
      }
      else if (mode == 'song' || mode == 'playlist')
      {
        
        if (!res.songs.length)
        {
          Output.saveSongRow('No songs found');
          Output.addContentRows();
        }
        else
        {
          if (mode == 'song')
            Output.addSongsToPage(res.songs,$('#search-sortby').val());
          else
            Output.addSongsToPage(res.songs,$('#search-sortbyplaylist').val(),options);
        }
      }
      Output.content.trigger('create');
      $('#permafooter').show();
    });
  });

  $('#search-artist').on('keypress',function(e)
  {
    if (e.keyCode == 13 && !e.ctrlKey && !e.shiftKey && !e.altKey)
      $('#search').find('input.submit').trigger('click');
  });

  // auto select mode based on initial href
  if (Modernizr.sessionstorage && !$('#help').length)
  {
    var startsetting = sessionStorage.getItem('startsearchsetting');
    if (startsetting == 'song')
    {
      $('#search-byartist').prop('checked',false);
      $('#search-bysong').trigger('click').prop('checked',true);
      $('#permaheader').find('nav li a').removeClass('active');
      $('#permaheader a.song').addClass('active');
    }
    if (startsetting == 'playlist')
    {
      $('#search-byartist').prop('checked',false);
      $('#search-byplaylist').trigger('click').prop('checked',true);
      $('#permaheader').find('nav li a').removeClass('active');
      $('#permaheader a.playlist').addClass('active');
    }
    if (startsetting == 'artist')
    {
      $('#search-byartist').trigger('click').prop('checked',true);
      $('#permaheader').find('nav li a').removeClass('active');
      $('#permaheader a.artist').addClass('active');
    }
  }
  

  // add styles functionality
  EventHandler.addsearchCheckboxFunctionality('styles');
  
  // add moods functionality
  EventHandler.addsearchCheckboxFunctionality('moods');

  Output.setOutputToPage($('#top'));
  // have extra JQuery based animation for collapsible menus, add on demand terms and related items
  EventHandler.addArtistMenusFunctionality(Output.content);

  // fetch artists from echonest
  EchoCheck.fetchTopHotArtists(40,function(res)
  {
    Output.setOutputToPage($('#top'));
    Output.addArtistsToPage(res.artists);
    Output.content.trigger('create');
  });
});

EchoCheck = {
  api: 'PWNYOEPUNHQTGZLHY',
  base: 'http://developer.echonest.com/api/v4/',
  callJSON: function(url,inputdata,callback)
  {
    $.ajax({
      url: url,
      dataType: 'json',
      data: inputdata,
      success: function(data)
      {
        if (EchoCheck.checkResponse(data))
        {
          if (typeof callback == 'function')
            callback(data.response);
        }
      },
      error: function(res,status)
      {
        if (Output.currentId == 'search_results')
        {
          $('#search_results').removeClass('loading');
          Output.saveArtistRow('Unexpected error from server.');
          Output.addContentRows();
        }
        else
        {
          Output.setOutputToPage($('#search_results'));
          $('#search_results').removeClass('loading');
          Output.saveArtistRow('Unexpected error from server.');
          Output.addContentRows();
          UserAgent.changePage('#search_results');
        }       
      },
      timeout: 4000
    });
  },
  checkResponse: function(data)
  {
    if (data.response) 
    {
      if (data.response.status.code !== 0) 
      {
        if (Output.currentId == 'search_results')
        {
          $('#search_results').removeClass('loading');
          Output.saveArtistRow('Unexpected error from server. ' + data.response.status.message);
          Output.addContentRows();
        }
        else
        {
          Output.setOutputToPage($('#search_results'));
          $('#search_results').removeClass('loading');
          Output.saveArtistRow('Unexpected error from server. ' + data.response.status.message);
          Output.addContentRows();
          UserAgent.changePage('#search_results');
        }
      } 
      else 
      {
        return true;
      }
    } 
    else 
    {
      if (Output.currentId == 'search_results')
      {
        Output.saveArtistRow('Unexpected error from server.');
        Output.addContentRows();
      }
      else
      {
        Output.setOutputToPage($('#search_results'));
        Output.saveArtistRow('Unexpected error from server. ' + data.response.status.message);
        Output.addContentRows();
        UserAgent.changePage('#search_results');
      }
    }
    return false; 
  },
  findRelatedArtists: function(artistnameorid,namemode,callback)
  {
    if (typeof artistnameorid != 'string') return;
    var url = this.base + 'artist/similar?callback=?&bucket=id:spotify-WW&bucket=hotttnesss&bucket=familiarity&bucket=terms';
    var inputdata = {'format':'jsonp','api_key':this.api,'limit':true,'start':0,'results':30};
    if (namemode)
      inputdata.name = artistnameorid;
    else
      inputdata.id = artistnameorid;
    this.callJSON(url,inputdata,callback);
  },
  fetchTopTerms: function(findmood,callback)
  {
    if (typeof findmood != 'boolean' && typeof findmood != 'undefined') return;
    var url = this.base + 'artist/list_terms?callback=?';
    var searchtype = (findmood) ? 'mood' : 'style';
    this.callJSON(url,{'format':'jsonp','api_key':this.api,'type':searchtype},callback);
  },
  fetchTopHotArtists: function(results,callback)
  {
    if (typeof results != 'number') return;
    var url = this.base + 'artist/top_hottt?callback=?&bucket=id:spotify-WW&bucket=hotttnesss&bucket=familiarity&bucket=terms';
    this.callJSON(url,{'format':'jsonp','api_key':this.api,'limit':true,'results': results},callback);
  },
  powerSearch: function(mode,options,callback)
  {
    if (typeof mode != 'string' || typeof options != 'object') return;
    var url = this.base + 'artist/search?callback=?&bucket=id:spotify-WW&bucket=hotttnesss&bucket=familiarity&bucket=terms';
    if (mode == 'song')
      url = this.base + 'song/search?callback=?&bucket=id:spotify-WW&bucket=tracks&bucket=song_hotttnesss&bucket=artist_hotttnesss&bucket=audio_summary&bucket=artist_familiarity';
    else if (mode == 'playlist')
    {
      url = this.base + 'playlist/static?callback=?&bucket=id:spotify-WW&bucket=tracks&bucket=song_hotttnesss&bucket=artist_hotttnesss&bucket=audio_summary&bucket=artist_familiarity';
      if (options.description && options.playlisttype && options.playlisttype == 'artistdescription')
      {
        var items = options.description.split(',');
        for (var i = 0; i < items.length; i++)
        {
          url += '&description=' + jQuery.trim(items[i]);
        }
      }
      else if (options.artist && options.playlisttype && (options.playlisttype == 'artistradio' || options.playlisttype == 'artist' || options.playlisttype == 'songradio'))
      {
        var items2 = options.artist.split(',');
        for (var j = 0; j < items2.length; j++)
        {
          // check if item is direct spotify reference, if so add to artist_id or track_id
          if (items2[j].indexOf('spotify:artist') > -1)
            url += '&artist_id=spotify-WW:' + jQuery.trim(items2[j].replace('spotify:',''));
          else 
          {
            if (items2[j].indexOf('spotify:track') > -1)
              url += '&track_id=spotify-WW:' + jQuery.trim(items2[j].replace('spotify:',''));
            else
              url += '&artist=' + jQuery.trim(items2[j]);
          }
        }
      }
    }
    var inputdata = {'format':'jsonp','api_key':this.api,'sort':'hotttnesss-desc','limit':true,results:50,min_hotttnesss:0.1};
    if (options.artist && mode == 'artist')
    {
      delete inputdata.min_hotttnesss;
      inputdata.name = options.artist;
    }
    else {
      if (mode == 'song' && options.combined)
        inputdata.combined = options.combined;
      if (options.styles)
        inputdata.style = options.styles;
      if (options.moods)
        inputdata.mood = options.moods;
      if (options.description && mode != 'playlist')
        inputdata.description = options.description;
      if (mode == 'song')
      {
        delete inputdata.min_hotttnesss;
        if (options.hotnessmin || options.hotnessmin === 0)
          inputdata.song_min_hotttnesss = options.hotnessmin;
        if (options.hotnessmax)
          inputdata.song_max_hotttnesss = options.hotnessmax;
      }
      else if (mode == 'playlist')
      {
        delete inputdata.min_hotttnesss;
        if (options.hotnessmin || options.hotnessmin === 0)
          inputdata.artist_min_hotttnesss = options.hotnessmin;
        if (options.hotnessmax)
          inputdata.artist_max_hotttnesss = options.hotnessmax;
      }
      else
      {
        if (options.hotnessmin || options.hotnessmin === 0)
          inputdata.min_hotttnesss = options.hotnessmin;
        if (options.hotnessmax)
          inputdata.max_hotttnesss = options.hotnessmax;    
      }
      if (mode == 'song' || mode == 'playlist')
      {
        if (options.familiaritymin || options.familiaritymin === 0)
          inputdata.artist_min_familiarity = options.familiaritymin;
        if (options.familiaritymax)
          inputdata.artist_max_familiarity = options.familiaritymax;          
      }
      else
      {
        if (options.familiaritymin || options.familiaritymin === 0)
          inputdata.min_familiarity = options.familiaritymin;
        if (options.familiaritymax)
          inputdata.max_familiarity = options.familiaritymax;       
      }
      if (options.startyear)
        inputdata.artist_end_year_after = options.startyear;
      if (options.endyear)
        inputdata.artist_start_year_before = options.endyear;
      if (mode == 'song')
      {
        inputdata.sort = 'song_hotttnesss-desc';          
      }
      if (options.sortby)
        inputdata.sort = options.sortby;
      if (options.results)
        inputdata.results = options.results;
      if (mode == 'playlist')
      {
        delete inputdata.sort;
        if (options.playlisttype && options.playlisttype == 'artistdescription')
        {
          delete inputdata.artist;
          inputdata.type = 'artist-description';
        }
        else
        {
          delete inputdata.description;
          if (options.playlisttype == 'songradio')
            inputdata.type = 'song-radio';
          else
          {
            if (options.playlisttype == 'artist')
              inputdata.type = 'artist';
            else
              inputdata.type = 'artist-radio';
          }
        }
        if (options.variety)
          inputdata.variety = options.variety;
        if (options.mintempo)
          inputdata.min_tempo = options.mintempo;
        if (options.maxtempo)
          inputdata.max_tempo = options.maxtempo;
        if (options.distribution)
          inputdata.distribution = options.distribution;
        if (options.songhotnessmin || options.songhotnessmin === 0)
          inputdata.song_min_hotttnesss = options.songhotnessmin;
        if (options.songhotnessmax)
          inputdata.song_max_hotttnesss = options.songhotnessmax;
        if (options.energymin || options.energymin === 0)
          inputdata.min_energy = options.energymin;
        if (options.energymax)
          inputdata.max_energy = options.energymax;
        if (options.danceabilitymin || options.danceabilitymin === 0)
          inputdata.min_danceability = options.danceabilitymin;
        if (options.danceabilitymax)
          inputdata.max_danceability = options.danceabilitymax;
        if (options.sortbyplaylist && options.sortbyplaylist != "random")
          inputdata.sort = options.sortbyplaylist;
      }
    }
    this.callJSON(url,inputdata,callback);
  }   
};

Output = {
  artistDetail: {},
  clipboard: null,
  colorSpectrumLength: 10,
  colorSpectrumIndex: 0,
  content: null,
  contentId: '',
  contentRows: [],
  contentSongLinkRows: [],
  footerContent: '<div class="footer"><div><ul>' +
          '<li><a class="search" href="#search">Search</a></li>' +
          '<li><a class="top" href="#top">Top</a></li>' +
          '</ul></div></div>',   
  plainTextContentRows: [],
  songDetail: {},
  addRow: function(text)
  {
    this.content.append('<div><h3>' + text + '</h3></div>').trigger('create');
    this.colorSpectrumLengthIndex++;
  },
  // takes currently cached rows of content (artists or songs), dumps all into content area at once
  addContentRows: function(content)
  {
    if (!content)
      this.content.append(this.contentRows.join('')).trigger('create');
    else
      content.append(this.contentRows.join('')).trigger('create');
    this.contentRows = [];
  },
  addArtistsToPage: function(artists,sortmethod)
  {
    for (var i = 0; i < artists.length; i++)
    {
      var currartist = artists[i];
      var existingdetail = Output.artistDetail[currartist.name];
      if (typeof existingdetail == 'undefined')
      {
        Output.artistDetail[currartist.name] = {echoid:currartist.id,spotlink:null,terms:null};
        existingdetail = Output.artistDetail[currartist.name];
      }
      else
        existingdetail.echoid = currartist.id;
      existingdetail[this.contentId + '_order'] = i;
      var currterms = [];
      for (var j = 0; j < currartist.terms.length; j++)
        currterms.push(currartist.terms[j].name);
      existingdetail.terms = currterms;
      var spotlink = '#';
      if (typeof currartist.foreign_ids == 'object' && typeof currartist.foreign_ids[0] == 'object')
        spotlink = 'spotify://' + currartist.foreign_ids[0].foreign_id.replace('spotify-WW:','');
      Output.saveArtistRow(currartist.name,currartist.hotttnesss,currartist.familiarity,currterms,spotlink);
    }
    if (typeof sortmethod == 'string')
      Output.sortOutput(sortmethod,false);
    Output.addContentRows();
  },
  addCheckboxesToPage: function(checkboxitems)
  {
    var fieldcontainer = Output.content.find('fieldset');
    if (!fieldcontainer.length) return;
    var optionstext = '';
    for (var i = 0; i < checkboxitems.length; i++)
    {
      var name = checkboxitems[i].name.replace(/(\s)+/,'_');
      optionstext += '<input type="checkbox" name="style-' + name + '" id="style-' + name + '" class="custom" />';
      optionstext += '<label for="style-' + name + '">' + checkboxitems[i].name + '</label>';
    }
    fieldcontainer.append(optionstext); 
    Output.content.trigger('create');
  },
  addNewPage: function(id,headertext,newclass)
  {
    if (typeof id != 'string' || typeof headertext != 'string') return;
    id = id.replace(/\s+/g,'_');
    var emptypagetext = '<div class="page" id="' + id + '" class="' + newclass + '"><div class="header"><h2>' + headertext + 
              '</h2></div><div class="content"></div>';
    $('#permafooter').before(emptypagetext);
  },
  addSongsToPage: function(songs,sortmethod,limits)
  {
    for (var i = 0; i < songs.length; i++)
    {
      var currsong = songs[i];
      var existingdetail = Output.songDetail[currsong.title];
      if (typeof existingdetail == 'undefined')
      {
        Output.songDetail[currsong.title] = {echoartistid:currsong.artist_id,echosongid:currsong.id,spotlink:null};
        existingdetail = Output.songDetail[currsong.title];
      }
      else
      {
        existingdetail.id = currsong.id;
        existingdetail.artist_id = currsong.artist_id;
      }
      existingdetail[this.contentId + '_order'] = i;
      var spotlink = '#';
      if (typeof currsong.tracks == 'object' && typeof currsong.tracks[0] == 'object')
        spotlink = 'spotify://' + currsong.tracks[0].foreign_id.replace('spotify-WW:','');
      if (typeof limits != 'object' || Output.filterOutput(currsong,limits))
        Output.saveSongRow(currsong.title,currsong.artist_name,currsong.song_hotttnesss,currsong.artist_hotttnesss,currsong.artist_familiarity,currsong.audio_summary.danceability,currsong.audio_summary.energy,currsong.audio_summary.tempo,spotlink);
    }
    if (typeof sortmethod == 'string' && sortmethod != 'random')
      Output.sortOutput(sortmethod,true);
    Output.addContentRows();
    if (UserAgent.miniWidth)
    {
      $('#search_results').click(function(e) {
        e.preventDefault();
        if (e.target.tagName == 'H3')
        {
          var spotifylink = $(e.target).siblings('ul').find('a');         
          if (spotifylink.length)
            document.location.href = spotifylink.attr('href');
        }
      });
    }  
  },
  // note artist position is zero indexed
  addSpotifyLinkToArtistRow: function(link,artistpos)
  {
    var artistrow = this.content.children().eq(artistpos);
    if (!artistrow.length) return;
    var list;
    list = artistrow.find('ul');
    list.prepend('<li><a href="' + link + '>Spotify Link</a></li>').trigger('create');
  },
  addSpotifyLinkToSongRow: function(link,songpos)
  {
    var songrow = this.content.children().eq(songpos);
    if (!songrow.length) return;
    var list;
    list = songrow.find('ul');
    list.prepend('<li><a href="' + link + '>Spotify Link</a></li>').trigger('create');
  },
  clearCheckboxesPage: function(pageid)
  {
    var checkeditems2 = $('#search').find('input').filter(':checked');
    checkeditems2.prop('checked',false);
    $('#search-' + pageid).text('-');
  },
  saveArtistRow: function(name,hotness,familiarity,terms,spotifylink)
  {
    var artistrowtext;
    // header
    artistrowtext = '<div class="artistrow"><h3>' + name + '</h3>';
    this.colorSpectrumIndex++;
    // row details
    if (typeof hotness == 'undefined')
    {
      artistrowtext += '</div>';
    }
    else
    {
      artistrowtext += '<ul>';
      if (UserAgent.miniWidth)
        artistrowtext += '<li><a href="' + spotifylink + '">Spotify Link</a></li><li>H: ' + Math.round(hotness*100) + '%</li><li>F: ' + Math.round(familiarity*100) + '%</li>';
      else
        artistrowtext += '<li><a href="' + spotifylink + '">Spotify Link</a></li><li>Hotness: ' + Math.round(hotness*100) + '%</li><li>Familiarity: ' + Math.round(familiarity*100) + '%</li>';
      this.artistDetail[name].terms = terms;
      artistrowtext += '</ul></div>';
    }
    this.contentRows.push(artistrowtext);
    this.plainTextContentRows.push('"' + name + '"');
  },
  saveSongRow: function(title,artistname,songhotness,artisthotness,artistfamiliarity,danceability,energy,tempo,spotifylink)
  {
    var songrowtext;
    // header
    var currcolor = Math.floor(this.colorSpectrumIndex / this.colorSpectrumLength) % 2 ? (this.colorSpectrumIndex % this.colorSpectrumLength) : this.colorSpectrumLength - (this.colorSpectrumIndex % this.colorSpectrumLength);
    if (typeof artistname == 'undefined')
      songrowtext = '<div class="songrow"><h3>' + title + '</h3>';
    else
      songrowtext = '<div class="songrow"><h3>' + title + ' - ' + artistname + '</h3>';
    this.colorSpectrumIndex++;
    // row details
    if (typeof artistname == 'undefined')
    {
      songrowtext += '</div>';
    }
    else
    {
      songrowtext += '<ul>';
      songrowtext += '<li><a href="' + spotifylink + '">Spotify Link</a></li>';
      songrowtext += '<li>SH: ' + Math.round(songhotness*100) + '%</li><li>AH: ' + Math.round(artisthotness*100) + '%</li>';
      songrowtext += '<li>AF: ' + Math.round(artistfamiliarity*100) + '%</li><li>D: ' + Math.round(danceability*100) + '%</li>';
      if (!UserAgent.miniWidth)
        songrowtext += '<li>E: ' + Math.round(energy*100) + '%</li><li class="last">T: ' + tempo + '</li>';
      songrowtext += '</ul></div>';
    }
    this.contentRows.push(songrowtext);
    this.plainTextContentRows.push('"' + title + '","' + artistname + '"');
    this.contentSongLinkRows.push(spotifylink);
  },
  // changes all focus of the output factory to this new page object element
  setOutputToPage: function(page)
  {
    if (typeof page != 'object') return;
    var newcontent = $(page).find('.content');
    if (!newcontent.length) return;
    this.contentId = page.attr('id');
    this.contentRows = [];
    this.contentSongLinkRows = [];
    if (page.attr('id') == 'search_results')
    {
      if (Modernizr.sessionstorage && sessionStorage.getItem('startsearchsetting') == 'artist')
        this.plainTextContentRows = ['"Artist"'];
      else if (Modernizr.sessionstorage && sessionStorage.getItem('startsearchsetting') == 'song')
        this.plainTextContentRows = ['"Song"'];
      else
        this.plainTextContentRows = ['"Song","Artist"'];
    }
    else
      this.plainTextContentRows = ['"Artist"'];
    this.content = newcontent;
    this.colorSpectrumIndex = 0;
  },
  filterOutput: function(item,limits)
  {
    return ((item.artist_familiarity >= limits.familiaritymin) &&
            (item.artist_familiarity <= limits.familiaritymax) &&
            (item.artist_hotttnesss >= limits.hotnessmin) &&
            (item.artist_hotttnesss <= limits.hotnessmax) &&
            (item.audio_summary.danceability >= limits.danceabilitymin) &&
            (item.audio_summary.danceability <= limits.danceabilitymax) &&
            (item.audio_summary.energy >= limits.energymin) &&
            (item.audio_summary.energy <= limits.energymax) &&
            (limits.mintempo.length === 0 || item.audio_summary.tempo >= limits.mintempo) &&
            (limits.maxtempo.length === 0 || item.audio_summary.tempo <= limits.maxtempo) &&
            (item.song_hotttnesss >= limits.songhotnessmin) &&
            (item.song_hotttnesss <= limits.songhotnessmax));
  },
  sortOutput: function(sortvalue,songmode)
  {
    var sortdesc = true;
    if (songmode)
    {
      if (sortvalue.indexOf('asc') > -1)
        sortdesc = false;
      if (sortvalue.indexOf('song_hotttnesss') > -1 || sortvalue.indexOf('hotness') > -1)
        sortvalue = 'SH';
      if (sortvalue.indexOf('artist_hotttnesss') > -1)
        sortvalue = 'AH';
      if (sortvalue.indexOf('artist_familiarity') > -1 || sortvalue.indexOf('familiarity') > -1)
        sortvalue = 'AF';
      if (sortvalue.indexOf('tempo') > -1)
        sortvalue = 'T';
      if (sortvalue.indexOf('danceability') > -1)
        sortvalue = 'D';
      if (sortvalue.indexOf('energy') > -1)
        sortvalue = 'E';
    }
    var patt = new RegExp('>' + sortvalue + ': (\\d)+','i');
    Output.contentRows.sort(function(a,b)
    {
      var matcha = a.match(patt);
      var matchb = b.match(patt);
      if (!matcha || !matchb) return 1;
      var compa = parseFloat(matcha[0].match(/\d+/)[0],10);
      var compb = parseFloat(matchb[0].match(/\d+/)[0],10);
      return sortdesc ? compb - compa : compa - compb;
    });
    // recut plain text
    songmode = (Output.contentRows[0].match(/<h3>(.*)<\/h3>/)[1].indexOf('-') > -1);
    if (songmode)   
      Output.plainTextContentRows = ['Artist,Song'];
    else
      Output.plainTextContentRows = ['Artist'];
    Output.contentSongLinkRows = [];
    for (i = 0; i < Output.contentRows.length; i++)
    {
      var name = Output.contentRows[i].match(/<h3>(.*)<\/h3>/)[1];
      if (songmode)
      {
        var link = Output.contentRows[i].match(/<a href="(.*)">Spotify/)[1];
        var track = $.trim(name.match(/-(.*)/)[1]);
        var artist = $.trim(name.match(/-(.*)/)[1]);
        Output.plainTextContentRows.push('"' + track + '","' + artist + '"');
        Output.contentSongLinkRows.push(link);
      }
      else
      {
        Output.plainTextContentRows.push('"' + name + '"');
      }
    }
  }
};

EventHandler = {
  addArtistMenusFunctionality: function(content)
  {
    var targetevent = 'click';
    var target = '.ui-collapsible-heading a';
    targetevent = 'mouseover';
    target = 'div.artistrow,div.songrow';
    content.on(targetevent,target,function() 
    { 
      $this = $(this);
      if (!$this.find('a.terms_link:visible').length)
      {
        var content;
        content = $this;
        
        // dynamically insert terms, related items if it's not there
        if (!content.find('a.terms_link').length)
        {
          var lookupname;
          lookupname = jQuery.trim($this.find('h3').html().replace(/<span(.*)<\/span>/,''));
          var detail = Output.artistDetail[lookupname];
          if (typeof detail == 'object')
          {
            var listview;
            listview = content.find('ul');
            var listviewcontents = listview.html();
            var newlisttext = '<ul>' + listviewcontents + '<li><a class="terms_link" href="#">Terms</a></li>';
            newlisttext += '<li class="last"><a class="related_link" href="#">Related artists</a></li></ul>';
            listview.replaceWith(newlisttext);
            content.trigger('create');  
          }
          // clicking on the terms event handler 
          content.on('click','a.terms_link',function()
          {
            // check if page exists
            $('#permaheader').find('nav a.top').removeClass('active');
            var termspageid = lookupname.replace(/\s+/g,'') + '_terms';
            if (!$('#' + termspageid).length)
            {
              Output.addNewPage(termspageid,lookupname + ' terms','terms');
              Output.setOutputToPage($('#' + termspageid));
              var termstext = '<ul>';
              for (var i = 0; i < detail.terms.length; i++)
              {
                termstext += '<li class="termsrow"><a href="#search">' + detail.terms[i] + '</a></li>';
              }
              termstext += '</ul>';
              Output.content.append(termstext).trigger('create');
              UserAgent.changePage('#' + termspageid);
              $('#' + termspageid).on('click','a',function()
              {
                $('#search-terms').val(jQuery.trim($(this).text()));
                UserAgent.changePage('#search');
                $('#permaheader nav a.artist').trigger('click');
                return false;
              });
            }
            else
              UserAgent.changePage('#' + termspageid);
            return false;
          });
          // clicking on related link event handler
          content.on('click','a.related_link',function()
          {
            // check if page exists
            $('#permaheader').find('nav a.top').removeClass('active');
            var relatedartistpageid = lookupname.replace(/\s+/g,'') + '_related';
            if (!$('#' + relatedartistpageid).length)
            {
              Output.addNewPage(relatedartistpageid,lookupname + ' related artists','related');
              Output.setOutputToPage($('#' + relatedartistpageid));
              EventHandler.addArtistMenusFunctionality(Output.content);
              UserAgent.changePage('#' + relatedartistpageid);
              $('#' + relatedartistpageid).addClass('loading');
              $('#permafooter').css('visibility','hidden');
              EchoCheck.findRelatedArtists(detail.echoid,false,function(res)
              {
                Output.addArtistsToPage(res.artists);
                $('#permafooter').css('visibility','visible');
                $('#' + relatedartistpageid).removeClass('loading');
              });
              return false;
            }
            else
              UserAgent.changePage('#' + relatedartistpageid);             
          });
        }
        $this.find('a.terms_link,a.related_link').parent().show();
      }
    });
  },
  addsearchCheckboxFunctionality: function(pageid)
  {
    var fieldcontainer = $('#' + pageid).find('fieldset');
    if (!fieldcontainer.length) return;
    var target;
    target = 'label';
    fieldcontainer.find(target).click(function()
    {
      var checkedfield;
      checkedfield = $(this).prev().attr('name').replace('style-','').replace('_',' ');
      var textcontainer;
      textcontainer = $('#search-' + pageid);
      var text = jQuery.trim(textcontainer.text());
      if (this.checked || (!$(this).prev()[0].checked))
      {
        if (text == '-')
        {
          text = checkedfield;
        }
        else
          text += ', ' + checkedfield;
      }
      else
      {
        text = text.replace(', ' + checkedfield,'').replace(checkedfield + ',','').replace(checkedfield,'');
        if (text === '')
        {
          text = '-';
        }
      }
      textcontainer.text(text);
    });
  }
};





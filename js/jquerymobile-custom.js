/* Author:
	nschaden
*/

// quick check to determine, based on past media query, if we're on desktop or mobile version
UserAgent = {};
if (document.documentElement.clientWidth > 480)
{
    UserAgent.desktop = true;
    UserAgent.init = 'ready';
    UserAgent.pageinit = 'ready';
    UserAgent.searchPage = null;
    UserAgent.searchResultsPage = null;
    UserAgent.stylesPage = null;
    UserAgent.moodsPage = null;
    UserAgent.topPage = null;
    UserAgent.manualHistory = ['#search'];
    $.mobile = {};
    $.mobile.changePage = function(newpage)
    {
    	$('div.page,#permafooter').not(newpage).fadeOut(400,function()
    	{
    		$(newpage).hide().fadeIn(400,function() { if (newpage != '#search_results') $('#permafooter').show(); });
    	});
    	if (newpage != '#search_results')
    		$('#permaheader nav li.csv_container').hide();
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
    	// history.pushState({page:'#search'})
    	window.onpopstate = function (event) 
    	{
			// see what is available in the event object
			if (UserAgent.manualHistory.length > 1)
			{
				UserAgent.manualHistory.pop();
				var nextpage = UserAgent.manualHistory.pop();
				$.mobile.changePage(nextpage);
			}
		};
    }
}
else
{
	UserAgent.mobile = true;
	UserAgent.init = 'mobileinit';
	UserAgent.pageinit = 'pageinit';
	UserAgent.searchPage = '#search';
    UserAgent.searchResultsPage = '#search_results';
    UserAgent.stylesPage = '#styles';
    UserAgent.moodsPage = '#moods';
    UserAgent.topPage = '#top';
}

$(document).bind(UserAgent.init, function(){
	// for hash tags that don't fall in the proper starting area, change and reload
	var splithref = document.location.href.split('#');
	if (splithref.length > 1 && splithref[1] != 'top' && splithref[1] != 'search')
	{
		document.location.href = splithref[0] + '#search';
	}
	if (UserAgent.mobile)
	{
		$.mobile.page.prototype.options.addBackBtn = true;
		$.mobile.touchOverflowEnabled = true;
		$.support.touchOverflow = true;
	}
	else
	{
		// init core header options
		$('#permaheader').find('nav li a').click(function()
		{
			$this = $(this);
			if ($this.hasClass('active')) return false;
			if ($this.hasClass('csv'))
			{
				var data = Output.plainTextContentRows.join('\n');
				$('#save-csv input').val(data);
				$('#save-csv').submit();
			}
			else
			{
				if (!$('#search:visible').length && !$this.hasClass('top'))
					$.mobile.changePage('#search');
				$('#permaheader').find('nav li a').removeClass('active');
				$this.addClass('active');
				if ($this.hasClass('artist'))
					$('#search-byartist').trigger('click');
				if ($this.hasClass('song'))
					$('#search-bysong').trigger('click');
				if ($this.hasClass('playlist'))
					$('#search-byplaylist').trigger('click');
				if ($this.hasClass('top'))
				{
					$.mobile.changePage('#top');
				}
				else
					$('#top:visible').fadeOut(400);	
			}
			return false;
		});
	}
});
$(document).on(UserAgent.pageinit + '.search',UserAgent.searchPage,function()
{
	EchoCheck.fetchTopTerms(false,function(res)
	{
		Output.setOutputToPage($('#styles'));
		Output.addCheckboxesToPage(res.terms);
		if (UserAgent.desktop)
		{
			// move results to form
			EventHandler.addsearchCheckboxFunctionality('styles');
			$('#styles .content fieldset').addClass('checkbox_container').insertAfter($('#styles_container'));
			$('#search-styles').on('click',function() { $('#styles_container').next().toggle(400); return false; });			
		}

		EchoCheck.fetchTopTerms(true,function(res)
		{
			Output.setOutputToPage($('#moods'));
			Output.addCheckboxesToPage(res.terms);
			if (UserAgent.desktop)
			{
				// move results to form
				EventHandler.addsearchCheckboxFunctionality('moods');
				$('#moods .content fieldset').addClass('checkbox_container').insertAfter($('#moods_container'));
				$('#search-moods').on('click',function() { $('#moods_container').next().toggle(400); return false; });
				
			}
		});
	});

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
		$('#search-artist').val('');
		Output.clearCheckboxesPage('styles');
		Output.clearCheckboxesPage('moods');
		$('#search-startyear')[0].selectedIndex = 0;
		if (UserAgent.mobile)
			$('#search-startyear').selectmenu('refresh');
		$('#search-endyear')[0].selectedIndex = 0;
		if (UserAgent.mobile)
			$('#search-endyear').selectmenu('refresh');
		$('#search-terms').val('');
		$('#search-playlisttype')[0].selectedIndex = 0;
		if (UserAgent.mobile)
			$('#search-playlisttype').selectmenu('refresh');
		$('#search-hotness')[0].selectedIndex = 0;
		if (UserAgent.mobile)
			$('#search-hotness').selectmenu('refresh');
		$('#search-songhotness')[0].selectedIndex = 0;
		if (UserAgent.mobile)
			$('#search-songhotness').selectmenu('refresh');
		$('#search-familiarity')[0].selectedIndex = 0;
		if (UserAgent.mobile)
			$('#search-familiarity').selectmenu('refresh');
		$('#search-sortby')[0].selectedIndex = 0;
		if (UserAgent.mobile)
			$('#search-sortby').selectmenu('refresh');
		$('#search-variety')[0].selectedIndex = 2;
		if (UserAgent.mobile)
			$('#search-variety').selectmenu('refresh');
		$('#search-distribution')[0].selectedIndex = 0;
		if (UserAgent.mobile)
			$('#search-distribution').selectmenu('refresh');
		$('#search-mintempo').val('');
		$('#search-maxtempo').val('');
		$('#search-energy')[0].selectedIndex = 0;
		if (UserAgent.mobile)
			$('#search-energy').selectmenu('refresh');
		$('#search-danceability')[0].selectedIndex = 0;
		if (UserAgent.mobile)
			$('#search-danceability').selectmenu('refresh');
		$('#search-results')[0].selectedIndex = 1;
		if (UserAgent.mobile)
			$('#search-results').selectmenu('refresh');
	});
	
	$('#search').find('input.submit').on('click',function()
	{
		Output.setOutputToPage($('#search_results'));
		if (UserAgent.desktop)
			$('#permaheader nav a').removeClass('active');
		$('#search_results').addClass('loading');
		var existingresults;
		if (UserAgent.mobile)
			existingresults = Output.content.find('div.ui-collapsible');
		else
			existingresults = Output.content.children();
		if (existingresults.length)
		{
			existingresults.remove();
		}
		else
			EventHandler.addArtistMenusFunctionality(Output.content);
		$.mobile.changePage('#search_results');
		var searchpage = $('#search');
		var mode = 'artist';
		var modeselect = $('input[name="search-by"]:checked').val();
		if (modeselect == 'bysong')
			mode = 'song';
		if (modeselect == 'byplaylist')
			mode = 'playlist';
		var options = {};
		if (mode == 'song')
		{
			options.combined = jQuery.trim($('#search-artist').val());
		}
		else
		{
			options.artist = jQuery.trim($('#search-artist').val());
		}
		
	
		if (UserAgent.mobile)
		{
			options.styles = $('#search-styles').find('.ui-btn-text').text().replace('-','');
			options.moods = $('#search-moods').find('.ui-btn-text').text().replace('-','');
		}	
		else
		{
			options.styles = $('#search-styles').text().replace('-','');
			options.moods = $('#search-moods').text().replace('-','');
		}
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
				options.sortby = 'artist_familiarity-desc';
			else
				options.sortby = 'familiarity-desc';
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
		}
		EventHandler.addArtistMenusFunctionality(Output.content);
		EchoCheck.powerSearch(mode,options,function(res)
		{
			$('#search_results').removeClass('loading');
			if (UserAgent.desktop)
				$('#permaheader nav li.csv_container').show();
			if (mode == 'artist')
			{
				Output.addArtistsToPage(res.artists);
				if (!res.artists.length)
				{
					Output.saveArtistRow('No artists found');
					Output.addContentRows();
				}	
			}
			else if (mode == 'song' || mode == 'playlist')
			{
				Output.addSongsToPage(res.songs);
				if (!res.songs.length)
				{
					Output.saveSongRow('No songs found');
					Output.addContentRows();
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
	if (Modernizr.sessionstorage)
	{
		var startsetting = sessionStorage.getItem('startsearchsetting');
		if (startsetting == 'song')
		{
			$('#search-byartist').prop('checked',false);
			$('#search-bysong').trigger('click').prop('checked',true);
			if (UserAgent.mobile)
				$('#search-bysong').checkboxradio("refresh");
			else
			{
				$('#permaheader').find('nav li a').removeClass('active');
				$('#permaheader a.song').addClass('active');
			}
		}
		if (startsetting == 'playlist')
		{
			$('#search-byartist').prop('checked',false);
			$('#search-byplaylist').trigger('click').prop('checked',true);
			if (UserAgent.mobile)
				$('#search-byplaylist').checkboxradio("refresh");
			else
			{
				$('#permaheader').find('nav li a').removeClass('active');
				$('#permaheader a.playlist').addClass('active');
			}
		}
		if (startsetting == 'artist' && !UserAgent.mobile)
		{
			$('#search-byartist').trigger('click').prop('checked',true);
			$('#permaheader').find('nav li a').removeClass('active');
			$('#permaheader a.artist').addClass('active');
		}
	}

	$(document).unbind(UserAgent.pageinit + '.search');
});
$(document).on(UserAgent.pageinit + '.searchresults',UserAgent.searchResultsPage,function()
{
	$('#plaintext_link').on('click',function()
	{
		if (typeof Output == 'object')
		{
			$('#plaintext textarea').html(Output.plainTextContentRows.join('\n'));
		}
	});
	$(document).unbind(UserAgent.pageinit + '.searchresults');	
});
$(document).on(UserAgent.pageinit + '.styles',UserAgent.stylesPage,function()
{
	EventHandler.addsearchCheckboxFunctionality('styles');
	$(document).unbind(UserAgent.pageinit + '.styles');
});
$(document).on(UserAgent.pageinit + '.moods',UserAgent.moodsPage,function()
{
	EventHandler.addsearchCheckboxFunctionality('moods');
	$(document).unbind('UserAgent.pageinit.moods');
});
$(document).on(UserAgent.pageinit + '.top',UserAgent.topPage,function()
{
	Output.setOutputToPage($('#top'));
	// have extra JQuery based animation for collapsible menus, add on demand terms and related items
	EventHandler.addArtistMenusFunctionality(Output.content);

	// fetch artists from echonest
	EchoCheck.fetchTopHotArtists(40,function(res)
	{
		if (UserAgent.desktop)
			Output.setOutputToPage($('#top'));
		Output.addArtistsToPage(res.artists);
		Output.content.trigger('create');
	});
	$(document).unbind(UserAgent.pageinit + '.top');
});





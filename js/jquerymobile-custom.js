/* Author:
	nschaden
*/

$(document).bind("mobileinit", function(){
	// for hash tags that don't fall in the proper starting area, change and reload
	var splithref = document.location.href.split('#');
	if (splithref.length > 1 && splithref[1] != 'top' && splithref[1] != 'search')
	{
		document.location.href = splithref[0] + '#search';
	}

	$.mobile.page.prototype.options.addBackBtn = true;
	$.mobile.touchOverflowEnabled = true;
	$.support.touchOverflow = true;
});
$(document).on('pageinit.search','#search',function()
{
	EchoCheck.fetchTopTerms(false,function(res)
	{
		Output.setOutputToPage($('#styles'));
		Output.addCheckboxesToPage(res.terms);

		EchoCheck.fetchTopTerms(true,function(res)
		{
			Output.setOutputToPage($('#moods'));
			Output.addCheckboxesToPage(res.terms);
		});
	});

	$('#search').find('#search-byartist,#search-bysong').on('click',function()
	{
		$('#search').find('.playlistonly').addClass('inactive');
		$('#search').find('.hideonplaylist').removeClass('inactive');
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
		$('#search-artist').siblings('label').text('Artist name(s)');
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
		$('#search-startyear').selectmenu('refresh');
		$('#search-endyear')[0].selectedIndex = 0;
		$('#search-endyear').selectmenu('refresh');
		$('#search-terms').val('');
		$('#search-hotness')[0].selectedIndex = 0;
		$('#search-hotness').selectmenu('refresh');
		$('#search-songhotness')[0].selectedIndex = 0;
		$('#search-songhotness').selectmenu('refresh');
		$('#search-familiarity')[0].selectedIndex = 0;
		$('#search-familiarity').selectmenu('refresh');
		$('#search-sortby')[0].selectedIndex = 0;
		$('#search-sortby').selectmenu('refresh');
		$('#search-variety')[0].selectedIndex = 2;
		$('#search-variety').selectmenu('refresh');
		$('#search-distribution')[0].selectedIndex = 0;
		$('#search-distribution').selectmenu('refresh');
		$('#search-energy')[0].selectedIndex = 0;
		$('#search-energy').selectmenu('refresh');
		$('#search-distribution')[0].selectedIndex = 0;
		$('#search-distribution').selectmenu('refresh');
		$('#search-results')[0].selectedIndex = 1;
		$('#search-results').selectmenu('refresh');
	});
	
	$('#search').find('input.submit').on('click',function()
	{
		Output.setOutputToPage($('#search_results'));
		$('#search_results').addClass('loading');
		var existingresults = Output.content.find('div.ui-collapsible');
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
		
	
		options.styles = $('#search-styles').find('.ui-btn-text').text().replace('-','');
		options.moods = $('#search-moods').find('.ui-btn-text').text().replace('-','');
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
			if (mode == 'artist')
			{
				Output.addArtistsToPage(res.artists);

				// fetch artist references from spotify
				for (i = 0; i < res.artists.length; i++)
				{
					currartist = res.artists[i];
					SpotCheck.getArtistLink(currartist.name,function(href,name)
					{
						// based on response, find position, insert accordingly
						var ref = Output.artistDetail[name];
						if (typeof ref == 'object')
						{
							ref.spotlink = href;
							Output.addSpotifyLinkToArtistRow(href,ref[Output.contentId + '_order']);
						}
					});
				}
			}
			else if (mode == 'song' || mode == 'playlist')
			{
				Output.addSongsToPage(res.songs);

				// fetch track references from spotify
				for (i = 0; i < res.songs.length; i++)
				{
					currsong = res.songs[i];
					SpotCheck.getTrackLink(currsong.title,currsong.artist_name,function(href,trackname)
					{
						// based on response, find position, insert accordingly
						if (href != false)
						{
							var ref = Output.songDetail[trackname];
							if (typeof ref == 'object')
							{
								ref.spotlink = href;
								Output.addSpotifyLinkToSongRow(href,ref[Output.contentId + '_order']);
							}	
						}
					});
				}
			}
			Output.content.trigger('create');
		});
	});

	// auto select mode based on initial href
	if (Modernizr.sessionstorage)
	{
		var startsetting = sessionStorage.getItem('startsearchsetting');
		if (startsetting == 'song')
		{
			$('#search-byartist').prop('checked',false);
			$('#search-bysong').trigger('click').prop('checked',true).checkboxradio("refresh");
		}
		if (startsetting == 'playlist')
		{
			$('#search-byartist').prop('checked',false);
			$('#search-byplaylist').trigger('click').prop('checked',true).checkboxradio("refresh");
		}
	}

	$(document).unbind('pageinit.search');
});
$(document).on('pageinit.searchresults','#search_results',function()
{
	$('#plaintext_link').on('click',function()
	{
		if (typeof Output == 'object')
		{
			$('#plaintext textarea').html(Output.plainTextContentRows.join('\n'));
		}
	});
	$(document).unbind('pageinit.searchresults');	
});
$(document).on('pageinit.styles','#styles',function()
{
	EventHandler.addsearchCheckboxFunctionality('styles');
	$(document).unbind('pageinit.styles');
});
$(document).on('pageinit.moods','#moods',function()
{
	EventHandler.addsearchCheckboxFunctionality('moods');
	$(document).unbind('pageinit.moods');
});
$(document).on('pageinit.top','#top',function()
{
	Output.setOutputToPage($('#top'));
	// have extra JQuery based animation for collapsible menus, add on demand terms and related items
	EventHandler.addArtistMenusFunctionality(Output.content);

	// fetch artists from echonest
	EchoCheck.fetchTopHotArtists(40,function(res)
	{
		Output.addArtistsToPage(res.artists);

		// fetch artist references from spotify
		for (i = 0; i < res.artists.length; i++)
		{
			currartist = res.artists[i];
			SpotCheck.getArtistLink(currartist.name,function(href,name)
			{
				// based on response, find position, insert accordingly
				var ref = Output.artistDetail[name];
				if (typeof ref == 'object')
				{
					ref.spotlink = href;
					Output.addSpotifyLinkToArtistRow(href,ref[Output.contentId + '_order']);
				}
			});
		}
		Output.content.trigger('create');
	});
	$(document).unbind('pageinit.top');
});





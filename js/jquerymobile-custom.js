/* Author:
	nschaden
*/

$(document).bind("mobileinit", function(){
	// for hash tags that don't fall in the proper starting area, change and reload
	var splithref = document.location.href.split('#');
	if (splithref.length > 1 && splithref[1] != 'top' && splithref[1] != 'browse')
	{
		document.location.href = splithref[0] + '#browse';
	}

	$.mobile.page.prototype.options.addBackBtn = true;
	$.mobile.touchOverflowEnabled = true;
	$.support.touchOverflow = true;
});
$(document).on('pageinit.browse','#browse',function()
{
	EchoCheck.fetchTopTerms(false,function(res)
	{
		console.log('style results',res);
		Output.setOutputToPage($('#styles'));
		Output.addCheckboxesToPage(res.terms);

		EchoCheck.fetchTopTerms(true,function(res)
		{
			console.log('moods results',res);
			Output.setOutputToPage($('#moods'));
			Output.addCheckboxesToPage(res.terms);
		});
	});

	$('#browse').find('#browse-byartist,#browse-bysong').on('click',function()
	{
		$('#browse').find('.playlistonly').addClass('inactive');
		$('#browse').find('.hideonplaylist').removeClass('inactive');
		$('#browse-artist').siblings('label').text('Find artist');
		if ($(this).attr('id') == 'browse-bysong')
			$('#browse-hotness').siblings('label').text('Song hotness');
		else
			$('#browse-hotness').siblings('label').text('Artist hotness');
		if (Modernizr.sessionstorage)
			sessionStorage.setItem('startbrowsesetting',$(this).attr('id').replace('browse-by',''));
	});

	$('#browse').find('#browse-byplaylist').on('click',function()
	{
		$('#browse').find('.playlistonly').removeClass('inactive');
		$('#browse').find('.hideonplaylist').addClass('inactive');
		$('#browse-artist').siblings('label').text('Artist name(s)');
		$('#browse-hotness').siblings('label').text('Artist hotness');
		if (Modernizr.sessionstorage)
			sessionStorage.setItem('startbrowsesetting','playlist');
	});

	$('#browse').find('input.reset').on('click',function()
	{	
		$('#browse-artist').val('');
		Output.clearCheckboxesPage('styles');
		Output.clearCheckboxesPage('moods');
		$('#browse-startyear')[0].selectedIndex = 0;
		$('#browse-startyear').selectmenu('refresh');
		$('#browse-endyear')[0].selectedIndex = 0;
		$('#browse-endyear').selectmenu('refresh');
		$('#browse-terms').val('');
		$('#browse-hotness')[0].selectedIndex = 0;
		$('#browse-hotness').selectmenu('refresh');
		$('#browse-songhotness')[0].selectedIndex = 0;
		$('#browse-songhotness').selectmenu('refresh');
		$('#browse-familiarity')[0].selectedIndex = 0;
		$('#browse-familiarity').selectmenu('refresh');
		$('#browse-sortby')[0].selectedIndex = 0;
		$('#browse-sortby').selectmenu('refresh');
		$('#browse-variety')[0].selectedIndex = 2;
		$('#browse-variety').selectmenu('refresh');
		$('#browse-distribution')[0].selectedIndex = 0;
		$('#browse-distribution').selectmenu('refresh');
		$('#browse-energy')[0].selectedIndex = 0;
		$('#browse-energy').selectmenu('refresh');
		$('#browse-distribution')[0].selectedIndex = 0;
		$('#browse-distribution').selectmenu('refresh');
	});
	
	$('#browse').find('input.submit').on('click',function()
	{
		Output.setOutputToPage($('#browse_results'));
		var existingresults = Output.content.find('div.ui-collapsible');
		if (existingresults.length)
		{
			existingresults.remove();
		}
		else
			EventHandler.addArtistMenusFunctionality(Output.content);
		$.mobile.changePage('#browse_results');
		var browsepage = $('#browse');
		var mode = 'artist';
		var modeselect = $('input[name="browse-by"]:checked').val();
		if (modeselect == 'bysong')
			mode = 'song';
		if (modeselect == 'byplaylist')
			mode = 'playlist';
		var options = {};
		if (mode == 'song')
		{
			options.combined = jQuery.trim($('#browse-artist').val());
		}
		else
		{
			options.artist = jQuery.trim($('#browse-artist').val());
		}
		
	
		options.styles = $('#browse-styles').find('.ui-btn-text').text().replace('-','');
		options.moods = $('#browse-moods').find('.ui-btn-text').text().replace('-','');
		options.startyear = $('#browse-startyear').val();
		if (options.startyear == 'Start Year')
			options.startyear = null;
		else
			options.startyear = parseInt(options.startyear,10)-1;
		options.endyear = $('#browse-endyear').val();
		if (options.endyear == 'End Year')
			options.endyear = null;
		else
			options.endyear = parseInt(options.endyear,10)+1;
		options.description = jQuery.trim($('#browse-terms').val());
		var hotness = $('#browse-hotness').val();
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
		var familiarity = $('#browse-familiarity').val();
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
		options.sortby = $('#browse-sortby').val();
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
			var variety = $('#browse-variety').val();
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
			options.distribution = $('#browse-distribution').val();
			var songhotness = $('#browse-songhotness').val();
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
			var energy = $('#browse-energy').val();
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
			var danceability = $('#browse-danceability').val();
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
			console.log('got search response',res);
			if (mode == 'artist')
			{
				Output.addArtistsToPage(res.artists);

				// fetch artist references from spotify
				for (i = 0; i < res.artists.length; i++)
				{
					currartist = res.artists[i];
					SpotCheck.getArtistId(currartist.name,function(href,name)
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

				// fetch artist references from spotify
				// for (i = 0; i < res.artists.length; i++)
				// {
				// 	currartist = res.artists[i];
				// 	SpotCheck.getArtistId(currartist.name,function(href,name)
				// 	{
				// 		// based on response, find position, insert accordingly
				// 		var ref = Output.artistDetail[name];
				// 		if (typeof ref == 'object')
				// 		{
				// 			ref.spotlink = href;
				// 			Output.addSpotifyLinkToArtistRow(href,ref[Output.contentId + '_order']);
				// 		}
				// 	});
				// }
			}
			Output.content.trigger('create');
		});
	});

	// auto select mode based on initial href
	if (Modernizr.sessionstorage)
	{
		var startsetting = sessionStorage.getItem('startbrowsesetting');
		console.log('here is start setting',startsetting);
		if (startsetting == 'song')
		{
			$('#browse-byartist').prop('checked',false);
			$('#browse-bysong').trigger('click').prop('checked',true).checkboxradio("refresh");
		}
		if (startsetting == 'playlist')
		{
			$('#browse-byartist').prop('checked',false);
			$('#browse-byplaylist').trigger('click').prop('checked',true).checkboxradio("refresh");
		}
	}

	$(document).unbind('pageinit.browse');
});
$(document).on('pageinit.browseresults','#browse_results',function()
{
	$('#plaintext_link').on('click',function()
	{
		if (typeof Output == 'object')
		{
			$('#plaintext textarea').html(Output.plainTextContentRows.join('\n'));
		}
	});
	$(document).unbind('pageinit.browseresults');	
});
$(document).on('pageinit.styles','#styles',function()
{
	EventHandler.addBrowseCheckboxFunctionality('styles');
	$(document).unbind('pageinit.styles');
});
$(document).on('pageinit.moods','#moods',function()
{
	EventHandler.addBrowseCheckboxFunctionality('moods');
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
		console.log('response',res);
		// based on response, add top artist details from echonest
		// for (var i = 0; i < res.artists.length; i++)
		// {
		// 	var currartist = res.artists[i];
		// 	Output.artistDetail[currartist.name] = {echoid:currartist.id,order:i,spotlink:null,terms:null};
		// 	var currterms = [];
		// 	for (var j = 0; j < currartist.terms.length; j++)
		// 		currterms.push(currartist.terms[j].name);
		// 	Output.saveArtistRow(currartist.name,currartist.hotttnesss,currartist.familiarity,currterms);
		// }
		// console.log('init artist rows');
		// Output.addArtistRows();
		Output.addArtistsToPage(res.artists);

		// fetch artist references from spotify
		for (i = 0; i < res.artists.length; i++)
		{
			currartist = res.artists[i];
			SpotCheck.getArtistId(currartist.name,function(href,name)
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





/* Author:
	nschaden
*/

$(document).bind("mobileinit", function(){
	// for hash tags that don't fall in the proper starting area, change and reload
	console.log('starting href',document.location.href,document.location.href.split('#'));
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
		$('#browse-familiarity')[0].selectedIndex = 0;
		$('#browse-familiarity').selectmenu('refresh');
		$('#browse-sortby')[0].selectedIndex = 0;
		$('#browse-sortby').selectmenu('refresh');
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
		var artist = jQuery.trim($('#browse-artist').val());
	
		var styles = $('#browse-styles').find('.ui-btn-text').text().replace('-','');
		var moods = $('#browse-moods').find('.ui-btn-text').text().replace('-','');
		var startyear = $('#browse-startyear').val();
		if (startyear == 'Start Year')
			startyear = null;
		else
			startyear = parseInt(startyear,10)-1;
		var endyear = $('#browse-endyear').val();
		if (endyear == 'End Year')
			endyear = null;
		else
			endyear = parseInt(endyear,10)+1;
		var description = jQuery.trim($('#browse-terms').val());
		var hotness = $('#browse-hotness').val();
		var hotnessmininput = 0;
		var hotnessmaxinput = 1;
		console.log('hotness',hotness);
		if (hotness == 'high')
		{
			hotnessmininput = 0.7;
		}
		if (hotness == 'average')
		{
			hotnessmininput = 0.3;
			hotnessmaxinput = 0.7;
		}
		if (hotness == 'low')
		{
			hotnessmaxinput = 0.3;
		}
		var familiarity = $('#browse-familiarity').val();
		var familiaritymininput = 0;
		var familiaritymaxinput = 1;
		if (familiarity == 'wellknown')
		{
			familiaritymininput = 0.7;
		}
		if (familiarity == 'average')
		{
			familiaritymininput = 0.3;
			familiaritymaxinput = 0.7;
		}
		if (familiarity == 'obscure')
		{
			familiaritymaxinput = 0.3;
		}
		var sortby = $('#browse-sortby').val();
		if (sortby == 'hotness')
			sortby = 'hotttnesss-desc';
		else
			sortby = 'familiarity-desc';
		EventHandler.addArtistMenusFunctionality(Output.content);
		EchoCheck.findArtists(artist,styles,moods,description,hotnessmininput,hotnessmaxinput,familiaritymininput,familiaritymaxinput,startyear,endyear,sortby,function(res)
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
			Output.content.trigger('create');
		});
	});
	$(document).unbind('pageinit.browse');
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





/* Author:
	nschaden
*/
EchoCheck = {
	api: 'PWNYOEPUNHQTGZLHY',
	base: 'http://developer.echonest.com/api/v4/',
	callJSON: function(url,inputdata,callback)
	{
		$.getJSON(url,inputdata,function(data)
		{
			if (EchoCheck.checkResponse(data))
			{
				if (typeof callback == 'function')
					callback(data.response);
			}
		});
	},
	checkResponse: function(data)
	{
		if (data.response) 
		{
	        if (data.response.status.code !== 0) 
	        {
	            alert("Whoops... Unexpected error from server. " + data.response.status.message);
	        } 
	        else 
	        {
	            return true;
	        }
	    } 
	    else 
	    {
	        alert("Unexpected response from server");
	    }
	    return false;	
	},
	findRelatedArtists: function(artistnameorid,namemode,callback)
	{
		if (typeof artistnameorid != 'string') return;
		var url = this.base + 'artist/similar?callback=?&bucket=hotttnesss&bucket=familiarity&bucket=terms';
		var inputdata = {'format':'jsonp','api_key':this.api,'start':0,'results':30};
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
		var url = this.base + 'artist/top_hottt?callback=?&bucket=hotttnesss&bucket=familiarity&bucket=terms';
		this.callJSON(url,{'format':'jsonp','api_key':this.api,'results': results},callback);
	},
	powerSearch: function(mode,options,callback)
	{
		if (typeof mode != 'string' || typeof options != 'object') return;
		var url = this.base + 'artist/search?callback=?&bucket=hotttnesss&bucket=familiarity&bucket=terms';
		if (mode == 'song')
			url = this.base + 'song/search?callback=?&bucket=song_hotttnesss&bucket=artist_familiarity';
		else if (mode == 'playlist')
			url = this.base + 'playlist/static?callback=?&bucket=song_hotttnesss&bucket=artist_familiarity&type=artist-radio';
		var inputdata = {'format':'jsonp','api_key':this.api,'sort':'hotttnesss-desc',results:50,min_hotttnesss:0.1};
		if (options.artist && mode == 'artist')
		{
			delete inputdata.min_hotttnesss;
			inputdata.name = options.artist;
		}
		else {
			if (mode == 'song' && options.combined)
				inputdata.combined = options.combined;
			if (mode == 'playlist' && options.artist)
				inputdata.artist = options.artist;
			if (options.styles)
				inputdata.style = options.styles;
			if (options.moods)
				inputdata.mood = options.moods;
			if (options.description)
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
				if (options.variety)
					inputdata.variety = options.variety;
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
			}
		}
		this.callJSON(url,inputdata,callback);
	}		
};
SpotCheck = {
	spotdata: new Spotify.Metadata(),
	getArtistLink: function(artistname,callback)
	{
		var artistnamecheck = artistname.replace(/\&/g,' ');
		this.spotdata.search({method:'artist',q:encodeURI(artistnamecheck)},function(data)
		{
			var response = JSON.parse(data);
			var returnhref = false;
			if (response.artists.length > 0)
				returnhref = response.artists[0].href;
			if (typeof callback == 'function')
				callback(returnhref,artistname);
		});
	},
	getTrackLink: function(trackname,artistname,callback)
	{
		var tracknamecheck = trackname.replace(/\&/g,' ');
		this.spotdata.search({method:'track',q:encodeURI(tracknamecheck)},function(data)
		{
			var response = JSON.parse(data);
			var returnhref = false;
			if (typeof response.tracks != 'object') return;
			var gotmatch = false;
			for (var i = 0; i < response.tracks.length; i++)
			{
				var currtrack = response.tracks[i];
				if (jQuery.trim(trackname.toLowerCase()) == currtrack.name.toLowerCase() && jQuery.trim(artistname.toLowerCase()) == currtrack.artists[0].name.toLowerCase())
				{
					gotmatch = true;
					if (typeof callback == 'function')
						callback(currtrack.href,trackname);
					break;
				}
			}
			if (!gotmatch && typeof callback == 'function')
				callback(false,trackname);
		});
	}
};

Output = {
	artistDetail: {},
	colorSpectrumLength: 10,
	colorSpectrumIndex: 0,
	content: null,
	contentId: '',
	contentRows: [],
	footerContent: '<div class="footer" data-id="footer" data-position="fixed" data-role="footer"><div data-role="navbar" data-iconpos="top"><ul>' +
					'<li><a class="search" href="#search" data-icon="search" data-transition="none">Search</a></li>' +
					'<li><a class="top" href="#top" data-icon="star" data-transition="none">Top</a></li>' +
					'</ul></div></div>',
	plainTextContentRows: [],
	songDetail: {},
	addRow: function(text)
	{
		var currcolor = Math.floor(this.colorSpectrumIndex / this.colorSpectrumLength) % 2 ? (this.colorSpectrumIndex % this.colorSpectrumLength) : this.colorSpectrumLength - (this.colorSpectrumIndex % this.colorSpectrumLength);
		this.content.append('<div class="color-blue-' + currcolor + '" data-role="collapsible"><h3>' + text + '</h3></div>').trigger('create');
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
	addArtistsToPage: function(artists)
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
			Output.saveArtistRow(currartist.name,currartist.hotttnesss,currartist.familiarity,currterms);
		}
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
		var emptypagetext = '<div data-role="page" id="' + id + '" class="' + newclass + '"><div class="header" data-role="header"><h1>' + headertext + 
							'</h1></div><div data-role="content"></div>' + this.footerContent + ' </div>';
		$('body').append(emptypagetext);
		$('#' + id).page();
	},
	addSongsToPage: function(songs)
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
			Output.saveSongRow(currsong.title,currsong.artist_name,currsong.song_hotttnesss,currsong.artist_familiarity);
		}
		Output.addContentRows();	
	},
	// note artist position is zero indexed
	addSpotifyLinkToArtistRow: function(link,artistpos)
	{
		var artistrow = this.content.children().eq(artistpos);
		if (!artistrow.length) return;
		var list = artistrow.find('.ui-collapsible-content > .ui-listview');
		list.prepend('<li><a href="' + link + '" data-role="button">Open on Spotify</a></li>').trigger('create');
	},
	addSpotifyLinkToSongRow: function(link,songpos)
	{
		var songrow = this.content.children().eq(songpos);
		if (!songrow.length) return;
		var list = songrow.find('.ui-collapsible-content > .ui-listview');
		list.prepend('<li><a href="' + link + '" data-role="button">Open on Spotify</a></li>').trigger('create');
	},
	clearCheckboxesPage: function(pageid)
	{
		var checkeditems = $('#' + pageid).find('input').filter(':checked');
		checkeditems.prop('checked',false).checkboxradio('refresh');
		$('#search-' + pageid).find('.ui-btn-text').text('-');
	},
	saveArtistRow: function(name,hotness,familiarity,terms)
	{
		var artistrowtext;
		// header
		var currcolor = Math.floor(this.colorSpectrumIndex / this.colorSpectrumLength) % 2 ? (this.colorSpectrumIndex % this.colorSpectrumLength) : this.colorSpectrumLength - (this.colorSpectrumIndex % this.colorSpectrumLength);
		artistrowtext = '<div class="color-blue-' + currcolor + '" data-role="collapsible"><h3>' + name + '</h3>';
		this.colorSpectrumIndex++;
		// row details
		artistrowtext += '<ul data-role="listview">';
		artistrowtext += '<li>Hotness: ' + Math.round(hotness*100) + '%</li><li>Familiarity: ' + Math.round(familiarity*100) + '%</li>';
		this.artistDetail[name].terms = terms;
		artistrowtext += '</ul></div>';
		this.contentRows.push(artistrowtext);
		this.plainTextContentRows.push(name);
	},
	saveSongRow: function(title,artistname,hotness,familiarity)
	{
		var songrowtext;
		// header
		var currcolor = Math.floor(this.colorSpectrumIndex / this.colorSpectrumLength) % 2 ? (this.colorSpectrumIndex % this.colorSpectrumLength) : this.colorSpectrumLength - (this.colorSpectrumIndex % this.colorSpectrumLength);
		songrowtext = '<div class="color-blue-' + currcolor + '" data-role="collapsible"><h3>' + title + ' - ' + artistname + '</h3>';
		this.colorSpectrumIndex++;
		// row details
		songrowtext += '<ul data-role="listview">';
		songrowtext += '<li>Song hotness: ' + Math.round(hotness*100) + '%</li><li>Artist familiarity: ' + Math.round(familiarity*100) + '%</li>';
		songrowtext += '</ul></div>';
		this.contentRows.push(songrowtext);
		this.plainTextContentRows.push(title + '|' + artistname);
	},
	// changes all focus of the output factory to this new page object element
	setOutputToPage: function(page)
	{
		if (typeof page != 'object') return;
		var newcontent = $(page).find('div[data-role=content]');
		if (!newcontent.length) return;
		this.contentId = page.attr('id');
		this.contentRows = [];
		if (page.attr('id') == 'search_results')
		{
			if (Modernizr.sessionstorage && sessionStorage.getItem('startsearchsetting') != 'playlist')
				this.plainTextContentRows = ['Artist'];
			else
				this.plainTextContentRows = ['Track|Artist'];
		}
		else
			this.plainTextContentRows = ['Artist'];
		this.content = newcontent;
		this.colorSpectrumIndex = 0;
	}
};

EventHandler = {
	addArtistMenusFunctionality: function(content)
	{
		content.on('click','.ui-collapsible-heading a',function() 
		{ 
			$this = $(this);
			if (!$this.parent().hasClass('ui-collapsible-heading-collapsed'))
			{
				var content = $this.parent().siblings('.ui-collapsible-content');
				content.stop(true,true).slideUp(0);
				// dyanically insert terms, related items if it's not there
				if (!content.find('a.terms_link').length)
				{
					var lookupname = jQuery.trim($this.find('span.ui-btn-text').html().replace(/<span(.*)<\/span>/,''));
					var detail = Output.artistDetail[lookupname];
					if (typeof detail == 'object')
					{
						var listview = content.find('ul.ui-listview');
						var listviewcontents = listview.html();
						// var newlisttext = '<ul data-role="listview">' + listviewcontents + '<li class="terms">Terms<ul>';
						// for (var i = 0; i < detail.terms.length; i++)
						// {
						// 	newlisttext += '<li><a href="#">' + detail.terms[i] + '</a></li>';
						// }
						// newlisttext += '</ul></li><li><a class="related_link" href="#">Related artists</a></li></ul>';
						var newlisttext = '<ul data-role="listview">' + listviewcontents + '<li><a class="terms_link" href="#">Terms</a></li>';
						newlisttext += '<li><a class="related_link" href="#">Related artists</a></li></ul>';
						listview.replaceWith(newlisttext);
						content.trigger('create');	
						// force new terms pages to have the persist footer
						// Output.addSpotifyLinkToArtistRow('hello there',detail.order);
					}
					// clicking on the terms event handler 
					content.on('click','a.terms_link',function()
					{
						// check if page exists
						var termspageid = lookupname.replace(/\s+/g,'') + '_terms';
						if (!$('#' + termspageid).length)
						{
							$(document).on('pageinit.temppage','#' + termspageid,function()
							{
								$.mobile.changePage('#' + termspageid);
								// add event handlers for terms
								$('#' + termspageid).on('click','li',function()
								{
									$('#search-terms').val(jQuery.trim($(this).text()));
								});
								$(document).unbind('pageinit.temppage');
							});
							Output.addNewPage(termspageid,lookupname + ' terms','terms');
							Output.setOutputToPage($('#' + termspageid));
							var termstext = '<ul data-role="listview">';
							for (var i = 0; i < detail.terms.length; i++)
							{
								termstext += '<li><a href="#search">' + detail.terms[i] + '</a></li>';
							}
							termstext += '</ul>';
							Output.content.append(termstext).trigger('create');
						}
						else
							$.mobile.changePage('#' + termspageid);
					});
					// clicking on related link event handler
					content.on('click','a.related_link',function()
					{
						// check if page exists
						var relatedartistpageid = lookupname.replace(/\s+/g,'') + '_related';
						if (!$('#' + relatedartistpageid).length)
						{
							$(document).on('pageinit.temppage','#' + relatedartistpageid,function()
							{
								$.mobile.changePage('#' + relatedartistpageid);
								$(document).unbind('pageinit.temppage');
							});
							Output.addNewPage(relatedartistpageid,lookupname + ' related artists','related');
							Output.setOutputToPage($('#' + relatedartistpageid));
							EventHandler.addArtistMenusFunctionality(Output.content);
							EchoCheck.findRelatedArtists(detail.echoid,false,function(res)
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
							});
						}
						else
							$.mobile.changePage('#' + relatedartistpageid);							
					});
				}
				content.slideDown(400,'linear');
			}
			else
			{
				$this.parent().siblings('.ui-collapsible-content').stop(true,true).slideDown(0).slideUp(400,'linear'); 
			}
		});
	},
	addsearchCheckboxFunctionality: function(pageid)
	{
		var fieldcontainer = $('#' + pageid).find('fieldset');
		if (!fieldcontainer.length) return;
		fieldcontainer.find('input[type="checkbox"]').click(function()
		{
			var checkedfield = $(this).attr('name').replace('style-','').replace('_',' ');
			var textcontainer = $('#search-' + pageid).find('.ui-btn-text');
			var text = jQuery.trim(textcontainer.text());
			if (this.checked)
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





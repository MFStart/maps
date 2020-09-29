//live santa clara dataType
//using D3.js to display table. The code is too obfusticated, therefore deprecate until further practice on D3

d3.json("https://data.sccgov.org/resource/j2gj-bg6c.json", function(data) {
    let html;
    var sortAscending = true;
    var table = d3.select('#covidtable').append('table');
    var titles = d3.keys(data[0]);
	  var headers = table.append('thead').append('tr')
    .selectAll('th')
    .data(titles).enter()
    .append('th')
    .text(function (d) {return d;})
    .on('click', function (d) {headers.attr('class', 'header');
    if (sortAscending) {
        rows.sort(function (a, b) {return d3.ascending(b[d], a[d]);
        });
        sortAscending = false;
        this.className = 'aes';
      }
    else {
     rows.sort(function(a, b) {
     return d3.descending(b[d], a[d]);
     });
     sortAscending = true;
     this.className = 'des';
    }
    });

		  var rows = table.append('tbody').selectAll('tr')
		               .data(data).enter()
		               .append('tr');
		  rows.selectAll('td')
		    .data(function (d) {
		    	return titles.map(function (k) {
		    		return { 'value': d[k], 'name': k};
		    	});
		    }).enter()
		    .append('td')
		    .attr('data-th', function (d) {
		    	return d.name;
		    })
		    .text(function (d) {
		    	return d.value;
		    })
        //trigger callmap to zoom to geoJson feature if click onto the zipcode value
        .on('click',function(d){
          if(d.name == 'zipcode')
            callmap(d.value);});

	  });

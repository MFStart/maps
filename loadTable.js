d3.text("covidbyzip.csv").then(function (data){
    var rows  = d3.csvParseRows(data);
    table = d3.select('body').append('table')
    .style("border-collapse", "collapse")
    .style("border", "2px black solid");
    // headers
    table.append("thead").append("tr")
        .selectAll("th")
        .data(rows[0])
        .enter().append("th")
        .text(function(d) { return d; })
        .style("border", "1px black solid")
        .style("padding", "5px")
        .style("background-color", "lightgray")
        .style("font-weight", "bold")
        .style("text-transform", "uppercase");
    table.append("tbody")
        .selectAll("tr").data(rows.slice(1))
        .enter().append("tr")
        .selectAll("td")
        .data(function(d){return d;})
        .enter().append("td")
        .style("border", "1px black solid")
        .style("padding", "5px")
        .text(function(d){return d;})
        .style("font-size", "12px");
      });

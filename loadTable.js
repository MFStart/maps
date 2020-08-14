var table = d3.text('covidbyzip.csv').then(function (data){
var keep_click = false;
var local = d3.local();
/*document.querySelectorAll(map)
  .forEach(e => e.addEventListener("click", clickHandler));
*/
    var rows  = d3.csvParseRows(data);
    table = d3.select('body').append('table')
    .style('border-collapse', 'collapse')
    .style('border', '2px black solid');
    // headers
    table.append('thead').append('tr')
        .selectAll('th')
        .data(rows[0])
        .enter().append('th')
        .text(function(d) { return d; })
        .style('border', '1px black solid')
        .style('padding', '5px')
        .style('background-color', 'steelblue')
        .style('font-weight', 'bold')
        .style('text-transform', 'uppercase');
    //body
    table.append('tbody')
        .selectAll('tr').data(rows.slice(1))
        .enter().append('tr')
        .on('click',function(d){
          keep_click = !keep_click;
          d3.select(this).style('background','lightblue');
          })
        //hover change color
        .on('mouseover',function(d) {
            if(d3.select(this).style('background') == 'lightblue')
              d3.select(this).style('background','lightblue')
            else
              d3.select(this).style('background', 'orange');
          })
        .on('mouseout',function(d){
          if(keep_click){
            d3.select(this).style('background','lightblue');
            keep_click = !keep_click;
            }
          else
            d3.select(this).style('background','transparent');
          })
        .selectAll('td')
        .data(function(d){return d;})
        .enter().append('td')
        /*.on('click',function(d){
          if
          alert('you clicked on : ' + d);})*/
        .style('border', '1px black solid')
        .style('padding', '5px')
        .text(function(d){return d;})
        .style('font-size', '12px')

      });

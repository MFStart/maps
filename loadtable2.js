$(document).ready(function(){
  //uses Jquery to find the first column of table: zipcode to pass zipcode value to callmap
	$('#covidtable2').on('click','td,th',function(){
        //if(this.textcontent === 'zipcode')
        var c = $(this).closest('tr');
        var d = c.find('td:eq(0)').text();
        callmap(d);
    });
	$.getJSON("https://data.sccgov.org/resource/j2gj-bg6c.json", function (data) {
    	var arrItems = [];      // THE ARRAY TO STORE JSON ITEMS.
            $.each(data, function (index, value) {
                arrItems.push(value);       // PUSH THE VALUES INSIDE THE ARRAY.
            });
            // EXTRACT VALUE FOR TABLE HEADER.
            var col = [];
            for (var i = 0; i < arrItems.length; i++) {
                for (var key in arrItems[i]) {
                    if (col.indexOf(key) === -1) {
                        col.push(key);
                    }
                }
            }

            // CREATE DYNAMIC TABLE.
            var table = document.createElement("table");

            // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

            var tr = table.insertRow(-1);                   // TABLE ROW.

            for (var i = 0; i < col.length; i++) {
                var th = document.createElement("th");      // TABLE HEADER.
                th.innerHTML = col[i];
                tr.appendChild(th);
            }

            // ADD JSON DATA TO THE TABLE AS ROWS.
            for (var i = 0; i < arrItems.length; i++) {

                tr = table.insertRow(-1);

                for (var j = 0; j < col.length; j++) {
                    var tabCell = tr.insertCell(-1);
                    tabCell.innerHTML = arrItems[i][col[j]];
                }
            }
            $("#covidtable2").append(table);
   });
  });

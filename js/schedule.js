	//Width and height
	var w = 800;
	var h = 500;
	var padding = 30;
	var margin = {top:30,bottom:30,right:30,left:40};
    var svg = d3.select("body")
                .append("svg")
                .attr("width",w+padding*2)
                .attr("height",h+padding*2);

	
	//create the scales
	var x = d3.scaleLinear().domain([8,22])
							.range([padding,w]);
	var y = d3.scaleLinear().domain([0,5])
							.range([h-padding,0]); //Remember to reverse
	//Since D3 v4,axes have to be defined like this now.
	var xAxis = d3.axisBottom()
    	.scale(x)
    	.tickPadding(5);
                  
	var yAxis = d3.axisLeft()
    	.scale(y)
    	//.tickValues([1,2,3,4,5]) //specified an array for tickvalues. overrides scale
	    .tickPadding(5);
	
	var lineGenerator = d3.line()
	                      .x(function(d) { return x(d.time); })
	                      .y(function(d) { return y(d.rating); });
	svg.append("g")
	   .attr("class","x-axis")
	   .attr("transform","translate(0,"+(h-padding)+")")
       .call(xAxis);
       
    svg.append("g")
       .attr("class","y-axis")
	   .attr("transform","translate("+(padding)+",10)")
       .call(yAxis);
	
      
	// Displaying through data
	d3.csv("ratings2.0.csv", function(error, data) {
	    // Scale the range of the data if needed
	    
	    // Nest the entries by branch
	    var dataNest = d3.nest()
	        .key(function(d) {return d.br;})
	        .entries(data);
	    // Loop through each branch
	    //The nest changes the parameters -> key and values
	    dataNest.forEach(function(d,i) {
	        svg.append("path")
	            .attr("class", "line")
	            .style("stroke", function() { return colors[d.key-1]; })
	            .attr("id","br"+d.key)
	            .attr("d", lineGenerator(d.values)); 
	        // Add the Legend
	        svg.append("text")
	            .attr("x", w+10)// spacing
	            .attr("y", h/2 + (d.key)*20)
	            .attr("class", "legend")
	            .style("fill", function() { return colors[d.key-1]; })
	            .on("click", function(){
	            	elem = document.getElementById("br"+d.key);
	            	var oldOpacity = window.getComputedStyle(elem).getPropertyValue("opacity");
	            	if(oldOpacity ==0){
	            		newOpacity = 1;
	            	}
	            	else{
	            		newOpacity = 0;
	            	}
	            	//var newOpacity =  oldOpacity  ? 0 : 1
	            	d3.select("#br"+d.key).style("opacity", newOpacity);
                })
	            .text(d.key);
	    });
	    // Add a scatterplot if needed
	    svg.selectAll("dot")
	        .data(data)
	        .enter().append("circle")
	        .attr("r", 3.5)
	        .attr("cx", function(d) { return x(d.time); })
	        .attr("cy", function(d) { return y(d.rating); });
	});
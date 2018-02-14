console.log("WELCOME TO MOVIE MATTERS");

/*
		 GLOBAL LAYOUT CONSTANTS
*/          
var width = 750;
var height = 450;
var margin = {top: 20, right: 15, bottom: 30, left: 50};

var w = width - margin.left - margin.right;
var h = height - margin.top - margin.bottom;


/*
		GLOBAL DATA-RELATED VARIABLES
		Useful to access variables and data for scales and viz
*/          
var dataset;

var	maxYear;
var maxRating;
var maxRuntime;
var maxImdbRating;
var maxReveue;
var countRecords;

/*
		GLOBAL FILTER-RELATED VARIABLES
		To keep track of patterns and current selections on filters
*/          


//start with the type set to all, changes this variable everytime the dropdown for type is changed
var patt = new RegExp("all"); //For TYPE filter



/*
		 READ DATA AND RELATED VARIABLES

Column Names in Dataset:
film_id 			title		cast				my_title	
my_rating			budget		id					imdb_id		
original_language	overview	poster_path			revenue		
runtime				votes		imdb_rating			year	
genre	

*/          


console.log('Before Reading Data')

d3.csv("data/final_data.csv", 
	function(error, movies) {	
			//read in the data
			if (error) return console.warn(error);
		     movies.forEach(function(d) {
						d.film_id = +d.film_id;
				     	d.my_rating = +d.my_rating;
					 	d.id = +d.id;
					 	d.budget = +d.budget;
					 	d.revenue = +d.revenue;
					 	d.runtime = +d.budget;
					 	d.votes = +d.votes;
					 	d.imdb_rating = +d.imdb_rating;
					 	d.year = +d.year;
						});

	//dataset is the full dataset -- maintain a copy of this at all times
	 dataset = movies;

	//max of different variables for sliders
	  maxYear = d3.max(dataset.map(function(d) {return d.year;}));
	  maxRating = d3.max(dataset.map(function(d) {return d['my_rating'];}));
	  maxRuntime = d3.max(dataset.map(function(d) {return d['runtime'];}));
	  maxImdbRating = d3.max(dataset.map(function(d) {return d['imdb_rating'];}));
	  maxReveue = d3.max(dataset.map(function(d) {return d['revenue'];}));
	  countRecords = dataset.length;

	  console.log('Details of Dataset');
	  console.log('# Records: ', dataset.length);
	  console.log('Max Year : ', maxYear);
	  console.log('Max Rating : ', maxRating);
	  console.log('Max IMDB Rating : ', maxImdbRating);
	  console.log('Max Runtime : ', maxRuntime);
	  console.log('Max Revenue : ', maxReveue);

	//all the data is now loaded, so draw the initial vis
	//console.log('Drawing Initial Visualizations')
	//drawAllVis(dataset);

}); //end d3.csv



/*
		 DATA ACCESSOR FUNCTIONS
		 Functions to quickly get value of important columns for Scales, Axes
*/          

var title = function(d) {return d['title']]};
var year = function (d) {return d['imdb_startYear']} ;
var my_genre = function (d) {return d['genre']};
var my_rating = function (d) {return d['my_rating']};
var imdb_rating = function (d) {return d['imdb_rating']};
var runtime = function (d) {return d['runtime']};
var revenue = function (d) {return d['revenue']};



/*
		 SCALES, AXES and DOM ELEMENTS
none of these depend on the data being loaded so fine to define here

*/          


//SCALES For Timeline Div


//SVG and DOM tags for Timeline Div


//SCALES for Genre Div


//SVG and DOM tags for Genre Div


//SCALES for Ratings Div

var col = d3.scaleOrdinal(d3.schemeCategory10);

var colLightness = d3.scaleLinear()
	.domain([0, 1200])
	.range(["#FFFFFF", "#000000"])


var x = d3.scaleLinear()
        .domain([0, 1000])
        .range([0, w]);

var y = d3.scaleLinear()
        .domain([0, 1000])
        .range([h, 0]);


//SVG and DOM tags for Ratings Div
var svg = d3.select("body").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = d3.select("#rating-years")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom+15)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


 chart.append("g")
      .attr("transform", "translate(0," + h + ")")
      .call(d3.axisBottom(x))
     .append("text")
      .attr("x", w)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Price");

      chart.append("g")
       .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("True Value");



/*
		DRAW VISUALIZATIONS
		Function Definitions to draw the graphs and charts on screen
*/          


function drawAllVis(dataset){
	//Calls all individual drawVis functions for each chart/graph

	drawRatingYearVis(dataset);
}




function drawRatingYearVis(dataset) { //draw the circles initially and on each interaction with a control
  console.log('Drawing Circles')

	var circle = chart.selectAll("circle")
	   .data(dataset);

  var tooltipText = function(d) {return "Price: " + d.price + "<br/>eValue: "  + d.eValue + "<br/>Vol: " + d.vol + "<br/>Delta: " + d.delta}

  console.log('Update')
	circle
    	  .attr("cx", function(d) { return x(d.price);  })
    	  .attr("cy", function(d) { return y(d.eValue);  })
     	  .style("fill", function(d) { return col(d.type); })
        .on("mouseover", function(d) {    
            tooltip.transition()    
                .duration(200)    
                .style("opacity", .9);    
            tooltip.html(tooltipText(d))  
                .style("left", (d3.event.pageX +5) + "px")   
                .style("top", (d3.event.pageY - 28) + "px");  
            })          
        .on("mouseout", function(d) {   
            tooltip.transition()    
                .duration(500)    
                .style("opacity", 0); 
        });;

  console.log('Exit')
	circle.exit().remove();

  console.log('Enter')
	circle.enter().append("circle")
    	  .attr("cx", function(d) { return x(d.price);  })
    	  .attr("cy", function(d) { return y(d.eValue);  })
    	  .attr("r", 4)
    	  .style("stroke", "black")
     	  .style("fill", function(d) { return col(d.type); })
    	  .style("opacity", 0.5)
        .on("mouseover", function(d) {    
            tooltip.transition()    
                .duration(200)    
                .style("opacity", .9);    
            tooltip.html(tooltipText(d))  
                .style("left", (d3.event.pageX +5) + "px")   
                .style("top", (d3.event.pageY - 28) + "px");  
            })          
        .on("mouseout", function(d) {   
            tooltip.transition()    
                .duration(500)    
                .style("opacity", 0); 
        });


} //End Draw Vis


/*
		 CODE FOR FILTERS
		 Functions to redraw graphs on filter selections 
*/          

//Code to Combine Filter Selections




var typeSelected = "all";
var volSelected = [0,1200]; 

function filterCriteria(d){
  var res = patt.test(mtype); //boolean

  return d["type"]==typeSelected;
}


function filterType(mtype) {
    console.log("Passed Value to DropDown:", mtype);
    var res = patt.test(mtype); //boolean
    console.log("Is all selected ?", res);

    typeSelected = mtype; 

    if(res==true) //All selected
    {
        drawVis(dataset); //reset to all images
    }
    
    else
    {
        var filteredDataset = dataset.filter( function(d) { return d["type"]==mtype;}  );
        drawVis(filteredDataset);
    }

}//End Filter Type


$(function() {
    $( "#volumeslider" ).slider({
          range: true,
          min: 0,
          max: 1200,
          values: [ 0, 1200], 
          slide: function( event, ui ) 
          {
              $( "#myvolumetext" ).val( ui.values[ 0 ] + " to " + ui.values[ 1 ] ); 
              filterVolume(ui.values);
          } //end slide function
    }); //end slider

    $( "#myvolumetext" ).val( $( "#volumeslider" ).slider( "values", 0 ) + " - " + $( "#volumeslider" ).slider( "values", 1 ) ); 
}); //end function



function filterVolume(volRange){
    volSelected = volRange;

    console.log('Filter Volume', volRange);
    var volDataset = dataset.filter( function(d) { return d.vol >= volRange[0] && d.vol < volRange[1]} );
    drawVis(volDataset);
}//End Filter Volume



console.log('End of JS File');
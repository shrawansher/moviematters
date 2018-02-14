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
					 	d.year = d.year;
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
	drawAllVis(dataset);

}); //end d3.csv



/*
		 DATA ACCESSOR FUNCTIONS
		 Functions to quickly get value of important columns for Scales, Axes
*/          

var title = function(d) {return d['title']};
var year = function (d) {return d['year']} ;
var my_genre = function (d) {return d['genre']};
var my_rating = function (d) {return d['my_rating']};
var imdb_rating = function (d) {return d['imdb_rating']};
var runtime = function (d) {return d['runtime']};
var revenue = function (d) {return d['revenue']};


var formatCount = d3.format(",.0f");

/*
		 SCALES, AXES, TOOLTIPS and DOM ELEMENTS
none of these depend on the data being loaded so fine to define here

*/          


// TOOLTIPS ! 
//Currently only 1 tooltip
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);



/*
		DRAW VISUALIZATIONS
		Function Definitions to draw the graphs and charts on screen
*/          


function drawAllVis(dataset){
	//Calls all individual drawVis functions for each chart/graph

	drawTimelineVis(dataset);
	// Add more functions here
}


function drawTimelineVis(dataset) { 
  var maxYear = d3.max(dataset.map(function(d) {return d.year;}));
  var minYear = d3.min(dataset.map(function(d) {return d.year;}));

//Set the Tooltip Text

  var tooltipText = function(d) {
                    return "<strong> Year: " 
                    + d.x0 + "<br/> Movies Watched: " + d.length
                  };

  console.log('Drawing Timeline Histogram Plot')

  var x_year = d3.scaleLinear()
        .domain([minYear, maxYear])
        .range([0, w]);

  console.log("Years",x_year);

  //SVG and DOM tags for Ratings Div
  var timelineSvg = d3.select("#time-bars") //select svg element by id
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom+15)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Call the tip


  var yearMap = dataset.map(function(d){return d.year;});
  console.log("Year Map", yearMap);

  const thresholds = d3.range(minYear, maxYear+1, 1); 
  console.log("thresholds", thresholds);
  var timelineBins = d3.histogram()
                      .thresholds(thresholds)
                    (yearMap);

  var yTimeline = d3.scaleLinear()
    .domain([0, d3.max(timelineBins, function(d) { return d.length; })])
    .range([h, 0]);

  console.log("bin widths: " , timelineBins);
  console.log(x_year(1939));
  console.log(x_year(2017));

  var bar = timelineSvg.selectAll(".timebars")
    .data(timelineBins)
    .enter().append("g")
    .attr("class", "timebars")
    .attr("transform", function(d) { return "translate(" + x_year(d.x0) + "," + yTimeline(d.length) + ")"; });
    


  bar.append("rect")
      .attr("x", 1)
      .attr("width", x_year(timelineBins[0].x1) - x_year(timelineBins[0].x0) - 1)
      .attr("height", function(d) { return h - yTimeline(d.length); })
      .attr("fill","steelblue")
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


// bar.append("text")
//     .attr("dy", ".75em")
//     .attr("y", 6)
//     .attr("x", (x_year(timelineBins[0].x1) - x_year(timelineBins[0].x0)) / 2)
//     .attr("text-anchor", "middle")
//     .text(function(d) { return formatCount(d.length); });

timelineSvg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + h + ")")
    .call(d3.axisBottom(x_year).tickFormat(d3.format("d")));

timelineSvg.append("g")
    .attr("class", "axis axis--y")
     // .attr("transform", "translate("+ w  + ", 0 )")
    .call(d3.axisLeft(yTimeline));


} //End Draw Vis


/*
		 CODE FOR FILTERS 
		 [NOT REWORKED fOR MOVIES]
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
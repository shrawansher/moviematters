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
	drawAllVis(dataset);

}); //end d3.csv



/*
		 DATA ACCESSOR FUNCTIONS
		 Functions to quickly get value of important columns for Scales, Axes
*/          

var title = function(d) {return d['title']};
var year = function (d) {return d['imdb_startYear']} ;
var my_genre = function (d) {return d['genre']};
var my_rating = function (d) {return d['my_rating']};
var imdb_rating = function (d) {return d['imdb_rating']};
var runtime = function (d) {return d['runtime']};
var revenue = function (d) {return d['revenue']};



/*
		 SCALES, AXES, TOOLTIPS and DOM ELEMENTS
none of these depend on the data being loaded so fine to define here

*/          

// TOOLTIPS ! 
//Currently only 1 tooltip
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);



//SCALES For Timeline Div

//SVG and DOM tags for Timeline Div


//SCALES for Genre Div

//SVG and DOM tags for Genre Div


//SCALES for Ratings Div
function createNumericScale(dataset, col, pixelRange){
	//To create Linear Scales for Quantitative Columns 
	//(E.g. year, imdb rating, my rating) 

	var colValue = function(d){return d[col];}

	var extent = d3.extent(dataset, colValue);

  	var scale = d3.scaleLinear()
    	.domain(extent)
    	.range(pixelRange);
    
    return scale; //scale function
}



//SVG and DOM tags for Ratings Div
function createSVGChartAndAxes(selectString, xScale, yScale, xLabel, yLabel)
{
	var chart = d3.select(selectString) //select svg element by id, class
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom+15)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    chart.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + h + ")")
      .call(d3.axisBottom(xScale))
     .append("text")
      .attr("x", w)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text(xLabel);

	chart.append("g")
	 .attr("class", "y-axis")
     .call(d3.axisLeft(yScale))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(yLabel);

    return chart;
}



var ratingchart;

/*
		DRAW VISUALIZATIONS
		Function Definitions to draw the graphs and charts on screen
*/          


function drawAllVis(dataset){
	//Calls all individual drawVis functions for each chart/graph

	drawRatingYearVis(dataset);
	// Add more functions here
}


function drawRatingYearVis(dataset) { 

  	console.log('Drawing Scatter Plot: Rating vs Year')

  	//Set the Tooltip Text
  	var tooltipText = function(d) {
  									return "<strong>" + d.title + "</strong> ("  + d.year + ") <br/> My Rating " 
  									+ d.my_rating + "<br/> IMDB Rating: " + d.imdb_rating
  								};

  	//Create Scales (Dynamically)
  	x_col = "year"
  	y_col = "my_rating"

  	var rating_xScale = createNumericScale(dataset, x_col, [0,w]);
	var rating_yScale = createNumericScale(dataset, y_col, [h,0]);

	var x = function(d) {return rating_xScale(d[x_col]);} //accessor function
	var y = function(d) {return rating_yScale(d[y_col]);} //accessor function

	//Create SVG Chart And AXES if needed (Runs only during initial)
	if (typeof ratingchart == 'undefined')
	{	ratingchart = createSVGChartAndAxes("#rating-years", rating_xScale, rating_yScale, "Year", "My Rating");
		console.log("Created Rating Chart: ", ratingchart);
	}

  	//draw the circles initially and on each interaction with a control
	var circle = ratingchart.selectAll(".rating-circle")
	   .data(dataset);


  	console.log('Update')
	circle
    	  .attr("cx", x)
    	  .attr("cy", y)
    	  .attr("class", ".rating-circle")
    	  .style("opacity", 0.2)
     	 // .style("fill", function(d) { return col(d.type); })
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

	console.log('Exit')
	circle.exit().remove();

    console.log('Enter')
	circle.enter().append("circle")
    	  .attr("cx", x)
    	  .attr("cy", y)
    	  .attr("r", 4)
    	  .style("stroke", "black")
     	  //.style("fill", function(d) { return col(d.type); })
    	  .style("opacity", 0.2)
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
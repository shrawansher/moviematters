console.log("WELCOME TO MOVIE MATTERS");

/*
     GLOBAL LAYOUT CONSTANTS
*/
var width = 750;
var height = 450;
var margin = { top: 20, right: 15, bottom: 30, left: 50 };

var w = width - margin.left - margin.right;
var h = height - margin.top - margin.bottom;


/*
    GLOBAL DATA-RELATED VARIABLES
    Useful to access variables and data for scales and viz
*/
var dataset;

var maxYear;
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
film_id       title   cast        my_title  
my_rating     budget    id          imdb_id   
original_language overview  poster_path     revenue   
runtime       votes   imdb_rating     year  
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
        maxYear = d3.max(dataset.map(function(d) { return d.year; }));
        maxRating = d3.max(dataset.map(function(d) { return d['my_rating']; }));
        maxRuntime = d3.max(dataset.map(function(d) { return d['runtime']; }));
        maxImdbRating = d3.max(dataset.map(function(d) { return d['imdb_rating']; }));
        maxReveue = d3.max(dataset.map(function(d) { return d['revenue']; }));
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

var title = function(d) { return d['title'] };
var year = function(d) { return d['imdb_startYear'] };
var my_genre = function(d) { return d['genre'] };
var my_rating = function(d) { return d['my_rating'] };
var imdb_rating = function(d) { return d['imdb_rating'] };
var runtime = function(d) { return d['runtime'] };
var revenue = function(d) { return d['revenue'] };
var key = function(d) { return d['film_id'] };


/*
     SCALES, AXES, TOOLTIPS and DOM ELEMENTS
none of these depend on the data being loaded so fine to define here

*/

// TOOLTIPS ! 
//Currently only 1 tooltip
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var formatCount = d3.format(",.0f");



//SCALES For Timeline Div

//SVG and DOM tags for Timeline Div


//SCALES for Genre Div

//SVG and DOM tags for Genre Div


//SVG and DOM tags for Ratings Div
function createSVGChart(selectString) {
    var chart = d3.select(selectString) //select svg element by id, class
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom + 15)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    return chart;
}

function createAxesDOM(chart, idLabel, xLabel, yLabel) {
    g1 = chart.append("g")
        .attr("class", "x axis " + idLabel) //Keep space between x axis and label
        .attr("transform", "translate(0," + h + ")");

    g2 = chart.append("g")
        .attr("class", "y axis " + idLabel); //Keep space between x axis and label

    //Label the axes
    g1.append("text")
        .attr("x", w)
        .attr("y", -6)
        .style("text-anchor", "end")
        .style("z-index", "3")
        .text(xLabel);


    g2.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("z-index", "3")
        .text(yLabel);
}


//SCALES for Ratings Div
function createNumericScale(dataset, col, pixelRange) {
    //To create Linear Scales for Quantitative Columns 
    //(E.g. year, imdb rating, my rating) 

    var colValue = function(d) { return d[col]; }

    var extent = d3.extent(dataset, colValue);

    var scale = d3.scaleLinear()
        .domain(extent)
        .range(pixelRange);

    return scale; //scale function
}

// function createD3Axes(chart, xScale, yScale, xTicks, yTicks) {
//     var xAxis = d3.axisBottom().scale(xScale);
//     var yAxis = d3.axisLeft().scale(yScale);
//     return [xAxis, yAxis];
// }


/*
    DRAW VISUALIZATIONS
    Function Definitions to draw the graphs and charts on screen
*/


function drawAllVis(dataset) {
    //Calls all individual drawVis functions for each chart/graph

    drawRatingYearVis(dataset);
    drawTimelineVis(dataset);
    // Add more functions here
}
function createTimelineAxesDOM(chart,idLabel){
  chart.append("g")
      .attr("class", "x axis " + idLabel)
      .attr("transform", "translate(0," + h + ")")
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d){
          return "rotate(-65)";
        });

  chart.append("g")
        .attr("class", "y axis " + idLabel);
}




// Ratings View: VARIABLES and FUNCTIONS
var ratingchart;

function drawRatingYearVis(dataset) {

    console.log('Drawing Scatter Plot: Rating vs Year')

    //Set the Tooltip Text
    var tooltipText = function(d) {
        return "<strong>" + d.title + "</strong> (" + d.year + ") <br/> My Rating: " +
            d.my_rating + "<br/> IMDB Rating: " + d.imdb_rating
    };


    idLabel = "rating-year" //label to identify class of axes for this chart

    //Labels for Axes 
    xLabel = "Year"
    yLabel = "My Rating"


    //Create SVG Chart And Axes Group DOM if needed (Runs only once during initial load)
    if (typeof ratingchart == 'undefined') {
        ratingchart = createSVGChart("#rating-years");
        console.log("Created Rating Chart: ", ratingchart);

        createAxesDOM(ratingchart, idLabel, xLabel, yLabel);
        console.log("Created Rating Chart Axes DOM");
    }


    //Create Scales (Dynamically)
    x_col = "year"
    y_col = "my_rating"

    var rating_xScale = createNumericScale(dataset, x_col, [0, w]);
    var rating_yScale = createNumericScale(dataset, y_col, [h, 0]);

    var x = function(d) { return rating_xScale(d[x_col]); }
    var y = function(d) { return rating_yScale(d[y_col]); }

    //Create xAxis, yAxis d3 axes with ticks (Dynamically)
    //axes= createD3Axes(ratingchart, rating_xScale, rating_yScale, 10, 10);
    //rating_x_axis = axes[0];
    //rating_y_axis = axes[1];    

    var xAxis = d3.axisBottom().scale(rating_xScale);
    var yAxis = d3.axisLeft().scale(rating_yScale);


    //REDRAW axes Dynamically
    g1 = d3.select(".x.axis." + idLabel)
        .call(xAxis.tickFormat(d3.format("d")));

    g2 = d3.select(".y.axis." + idLabel)
        .call(yAxis);


    //REDRAW CIRCLES

    //draw the circles initially and on each interaction with a control
    var circle = ratingchart.selectAll(".rating-circle")
        .data(dataset, key);


    //console.log('Update')
    circle
        .attr("cx", x)
        .attr("cy", y)
        .style("opacity", 0.2)
        // .style("fill", function(d) { return col(d.type); })
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(100)
                .style("opacity", .9);
            tooltip.html(tooltipText(d))
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    //console.log('Exit')
    circle.exit().remove();

    //console.log('Enter')
    circle.enter().append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 4)
        .attr("class", "rating-circle")
        .style("stroke", "black")
        //.style("fill", function(d) { return col(d.type); })
        .style("opacity", 0.2)
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(100)
                .style("opacity", .9);
            tooltip.html(tooltipText(d))
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

} //End Draw Vis

/* ---------TIMELINE VIS--------
 */
var timelineSvg;

function drawTimelineVis(dataset) {
  // Year Ranges
    var maxYear = d3.max(dataset.map(function(d) { return d.year; }));
    var minYear = d3.min(dataset.map(function(d) { return d.year; }));

    console.log("Min Year", minYear);
    console.log("Max Year", maxYear);

    // ID Label for the axes
    var idLabel = "timeline";

    //Set the Tooltip Text
    var tooltipText = function(d) {
        return "<strong> Year: " +
            d.x0 + "<br/> Movies Watched: " + d.length
    };

    console.log('Drawing Timeline Histogram Plot')

    // X-Scale Function
    //----EXPERIMENTAL
    // var xChart = d3.scaleBand()
    //     .range([0, w]);
    // var yChart = d3.scaleLinear()
    //     .range([h, 0]);

    // var xAxis = d3.axisBottom(xChart);
    // var yAxis = d3.axisLeft(yChart);



    var x_year = d3.scaleLinear()
        .domain([minYear, maxYear])
        .range([0, w]);


    var barWidth = w/dataset.length;
    // console.log("Years", x_year);
    
    //Create SVG Chart And Axes Group DOM if needed (Runs only once during initial load)
    if (typeof timelineSvg == 'undefined') {
         timelineSvg = createSVGChart("#time-bars");
         console.log("Created Timeline Chart: ", timelineSvg);

         createTimelineAxesDOM(timelineSvg, idLabel);
         console.log("Created Timeline Chart Axes DOM");
    }

    //SVG and DOM tags for Ratings Div
    // var timelineSvg = d3.select("#time-bars") //select svg element by id
    //     .attr("width", w + margin.left + margin.right)
    //     .attr("height", h + margin.top + margin.bottom + 15)
    //     .append("g")
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // Create the Year Array
    var yearMap = dataset.map(function(d) { return d.year; });
    console.log("Year Map", yearMap);

    // Set the Bins
    const thresholds = d3.range(minYear, maxYear + 1, 1);
    console.log("thresholds", thresholds);
    var timelineBins = d3.histogram()
        .thresholds(thresholds)
        (yearMap);

    // Yscale function
    var yTimeline = d3.scaleLinear()
        .domain([0, d3.max(timelineBins, function(d) { return d.length; })])
        .range([h, 0]);

    console.log("bins: ", timelineBins);
    console.log(x_year(1939));
    console.log(x_year(2017));
    //Map the timeline chart group to all the data points

    var bar = timelineSvg.selectAll(".timebars")
        .remove().exit()
        .data(timelineBins);

    console.log("bars" ,bar);

    bar.enter().append("rect")
        .attr("class","timebars")
        .attr("x", function(d){ return x_year(d.x1)})
        .attr("y",function(d){return yTimeline(d.length)})
        // .attr("width", x_year(timelineBins[0].x1) - x_year(timelineBins[0].x0) - 1)
        .attr("width", barWidth)
        .attr("height", function(d) { return h - yTimeline(d.length); })
        .attr("fill", "steelblue")
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(tooltipText(d))
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");

        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });


      


    // bar.enter().append("g")
    //     .attr("class", "timebars")
    //     .attr("transform", function(d) { return "translate(" + x_year(d.x0) + "," + yTimeline(d.length) + ")"; });


   
    // // Insert bars
    // bar.append("rect")
    //     .attr("x", 1)
    //     .attr("width", x_year(timelineBins[0].x1) - x_year(timelineBins[0].x0) - 1)
    //     .attr("height", function(d) { return h - yTimeline(d.length); })
    //     .attr("fill", "steelblue")
    //     .on("mouseover", function(d) {
    //         tooltip.transition()
    //             .duration(200)
    //             .style("opacity", .9);
    //         tooltip.html(tooltipText(d))
    //             .style("left", (d3.event.pageX + 5) + "px")
    //             .style("top", (d3.event.pageY - 28) + "px");

    //     })
    //     .on("mouseout", function(d) {
    //         tooltip.transition()
    //             .duration(500)
    //             .style("opacity", 0);
    //     });



    console.log("TimeLine SVG", timelineSvg.select(".x.axis."+idLabel));
    
 

    // timelineSvg.append("g")
    //     .attr("class", "axis axis--x")
    //     .attr("transform", "translate(0," + h + ")")
    timelineSvg.select(".x.axis."+idLabel)
                  .call(d3.axisBottom(x_year)
                    .tickFormat(d3.format("d")));


        // .attr("transform", "translate("+ w  + ", 0 )")
    timelineSvg.select(".y.axis."+idLabel)
              .call(d3.axisLeft(yTimeline));


}

/*
     CODE FOR FILTERS 
     [NOT REWORKED fOR MOVIES]
     Functions to redraw graphs on filter selections 
*/

//Code to Combine Filter Selections

var filters;

var yearSelected;
var genresSelected;
filters = {
    yearSelected: 10,
    genresSelected: 10

}

/*
var filterDefaults = {
  var typeSelected = "all";
  var volSelected = [0,1200]; }
*/

function filterCriteria(d) {
    var res = patt.test(mtype); //boolean

    return d["type"] == typeSelected;
}

function filterType(mtype) {
    console.log("Passed Value to DropDown:", mtype);
    var res = patt.test(mtype); //boolean
    console.log("Is all selected ?", res);

    typeSelected = mtype;

    if (res == true) //All selected
    {
        drawVis(dataset); //reset to all images
    } else {
        var filteredDataset = dataset.filter(function(d) { return d["type"] == mtype; });
        drawVis(filteredDataset);
    }

} //End Filter Type


$(function() {
    console.log("Inside Slider Handler");

    $("#yearslider").slider({
        range: true,
        min: 1939,
        max: 2017,
        values: [1939, 2017],
        slide: function(event, ui) {
            $("#yeartext").val(ui.values[0] + " to " + ui.values[1]);
            filterYear(ui.values);
        } //end slide function
    }); //end slider

    $("#yeartext").val($("#yearslider").slider("values", 0) + " - " + $("#yearslider").slider("values", 1));
}); //end function



function filterYear(yearRange) {

    yearsSelected = yearRange;

    console.log('Filter Year', yearRange);
    var filteredDataset = dataset.filter(function(d) { return d.year >= yearRange[0] && d.year <= yearRange[1] });

    drawAllVis(filteredDataset);
} //End Filter Volume



console.log('End of JS File');
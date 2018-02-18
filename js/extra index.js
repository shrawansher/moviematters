console.log("WELCOME TO MOVIE MATTERS");

/*
     GLOBAL LAYOUT CONSTANTS
*/
var width = 1000;
var height = 450;
var margin = { top: 20, right: 15, bottom: 30, left: 50 };

var w = width - margin.left - margin.right;
var h = height - margin.top - margin.bottom;


/*
    GLOBAL DATA-RELATED VARIABLES
    Useful to access variables and data for scales and viz
*/
var dataset;

var avgImdbRating;
var avgMyRating;

var yearExtent;
var runtimeExtent;
var revenueExtent;

var countRecords;

var genres;
var genresSelected={};

var maxCount;
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
            d.runtime = +d.runtime;
            d.votes = +d.votes;
            d.imdb_rating = +d.imdb_rating;
            d.year = +d.year;
        });

        //dataset is the full dataset -- maintain a copy of this at all times
        dataset = movies;

        //max of different variables for sliders
//        maxYear = d3.max(dataset.map(function(d) { return d.year; }));
//        maxRuntime = d3.max(dataset.map(function(d) { return d['runtime']; }));
//        maxRevenue = d3.max(dataset.map(function(d) { return d['revenue']; }));

        countRecords = dataset.length;
        genres = [...new Set(dataset.map(function(d){return d.genre;}))];
        console.log("Genres",genres);
        genres.sort();
        console.log("Sorted Genres",genres);


        avgMyRating = d3.mean(dataset.map(function(d) { return d['my_rating']; }));
        avgImdbRating = d3.mean(dataset.map(function(d) { return d['imdb_rating']; }));

        avgMyRating = +avgMyRating.toFixed(2); //Round to 2 decimals
        avgImdbRating = +avgImdbRating.toFixed(2); //Round to 2 decimals

        yearExtent = d3.max(dataset.map(function(d) { return d.year; }));
        runtimeExtent = d3.extent(dataset.map(function(d) { return d['runtime']; }));
        revenueExtent = d3.extent(dataset.map(function(d) {return d['revenue']; }));

        console.log('Details of Dataset');
        console.log('# Records: ', dataset.length);
//        console.log('Max Year : ', maxYear);
//        console.log('Max Runtime : ', maxRuntime);
//        console.log('Max Revenue : ', maxRevenue);

        console.log('Avg My Rating : ', avgMyRating);
        console.log('Avg IMDB Rating : ', avgImdbRating);

        console.log('Extent Year : ', runtimeExtent);
        console.log('Extent Runtime : ', yearExtent);
        console.log('Extent Revenue : ', revenueExtent);

        console.log("Genre List",genres);

        for(i=0;i<genres.length;i++){
            genresSelected[genres[i]] = true;

        }

        console.log("GENRE SELECTED",genresSelected);

        //all the data is now loaded, so draw the initial vis
        //console.log('Drawing Initial Visualizations')

        drawGenreFilter(dataset);
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
console.log("Created Tooltip");
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var formatCount = d3.format(",.0f");

// For Multi Select

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
    console.log("SVG Width",w);

    return chart;
}

function createAxesDOM(chart, idLabel, xLabel, yLabel) {
    // g1 = chart.append("g")
    //     .attr("class", "x axis " + idLabel) //Keep space between x axis and label
    //     .attr("transform", "translate(0," + h + ")")
    //     .style("text-anchor", "end")
    //     .attr("dx", "-.8em")
    //     .attr("dy", ".15em");
   chart.append("g")
      .attr("class", "x axis " + idLabel)
      .attr("transform", "translate(0," + h + ")")
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d){
          return "rotate(-65)";
        })
    // text label for the x axis
      chart.append("text")             
          .attr("transform",
                "translate(" + (w/2) + " ," + 
                               (h + 40) + ")")
          .style("text-anchor", "middle")
          .text(xLabel);

    chart.append("g")
        .attr("class", "y axis " + idLabel) //Keep space between x axis and label
     chart.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text(yLabel);
}
    //Label the axes
    // g1.append("text")
    //     .attr("x", w)
    //     .attr("y", -6)
    //     .style("text-anchor", "end")
    //     .style("z-index", "3")
        // .text(xLabel);
  // g1.append("text")             
  //     .attr("transform",
  //           "translate(" + (w/2) + " ," + 
  //                          0+ ")")
  //     .style("text-anchor", "middle")
  //     .text(xLabel);


        

//SCALES for Ratings Div
function createNumericScale(dataset, col, pixelRange) {
    //To create Linear Scales for Quantitative Columns 
    //(E.g. year, imdb rating, my rating) 

    var colValue = function(d) { return d[col]; }

    var extent = d3.extent(dataset, colValue);
    var colspan = extent[1] -extent[0];

    var scale = d3.scaleLinear()
        .domain([extent[0] - (colspan * .05), extent[1] + (colspan * .05)]) //Prevent data points from touching axes
        .range(pixelRange);

    return scale; //scale function
}

//SCALES for Ordinal Div
function createOrdinalScale(dataset, col, pixelRange) {
    //To create Ordinal Scales for Quantitative Columns 
    //(E.g. year) 

    // var colValue = function(d) { return d[col]; }

    console.log("Band 1939", col);
    var colValue = function(d) { return d[col]; }

    var extent = d3.extent(dataset, colValue);
    console.log("Extent",extent);
    // var keys = [ ...new Set(dataset.map(function(d){return d[col];}))];
    // keys.sort();
    var keys = d3.range(extent[0],extent[1]+1,1);
    console.log("Keys",keys);
    var scale = d3.scaleBand()
        .domain(keys) //Prevent data points from touching axes
        .range(pixelRange)
        .padding(0.1)

    console.log("Band 1939", scale(1939));

    return scale; //scale function
}
/*
    DRAW VISUALIZATIONS
    Function Definitions to draw the graphs and charts on screen
*/

function drawAllVis(dataset) {
    //Calls all individual drawVis functions for each chart/graph

    // drawRatingYearVis(dataset);
    drawGraph(dataset);
    drawTimelineVis(dataset);
    // Add more functions here
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

    var x = createNumericScale(dataset, x_col, [0, w]); // Data-dependent year scale
    var y = d3.scaleLinear().domain([0,10]).range([h, 0]); //FIXED Rating Scale from 0 to 10

    // var x = function(d) { return rating_xScale(d[x_col]); }
    // var y = function(d) { return rating_yScale(d[y_col]); }

    var colour = d3.scaleOrdinal()
    .domain(d3.map(dataset, function(d){return d.genre;}).keys())
    .range(d3.schemeCategory20);
          
    //Create xAxis, yAxis d3 axes with ticks (Dynamically)
    //axes= createD3Axes(ratingchart, rating_xScale, rating_yScale, 10, 10);

    var xAxis = d3.axisBottom().scale(x);
    var yAxis = d3.axisLeft().scale(y);


    //REDRAW axes Dynamically
    g1 = d3.select(".x.axis." + idLabel)
        .call(xAxis.tickFormat(d3.format("d")));

    g2 = d3.select(".y.axis." + idLabel)
        .call(yAxis);


    var radius = 2.5;
    var padding = 1;

    //ADD FORCE
    var simulation = d3.forceSimulation(dataset)
      .force("charge", d3.forceManyBody().strength(-10))
      .force("x", d3.forceX(function(d) {return x(d[x_col]);}).strength(0.5))
      .force("y", d3.forceY(function(d) {return y(d[y_col]);}).strength(0.1))
      .force("collide", d3.forceCollide(4).strength(0.7).iterations(4))
      .stop();

    console.log(simulation)

    console.log("Adding the force");
    for (var i = 0; i < 5; ++i) 
        simulation.tick();

    //REDRAW CIRCLES

    //draw the circles initially and on each interaction with a control
    var circle = ratingchart.selectAll(".rating-circle")
        .data(dataset, key);

    var t = d3.transition().duration(300);


    //console.log('Update')
    circle
        .attr("cx", function(d) {return x(d[x_col]);})
        .attr("cy", function(d) {return y(d[y_col]);})
        .style("opacity", 1)
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
                .duration(300)
                .style("opacity", 0);
        });

    //console.log('Exit')
    circle.exit()
        .attr("class", "rating-circle exit")
        .transition(t)
          .style("fill-opacity", 1e-6)  //exit transition
          .remove();

    //console.log('Enter')
    circle.enter().append("circle")
        .attr("class", "rating-circle enter")
        .attr("cx", function(d) {return x(d[x_col]);})
        .attr("cy", function(d) {return y(d[y_col]);})
        .attr("r", radius)
        .style("fill", function(d) { return colour(d.genre); })      
        //.style("stroke", "black")
        .style("opacity", 1)
        .on("mouseover", function(d) {
            // d3.select(this)
            // .transition()
            // .duration(500)
            // .attr("r", 3)
            tooltip.transition()
                .duration(100)
                .style("opacity", .9);
            tooltip.html(tooltipText(d))
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(300)
                .style("opacity", 0);

            // d3.select(this)
            // .transition()
            // .duration(100)
            // .style("fill-opacity", 1)
            // .attr("r", 4)
        })
        // .style("fill-opacity", 1e-6)    //enter transition
        // .transition(t)
        // .style("fill-opacity", 0.2)
        
} //End Draw Vis





function drawGraph(fullData){  

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
       // ratingchart = createSVGChart("#rating-years");
        var ratingchart = d3.select("#rating-years")//.append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        console.log("Created Rating Chart: ", ratingchart);

        createAxesDOM(ratingchart, idLabel, xLabel, yLabel);
        console.log("Created Rating Chart Axes DOM");
    }


    //Create Scales (Dynamically)
    x_col = "year"
    y_col = "my_rating"


    var x = createNumericScale(dataset, x_col, [0, w]); // Data-dependent year scale
    var y = d3.scaleLinear().domain([0,10]).range([h, 0]); //FIXED Rating Scale from 0 to 10

    var colour = d3.scaleOrdinal()
    .domain(d3.map(dataset, function(d){return d.genre;}).keys())
    .range(d3.schemeCategory20);
          

    // var xAxis = d3.axisBottom().scale(x);
    // var yAxis = d3.axisLeft().scale(y);

    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);


    //REDRAW axes Dynamically
    g1 = d3.select(".x.axis." + idLabel)
        .call(xAxis.tickFormat(d3.format("d")));

    g2 = d3.select(".y.axis." + idLabel)
        .call(yAxis);

    // var clip = ratingchart.append("defs").append("svg:clipPath")
    // .attr("id", "clip")
    // .append("svg:rect")
    // .attr("width", width )
    // .attr("height", height )
    // .attr("x", 0) 
    // .attr("y", 0)
    // .attr(""); 

    var scatter = ratingchart.append("g")
    .attr("id", "scatterplot");

    // x axis
    // ratingchart.append("g")
    //   .attr("class", "x axis")
    //   .attr('id', "axis--x")
    //   .attr("transform", "translate(0," + height + ")")
    //   .call(xAxis)
    //   .selectAll("text")    
    //   .style("text-anchor", "end")
    //   .attr("dx", "-.8em")
    //   .attr("dy", ".15em")
    //   .attr("transform", "rotate(-65)");

    
    // ratingchart.append("text")
    //      .style("text-anchor", "end")
    //         .attr("x", width)
    //         .attr("y", height - 8)
    //      .text("Year");

    // y axis
    // ratingchart.append("g")
    //   .attr("class", "y axis")
    //   .attr('id', "axis--y")
    //   .call(yAxis);
    
    // ratingchart.append("text")
    //   .attr("transform", "rotate(-90)")
    //   .attr("y", 6)
    //   .attr("dy", "1em")
    //   .style("text-anchor", "end")
    //   .text("My Rating");
  
        var simulation = d3.forceSimulation(fullData)
      .force("x", d3.forceX(function(d) { return x(d.year); }))
      .force("y", d3.forceY(function(d) { return y(d.my_rating); }))
      .force("collide", d3.forceCollide(4)
                .strength(0.1)
                    .iterations(2))
      .stop();

    // console.log(fullData[0]);
    for (var i = 0; i < 10; ++i) simulation.tick();

    // scatter.selectAll(".dot")
    //   .data(fullData)
    //   .enter().append("circle")
    //   .attr("class", "dot")
    //   .attr("r", 2.5)
    //   .attr("cx", function(d) { return d.x })
    //   .attr("cy", function(d) { return d.y; })
    //   .attr("opacity", 0.7)
    //   .style("fill", function(d) { return colour(d.genre); })
    //     .on("mouseover", function(d) {
    //          tooltip.transition()
    //            .duration(200)
    //            .style("opacity", .9);
    //          tooltip.html(d.my_title + " (" + d.year + ")<br/>" + d.my_rating)
    //            .style("left", (d3.event.pageX) + "px")
    //            .style("top", (d3.event.pageY - 28) + "px");
                
    //        })
    //        .on("mouseout", function(d) {
    //          tooltip.transition()
    //            .duration(500)
    //            .style("opacity", 0);
    //        });

    //draw the circles initially and on each interaction with a control
    var circle = scatter.selectAll(".rating-circle")
        .data(dataset, key);

    var radius = 2.5;

    var t = d3.transition().duration(300);

    //console.log('Enter')
    circle.enter().append("circle")
        .attr("class", "rating-circle enter")
        .attr("cx", function(d) {return x(d[x_col]);})
        .attr("cy", function(d) {return y(d[y_col]);})
        .attr("r", radius)
        .style("fill", function(d) { return colour(d.genre); })      
        .style("opacity", 1)
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(100)
                .style("opacity", .9);
            tooltip.html(tooltipText(d))
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(400)
                .style("opacity", 0);
        })


    //console.log('Update')
    circle
        .attr("cx", function(d) {return x(d[x_col]);})
        .attr("cy", function(d) {return y(d[y_col]);})
        .attr("r", radius)
        .style("fill", function(d) { return colour(d.genre); })      
        .style("opacity", 1)
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
                .duration(400)
                .style("opacity", 0);
        });

    //console.log('Exit')
    circle.exit()
        .attr("class", "rating-circle exit")
        .transition(t)
          .duration(300)
          .style("fill-opacity", 1e-6)  //exit transition
          .remove();




}


/* ---------TIMELINE VIS--------*/



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
    // text label for the x axis
  chart.append("text")             
      .attr("transform",
            "translate(" + (w/2) + " ," + 
                           (h + 40) + ")")
      .style("text-anchor", "middle")
      .text("Year");

  chart.append("g")
        .attr("class", "y axis " + idLabel);
  console.log("CHarty", chart);
}


var timelineSvg;


function drawTimelineVis(dataset) {

    var x_col = "year";

    // ID Label for the axes
    var idLabel = "time-bar";

    // Year Ranges
    var maxYear = d3.max(dataset.map(function(d) { return d.year; }));
    var minYear = d3.min(dataset.map(function(d) { return d.year; }));

    console.log("Min Year", minYear);
    console.log("Max Year", maxYear);

    
    //Set the Tooltip Text
    var tooltipText = function(d) {
        return "<strong> Year: " +
            d.x0 + "<br/> Movies Watched: " + d.length
    };

    console.log('Drawing Timeline Histogram Plot')

    // X-Scale Function
    var x_year = createNumericScale(dataset, x_col, [0, w]); // Data-dependent year scale
    
    //SVG and DOM tags for Ratings Div

    // Create the Year Array
    var yearMap = dataset.map(function(d) { return d.year; });
    console.log("Year Map", yearMap);

    // Set the Bins
    const thresholds = d3.range(minYear, maxYear + 1, 1);
    console.log("thresholds", thresholds);
    var timelineBins = d3.histogram()
        .thresholds(thresholds)
        (yearMap);

    //Create SVG Chart And Axes Group DOM if needed (Runs only once during initial load)
    if (typeof timelineSvg == 'undefined') {
         timelineSvg = createSVGChart("#time-bars");
         console.log("Created Timeline Chart: ", timelineSvg);

         createTimelineAxesDOM(timelineSvg, idLabel);
         console.log("Created Timeline Chart Axes DOM");

         maxCount = d3.max(timelineBins.map(function(d){ return d.length; }));
         console.log("Max count",maxCount);
    }

    // Yscale function
    var yTimeline = d3.scaleLinear()
        // .domain([0, d3.max(timelineBins, function(d) { return d.length; })])
        .domain([0,maxCount])
        .range([h, 0]);

    console.log("bins: ", timelineBins);
    console.log(x_year(1939));
    console.log(x_year(2017));
    //Map the timeline chart group to all the data points
    var barWidth = x_year(timelineBins[0].x0)/timelineBins.length ;
    console.log("BAR WIDTh", barWidth);

    var bar = timelineSvg.selectAll(".timeline")
                    .data(timelineBins,function(d) { return d.x0;});
     
        
    // bar.enter().append("g")
    //                 .attr("class","timeline");
    
    // bar.remove().exit();
        

    console.log("bars" ,bar);

    bar.exit()
        .transition()
        // .delay(1000)
        .ease(d3.easeExp)
        .duration(50)
        .remove();
        console.log("Bar after exit",bar);

    bar.on("mouseover", function(d) {
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
                    })

    bar.transition()
            .duration(300)
            .ease(d3.easeCubic)
            .attr("height", function(d) { return h - yTimeline(d.length); })
            .attr("x", function(d){ return x_year(d.x0);})
            .attr("y",function(d){return yTimeline(d.length);})
            // .attr("width",barWidth+1);
            .attr("width", x_year(timelineBins[0].x1) - x_year(timelineBins[0].x0) - 1)
          
            
                         


    bar.enter()
        .append("rect")
        .attr("class","timeline")
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
                            .style("opacity", 0)
                    })
        .transition()
            .duration(300)
            .ease(d3.easeExp)
        .attr("x", function(d){ 
            console.log(x_year(d.x0));
            return x_year(d.x0)})
        .attr("y",function(d){return yTimeline(d.length);})
        // .attr("width",barWidth)
        .attr("width", x_year(timelineBins[0].x1) - x_year(timelineBins[0].x0) - 1)
        //.attr("width", barWidth)
        .attr("height", function(d) { return h - yTimeline(d.length); })
        .attr("fill", "steelblue");



        // .transition()
        //     .duration(300)
        //     .ease(d3.easeExp);
     
     // bar.transition()
     //    .duration(300)
     //    .ease(d3.easeExp);

        // .on("mouseover", function(d) {
        //     tooltip.transition()
        //         .duration(200)
        //         .style("opacity", .9);
        //     tooltip.html(tooltipText(d))
        //         .style("left", (d3.event.pageX + 5) + "px")
        //         .style("top", (d3.event.pageY - 28) + "px");

        // })
        // .on("mouseout", function(d) {
        //     tooltip.transition()
        //         .duration(500)
        //         .style("opacity", 0);
        // });

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
        console.log("Creating y axis");


}

function drawGenreFilter(dataset){

    var color = d3.scaleOrdinal(d3.schemeCategory20).domain(genres);
    // console.log("Colors",color("SCI_FI"));
    console.log("Colors domain",color.domain());


    var legendSvg = d3.select("#genre-filter").append("g").attr("class","left-legend");

    var legend = legendSvg.selectAll(".legend")
                            .data(color.domain())
                            .enter().append("g")
                            .attr("class", function(d) { 
                             return  "sqbar " + "color-" + color(d).substring(1) + " legend"; })
                            .attr("transform", function(d, i) {
                             return "translate(0," + i * 20 + ")";
                                    })
                            .style("opacity",1);

    legend.append("rect")
                            .attr("x",3 )
                            .attr("width", 18)
                            .attr("height", 18)
                            .style("fill", color);
                                                        // .on("mouseover", function(d) {
                            // legendSvg.selectAll("rect.color-" + color(d).substring(1)).style("opacity", 0.5).attr("stroke-width","3");
                            //  })
                            // .on("mouseout", function(d) {
                            //     legendSvg.selectAll("rect.color-" + color(d).substring(1)).style("opacity",1).attr("stroke-width","0");
                            //  });
    legend.append("text")
        .attr("x", 26)
        .attr("dy", ".9em")
        .text(function(d) {
            return d;
        });


    legend.on("click", (function(d){
                        var y = "sqbar color-" + color(d).substring(1);
                        console.log("Class =" ,d);
                        genresSelected[d] = !genresSelected[d] ;
                        var opacity  = document.getElementsByClassName(y)[0].style.opacity;
                        console.log ("Old opacity =" + opacity);


                      
                        if (opacity === "1") {
                            console.log("Reducing opacity");
                            legendSvg.selectAll(".sqbar.color-" + color(d).substring(1)).style("opacity", "0.2");
                            //svg.selectAll(".rect.color-" + color(d).substring(1)).remove();
                        }
                        else{
                            legendSvg.selectAll(".sqbar.color-" + color(d).substring(1)).style("opacity", "1");
                            //svg.selectAll(".rect.color-" + color(d).substring(1)).d.enter().append();
                        }
       
                        opacity  = document.getElementsByClassName(y)[0].style.opacity;
                        console.log ("New opacity =" + opacity);
                        filterColumn("genresSelected",genresSelected);

                        
                }
                ));

}



/*
     CODE FOR FILTERS 
     Functions to redraw graphs on filter selections 
*/

//Store Current Filter Selections
var filters = {};


var subset_fn = function(d) { 
//SUBSET Function
//iterate over filters and return true or false for each data point d
//Used to create filtered dataset

    var res = true;
    if( typeof(filters.year) != 'undefined')
    {    res = res && d.year >= filters.year[0] && d.year <= filters.year[1]; }

    if( res!=false && typeof(filters.my_rating) != 'undefined')
    {    res = d.my_rating >= filters.my_rating[0] && d.my_rating <= filters.my_rating[1]; }

    if( res!=false && typeof(filters.runtime) != 'undefined')
    {    res = d.runtime >= filters.runtime[0] && d.runtime <= filters.runtime[1]; }
    
    if( res!= false && typeof(filters.genresSelected) != 'undefined'){
        res = genresSelected[d.genre];
    }

    if( res!=false && typeof(filters.ratingdifftype) != 'undefined' && filters.ratingdifftype!="all")
    {     if(filters.ratingdifftype == "underrated")
                res = (d.my_rating - d.imdb_rating >= 1.969); //95th percentile for significance 
          else res = (d.imdb_rating - d.my_rating >= 1.969); //95th percentile for significance 
    }

    return res;
}


function filterColumn(column, value){
// Function to store updated Range/ checkbox/dropdown value, re-filter data and redraw Visualizations
// Use for columns that filter based on Sliders Checkboxes and DropDowns

    filters[column] = value;
    console.log("Changed Filter for ", column, "\n value = ", value);

    var filteredDataset = dataset.filter(subset_fn);
    drawAllVis(filteredDataset);
}


/*
        UI CALLBACKS : RANGE SLIDERS, CHECKBOXES, DROPDOWNS
*/

// Range Slider for YEAR (Data based Range)
$(function() {
    console.log("Inside Year Slider Handler");

    $("#yearslider").slider({
        range: true,
        min: 1939,
        max: 2017,
        values: [1939, 2017],
        slide: function(event, ui) {
            $("#yeartext").val(ui.values[0] + " - " + ui.values[1]);
            filterColumn( "year", ui.values);
        } //end slide function
    }); //end slider

    $("#yeartext").val($("#yearslider").slider("values", 0) + " - " + $("#yearslider").slider("values", 1));
}); //end function


// Range Slider for MY RATING (Hard-coded 0-10 Range only)
$(function() {
    console.log("Inside My Rating Slider Handler");

    $("#myratingslider").slider({
        range: true,
        min: 0,
        max: 10,
        values: [0, 10],
        slide: function(event, ui) {
            $("#myratingtext").val(ui.values[0] + " - " + ui.values[1]);
            filterColumn( "my_rating", ui.values);
        } //end slide function
    }); //end slider

    $("#myratingtext").val($("#myratingslider").slider("values", 0) + " - " + $("#myratingslider").slider("values", 1));
}); //end function


// Range Slider for RUNTIME (Data-based Range)
$(function() {
    console.log("Inside Runtime Slider Handler");

    $("#runtimeslider").slider({
        range: true,
        min: 75,
        max: 238,
        values: [75, 238],
        slide: function(event, ui) {
            $("#runtimetext").val(ui.values[0] + " to " + ui.values[1]);
            filterColumn( "runtime", ui.values);
        } //end slide function
    }); //end slider

    $("#runtimetext").val($("#runtimeslider").slider("values", 0) + " - " + $("#runtimeslider").slider("values", 1));
}); //end function


console.log('End of JS File');
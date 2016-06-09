
var hist = function(data_in, chart_id, value, chart_title) {

  var margin = {
      "top": 30,
      "right": 30,
      "bottom": 50,
      "left": 30
    },
    width = 600 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  var x = d3.scale.linear()
    .domain([0, 1])
    .range([0, width]);

  var y = d3.scale.linear()
    .domain([
      d3.min(data_in, function(d) {
        return d.value[value];
      }) > 1000 ? 1850 : 0   , 
      d3.max(data_in, function(d) {
        return d.value[value];
      })
    ])
    .range([height, 0]);
  
  d3.select("#" + chart_id).remove();
  
  var div = d3.select("#slider_container").append("div").attr("id", chart_id);
  
  div.append("h2").text(chart_title);
  
  var svg = div.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar = svg.selectAll(".bar")
    .data(data_in)
    .enter()
    .append("g")
    .attr("class", "bar")
    .attr("transform", function(d, i) {
      return "translate(" + x(i / data_in.length) + "," + y(d.value[value]) + ")";
    });

  bar.append("rect")
    .attr("x", 1)
    .attr("width", width / data_in.length - 1)
    .attr("height", function(d) {
      return height - y(d.value[value]);
    });

  var formatCount = d3.format(",.0f");

  bar.append("text")
    .attr("dy", ".75em")
    .attr("y", 6)
    .attr("x", (width / data_in.length - 1) / 2)
    .attr("text-anchor", "middle")
    .text(function(d) {
      return formatCount(d.value[value]);
    });
  
  var unique_names = data_in.map(function(d) {
    return d.key;
  });

  var xScale = d3.scale.ordinal().domain(unique_names).rangePoints([0, width]);

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

  var xTicks = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("font-size", 10)
    .attr("transform", function(d) {
      return "rotate(-50)"
    });


  var yAxis = d3.svg.axis()
    .ticks(5)
    .scale(y)
    .orient("left");

  svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(yAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("font-size", 10);
}

d3.json("https://tranquil-peak-82564.herokuapp.com/api/v1.0/data/baseball/limit/100/",
  function(error, games_json) {

    var cf = crossfilter(games_json);
    var dim_ngames = cf.dimension(function(d){ return d.g_all;     });
    var dim_year = cf.dimension(function(d){ return d.year;     });
    var dim_team = cf.dimension(function(d){ return d.team_id;     });
    var dim_player = cf.dimension(function(d){ return d.player_id;     });    

    
    /* add more dimensions here */
    
    var group_team = dim_team.group();
    var group_ngames = dim_ngames.group();
    var group_year = dim_year.group();
    var group_player = dim_player.group();

    
    
    /* add more groups here */
     
    /* 
    // sanity check
    
    group_team
      .top(Infinity)
      .forEach(function(d, i) {
        console.log(JSON.stringify(d));
      });
      
    */
    
    /* --------------------------------------------------------- 
    
      Add a third and 4th variable to this map reduction
      - the third should be the minimum year
      - the fourth should be the maximum year
      - hint: use inequalities
      
    */
    
    var reduce_init = function() {
      return {
        "count": 0,
        "total": 0,
        "years": [],
        "min_year": -3000,
        "max_year": 3000,
      };
    }

    var reduce_add = function(p, v, nf) {
      ++p.count;
      p.total += v.g_all;
      p.years.push(v.year);
      p.years.sort();
      p.min_year = p.years[0];
      p.max_year = p.years[p.years.length-1];
      return p;
    }

    var reduce_remove = function(p, v, nf) {
      --p.count;
      p.total -= v.g_all;
      var index = p.years.indexOf(v.year);
      if (index > -1) {
        p.years.splice(index, 1);
      }
      p.min_year = p.years[0];
      p.max_year = p.years[p.years.length-1];
      return p;
    }
    
    /* --------------------------------------------------------- */
    
    
    group_team.reduce(reduce_add, reduce_remove, reduce_init);
    group_player.reduce(reduce_add, reduce_remove, reduce_init);

    
    
    /* reduce the more groups here */
    
    var render_plots = function(){
      // count refers to a specific key specified in reduce_init 
      // and updated in reduce_add and reduce_subtract
      // Modify this for the chart to plot the specified variable on the y-axis
     
      hist(group_team.top(Infinity), 
        "appearances_by_team", 
        "count", 
        "# of Appearances by Team"
      );
      
      /* build more charts here */
      
      
      hist(group_team.top(Infinity), 
        "total_appearances_by_team", 
        "total", 
        "total Appearances by Team"
      );
      
      hist(group_team.top(Infinity), 
        "earliest_year_by_team", 
        "min_year", 
        "earliest year of Appearances by Team"
      );  
      
      hist(group_team.top(Infinity), 
        "latest_year_by_team", 
        "max_year", 
        "latest year of Appearances by Team"
      );
    }
    
    
    /* --------------------------------------------------------- 
       this is a slider, see the html section above
    */
    var n_games_slider = new Slider(
      "#n_games_slider", {
        "id": "n_games_slider",
        "min": 0,
        "max": 100,
        "range": true,
        "value": [0, 100]
      });
      
    var n_games_slider2 = new Slider(
      "#n_games_slider2", {
        "id": "n_games_slider2",
        "min": 1850,
        "max": 1915,
        "range": true,
        "value": [1850, 1915]
      });
      
    var n_games_slider3 = new Slider(
      "#n_games_slider3", {
        "id": "n_games_slider3",
        "min": 0,
        "max": 100,
        "range": true,
        "value": [0, 100]
      });
      
    var n_games_slider4 = new Slider(
      "#n_games_slider4", {
        "id": "n_games_slider4",
        "min": 0,
        "max": 100,
        "range": true,
        "value": [0, 100]
      });
    
   
    // this is an event handler for a particular slider
    n_games_slider.on("slide", function(e) {
      d3.select("#n_games_slider_txt").text("min: " + e[0] + ", max: " + e[1]);
      
      // filter based on the UI element
      dim_ngames.filter(e);
   
      render_plots();
        
    });
    
    
    
    n_games_slider2.on("slide", function(e) {
      d3.select("#n_games_slider_txt2").text("min: " + e[0] + ", max: " + e[1]);
      
      // filter based on the UI element
      dim_year.filter(e);
   
      render_plots();
        
    });    
   
    
    n_games_slider3.on("slide", function(e) {
      d3.select("#n_games_slider_txt3").text("min: " + e[0] + ", max: " + e[1]);
      
      // filter based on the UI element
      dim_ngames.filter(e);
   
      render_plots();
        
    }); 
    
    
    n_games_slider4.on("slide", function(e) {
      d3.select("#n_games_slider_txt4").text("min: " + e[0] + ", max: " + e[1]);
      
      // filter based on the UI element
      dim_ngames.filter(e);
   
      render_plots();
        
    }); 
    
    
     /* add at least 3 more event handlers here */
     
     
     /* --------------------------------------------------------- */
     
     
     
     render_plots(); // this just renders the plots for the first time
    
  });
/* 

API returns entire iris dataset
http://tranquil-peak-82564.herokuapp.com/api/v1.0/data/iris/

API returns n=10 entries from dataset, useful for debugging
http://tranquil-peak-82564.herokuapp.com/api/v1.0/data/iris/limit/10/

data is in this format
{"sepal_length":5.1,"sepal_width":3.5,"petal_length":1.4,"petal_width":0.2,"species":"setosa"}

*/

// on load data {

  // crossfilter
  
  // dimensions for sepal_length, sepal_width, petal_length, petal_width, species
  
  // unique values for species (hint: underscore.js)

  // bar charts for sepal_length, sepal_width, petal_length, petal_width, species 

  // render
  
// } end load data


d3.json("https://tranquil-peak-82564.herokuapp.com/api/v1.0/data/iris/", function(remote_json){
  
  window.remote_json = remote_json;
  
  // crossfilter
  var cf            = crossfilter(remote_json);
  
  // dimension
  // round to the nearest .5
  var sepal_length  = cf.dimension(function(d){return Math.round(d.sepal_length * 2)/2; }); 
  var species       = cf.dimension(function(d){return d.species; });
  var petal_width  = cf.dimension(function(d){return Math.round(d.petal_width * 2)/2; }); 
  var sepal_width  = cf.dimension(function(d){return Math.round(d.sepal_width * 2)/2; }); 
  var petal_length  = cf.dimension(function(d){return Math.round(d.petal_length * 2)/2; }); 
  
  var sepal_length2  = cf.dimension(function(d){return Math.round(d.sepal_length ); }); 
  var petal_width2  = cf.dimension(function(d){return Math.round(d.petal_width); }); 
  var sepal_width2  = cf.dimension(function(d){return Math.round(d.sepal_width); }); 
  var petal_length2  = cf.dimension(function(d){return Math.round(d.petal_length); });   
  
 
  
  // groups
  var sepal_length_sum = sepal_length.group().reduceSum(function(d){ return d.sepal_length; });
  var species_sum      = species.group().reduceCount();
  
  var petal_width_sum = petal_width.group().reduceSum(function(d){ return d.petal_width; });
  var sepal_width_sum = sepal_width.group().reduceSum(function(d){ return d.sepal_width; });
  var petal_length_sum = petal_length.group().reduceSum(function(d){ return d.petal_length; });
  
  
  var sepal_length_sum2 = sepal_length2.group().reduceSum(function(d){ return d.sepal_length; });
  
  var petal_width_sum2 = petal_width2.group().reduceSum(function(d){ return d.petal_width; });
  var sepal_width_sum2 = sepal_width2.group().reduceSum(function(d){ return d.sepal_width; });
  var petal_length_sum2 = petal_length2.group().reduceSum(function(d){ return d.petal_length; });

  
  

  
  // !!!! 
  // remove this line, it is just here so you can see the result
  // you need to generate these names using the step below
  // if you leave this in, you will lose points
  //window.species_names = ["setosa", "versicolor", "virginica"];
  // !!!!
 

     window.species_names = _.chain(remote_json).pluck("species").uniq().value();
     

  
 
  var sepal_length_chart = dc
    .barChart("#sepal_length_chart","group1")
    .width(250)
    .height(200)
    .dimension(sepal_length)
    .group(sepal_length_sum)
    .centerBar(true)
    .x( d3.scale.linear().domain([3,10]) )
    .xUnits(dc.units.fp.precision(.5));
  
  var species_chart = dc
    .barChart("#species_chart","group1")
    .width(250)
    .height(200)
    .dimension(species)
    .group(species_sum)
    .centerBar(true)
    .x(d3.scale.ordinal().domain(species_names))
    .xUnits(dc.units.ordinal);
  
  
   var sepal_width_chart = dc
    .barChart("#sepal_width_chart","group1")
    .width(250)
    .height(200)
    .dimension(sepal_width)
    .group(sepal_width_sum)
    .centerBar(true)
    .x(d3.scale.linear().domain([1.5,5]))
    .xUnits(dc.units.fp.precision(.5));
   
   var petal_length_chart = dc
    .barChart("#petal_length_chart","group1")
    .width(250)
    .height(200)
    .dimension(petal_length)
    .group(petal_length_sum)
    .centerBar(true)
    .x(d3.scale.linear().domain([0,8]))
    .xUnits(dc.units.fp.precision(.5));
   
   var petal_width_chart = dc
    .barChart("#petal_width_chart","group1")
    .width(250)
    .height(200)
    .dimension(petal_width)
    .group(petal_width_sum)
    .centerBar(true)
    .x(d3.scale.linear().domain([0,3]))
    .xUnits(dc.units.fp.precision(.5));
    
    
   var sepal_length_pie = dc.pieChart("#sepal_length_pie","group1")
    .width(250)
    .height(200)
    .radius(100)
    .innerRadius(50)
    .dimension(sepal_length2)
    .group(sepal_length_sum2)
    .renderLabel(true)
    .label(function (d) { return (d.data.key + "-" + (d.data.key+1)); });    
  
  
   var sepal_width_pie = dc.pieChart("#sepal_width_pie","group1")
    .width(250)
    .height(200)
    .radius(100)
    .innerRadius(50)
    .dimension(sepal_width2)
    .group(sepal_width_sum2)
    .renderLabel(true)
    .label(function (d) { return (d.data.key + "-" + (d.data.key+1)); }); 
    
   var petal_length_pie = dc.pieChart("#petal_length_pie","group1")
    .width(250)
    .height(200)
    .radius(100)
    .innerRadius(50)
    .dimension(petal_length2)
    .group(petal_length_sum2)
    .renderLabel(true)
    .label(function (d) { return (d.data.key + "-" + (d.data.key+1)); });  
    
    
   var petal_width_pie = dc.pieChart("#petal_width_pie","group1")
    .width(250)
    .height(200)
    .radius(100)
    .innerRadius(50)
    .dimension(petal_width2)
    .group(petal_width_sum2)
    .renderLabel(true)
    .label(function (d) { return (d.data.key + "-" + (d.data.key+1)); });  
  

  /* implement (this is tricky)
  
  add a reset button as shown in the tutorial
  
  */
  
  var showButton = function(){
    
    if(sepal_length_chart.filters().length > 0 || sepal_width_chart.filters().length > 0 || petal_length_chart.filters().length > 0 || petal_width_chart.filters().length > 0 || sepal_length_pie.filters().length > 0 || petal_length_pie.filters().length > 0 || sepal_width_pie.filters().length > 0 || petal_width_pie.filters().length > 0 ){
        
        d3.select(".btn-btn")
          .remove();
        
        d3.select("#resetButton")
          .append("button")
          .attr("type","button")
          .attr("class","btn-btn")
          .append("div")
          .attr("class","label")
          .text(function(d) { return "Reset";})
          .on("click", function(){
              sepal_length_chart.filter(null);              
              sepal_width_chart.filter(null);
              petal_length_chart.filter(null);
              petal_width_chart.filter(null);
              sepal_length_pie.filter(null);
              petal_length_pie.filter(null);
              sepal_width_pie.filter(null);
              petal_width_pie.filter(null);

              dc.redrawAll("group1");
          });
        
    } else {
        
        d3.select(".btn-btn")
          .remove();

    };
};

  sepal_width_chart.on('filtered', function(){showButton();});
  sepal_length_chart.on('filtered', function(){showButton();});
  petal_width_chart.on('filtered', function(){showButton();});
  petal_length_chart.on('filtered', function(){showButton();});
  sepal_width_pie.on('filtered', function(){showButton();});
  sepal_length_pie.on('filtered', function(){showButton();});
  petal_length_pie.on('filtered', function(){showButton();});
  petal_width_pie.on('filtered', function(){showButton();});


  dc.renderAll("group1");
  
});





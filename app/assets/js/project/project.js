d3.json("/assets/data/project_data.json", function(my_data){


	var cf = crossfilter(my_data);

	var basal_temp       = cf.dimension(function(d){return Math.round(d.basal_temp*20)/20; });
	var weight       = cf.dimension(function(d){return Math.round(d.weight*2)/2; });
	var room_temp       = cf.dimension(function(d){return Math.round(d.room_temp); });
	var condition       = cf.dimension(function(d){return d.condition; });
	var weather       = cf.dimension(function(d){return d.weather; });
	var mood       = cf.dimension(function(d){return d.mood; });
	var sleep_hour       = cf.dimension(function(d){return Math.round(d.sleep_hour*4)/4; });
	var work_hour       = cf.dimension(function(d){return Math.round(d.work_hour*2)/2; });
	var sport_hour       = cf.dimension(function(d){return Math.round(d.sport_hour*10)/10; });


	var weather_sum = weather.group().reduceCount();
	var condition_sum = condition.group().reduceCount();
	var basal_temp_sum = basal_temp.group().reduceCount();
	var weight_sum = weight.group().reduceCount();
	var room_temp_sum = room_temp.group().reduceCount();
	var mood_sum = mood.group().reduceCount();
	var work_hour_sum = work_hour.group().reduceCount();
	var sport_hour_sum = sport_hour.group().reduceCount();
	var sleep_hour_sum = sleep_hour.group().reduceCount();


/*
     window.mood_text = _.chain(my_data).pluck("mood").uniq().value();
     window.condition_text = _.chain(my_data).pluck("condition").uniq().value();
     window.weather_text = _.chain(my_data).pluck("weather").uniq().value();


/*
	var wakeup_time_chart = dc
    .barChart("#wakeup_time_chart")
    .width(250)
    .height(200)
    .dimension(wakeup_time)
    .group(wakeup_time_sum)
    .centerBar(true)
    .x( d3.scale.linear().domain([,]) )
    .xUnits(dc.units.fp.precision(.5));
*/

	var mood_pie = dc.pieChart("#mood_pie")
    .width(350)
    .height(300)
    .radius(120)
    .innerRadius(50)
    .dimension(mood)
    .group(mood_sum)
    .renderLabel(true)
    .label(function (d) { return (d.data.key); });    


   	var weather_pie = dc.pieChart("#weather_pie")
    .width(350)
    .height(300)
    .radius(120)
    .innerRadius(50)
    .dimension(weather)
    .group(weather_sum)
    .renderLabel(true)
    .label(function (d) { return (d.data.key); });    


	var condition_pie = dc.pieChart("#condition_pie")
    .width(350)
    .height(300)
    .radius(120)
    .innerRadius(50)
    .dimension(condition)
    .group(condition_sum)
    .renderLabel(true)
    .label(function (d) { return (d.data.key); });    
/*
    var mood_chart = dc
    .barChart("#mood_chart")
    .width(350)
    .height(300)
    .dimension(mood)
    .group(mood_sum)
    .centerBar(true)
    .x(d3.scale.ordinal().domain(mood_text))
    .xUnits(dc.units.ordinal);


    var sports_chart = dc
    .barChart("#sports_chart")
    .width(350)
    .height(300)
    .dimension(sports)
    .group(sports_sum)
    .centerBar(true)
    .x(d3.scale.ordinal().domain(sports_text))
    .xUnits(dc.units.ordinal);


	var condition_chart = dc
    .barChart("#condition_chart")
    .width(350)
    .height(300)
    .dimension(condition)
    .group(condition_sum)
    .centerBar(true)
    .x(d3.scale.ordinal().domain(condition_text))
    .xUnits(dc.units.ordinal);

*/
	var basal_temp_chart = dc
    .barChart("#basal_temp_chart")
    .width(350)
    .height(300)
    .dimension(basal_temp)
    .group(basal_temp_sum)
    .centerBar(true)
    .x( d3.scale.linear().domain([36,36.8]) )
    .xUnits(dc.units.fp.precision(.05))
    .elasticY(true);


	var room_temp_chart = dc
    .barChart("#room_temp_chart")
    .width(350)
    .height(300)
    .dimension(room_temp)
    .group(room_temp_sum)
    .centerBar(true)
    .x( d3.scale.linear().domain([15,35]) )
    .xUnits(dc.units.fp.precision(1))
    .elasticY(true);

	var sleep_hour_chart = dc
    .barChart("#sleep_hour_chart")
    .width(350)
    .height(300)
    .dimension(sleep_hour)
    .group(sleep_hour_sum)
    .centerBar(true)
    .x( d3.scale.linear().domain([6,9]) )
    .xUnits(dc.units.fp.precision(0.2))
    .elasticY(true);


	var work_hour_chart = dc
    .barChart("#work_hour_chart")
    .width(350)
    .height(300)
    .dimension(work_hour)
    .group(work_hour_sum)
    .centerBar(true)
    .x( d3.scale.linear().domain([4,11]) )
    .xUnits(dc.units.fp.precision(0.5))
    .elasticY(true);


	var sport_hour_chart = dc
    .barChart("#sport_hour_chart")
    .width(350)
    .height(300)
    .dimension(sport_hour)
    .group(sport_hour_sum)
    .centerBar(true)
    .x( d3.scale.linear().domain([0,1.8]) )
    .xUnits(dc.units.fp.precision(0.1))
    .elasticY(true);




	var weight_chart = dc
    .barChart("#weight_chart")
    .width(350)
    .height(300)
    .dimension(weight)
    .group(weight_sum)
    .centerBar(true)
    .x( d3.scale.linear().domain([46,54]) )
    .xUnits(dc.units.fp.precision(.5))
    .elasticY(true);

/*
  add a reset button as shown in the tutorial
  
  */
  
  var showButton = function(){
    
    if(room_temp_chart.filters().length > 0 || basal_temp_chart.filters().length > 0 || weight_chart.filters().length > 0 || sleep_hour_chart.filters().length > 0 || work_hour_chart.filters().length > 0 || sport_hour_chart.filters().length > 0 || condition_pie.filters().length > 0 || mood_pie.filters().length > 0 || weather_pie.filters().length > 0 ){
        
        d3.select(".btn-btn")
          .remove();
        
        d3.select("#resetButton")
          .append("button")
          .attr("type","button")
          .attr("class","btn-btn btn-primary btn-lg")
          .append("div")
          .attr("class","label")
        //  .attr("style","background: rgb(66, 184, 221);")

          .text(function(d) { return "Reset";})
          .on("click", function(){
              room_temp_chart.filter(null);              
              basal_temp_chart.filter(null);
              weight_chart.filter(null);
              sleep_hour_chart.filter(null);
              work_hour_chart.filter(null);
              sport_hour_chart.filter(null);
              weather_pie.filter(null);
              condition_pie.filter(null);
              mood_pie.filter(null);


              dc.redrawAll();
          });
        
    } else {
        
        d3.select(".btn-btn")
          .remove();

    };
};


	room_temp_chart.on('filtered', function(){showButton();});
  	basal_temp_chart.on('filtered', function(){showButton();});
  	weight_chart.on('filtered', function(){showButton();});
  	
  	sleep_hour_chart.on('filtered', function(){showButton();});
  	work_hour_chart.on('filtered', function(){showButton();});
  	sport_hour_chart.on('filtered', function(){showButton();});
  	weather_pie.on('filtered', function(){showButton();});
  	condition_pie.on('filtered', function(){showButton();});
  	mood_pie.on('filtered', function(){showButton();});




    dc.renderAll();





});


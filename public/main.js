var sliderPos = 'January 2015';
drawWorld();

function drawWorld() {
  var w = 1100;
  var h = 1050;
  map_svg = d3.select(".map")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("fill", "#666666");
  projection = d3.geo.kavrayskiy7()
    .scale(240)
    .translate([530, 380])
    .precision(.1);
  var path = d3.geo.path()
    .projection(projection);
  d3.json("world.json", function(json) {
    map_svg.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("stroke", "#000000")
      .attr("stroke-width", 1);
    drawSlider();
    drawData();
    arrowClickHandlers();
    toggleArrows();
  })
}

function arrowClickHandlers() {
  d3.select(".left-arrow").on("click", stepLeft);
  d3.select(".right-arrow").on("click", stepRight);
}

function toggleArrows() {
  d3.select('body').on("mousemove", function(e) {
    var mouseX = d3.mouse(this)[0];
    if (mouseX > window.innerWidth / 2) {
      d3.select('.left-arrow').style('opacity', 0);
      d3.select('.right-arrow').style('opacity', 1);
    } else {
      d3.select('.left-arrow').style('opacity', 1);
      d3.select('.right-arrow').style('opacity', 0);
    }
  });
}

function show(stories) {
  d3.selectAll("circle")
    .style("fill", "white")
    .style("opacity", 0.5);
  d3.select("#" + stories.name)
    .style("fill", "none")
    .style("stroke", "white")
    .style("stroke-width", 4)
    .style("opacity", 1);
  cityBody = d3.select("g").append("text")
    .attr("id", "cityBody")
    .attr("fill", "white")
    .attr("font-size", 17)
    .attr("font-family", "Garamond")
    .attr("text-align", "center")
    .attr("transform", "translate(" + (-30) + " ," + (-150) + ")")
    .text(function(stories) {
      return "Lorem Ipsum"; //replace with stories.story
    });

}

function drawSlider() {
  formatDate = d3.time.format("%B %Y");

  var margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    width = 1100,
    height = 300 - margin.bottom - margin.top;

  domainArray = [new Date('2015-02'), new Date('2015-03'), new Date('2015-04'), new Date('2015-05'), new Date('2015-06'), new Date('2015-07'), new Date('2015-08'), new Date('2015-09'), new Date('2015-10'), new Date('2015-11'), new Date('2015-12'), new Date('2016-01')];
  // scale function
  timeScale = d3.time.scale()
    .domain([domainArray[0], domainArray[11]])
    .range([0, width])
    .clamp(true);

  // initial value
  startingValue = new Date('2015-02');

  // defines brush
  brush = d3.svg.brush()
    .x(timeScale)
    .extent([startingValue, startingValue])
    .on("brush", brushed);
  //.on("brushend", brushended);

  var svg = d3.select("svg")
    .append("g")
    .attr("transform", "translate(" + 0 + "," + 570 + ")");

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height / 2 + ")")
    // introduce axis
    .call(d3.svg.axis()
      .scale(timeScale)
      .orient("bottom")
      .ticks(12)
      .tickSize(15)
      .tickFormat(function(d) {
        //return formatDate(d);
      }))
    .select(".domain")
    .attr("class", "halo");


  slider = svg.append("g")
    .attr("class", "slider")
    .call(brush);

  slider.selectAll(".extent,.resize")
    .remove();

  slider.select(".background")
    .attr("height", height);

  handle = slider.append("g")
    .attr("class", "handle")

  handle.append("path")
    .attr("transform", "translate(0," + height / 2 + ")")
    .attr("d", "M 0 -20 V 20")

  handle
    .append("text")
    .attr('class', 'slider-label')
    .attr("transform", "translate(" + (-45) + " ," + (height / 2 + 50) + ")")

  slider
    .call(brush.event);
}

var domainArrayHash = {
  "January 2015": 0,
  "February 2015": 1,
  "March 2015": 2,
  "April 2015": 3,
  "May 2015": 4,
  "June 2015": 5,
  "July 2015": 6,
  "August 2015": 7,
  "September 2015": 8,
  "October 2015": 9,
  "November 2015": 10,
  "December 2015": 11
};

function iterArr(domainArray) {
  var current = domainArrayHash[sliderPos];
  domainArray.next = (function() {
    return (++current >= this.length) ? false : this[current];
  });
  domainArray.prev = (function() {
    return (--current < 0) ? false : this[current];
  });

}

// slider event handler
function brushed() {
  var value = brush.extent()[0];

  if (d3.event.sourceEvent) {
    value = timeScale.invert(d3.mouse(this)[0]);
    brush.extent([formatDate(value), formatDate(value)]);

  }

  handle.attr("transform", "translate(" + timeScale(value) + ",0)");
  handle.select('text').text(formatDate(value));
  oldSliderPos = sliderPos;
  sliderPos = formatDate(value);

  updateCityValues();
  iterArr(domainArray);
}

//button event handler
function stepRight() {
  var duration = 1000;
  var step = domainArray.next();

  slider
    .transition()
    .duration(duration)
    .ease('linear')
    .call(brush.extent([step, step]))
    .call(brush.event);
  return domainArrayHash[sliderPos];
}

function stepLeft() {
  var duration = 1000;
  var step = domainArray.prev();

  slider
    .transition()
    .duration(duration)
    .ease('linear')
    .call(brush.extent([step, step]))
    .call(brush.event);
}


var sliderPositionHash = {
  "January 2015": "jan",
  "February 2015": "feb",
  "March 2015": "mar",
  "April 2015": "apr",
  "May 2015": "may",
  "June 2015": "jun",
  "July 2015": "jul",
  "August 2015": "aug",
  "September 2015": "sep",
  "October 2015": "oct",
  "November 2015": "nov",
  "December 2015": "dec"
};

function updateCityValues() {
  if (oldSliderPos != sliderPos) {
    //add: display default month by making hash for sliderPos:default city, then pass to show function
    map_svg.select("#cityBody").remove();
    map_svg.selectAll("circle").transition().duration(500)
      .style("fill", "white")
      .style("opacity", 0.5)
      .attr("r", function(cities) {
        if (cities[sliderPositionHash[sliderPos]] > 0) {
          return Math.log(parseInt(cities[sliderPositionHash[sliderPos]]) + 1) * 7;
        } else {
          return 0;
        }
      });
  }
}

function drawData() {
  var defaultStartMonth = 'jan';
  d3.csv("master_data.csv", function(cities) {
    map_svg.selectAll("circle")
      .data(cities)
      .enter()
      .append("circle")
      .attr("id", function(d) {
        return d.name;
      })
      .attr("cx", function(d) {
        return projection([d.longitude, d.latitude])[0];
      })
      .attr("cy", function(d) {
        return projection([d.longitude, d.latitude])[1];
      })
      .attr("r", function(d) {
        if (d[defaultStartMonth] > 0) {
          return Math.log(parseInt(d[defaultStartMonth]) + 1) * 7;
        } else {
          return 0;
        }

      })
      .style("fill", "white")
      .style("opacity", 0.5)
      .on("mouseover", function(d) {
        cityMouseOver(d, this);
      })
      .on("mouseout", cityMouseOut)
  })

};

function cityMouseOver(d, circle) {
  cityLabel = map_svg.append("text")
    .attr("class", "city-label")
    .text(function() {
      return d.name;
    })
    .attr("x", function() { //this doesn't work yet
      return Number(d3.select(circle).attr('cx')) + 30;
    })
    .attr("y", function() {
      return Number(d3.select(circle).attr('cy')) + 5;
    });
};

function cityMouseOut() {
  var textOut = d3.select(".city-label").remove()
};

var sliderPos = 'January 2015';
var sliderPositions = [
  "January 2015",
  "February 2015",
  "March 2015",
  "April 2015",
  "May 2015",
  "June 2015",
  "July 2015",
  "August 2015",
  "September 2015",
  "October 2015",
  "November 2015",
  "December 2015"
];
var domainArray = [new Date('2015-02'), new Date('2015-03'), new Date('2015-04'),
  new Date('2015-05'), new Date('2015-06'), new Date('2015-07'), new Date('2015-08'),
  new Date('2015-09'), new Date('2015-10'), new Date('2015-11'), new Date('2015-12'),
  new Date('2016-01')];
var SLIDER_DURATION = 400;

drawWorld();

function drawWorld() {
  var w = 1100;
  var h = 800;
  map_svg = d3.select(".map-svg")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("fill", "#666666");
  projection = d3.geo.kavrayskiy7()
    .scale(220)
    .translate([580, 380])
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
    toggleArrows();
    renderStory();
    setTimeout(highlightCurrentCity, 100);
  })
}

function toggleArrows() {
  d3.select('body').on("mousemove", function(e) {
    var mouseX = d3.mouse(this)[0];
    var mouseY = d3.mouse(this)[1];
    // This is pathetic... D3 doesn't support any form of `offset`
    var mapTop = $('.map').offset().top;
    var mapBottom = $('.map').offset().top + $('.map').height();
    if (mouseY < mapTop || mouseY > (mapBottom - 200)) {
      d3.select('body').attr('class', '')
        .on('click', null); // Seriously no `off` WTF d3?
    } else if (mouseX > window.innerWidth / 2) {
      d3.select('body').attr('class', 'left-arrow').on('click', stepRight);
    } else {
      d3.select('body').attr('class', 'right-arrow').on('click', stepLeft);
    }
  });
  d3.select('.mobile-arrows-left').on('click', stepLeft);
  d3.select('.mobile-arrows-right').on('click', stepRight);
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
    .on("brush", brushed)
    .on("brushend", highlightCurrentCity);

  var svg = d3.select("svg")
    .append("g")
    .attr("transform", "translate(" + 0 + "," + 570 + ")");

  svg.append("g")
    .attr("class", "axis")
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
    .attr("transform", "translate(0," + (height / 2 + 50) + ")")

  slider
    .call(brush.event);
}

function highlightCurrentCity(stories) {
  var story = STORIES[sliderPos];
  d3.selectAll("circle")
    .style("fill", "white")
    .style("opacity", 0.5);
  d3.select("[id='" + story.label.replace('São Paulo', 'Sao Paulo') + "']")
    .style("fill", "none")
    .style("stroke", "white")
    .style("stroke-width", 4)
    .style("opacity", 1);
  d3.select("[id='" + story.labeltwo + "']")
    .style("fill", "none")
    .style("stroke", "white")
    .style("stroke-width", 4)
    .style("opacity", 1);
}

// slider event handler
function brushed() {
  var value = brush.extent()[0];

  if (d3.event.sourceEvent) {
    value = timeScale.invert(d3.mouse(this)[0]);
    brush.extent([formatDate(value), formatDate(value)]);
  }

  handle.attr("transform", "translate(" + timeScale(value) + ",0)");
  handle.select('text').text(formatDate(value).replace('2015', ''));
  oldSliderPos = sliderPos;
  sliderPos = formatDate(value);

  // Run "on date change" callbacks
  renderStory();
  updateCityValues();
}

function renderStory() {
  var story = STORIES[sliderPos];
  d3.select('.map-story h2').html(story.label);
  d3.select('.map-story p').html(story.copy);
  d3.select('.map-story2 h2').html(story.labeltwo);
  d3.select('.map-story2 p').html(story.copytwo);
}

function updateCityValues() {
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
  if (oldSliderPos != sliderPos) {
    //add: display default month by making hash for sliderPos:default city, then pass to show function
    map_svg.select("#cityBody").remove();
    map_svg.selectAll("circle").transition().duration(500)
      .attr("r", function(cities) {
        if (cities[sliderPositionHash[sliderPos]] > 0) {
          return Math.log(parseInt(cities[sliderPositionHash[sliderPos]]) + 1) * 7;
        } else {
          return 0;
        }
      });
  }
}

//button event handler
function stepRight() {
  var nextDate = domainArray[sliderPositions.indexOf(sliderPos) + 1];
  if (!nextDate) return;
  slider
    .transition()
    .duration(SLIDER_DURATION)
    .ease('linear')
    .call(brush.extent([nextDate, nextDate]))
    .call(brush.event);
}

function stepLeft() {
  var currentDate = domainArray[sliderPositions.indexOf(sliderPos)];
  var prevDate = domainArray[sliderPositions.indexOf(sliderPos) - 1];
  if (!prevDate) return;
  slider
    .transition()
    .duration(SLIDER_DURATION)
    .ease('linear')
    .call(brush.extent([prevDate, currentDate]))
    .call(brush.event);
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
  var cityLabel = map_svg.append("text")
    .attr("class", "city-label")
    .text(function() {
      return d.name
        .replace('Sao Paulo', 'São Paulo')
        .replace('Dusseldorf', 'Düsseldorf')
        .replace('Malmo', 'Malmö')
        .replace('Zurich', 'Zürich')
        .replace('Koln', 'Köln');
    })
    .attr("x", function() {
      return Number(d3.select(circle).attr('cx'));
    })
    .attr("y", function() {
      return Number(d3.select(circle).attr('cy')) - 30;
    });
  var width = cityLabel.node().getBBox().width;
  var curX = cityLabel.attr('x');
  cityLabel.attr('x', (curX - width / 2) + 5);
};

function cityMouseOut() {
  var textOut = d3.select(".city-label").remove()
};

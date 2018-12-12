/*
*    main.js
*    Author: James Imgrund
*    DATS6401 - Data Visualization
*/


function getFillColor(gender) {
    var fill;
    switch(gender) {
      case "Baby Boys":
         fill = "#83B9F7";
         break;
      case "Baby Girls":
         fill = "#F783D4";
         break;
      default:
         fill = "blue";
    }
    return fill;
}

function getMaxCount(data) {
   maxVal = Math.max.apply(Math, data.map(function(d) { return d.count; }))
   return maxVal;
}

function mapMothersAgeCode(code) {
   var ageDict = {
      "1":"0 < 15 years",
      "2":"15-19 years",
      "3":"20-24 years",
      "4":"25-29 years",
      "5":"30-34 years",
      "6":"35-39 years",
      "7":"40-44 years",
      "8":"45-49 years",
      "9":"50-54 years"
   };
   return ageDict[code];
}

function mapBirthWeightCode(code) {
   var birthWeightDict = {
      "01":"0227 - 0499",
      "02":"0500 – 0999",
      "03":"1000 - 1499",
      "04":"1500 – 1999",
      "05":"2000 – 2499",
      "06":"2500 – 2999",
      "07":"3000 – 3499",
      "08":"3500 – 3999",
      "09":"4000 – 4499",
      "10":"4500 – 4999",
      "11":"5000 – 8165",
      "12":"Unknown"
   };
   return birthWeightDict[code];
}

function mapMotherBmiCode(code) {
   var bmiDict = {
      "1":"Underweight <18.5",
      "2":"Normal 18.5-24.9",
      "3":"Overweight 25.0-29.9",
      "4":"Obesity I 35.0-34.9",
      "5":"Obesity II 35.0-39.9",
      "6":"Extreme Obesity III ≥ 40.0",
      "9":"Unknown",
   };
   return bmiDict[code];
}

function mapWeightGainCode(code) {
   var weightGainDict = {
      1:"0 < 11 ",
      2:"11 to 20",
      3:"21 to 30",
      4:"31 to 40",
      5:"41 to 98",
      9:"Unknown"
   };
   return weightGainDict[code];
}

function mapCigsFirstTriCode(code) {
   var cigsFirstTriDict = {
      "0":"Nonsmoker",
      "1":"1-5",
      "2":"6-10",
      "3":"11-20",
      "4":"21-40",
      "5":"41+",
      "6":"Unknown"
   };
   return cigsFirstTriDict[code];
}

function mapCigsSecondTriCode(code) {
   var cigsSecondTriDict = {
      "0":"Nonsmoker",
      "1":"1-5",
      "2":"6-10",
      "3":"11-20",
      "4":"21-40",
      "5":"41+",
      "6":"Unknown"
   };
   return cigsSecondTriDict[code];
}

function mapCigsThirdTriCode(code) {
   var cigsThirdTriDict = {
      "0":"Nonsmoker",
      "1":"1-5",
      "2":"6-10",
      "3":"11-20",
      "4":"21-40",
      "5":"41+",
      "6":"Unknown"
   };
   return cigsThirdTriDict[code];
}

//count values being mapped
/*
var area = d3.scaleLinear()
             .domain([40, 3002514])
             .range([3*Math.PI, 1500*Math.PI]);
*/

function pieChart(chartArea) {
    var margin = {left:40, right:40, top:40, bottom:40};
    var height = 500 - margin.top - margin.bottom,
        width  = 800 - margin.left - margin.right;
    var radius = Math.min(width, height) / 2;

    // entire canvas
    var canvas = d3.select(chartArea)
              .append("svg")
                 .attr("width", width + margin.left + margin.right)
                 .attr("height", height + margin.top + margin.bottom)
              .append("g")
                 .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var totalBirths = 0;
    var totalBirthsLabel = canvas.append("text")
                 .attr("y", radius + 10)
                 .attr("x", radius + 10)
                 .attr("font-size", "22px")
                 .attr("opacity", "0.0")
                 .attr("text-anchor", "middle")
                 .text("0");

    //Tooltip
    var tip = d3.tip().attr("class","d3-tip")
            .html(function(d) {
                     var text  = "<strong>Births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.data.count) + "</span></br>";
                     return text;
                  })
    canvas.call(tip);


    // color range
    var color = d3.scaleOrdinal()
        .range(["#F783D4", "#83B9F7"]);

    // pie chart arc. Need to create arcs before generating pie
    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    // arc for the labels position
    var labelArc = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    // generate pie chart and donut chart
    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.count; });

    // import data 
    d3.json("data/baby-pie.json").then( function(data) {
        // ensure count is cast as integer
        data.forEach(function(d) {
            d.count = +d.count;
            switch(d.infant_sex) {
              case "M":
                d.infant_sex = "Baby Boys";
                //Update the total births label
                totalBirths = (+(d.count) + totalBirths);
                totalBirthsLabel.text(d3.format(",.0f")(totalBirths).toString() + " Total Births");

                break;
              case "F":
                d.infant_sex = "Baby Girls";

                //Update the total births label
                totalBirths = (+(d.count) + totalBirths);
                totalBirthsLabel.text(d3.format(",.0f")(totalBirths).toString() + " Total Births");
                break;
            }
        })

      // "g element is a container used to group other SVG elements"
      var g = canvas.selectAll(".arc")
          .data(pie(data))
        .enter().append("g")
          .on("mouseover", tip.show)
          .on("mouseout", tip.hide)
          .attr("class", "arc");

      // append path 
      g.append("path")
          .attr("d", arc)
          .style("fill", function(d) { return color(d.data.infant_sex); })
        // transition 
        .transition()
          .ease(d3.easeLinear)
          .duration(1000)
          .attrTween("d", tweenPie);
        
      // append text
      g.append("text")
        .transition()
          .ease(d3.easeLinear)
          .duration(1500)
        .attr("transform", function(d) {
                  var c = arc.centroid(d),
                      x = c[0],
                      y = c[1],
                      // pythagorean theorem for hypotenuse
                      h = Math.sqrt(x*x + y*y);
                  return "translate(" + (x/h * radius/2) +  ',' +
                     (y/h * radius/2) +  ")"; 
              })
          .attr("dy", ".35em")
          .text(function(d) { return d.data.infant_sex ; });

        totalBirthsLabel.attr("opacity","1.0");
    
    }); //d3.json

    // Helper function for animation of pie chart and donut chart
    function tweenPie(b) {
      b.innerRadius = 0;
      var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
      return function(t) { return arc(i(t)); };
    }

} //pieChart


function scatterPlotWicWeight(chartArea) {
    var margin = {left:85, right:20, top:50, bottom:100};
    var height = 500 - margin.top - margin.bottom,
        width  = 800 - margin.left - margin.right;

    // entire canvas
    var canvas = d3.select(chartArea)
              .append("svg")
                 .attr("width", width + margin.left + margin.right)
                 .attr("height", height + margin.top + margin.bottom)
              .append("g")
                 .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    //Tooltip
    var tip = d3.tip().attr("class","d3-tip")
            .html(function(d) {
                     var text  = "<strong>WIC status: </strong><span style='color:yellow'>" + (d.wic) + "</span></br>";
                         text += "<strong>Birth weight: </strong><span style='color:yellow'>" + (d.birth_weight) + "</span></br>";
                         text += "<strong>Male births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.m_count) + "</span></br>";
                         text += "<strong>Female births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.f_count) + "</span></br>";
                         text += "<strong>Total births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.m_count + d.f_count) + "</span></br>";
                     return text;
                  })
    canvas.call(tip);

    canvas.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text("Birth Weight related to WIC Status");

    //x label
    canvas.append("text")
          .attr("y", height + margin.top)
          .attr("x", width/2)
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .text("Birth Weight");


    //y label
    canvas.append("text")
          .attr("y", -70)
          .attr("x", -(height/2))
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .text("WIC Status");

    //Read in the data
    d3.json("data/wic-birthweight.json").then( function(data) {
    
       // ensure count is cast as integer
       data.forEach(function(d) {
          d.m_count              = +d.m_count;
          d.f_count              = +d.f_count;
          d.count                = +d.f_count + +d.m_count;
          d.birth_weight         = mapBirthWeightCode(d.birth_weight_recode12);
          switch(d.wic) {
             case "Y":
                d.wic = "Yes";
                break;
             case "N":
                d.wic = "No";
                break;
             default:
                d.wic = " Unknown";
          }
       });

       update(data);

       $(document).ready(function(){
          $('.genderSelect-wic-weight').change(function(){
              var selectedGender = $(".genderSelect-wic-weight option:selected").text();
              data.forEach(function(d) {
                  if ( selectedGender === 'Baby Boys' ) {
                     d.count          = +d.m_count;
                  } else if ( selectedGender === 'Baby Girls' ) {
                     d.count          = +d.f_count;
                  } else {
                     d.count          = +d.f_count + +d.m_count;
                  }
              });
              update(data);
          });
       });
    
    }); //d3.json


    function update(data) {
       //x scale
       var x = d3.scaleBand()
               .domain(data.map(function(d){
                  return d.birth_weight;
               }).sort(function(a,b) {
                  regex = /^\d+/
                  return +regex.exec(a) - +regex.exec(b)
               }))
               .range([0, width])
               .padding(0.2);

       //y scale
       var y = d3.scaleBand()
               .domain(data.map(function(d){
                  return d.wic;
               }))
               .range([height, 0])
               .padding(0.1);


       //x axis
       var xAxis = d3.axisBottom(x);
       canvas.append("g")
              .attr("class", "x-axis")
              .attr("transform", "translate(0, " + height + ")")
              .call(xAxis)
            .selectAll("text")
              .attr("transform", "rotate(-10)");
    
    
       //y axis
       var yAxis = d3.axisLeft(y)
                    .tickFormat(function(d){
                       return d
                    });
       canvas.append("g")
             .attr("class", "y-axis")
             .call(yAxis)
            .selectAll("text")
              .attr("transform", "rotate(-10)");

       var circles = canvas.selectAll("circle").data(data)

       //Standard transition for the visualization
       var t = d3.transition().duration(1000);

       //Exit old elements not present in the new data
       circles.exit()
           .attr("class","exit")
           .remove();

       circles.enter()
           .append("circle")
           .on("mouseover", tip.show)
           .on("mouseout", tip.hide)
           .attr("class","enter")
           .attr("fill", "blue")
           .merge(circles)
           .transition(t)
             .attr("cy", function(d){ return (y(d.wic) + 50); })
             .attr("cx", function(d){ return (x(d.birth_weight) + 22); })
             .attr("r", function(d){ return Math.sqrt(area(d.count)/Math.PI); });

        canvas.selectAll("circle").attr("fill", function() { return (getFillColor($(".genderSelect-wic-weight option:selected").text())); });

    } // update
} // scatterPlotWicWeight

function scatterPlotWicApgar(chartArea) {
    var margin = {left:85, right:20, top:50, bottom:100};
    var height = 500 - margin.top - margin.bottom,
        width  = 800 - margin.left - margin.right;

    // entire canvas
    var canvas = d3.select(chartArea)
              .append("svg")
                 .attr("width", width + margin.left + margin.right)
                 .attr("height", height + margin.top + margin.bottom)
              .append("g")
                 .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    //Tooltip
    var tip = d3.tip().attr("class","d3-tip")
            .html(function(d) {
                     var text  = "<strong>WIC status: </strong><span style='color:yellow'>" + (d.wic) + "</span></br>";
                         text += "<strong>APGAR score: </strong><span style='color:yellow'>" + (d.five_min_apgar) + "</span></br>";
                         text += "<strong>Male births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.m_count) + "</span></br>";
                         text += "<strong>Female births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.f_count) + "</span></br>";
                         text += "<strong>Total births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.m_count + d.f_count) + "</span></br>";
                     return text;
                  })
    canvas.call(tip);

    canvas.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text("APGAR Score related to WIC Status");

    //x label
    canvas.append("text")
          .attr("y", height + margin.top)
          .attr("x", width/2)
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .text("APGAR Score");


    //y label
    canvas.append("text")
          .attr("y", -70)
          .attr("x", -(height/2))
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .text("WIC Status");

    //Read in the data
    d3.json("data/wic-apgar.json").then( function(data) {
    
       // ensure count is cast as integer
       data.forEach(function(d) {
          d.m_count              = +d.m_count;
          d.f_count              = +d.f_count;
          d.count                = +d.f_count + +d.m_count;
          d.birth_weight         = mapBirthWeightCode(d.birth_weight_recode12);
          d.five_min_apgar       = d.five_min_apgar;
          if (d.five_min_apgar == 99) {
             d.five_min_apgar = ' Unknown';
          }
          switch(d.wic) {
             case "Y":
                d.wic = "Yes";
                break;
             case "N":
                d.wic = "No";
                break;
             default:
                d.wic = ' Unknown';
          }
       });

       update(data);

       $(document).ready(function(){
          $('.genderSelect-wic-apgar').change(function(){
              var selectedGender = $(".genderSelect-wic-apgar option:selected").text();
              data.forEach(function(d) {
                  if ( selectedGender === 'Baby Boys' ) {
                     d.count          = +d.m_count;
                  } else if ( selectedGender === 'Baby Girls' ) {
                     d.count          = +d.f_count;
                  } else {
                     d.count          = +d.f_count + +d.m_count;
                  }
              });
              update(data);
          });
       });
    
    }); //d3.json

    function compareWicStatus(a,b) {
      let comparison = 0;
      if (a.wic > b.wic) {
        comparison = 1;
      } else if (a.wic < b.wic) {
        comparison = -1;
      }
      return comparison;
    }

    function compareApgarScores(a,b) {
      let comparison = 0;
      if (a.five_min_apgar > b.five_min_apgar) {
        comparison = 1;
      } else if (a.five_min_apgar < b.five_min_apgar) {
        comparison = -1;
      }
      return comparison;
    }

    function update(data) {
       //x scale
       var x = d3.scaleBand()
               .domain(data.sort(compareApgarScores).map(function(d){
                  return d.five_min_apgar;
               }).sort(function(a,b) {
                  regex = /^\d+/
                  return +regex.exec(a) - +regex.exec(b)
               }))
               .range([0, width])
               .padding(0.2);

       //y scale
       var y = d3.scaleBand()
               .domain(data.sort(compareWicStatus).map(function(d){
                  return d.wic;
               }))
               .range([height, 0])
               .padding(0.1);


       //x axis
       var xAxis = d3.axisBottom(x);
       canvas.append("g")
              .attr("class", "x-axis")
              .attr("transform", "translate(0, " + height + ")")
              .call(xAxis)
            .selectAll("text")
              .attr("transform", "rotate(-10)");
    
    
       //y axis
       var yAxis = d3.axisLeft(y)
                    .tickFormat(function(d){
                       return d
                    });
       canvas.append("g")
             .attr("class", "y-axis")
             .call(yAxis)
            .selectAll("text")
              .attr("transform", "rotate(-10)");

       var circles = canvas.selectAll("circle").data(data)

       //Standard transition for the visualization
       var t = d3.transition().duration(1000);

       //Exit old elements not present in the new data
       circles.exit()
           .attr("class","exit")
           .remove();

       circles.enter()
           .append("circle")
           .on("mouseover", tip.show)
           .on("mouseout", tip.hide)
           .attr("class","enter")
           .attr("fill", "blue")
           .merge(circles)
           .transition(t)
             .attr("cy", function(d){ return (y(d.wic) + 50); })
             .attr("cx", function(d){ return (x(d.five_min_apgar) + 22); })
             .attr("r", function(d){ return Math.sqrt(area(d.count)/Math.PI); });

        canvas.selectAll("circle").attr("fill", function() { return (getFillColor($(".genderSelect-wic-apgar option:selected").text())); });

    } // update
} // scatterPlotWicApgar



function scatterPlotMaritalWeight(chartArea) {
    var margin = {left:85, right:20, top:50, bottom:100};
    var height = 500 - margin.top - margin.bottom,
        width  = 800 - margin.left - margin.right;

    // entire canvas
    var canvas = d3.select(chartArea)
              .append("svg")
                 .attr("width", width + margin.left + margin.right)
                 .attr("height", height + margin.top + margin.bottom)
              .append("g")
                 .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    //Tooltip
    var tip = d3.tip().attr("class","d3-tip")
            .html(function(d) {
                     var text  = "<strong>Marital status: </strong><span style='color:yellow'>" + (d.marital_status) + "</span></br>";
                         text += "<strong>Birth weight: </strong><span style='color:yellow'>" + (d.birth_weight) + "</span></br>";
                         text += "<strong>Male births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.m_count) + "</span></br>";
                         text += "<strong>Female births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.f_count) + "</span></br>";
                         text += "<strong>Total births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.m_count + d.f_count) + "</span></br>";
                     return text;
                  })
    canvas.call(tip);

    canvas.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text("Birth Weight related to Marital Status");

    //x label
    canvas.append("text")
          .attr("y", height + margin.top)
          .attr("x", width/2)
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .text("Birth Weight");


    //y label
    canvas.append("text")
          .attr("y", -70)
          .attr("x", -(height/2))
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .text("Marital Status");

    //Read in the data
    d3.json("data/marital-birthweight.json").then( function(data) {
    
       // ensure count is cast as integer
       data.forEach(function(d) {
          d.m_count              = +d.m_count;
          d.f_count              = +d.f_count;
          d.count                = +d.f_count + +d.m_count;
          d.birth_weight         = mapBirthWeightCode(d.birth_weight_recode12);
          d.marital_status       = d.marital_status;
          switch(d.marital_status) {
             case "1":
                d.marital_status = "Married";
                break;
             case "2":
                d.marital_status = "Unmarried";
                break;
          }
       });

       update(data);

       $(document).ready(function(){
          $('.genderSelect-marital-weight').change(function(){
              var selectedGender = $(".genderSelect-marital-weight option:selected").text();
              data.forEach(function(d) {
                  if ( selectedGender === 'Baby Boys' ) {
                     d.count          = +d.m_count;
                  } else if ( selectedGender === 'Baby Girls' ) {
                     d.count          = +d.f_count;
                  } else {
                     d.count          = +d.f_count + +d.m_count;
                  }
              });
              update(data);
          });
       });
    
    }); //d3.json


    function update(data) {
       //x scale
       var x = d3.scaleBand()
               .domain(data.map(function(d){
                  return d.birth_weight;
               }).sort(function(a,b) {
                  regex = /^\d+/
                  return +regex.exec(a) - +regex.exec(b)
               }))
               .range([0, width])
               .padding(0.2);

       //y scale
       var y = d3.scaleBand()
               .domain(data.map(function(d){
                  return d.marital_status;
               }))
               .range([height, 0])
               .padding(0.1);


       //x axis
       var xAxis = d3.axisBottom(x);
       canvas.append("g")
              .attr("class", "x-axis")
              .attr("transform", "translate(0, " + height + ")")
              .call(xAxis)
            .selectAll("text")
              .attr("transform", "rotate(-10)");
    
    
       //y axis
       var yAxis = d3.axisLeft(y)
                    .tickFormat(function(d){
                       return d
                    });
       canvas.append("g")
             .attr("class", "y-axis")
             .call(yAxis)
            .selectAll("text")
              .attr("transform", "rotate(-10)");

       var circles = canvas.selectAll("circle").data(data)

       //Standard transition for the visualization
       var t = d3.transition().duration(1000);

       //Exit old elements not present in the new data
       circles.exit()
           .attr("class","exit")
           .remove();

       circles.enter()
           .append("circle")
           .on("mouseover", tip.show)
           .on("mouseout", tip.hide)
           .attr("class","enter")
           .attr("fill", "blue")
           .merge(circles)
           .transition(t)
             .attr("cy", function(d){ return (y(d.marital_status) + 75); })
             .attr("cx", function(d){ return (x(d.birth_weight) + 22); })
             .attr("r", function(d){ return Math.sqrt(area(d.count)/Math.PI); });

        canvas.selectAll("circle").attr("fill", function() { return (getFillColor($(".genderSelect-marital-weight option:selected").text())); });

    } // update
} // scatterPlotMaritalWeight


function scatterPlotMaritalApgar(chartArea) {
    var margin = {left:85, right:20, top:50, bottom:100};
    var height = 500 - margin.top - margin.bottom,
        width  = 800 - margin.left - margin.right;

    // entire canvas
    var canvas = d3.select(chartArea)
              .append("svg")
                 .attr("width", width + margin.left + margin.right)
                 .attr("height", height + margin.top + margin.bottom)
              .append("g")
                 .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    //Tooltip
    var tip = d3.tip().attr("class","d3-tip")
            .html(function(d) {
                     var text  = "<strong>Marital status: </strong><span style='color:yellow'>" + (d.marital_status) + "</span></br>";
                         text += "<strong>APGAR score: </strong><span style='color:yellow'>" + (d.five_min_apgar) + "</span></br>";
                         text += "<strong>Male births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.m_count) + "</span></br>";
                         text += "<strong>Female births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.f_count) + "</span></br>";
                         text += "<strong>Total births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.m_count + d.f_count) + "</span></br>";
                     return text;
                  })
    canvas.call(tip);

    canvas.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text("APGAR Score related to Marital Status");

    //x label
    canvas.append("text")
          .attr("y", height + margin.top)
          .attr("x", width/2)
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .text("APGAR Score");


    //y label
    canvas.append("text")
          .attr("y", -70)
          .attr("x", -(height/2))
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .text("Marital Status");

    //Read in the data
    d3.json("data/marital-apgar.json").then( function(data) {
    
       // ensure count is cast as integer
       data.forEach(function(d) {
          d.m_count              = +d.m_count;
          d.f_count              = +d.f_count;
          d.count                = +d.f_count + +d.m_count;
          d.five_min_apgar       = d.five_min_apgar;
          if (d.five_min_apgar == 99) {
             d.five_min_apgar = ' Unknown';
          }
          d.marital_status       = d.marital_status;
          switch(d.marital_status) {
             case "1":
                d.marital_status = "Married";
                break;
             case "2":
                d.marital_status = "Unmarried";
                break;
          }
       });

       update(data);

       $(document).ready(function(){
          $('.genderSelect-marital-apgar').change(function(){
              var selectedGender = $(".genderSelect-marital-apgar option:selected").text();
              data.forEach(function(d) {
                  if ( selectedGender === 'Baby Boys' ) {
                     d.count          = +d.m_count;
                  } else if ( selectedGender === 'Baby Girls' ) {
                     d.count          = +d.f_count;
                  } else {
                     d.count          = +d.f_count + +d.m_count;
                  }
              });
              update(data);
          });
       });
    
    }); //d3.json

    function compareApgarScores(a,b) {
      let comparison = 0;
      if (a.five_min_apgar > b.five_min_apgar) {
        comparison = 1;
      } else if (a.five_min_apgar < b.five_min_apgar) {
        comparison = -1;
      }
      return comparison;
    }

    function update(data) {
       //x scale
       var x = d3.scaleBand()
               .domain(data.sort(compareApgarScores).map(function(d){
                  return d.five_min_apgar;
               }).sort(function(a,b) {
                  regex = /^\d+/
                  return +regex.exec(a) - +regex.exec(b)
               }))
               .range([0, width])
               .padding(0.2);

       //y scale
       var y = d3.scaleBand()
               .domain(data.map(function(d){
                  return d.marital_status;
               }))
               .range([height, 0])
               .padding(0.1);


       //x axis
       var xAxis = d3.axisBottom(x);
       canvas.append("g")
              .attr("class", "x-axis")
              .attr("transform", "translate(0, " + height + ")")
              .call(xAxis)
            .selectAll("text")
              .attr("transform", "rotate(-10)");
    
    
       //y axis
       var yAxis = d3.axisLeft(y)
                    .tickFormat(function(d){
                       return d
                    });
       canvas.append("g")
             .attr("class", "y-axis")
             .call(yAxis)
            .selectAll("text")
              .attr("transform", "rotate(-10)");

       var circles = canvas.selectAll("circle").data(data)

       //Standard transition for the visualization
       var t = d3.transition().duration(1000);

       //Exit old elements not present in the new data
       circles.exit()
           .attr("class","exit")
           .remove();

       circles.enter()
           .append("circle")
           .on("mouseover", tip.show)
           .on("mouseout", tip.hide)
           .attr("class","enter")
           .attr("fill", "blue")
           .merge(circles)
           .transition(t)
             .attr("cy", function(d){ return (y(d.marital_status) + 75); })
             .attr("cx", function(d){ return (x(d.five_min_apgar) + 22); })
             .attr("r", function(d){ return Math.sqrt(area(d.count)/Math.PI); });

        canvas.selectAll("circle").attr("fill", function() { return (getFillColor($(".genderSelect-marital-apgar option:selected").text())); });

    } // update
} // scatterPlotMaritalApgar




function scatterPlotWeightGestDiab(chartArea) {
    var margin = {left:85, right:20, top:50, bottom:100};
    var height = 500 - margin.top - margin.bottom,
        width  = 800 - margin.left - margin.right;

    // entire canvas
    var canvas = d3.select(chartArea)
              .append("svg")
                 .attr("width", width + margin.left + margin.right)
                 .attr("height", height + margin.top + margin.bottom)
              .append("g")
                 .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    //Tooltip
    var tip = d3.tip().attr("class","d3-tip")
            .html(function(d) {
                     var text  = "<strong>Gestational diabetes: </strong><span style='color:yellow'>" + (d.gestational_diabetes) + "</span></br>";
                         text += "<strong>Birth weight: </strong><span style='color:yellow'>" + (d.birth_weight) + " grams</span></br>";
                         text += "<strong>Male births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.m_count) + "</span></br>";
                         text += "<strong>Female births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.f_count) + "</span></br>";
                         text += "<strong>Total births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.m_count + d.f_count) + "</span></br>";
                     return text;
                  })
    canvas.call(tip);

    canvas.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text("Number of Births, Birth Weight, and Gestational Diabetes");

    //x label
    canvas.append("text")
          .attr("y", height + margin.top)
          .attr("x", width/2)
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .text("Birth Weight");


    //y label
    canvas.append("text")
          .attr("y", -70)
          .attr("x", -(height/2))
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .text("Gestational Diabetes");

    //Read in the data
    d3.json("data/birth_weight-gest_diab.json").then( function(data) {
    
       // ensure count is cast as integer
       data.forEach(function(d) {
          d.m_count              = +d.m_count;
          d.f_count              = +d.f_count;
          d.count                = +d.f_count + +d.m_count;
          d.birth_weight         = mapBirthWeightCode(d.birth_weight_recode12);
          switch(d.gestational_diabetes) {
             case("Y"):
                d.gestational_diabetes = 'Yes';
                break;
             case("N"):
                d.gestational_diabetes = 'No';
                break;
             default:
                d.gestational_diabetes = 'Unknown';
          };
       });

       update(data);

       $(document).ready(function(){
          $('.genderSelect-birthweight-gest-diab').change(function(){
              var selectedGender = $(".genderSelect-birthweight-gest-diab option:selected").text();
              data.forEach(function(d) {
                  if ( selectedGender === 'Baby Boys' ) {
                     d.count          = +d.m_count;
                  } else if ( selectedGender === 'Baby Girls' ) {
                     d.count          = +d.f_count;
                  } else {
                     d.count          = +d.f_count + +d.m_count;
                  }
              });
              update(data);
          });
       });
    
    }); //d3.json


    function update(data) {
       maxCount = getMaxCount(data);
       area = d3.scaleLinear()
                 .domain([40, eval(maxCount)])
                 .range([0*Math.PI, 600*Math.PI]);

       //x scale
       var x = d3.scaleBand()
               .domain(data.map(function(d){
                  return d.birth_weight;
               }).sort(function(a,b) {
                  regex = /^\d+/
                  return +regex.exec(a) - +regex.exec(b)
               }))
               .range([0, width])
               .padding(0.2);

       //y scale
       var y = d3.scaleBand()
               .domain(data.map(function(d){
                  return d.gestational_diabetes;
               }))
               .range([height, 0])
               .padding(0.1);


       //x axis
       var xAxis = d3.axisBottom(x);
       canvas.append("g")
              .attr("class", "x-axis")
              .attr("transform", "translate(0, " + height + ")")
              .call(xAxis)
            .selectAll("text")
              .attr("transform", "rotate(-8)");
    
    
       //y axis
       var yAxis = d3.axisLeft(y)
                    .tickFormat(function(d){
                       return d
                    });
       canvas.append("g")
             .attr("class", "y-axis")
             .call(yAxis)
            .selectAll("text")
              .attr("transform", "rotate(-8)");

       var circles = canvas.selectAll("circle").data(data)

       //Standard transition for the visualization
       var t = d3.transition().duration(1000);

       //Exit old elements not present in the new data
       circles.exit()
           .attr("class","exit")
           .remove();

       circles.enter()
           .append("circle")
           .on("mouseover", tip.show)
           .on("mouseout", tip.hide)
           .attr("class","enter")
           .attr("fill", "blue")
           .merge(circles)
           .transition(t)
             .attr("cy", function(d){ return (y(d.gestational_diabetes) + 50); })
             .attr("cx", function(d){ return (x(d.birth_weight) + 20); })
             .attr("r", function(d){ return Math.sqrt(area(d.count)/Math.PI); });

        canvas.selectAll("circle").attr("fill", function() { return (getFillColor($(".genderSelect-birthweight-gest-diab option:selected").text())); });

    } // update
} // scatterPlotWeightGestDiab

function scatterPlotApgarCigs(chartArea) {
    var margin = {left:85, right:20, top:50, bottom:100};
    var height = 500 - margin.top - margin.bottom,
        width  = 800 - margin.left - margin.right;

    // entire canvas
    var canvas = d3.select(chartArea)
              .append("svg")
                 .attr("width", width + margin.left + margin.right)
                 .attr("height", height + margin.top + margin.bottom)
              .append("g")
                 .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    //Tooltip
    var tip = d3.tip().attr("class","d3-tip")
            .html(function(d) {
                     var text  = "<strong>APGAR score: </strong><span style='color:yellow'>" + (d.five_min_apgar) + "</span></br>";
                         text += "<strong>Cigarettes smoked: </strong><span style='color:yellow'>" + (d.cigs_first_tri) + "</span></br>";
                         text += "<strong>Male births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.m_count) + "</span></br>";
                         text += "<strong>Female births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.f_count) + "</span></br>";
                         text += "<strong>Total births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.m_count + d.f_count) + "</span></br>";
                     return text;
                  })
    canvas.call(tip);

    canvas.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text("Number of Births, Their Respective APGAR Scores, and Number of Cigarettes Smoked");

    //x label
    canvas.append("text")
          .attr("y", height + margin.top)
          .attr("x", width/2)
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .text("Cigarettes Smoked");


    //y label
    canvas.append("text")
          .attr("y", -70)
          .attr("x", -(height/2))
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .text("APGAR Score");

    fileName    = "data/five_min-cigs_first.json";
    cigCountVar = "cigs_first_trimester_recode";
    fileType    = "all";
    processFile(fileName,true);

    function determineFileName() {
       selectedAgeGroup   = $(".ageSelect-apgar-cigs option:selected").text();
       selectedTimePeriod = $(".smokeSelect-cigs-first-apgar option:selected").text();
       if ( selectedAgeGroup !== "All Ages" ) {
          fileType = "age";
          switch(selectedTimePeriod) {
             case "Prior to Pregnancy":
                fileName = "data/five_min-cigs_before-age.json";
                cigCountVar = "cigs_before_pregnancy_recode";
                break;
             case "First Trimester":
                fileName = "data/five_min-cigs_first-age.json";
                cigCountVar = "cigs_first_trimester_recode";
                break;
             case "Second Trimester":
                fileName = "data/five_min-cigs_second-age.json";
                cigCountVar = "cigs_second_trimester_recode";
                break;
             case "Third Trimester":
                fileName = "data/five_min-cigs_third-age.json";
                cigCountVar = "cigs_third_trimester_recode";
                break;
             default:
                fileName = "data/five_min-cigs_first-age.json";
                cigCountVar = "cigs_first_trimester_recode";
          }
       } else {
          fileType = "all";
          switch(selectedTimePeriod) {
             case "Prior to Pregnancy":
                fileName = "data/five_min-cigs_before.json";
                cigCountVar = "cigs_before_pregnancy_recode";
                break;
             case "First Trimester":
                fileName = "data/five_min-cigs_first.json";
                cigCountVar = "cigs_first_trimester_recode";
                break;
             case "Second Trimester":
                fileName = "data/five_min-cigs_second.json";
                cigCountVar = "cigs_second_trimester_recode";
                break;
             case "Third Trimester":
                fileName = "data/five_min-cigs_third.json";
                cigCountVar = "cigs_third_trimester_recode";
                break;
             default:
                fileName = "data/five_min-cigs_first.json";
                cigCountVar = "cigs_first_trimester_recode";
          }
       }
       return fileName;
    }



    function processFile(fileName,drawScale) {
       //Read in the data
       d3.json(fileName).then( function(data) {
    
          // ensure count is cast as integer
          data.forEach(function(d) {
             d.m_count        = +d.m_count;
             d.f_count        = +d.f_count;
             d.count          = +d.f_count + +d.m_count;
             //d.cigs_first_tri = mapCigsFirstTriCode(d.cigs_first_trimester_recode);
             d.cigs_first_tri = mapCigsFirstTriCode(eval("d.".concat(cigCountVar)));
             d.five_min_apgar = d.five_min_apgar;
             if (d.five_min_apgar == 99) {
                d.five_min_apgar = ' Unknown';
             }
             if ( fileType === "age" ) {
                d.mother_age  = mapMothersAgeCode(d.mother_age_recode9);
             }
          });

          if ( fileType === "age" ) {
             data = data.filter(function(data){ return data.mother_age === selectedAgeGroup; });
          }
   
          //data = nonSmokerExclusionHandler(data);
          //data = genderSelectHandler(data);
          $(document).ready(function(){
             $('.ageSelect-apgar-cigs').change(function(){
                fileName = determineFileName();
                processFile(fileName);
                //data = genderSelectHandler(data);
                //data = nonSmokerExclusionHandler(data);
                update(data,false);
             });
             $('.smokeSelect-cigs-first-apgar').change(function(){
                fileName = determineFileName();
                processFile(fileName);
                //data = genderSelectHandler(data);
                //data = nonSmokerExclusionHandler(data);
                update(data,false);
             });
             $('.genderSelect-cigs-first-apgar').change(function(){
                fileName = determineFileName();
                processFile(fileName,false);
                //data = genderSelectHandler(data);
                //data = nonSmokerExclusionHandler(data);
                //update(data);
             });
             $('.nonSmokerSelect-cigs-apgar').change(function(){
                fileName = determineFileName();
                processFile(fileName,false);
                //data = genderSelectHandler(data);
                //data = nonSmokerExclusionHandler(data);
                //update(data);
             });
          });
   

          update(data,drawScale);
       
       }); //d3.json
    } //processFile

    function nonSmokerExclusionHandler(data) {
       includeNonSmokers = $(".nonSmokerSelect-cigs-apgar option:selected").text();
       if ( includeNonSmokers === "No" ) {
          data = data.filter(function(data){ 
                               if (data.cigs_first_tri === "Nonsmoker") {
                                  data.count = 0;
                               }
                               return data; });
       } else {
          data = data.filter(function(data){ 
                               if (data.cigs_first_tri === "Nonsmoker") {
                                  data.count = data.m_count + data.f_count;
                               }
                               return data; });
       }
       return data;
    }

    function genderSelectHandler(data) {
       var selectedGender = $(".genderSelect-cigs-first-apgar option:selected").text();
       data.forEach(function(d) {
           if ( selectedGender === 'Baby Boys' ) {
              d.count          = +d.m_count;
           } else if ( selectedGender === 'Baby Girls' ) {
              d.count          = +d.f_count;
           } else {
              d.count          = +d.f_count + +d.m_count;
           }
       });
       return data;
    }

    function compareApgarScores(a,b) {
      let comparison = 0;
      if (a.five_min_apgar > b.five_min_apgar) {
        comparison = 1;
      } else if (a.five_min_apgar < b.five_min_apgar) {
        comparison = -1;
      }
      return comparison;
    }

    function compareCigsSmoked(a,b) {
      let comparison = 0;
      if (a.cigs_first_trimester_recode > b.cigs_first_trimester_recode) {
        comparison = 1;
      } else if (a.cigs_first_trimester_recode < b.cigs_first_trimester_recode) {
        comparison = -1;
      }
      return comparison;
    }

    var y;

    function update(data,drawScale) {
       data = genderSelectHandler(data);
       data = nonSmokerExclusionHandler(data);

       maxCount = getMaxCount(data);
       area = d3.scaleLinear()
                 .domain([40, eval(maxCount)])
                 .range([0*Math.PI, 600*Math.PI]);

       //x scale
       var x = d3.scaleBand()
               .domain(data.sort(compareCigsSmoked).map(function(d){
                  return d.cigs_first_tri;
               }).sort(function(a,b) {
                  regex = /^\d+/
                  return +regex.exec(a) - +regex.exec(b)
               }))
               .range([0, width])
               .padding(0.2);

       if ( drawScale) {
       //y scale
       y = d3.scaleBand()
               .domain(data.sort(compareApgarScores).map(function(d){
                  return d.five_min_apgar;
               }))
               .range([height, 0])
               .padding(0.1);


       //x axis
       var xAxis = d3.axisBottom(x);
       canvas.append("g")
              .attr("class", "x-axis")
              .attr("transform", "translate(0, " + height + ")")
              .call(xAxis);
    
    
       //y axis
       var yAxis = d3.axisLeft(y)
                    .tickFormat(function(d){
                       return d
                    });
       canvas.append("g")
             .attr("class", "y-axis")
             .call(yAxis);

       } //if drawScale

       var circles = canvas.selectAll("circle").data(data)

       //Standard transition for the visualization
       var t = d3.transition().duration(1000);

       //Exit old elements not present in the new data
       circles.exit()
           .attr("class","exit")
           .remove();

       circles.enter()
           .append("circle")
           .on("mouseover", tip.show)
           .on("mouseout", tip.hide)
           .attr("class","enter")
           .attr("fill", "blue")
           .merge(circles)
           .transition(t)
             .attr("cy", function(d){ return (y(d.five_min_apgar) + 13); })
             .attr("cx", function(d){ return (x(d.cigs_first_tri) + 39); })
             .attr("r", function(d){ return Math.sqrt(area(d.count)/Math.PI); });

        canvas.selectAll("circle").attr("fill", function() { return (getFillColor($(".genderSelect-cigs-first-apgar option:selected").text())); });

    } // update
} // scatterPlotApgarCigs

function scatterPlotBMI(chartArea) {
    //count values being mapped
    var maxCount = 1000;

    var margin = {left:85, right:20, top:50, bottom:100};
    var height = 500 - margin.top - margin.bottom,
        width  = 800 - margin.left - margin.right;

    // entire canvas
    var canvas = d3.select(chartArea)
              .append("svg")
                 .attr("width", width + margin.left + margin.right)
                 .attr("height", height + margin.top + margin.bottom)
              .append("g")
                 .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    //Tooltip
    var tip = d3.tip().attr("class","d3-tip")
            .html(function(d) {
                     var text  = "<strong>Birth weight: </strong><span style='color:yellow'>" + (d.birth_weight) + " grams</span></br>";
                         text += "<strong>Mother BMI: </strong><span style='color:yellow'>" + (d.bmi) + "</span></br>";
                         text += "<strong>Male births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.m_count) + "</span></br>";
                         text += "<strong>Female births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.f_count) + "</span></br>";
                         text += "<strong>Total births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.m_count + d.f_count) + "</span></br>";
                     return text;
                  })
    canvas.call(tip);

    canvas.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text("Number of Births at each Birth Weight and Mother BMI");

    //x label
    canvas.append("text")
          .attr("y", height + margin.top)
          .attr("x", width/2)
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .text("Mother BMI");


    //y label
    canvas.append("text")
          .attr("y", -70)
          .attr("x", -(height/2))
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .text("Birth Weight (grams)");

    fileName = "data/bmi-birth_weight.json";
    fileType = "all";
    $('.ageSelect-bmi').change(function(){
       selectedAgeGroup = $(".ageSelect-bmi option:selected").text();
       if ( selectedAgeGroup !== "All Ages" ) {
          fileType = "age";
          fileName = "data/bmi-birth_weight-age.json";
       } else {
          fileType = "all";
          fileName = "data/bmi-birth_weight.json";
       }
       processFile(fileName);
    });
    processFile(fileName);

    function processFile(fileName) {
       //canvas.selectAll("g").selectAll("yAxis").remove();

       //Read in the data
       d3.json(fileName).then( function(data) {
    
          // ensure count is cast as integer
          data.forEach(function(d) {
             d.m_count        = +d.m_count;
             d.f_count        = +d.f_count;
             d.count          = +d.f_count + +d.m_count;
             d.birth_weight   = mapBirthWeightCode(d.birth_weight_recode12);
             d.bmi            = mapMotherBmiCode(d.mother_bmi_recode);
             if ( fileType === "age" ) {
                d.mother_age  = mapMothersAgeCode(d.mother_age_recode9);
             }
          });

          if ( fileType === "age" ) {
             data = data.filter(function(data){ return data.mother_age === selectedAgeGroup; });
          }

          update(data);

          $(document).ready(function(){
             $('.genderSelect-bmi').change(function(){
                 // var e = document.getElementById("genderSelect");
                 // var selectedGender = e.options[e.selectedIndex].value;
                 var selectedGender = $(".genderSelect-bmi option:selected").text();
                 //var selectedGender = $('input[name=gender]:checked').val();
                 data.forEach(function(d) {
                     if ( selectedGender === 'Baby Boys' ) {
                        d.count          = +d.m_count;
                     } else if ( selectedGender === 'Baby Girls' ) {
                        d.count          = +d.f_count;
                     } else {
                        d.count          = +d.f_count + +d.m_count;
                     }
                 });
                 update(data);
             });
          });
       }); //d3.json
    } //processFile

    function compareBMI(a,b) {
      let comparison = 0;
      if (a.mother_bmi_recode > b.mother_bmi_recode) {
        comparison = 1;
      } else if (a.mother_bmi_recode < b.mother_bmi_recode) {
        comparison = -1;
      }
      return comparison;
    }

    function compareBirthWeight(a,b) {
      let comparison = 0;
      if (a.birth_weight_recode12 > b.birth_weight_recode12) {
        comparison = 1;
      } else if (a.birth_weight_recode12 < b.birth_weight_recode12) {
        comparison = -1;
      }
      return comparison;
    }
    
    function update(data) {
       maxCount = getMaxCount(data);
       area = d3.scaleLinear()
                 .domain([40, eval(maxCount)])
                 .range([0*Math.PI, 600*Math.PI]);
       //x scale
       var x = d3.scaleBand()
               .domain(data.sort(compareBMI).map(function(d){
                  return d.bmi;
               }))
               .range([0, width])
               .padding(0.2);

       //y scale
       var y = d3.scaleBand()
               .domain(data.sort(compareBirthWeight).map(function(d){
                  return d.birth_weight;
               }))
               .range([height, 0])
               .padding(0.1);


       //x axis
       var xAxis = d3.axisBottom(x);
       canvas.append("g")
              .attr("class", "x-axis")
              .attr("transform", "translate(0, " + height + ")")
              .call(xAxis)
            .selectAll("text")
              .attr("transform", "rotate(-8)");
    
    
       //y axis
       var yAxis = d3.axisLeft(y)
                    .tickFormat(function(d){
                       return d
                    });
       var yax = canvas.append("g")
             .attr("class", "y-axis")
             .call(yAxis)
            .selectAll("text")
              .attr("transform", "rotate(-8)");

       var circles = canvas.selectAll("circle").data(data)

       //Standard transition for the visualization
       var t = d3.transition().duration(1000);

       //Exit old elements not present in the new data
       circles.exit()
           .attr("class","exit")
           .remove();

       circles.enter()
           .append("circle")
           .on("mouseover", tip.show)
           .on("mouseout", tip.hide)
           .attr("class","enter")
           .attr("fill", "blue")
           .merge(circles)
           .transition(t)
             .attr("cy", function(d){ return (y(d.birth_weight) + 13); })
             .attr("cx", function(d){ return (x(d.bmi) + 39); })
             .attr("r", function(d){ return Math.sqrt(area(d.count)/Math.PI); });

        canvas.selectAll("circle").attr("fill", function() { return (getFillColor($(".genderSelect-bmi option:selected").text())); });

    } //update
} // scatterPlotBMI


function scatterPlot(chartArea) {
    var margin = {left:85, right:20, top:50, bottom:100};
    var height = 500 - margin.top - margin.bottom,
        width  = 800 - margin.left - margin.right;

    // entire canvas
    var canvas = d3.select(chartArea)
              .append("svg")
                 .attr("width", width + margin.left + margin.right)
                 .attr("height", height + margin.top + margin.bottom)
              .append("g")
                 .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    //Tooltip
    var tip = d3.tip().attr("class","d3-tip")
            .html(function(d) {
                     var text  = "<strong>Birth weight: </strong><span style='color:yellow'>" + (d.birth_weight) + " grams</span></br>";
                         text += "<strong>Weight gain: </strong><span style='color:yellow'>" + (d.weight_gain) + " lbs</span></br>";
                         text += "<strong>Male births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.m_count) + "</span></br>";
                         text += "<strong>Female births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.f_count) + "</span></br>";
                         text += "<strong>Total births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.m_count + d.f_count) + "</span></br>";
                     return text;
                  })
    canvas.call(tip);

    canvas.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text("Number of Births at each Birth Weight and Mother Weight Gain");

    //x label
    canvas.append("text")
          .attr("y", height + margin.top)
          .attr("x", width/2)
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .text("Mother Weight Gain (lbs)");


    //y label
    canvas.append("text")
          .attr("y", -70)
          .attr("x", -(height/2))
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .text("Birth Weight (grams)");


    fileName = "data/weight_gain-birth_weight.json";
    fileType = "all";
    $('.ageSelect-weight').change(function(){
       selectedAgeGroup = $(".ageSelect-weight option:selected").text();
       if ( selectedAgeGroup !== "All Ages" ) {
          fileType = "age";
          fileName = "data/weight_gain-birth_weight-age.json";
       } else {
          fileType = "all";
          fileName = "data/weight_gain-birth_weight.json";
       }
       processFile(fileName);
    });
    processFile(fileName);

    function processFile(fileName) {
       canvas.selectAll("yax").remove();

       //Read in the data
       d3.json(fileName).then( function(data) {
    
          // ensure count is cast as integer
          data.forEach(function(d) {
             d.m_count        = +d.m_count;
             d.f_count        = +d.f_count;
             d.count          = +d.f_count + +d.m_count;
             d.birth_weight   = mapBirthWeightCode(d.birth_weight_recode12);
             d.weight_gain    = mapWeightGainCode(d.weight_gain_recode);
             if ( fileType === "age" ) {
                d.mother_age  = mapMothersAgeCode(d.mother_age_recode9);
             }
          });

          if ( fileType === "age" ) {
             data = data.filter(function(data){ return data.mother_age === selectedAgeGroup; });
          }
          update(data);

          $(document).ready(function(){
             $('.genderSelect-weight').change(function(){
                 // var e = document.getElementById("genderSelect");
                 // var selectedGender = e.options[e.selectedIndex].value;
                 var selectedGender = $(".genderSelect-weight option:selected").text();
                 //var selectedGender = $('input[name=gender]:checked').val();
                 data.forEach(function(d) {
                     if ( selectedGender === 'Baby Boys' ) {
                        d.count          = +d.m_count;
                     } else if ( selectedGender === 'Baby Girls' ) {
                        d.count          = +d.f_count;
                     } else {
                        d.count          = +d.f_count + +d.m_count;
                     }
                 });
                 update(data);
             });
          });
       }); //d3.json
    }

    function compareBirthWeight(a, b) {
      let comparison = 0;
      if (a.birth_weight_recode12 > b.birth_weight_recode12) {
        comparison = 1;
      } else if (a.birth_weight_recode12 < b.birth_weight_recode12) {
        comparison = -1;
      }
      return comparison;
    }

    function compareWeightGain(a, b) {
      let comparison = 0;
      if (a.weight_gain_recode > b.weight_gain_recode) {
        comparison = 1;
      } else if (a.weight_gain_recode < b.weight_gain_recode) {
        comparison = -1;
      }
      return comparison;
    }

    function update(data) {
       maxCount = getMaxCount(data);
       area = d3.scaleLinear()
                 .domain([40, eval(maxCount)])
                 .range([0*Math.PI, 600*Math.PI]);
       //x scale
       var x = d3.scaleBand()
               .domain(data.sort(compareWeightGain).map(function(d){
                  return d.weight_gain;
               }))
               .range([0, width])
               .padding(0.2);

       //y scale
       var y = d3.scaleBand()
               .domain(data.sort(compareBirthWeight).map(function(d){
                  return d.birth_weight;
               }))
               .range([height, 0])
               .padding(0.1);


       //x axis
       var xAxis = d3.axisBottom(x);
       canvas.append("g")
              .attr("class", "x-axis")
              .attr("transform", "translate(0, " + height + ")")
              .call(xAxis)
            .selectAll("text")
              .attr("transform", "rotate(-10)");
    
    
       //y axis
       var yAxis = d3.axisLeft(y)
                    .tickFormat(function(d){
                       return d
                    });
       var yax = canvas.append("g")
             .attr("class", "y-axis")
             .call(yAxis)
            .selectAll("text")
              .attr("transform", "rotate(-10)");

       var circles = canvas.selectAll("circle").data(data)

       //Standard transition for the visualization
       var t = d3.transition().duration(1000);

       //Exit old elements not present in the new data
       circles.exit()
           .attr("class","exit")
           .remove();

       circles.enter()
           .append("circle")
           .on("mouseover", tip.show)
           .on("mouseout", tip.hide)
           .attr("class","enter")
           .attr("fill", "blue")
           .merge(circles)
           .transition(t)
             .attr("cy", function(d){ return (y(d.birth_weight) + 13); })
             .attr("cx", function(d){ return (x(d.weight_gain) + 45); })
             .attr("r", function(d){ return Math.sqrt(area(d.count)/Math.PI); });

        canvas.selectAll("circle").attr("fill", function() { return (getFillColor($(".genderSelect-weight option:selected").text())); });

    } //update
} // scatterPlot




function plotStuff(chartArea) {
    var margin = {left:85, right:20, top:50, bottom:100};
    var height = 500 - margin.top - margin.bottom,
        width  = 800 - margin.left - margin.right;

    // entire canvas
    var canvas = d3.select(chartArea)
              .append("svg")
                 .attr("width", width + margin.left + margin.right)
                 .attr("height", height + margin.top + margin.bottom)
              .append("g")
                 .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    //Tooltip
    var tip = d3.tip().attr("class","d3-tip")
            .html(function(d) {
                     var text  = "<strong>Male births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.m_count) + "</span></br>";
                         text += "<strong>Female births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.f_count) + "</span></br>";
                         text += "<strong>Total births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.m_count + d.f_count) + "</span></br>";
                     return text;
                  })
    canvas.call(tip);

    canvas.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text("Number of Births at each Birth Weight");

    //x label
    canvas.append("text")
          .attr("y", height + margin.top)
          .attr("x", width/2)
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .text("Birth Weight (grams)");


    //y label
    canvas.append("text")
          .attr("y", -70)
          .attr("x", -(height/2))
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .text("Number of Births");


    //Read in the data
    d3.json("data/birthweight.json").then( function(data) {
    
       // ensure count is cast as integer
       data.forEach(function(d) {
          d.m_count      = +d.m_count;
          d.f_count      = +d.f_count;
          d.count        = +d.f_count + +d.m_count;
          d.birth_weight = mapBirthWeightCode(d.birth_weight_recode12);
          d.weight_gain  = mapWeightGainCode(d.weight_gain_recode);
       });

       update(data,true);

       $(document).ready(function(){
          $('.genderSelect').change(function(){
              var selectedGender = $(".genderSelect option:selected").text();
              data.forEach(function(d) {
                  if ( selectedGender === 'Baby Boys' ) {
                     d.count          = +d.m_count;
                  } else if ( selectedGender === 'Baby Girls' ) {
                     d.count          = +d.f_count;
                  } else {
                     d.count          = +d.f_count + +d.m_count;
                  }
              });
              update(data,false);
          });
       });
    }); //d3.json

    var y;
    function update(data,drawAxis) {
    
       //x scale
       var x = d3.scaleBand()
               .domain(data.map(function(d){
                  return d.birth_weight;
               }))
               .range([0, width])
               .padding(0.2);

       if (drawAxis) {
       //y scale
       y = d3.scaleLinear()
               .domain([0, d3.max(data, function(d){
                  return d.count;
               })])
               .range([height, 0]);


       //x axis
       var xAxis = d3.axisBottom(x);
       canvas.append("g")
              .attr("class", "x-axis")
              .attr("transform", "translate(0, " + height + ")")
              .call(xAxis)
            .selectAll("text")
              .attr("transform", "rotate(-10)");
    
    
       //y axis
       var yAxis = d3.axisLeft(y)
                     .scale(y)
                    .tickFormat(function(d){
                       return d
                    });
       canvas.append("g")
             .attr("class", "y-axis")
             .call(yAxis)
            .selectAll("text")
              .attr("transform", "rotate(-10)");
       }

       //bars
       // canvas.selectAll("rect")
       //          .data(data)
       //       .enter().append('rect')
       //          .attr("y", function(d){return y(d.count); })
       //          .attr("x", function(d){return x(d.birth_weight); })
       //          .attr("height", function(d){return height - y(d.count); })
       //          .attr("width", x.bandwidth)
       //          .attr("fill", "blue");

       var rects = canvas.selectAll("rect").data(data);

       var t = d3.transition().duration(1000);

       //Exit old elements not present in the new data
       rects.exit()
           .attr("class","exit")
           .remove();

       rects.enter()
           .append("rect")
           .on("mouseover", tip.show)
           .on("mouseout", tip.hide)
           .attr("class","enter")
           .attr("fill", "blue")
           .merge(rects)
           .transition(t)
                .attr("y", function(d){return y(d.count); })
                .attr("x", function(d){return x(d.birth_weight); })
                .attr("height", function(d){return height - y(d.count); })
                .attr("width", x.bandwidth)

        canvas.selectAll("rect").attr("fill", function() { return (getFillColor($(".genderSelect option:selected").text())); });

    } //update
} //plotStuff


function plotMotherAge(chartArea) {
    var margin = {left:85, right:20, top:50, bottom:100};
    var height = 500 - margin.top - margin.bottom,
        width  = 800 - margin.left - margin.right;

    // entire canvas
    var canvas = d3.select(chartArea)
              .append("svg")
                 .attr("width", width + margin.left + margin.right)
                 .attr("height", height + margin.top + margin.bottom)
              .append("g")
                 .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    //Tooltip
    var tip = d3.tip().attr("class","d3-tip")
            .html(function(d) {
                     var text  = "<strong>Male births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.m_count) + "</span></br>";
                         text += "<strong>Female births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.f_count) + "</span></br>";
                         text += "<strong>Total births: </strong><span style='color:yellow'>" + d3.format(",.0f")(d.m_count + d.f_count) + "</span></br>";
                     return text;
                  })
    canvas.call(tip);

    canvas.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text("Number of Births at each Mother Age Group");

    //x label
    canvas.append("text")
          .attr("y", height + margin.top)
          .attr("x", width/2)
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .text("Mother's Age");


    //y label
    canvas.append("text")
          .attr("y", -70)
          .attr("x", -(height/2))
          .attr("font-size", "20px")
          .attr("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .text("Number of Births");


    //Read in the data
    d3.json("data/mothers-age.json").then( function(data) {
    
       // ensure count is cast as integer
       data.forEach(function(d) {
          d.m_count      = +d.m_count;
          d.f_count      = +d.f_count;
          d.count        = +d.f_count + +d.m_count;
          d.mothers_age  = mapMothersAgeCode(d.mother_age_recode9);
       });

       update(data,true);

       $(document).ready(function(){
          $('.genderSelect-age').change(function(){
              var selectedGender = $(".genderSelect-age option:selected").text();
              data.forEach(function(d) {
                  if ( selectedGender === 'Baby Boys' ) {
                     d.count          = +d.m_count;
                  } else if ( selectedGender === 'Baby Girls' ) {
                     d.count          = +d.f_count;
                  } else {
                     d.count          = +d.f_count + +d.m_count;
                  }
              });
              update(data,false);
          });
       });
    }); //d3.json

    var y;
    function update(data,drawScale) {
    
       //x scale
       var x = d3.scaleBand()
               .domain(data.map(function(d){
                  return d.mothers_age;
               }))
               .range([0, width])
               .padding(0.2);

       if (drawScale) {
       //y scale
       y = d3.scaleLinear()
               .domain([0, d3.max(data, function(d){
                  return d.count;
               })])
               .range([height, 0]);


       //x axis
       var xAxis = d3.axisBottom(x);
       canvas.append("g")
              .attr("class", "x-axis")
              .attr("transform", "translate(0, " + height + ")")
              .call(xAxis)
            .selectAll("text")
              .attr("transform", "rotate(-10)");
    
    
       //y axis
       var yAxis = d3.axisLeft(y)
                    .tickFormat(function(d){
                       return d
                    });

       canvas.append("g")
             .attr("class", "y-axis")
             .call(yAxis)
            .selectAll("text")
              .attr("transform", "rotate(-10)");
       }

       var rects = canvas.selectAll("rect").data(data);

       var t = d3.transition().duration(1000);

       //Exit old elements not present in the new data
       rects.exit()
           .attr("class","exit")
           .remove();

       rects.enter()
           .append("rect")
           .on("mouseover", tip.show)
           .on("mouseout", tip.hide)
           .attr("class","enter")
           .attr("fill", "blue")
           .merge(rects)
           .transition(t)
                .attr("y", function(d){ return y(d.count); })
                .attr("x", function(d){return x(d.mothers_age); })
                .attr("height", function(d){return height - y(d.count); })
                .attr("width", x.bandwidth)

        canvas.selectAll("rect").attr("fill", function() { return (getFillColor($(".genderSelect-age option:selected").text())); });

    } //update
} //plotMotherAge distribution


pieChart("#pie-chart-area");
plotStuff("#chart-area");
plotMotherAge("#mothers-age-area")
scatterPlot("#weight-scatter-plot-area");
scatterPlotBMI("#bmi-scatter-plot-area");
scatterPlotApgarCigs("#apgar-cigs-area");
scatterPlotWeightGestDiab("#weight-gest-diab-area");
scatterPlotMaritalWeight("#marital-weight-scatter-plot-area");
scatterPlotMaritalApgar("#marital-apgar-scatter-plot-area");
scatterPlotWicWeight("#wic-weight-scatter-plot-area");
scatterPlotWicApgar("#wic-apgar-scatter-plot-area");

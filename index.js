// Creating s Scatterplot Graph from Doping in Professional Bicycle Racing.
// Using D3.js to visualize data with AJAX request and  JSON API.
// Creating the project for freeCodeCamp Data Visualization Certification as a second project.

const width = 700;
const height = 450;
const padding = 90;
const legendContainer = [
  {
    color: "orange",
    text: "No Doping",
  },
  { color: "blue", text: "Doping" },
];

let xAxisScale;
let yAxisScale;

const svg = d3.select("svg");
svg.attr("viewBox", `0 0 700 450`);

svg
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -270)
  .attr("y", 40)
  .text("Time in minutes");

svg.append("text").attr("x", 340).attr("y", 400).text("Year");

const tooltip = d3
  .select("#tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden")
  .attr("class", "tooltip")
  .attr("id", "tooltip");

const createScales = (data) => {
  const yearData = data.map((d) => {
    return d.Year;
  });

  const timeData = data.map((d) => {
    return new Date(d.Seconds * 1000);
  });

  xAxisScale = d3
    .scaleLinear()
    .domain([d3.min(yearData) - 1, d3.max(yearData) + 1])
    .range([padding, width - padding]);

  yAxisScale = d3
    .scaleTime()
    .domain([d3.min(timeData), d3.max(timeData)])
    .range([padding, height - padding]);
};

const createAxes = () => {
  const xAxis = d3.axisBottom(xAxisScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yAxisScale).tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + (height - padding) + ")");

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ",0)");
};

const createLegendArea = () => {
  const legend = svg
    .append("g")
    .attr("id", "legend")
    .selectAll("#legend")
    .data(legendContainer)
    .enter()
    .append("g")
    .attr("transform", (d, i) => {
      return "translate(0," + (height / 2 - i * 20) + ")";
    });

  legend
    .append("rect")
    .attr("x", width - 18 - padding)
    .attr("y", -150)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", (d) => {
      if (d.text === "Doping") {
        return "blue";
      } else {
        return "orange";
      }
    });

  legend
    .append("text")
    .attr("x", width - 20 - padding)
    .attr("y", -138)
    .style("text-anchor", "end")
    .text((d) => {
      if (d.color == "blue") return "Riders with doping allegations";
      else {
        return "No doping allegations";
      }
    });
};

const drawCircles = (data) => {
  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", "6")
    .attr("data-xvalue", (item) => {
      return item.Year;
    })
    .attr("data-yvalue", (data) => {
      return new Date(data.Seconds * 1000);
    })
    .attr("cx", (item) => {
      return xAxisScale(item.Year);
    })
    .attr("cy", (item) => {
      return yAxisScale(new Date(item.Seconds * 1000));
    })
    .attr("fill", (item) => {
      if (item.Doping.length === 0) {
        return "orange";
      } else {
        return "blue";
      }
    })
    .on("mouseover", (d, i) => {
      tooltip.style("visibility", "visible");
      tooltip.attr("data-year", d.Year);
      tooltip.html(
        `${d.Name}: ${d.Nationality} <br> Year: ${d.Year} <br> Time: ${d.Time}
          <br>${d.Doping ? d.Doping : ""} `
      );
      tooltip
        .style("top", event.pageY - 2 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", (d) => {
      tooltip.style("visibility", "hidden");
    });

  createLegendArea();
};

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((response) => response.json())
  .then((res) => {
    createScales(res);
    createAxes();
    drawCircles(res);
  });

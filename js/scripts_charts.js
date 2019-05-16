var width = document.getElementById('vis')
    .clientWidth;
var height = document.getElementById('vis')
    .clientHeight;

var margin = {
    top: 10,
    bottom: 70,
    left: 70,
    right: 20
};

var svg = d3.select('#vis')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');

width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

var data = {};

var x_scale = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1);

var y_scale = d3.scaleLinear()
    .range([height, 0]);

var colour_scale = d3.scaleQuantile()
    .range(["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"]);

var y_axis = d3.axisLeft(y_scale);
var x_axis = d3.axisBottom(x_scale);

svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')');

svg.append('g')
    .attr('class', 'y axis');

function draw(year) {

    var csv_data = data[year];

    var t = d3.transition()
        .duration(2000);

    var zips = csv_data.map(function(d) {
        return d.zipcode;
    });
    x_scale.domain(zips);

    var max_value = d3.max(csv_data, function(d) {
        return +d.value;
    });

    y_scale.domain([0, max_value]);
    colour_scale.domain([0, max_value]);

    var bars = svg.selectAll('.bar')
        .data(csv_data)

    bars
        .exit()
        .remove();

    var new_bars = bars
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) {
            return x_scale(d.zipcode);
        })
        .attr('width', x_scale.bandwidth())
        .attr('y', height)
        .attr('height', 0)

    new_bars.merge(bars)
        .transition(t)
        .attr('y', function(d) {
            return y_scale(+d.value);
        })
        .attr('height', function(d) {
            return height - y_scale(+d.value)
        })
        .attr('fill', function(d) {
            return colour_scale(+d.value);
        })

    svg.select('.x.axis')
        .call(x_axis);

    svg.select('.y.axis')
        .transition(t)
        .call(y_axis);

}

d3.queue()
    .defer(d3.csv, 'data/zipcode_data_2018.csv')
    .defer(d3.csv, 'data/zipcode_data_2017.csv')
    .defer(d3.csv, 'data/zipcode_data_2016.csv')
    .defer(d3.csv, 'data/zipcode_data_2015.csv')
    .defer(d3.csv, 'data/zipcode_data_2014.csv')
    .await(function(error, d2018, d2017, d2016, d2015, d2014) {
        data['2014'] = d2014;
        data['2015'] = d2015;
        data['2016'] = d2016;
        data['2017'] = d2017;
        data['2018'] = d2018;
        draw('2018');
    });

var slider = d3.select('#year');
slider.on('change', function() {
    draw(this.value);
});

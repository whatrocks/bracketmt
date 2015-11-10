angular.module('bracketmt.directives', [])

.directive('d3test', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      replace: false,
      scope: { data: '='},
      link: function postLink(scope, element, attrs) {
        var w = 500;
        var h = 400;

        var svg = d3.select(element[0]).append('svg')
          .attr('width', w)
          .attr('height', h);

        scope.$watch('data', function(data) {
          if (data) {
            var escala = function(m) {
              return d3.scale
                .linear()
                .domain([d3.min(data), d3.max(data)])
                .range([10, m - 50]);
            };

            var ancho = escala(w);
            var alto = escala(h);
            var radio = d3.scale
              .linear()
              .domain([d3.min(data), d3.max(data)])
              .range([10, 50]);

            var color = function(d) {
              return d3.hsl(d*10,1,0.5);
            };

            var circle_set = function(c) {
              c
                .attr('r', radio)
                .attr('cx', ancho)
                .attr('cy', alto)
                .style('fill', color);
            };

            var circles = svg.selectAll('circle');
            var sel = circles.data(data);

            sel
              .transition()
              .ease('bounce')
              .duration(500)
              .call(circle_set);

            sel.enter()
              .append('circle')
              .call(circle_set);

            sel.exit()
              .remove();
          }
        });
      }
    };
});

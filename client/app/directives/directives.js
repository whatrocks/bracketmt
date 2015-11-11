angular.module('bracketmt.directives', [])

.directive('bracket', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      replace: true,
      scope: { data: '='},
      link: function postLink(scope, element, attrs) {
        var w = window.innerWidth;
        var h = 600;

        var svg = d3.select(element[0]).append('svg')
          .attr('width', w)
          .attr('height', h);

        scope.$watch('data', function(data) {
          
          if (data) {

            var randomX = function() { return Math.random () * w;};
            var randomY = function() { return Math.random () * h;};

            var color = function(d) {
              return d3.hsl(d*10,1,0.5);
            };

            var circle_set = function(c) {
              c
                .attr('r', 25)
                .attr('cx', randomX)
                .attr('cy', randomY)
                .style('fill', color);
            };

            var circles = svg.selectAll('circle');
            var sel = circles.data(data);
            
            sel.enter()
              .append('circle')
              .call(circle_set);
            
            var moving = function() {
              sel
                .transition()
                .ease('elastic')
                .duration(2000)
                .call(circle_set);

              sel.exit()
                .remove();
            };
            
            setInterval(function(){
              moving();
            }.bind(this), 2000);

          }

        });
      }
    };
});

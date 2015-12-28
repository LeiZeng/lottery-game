var _ = require('lodash');

module.exports = function Shredder(number, group){
  var _number = number;
  var _group = group;
  var arr = _.chain(1).range(number + 1).shuffle().value();
  var dimenArr = [];
  var length = parseInt(number / group);
  for (var i = 0; i < group - 1; i ++){
    dimenArr.push(arr.splice(0, length));
  }
  dimenArr.push(arr);

  this.getDimension = function(){
    return dimenArr;
  }
  this.getSplice = function(){
    return dimenArr.shift();
  }
  this.getLength = function() {
    return dimenArr.length;
  }
}

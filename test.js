var libraries = {}


function addLibrary(name, callback) {
  libraries[name] = callback;
}


function runTests() {

  results = {};

  for (key in libraries) {
    var testFunction = libraries[key];
    results[key] = getResults(testFunction);
  }

  drawResults(results);

}


function drawResults(results) {
  var wrapper = document.querySelector('#results');
  wrapper.innerHTML = '';

  var output = document.createDocumentFragment()

  function addCell(row, content) {
    var cell = row.appendChild(document.createElement('td'));
    cell.appendChild(document.createTextNode(content));
    return cell;
  }

  for (key in results) {
    var data = results[key];
    var row = output.appendChild(document.createElement('tr'));

    addCell(row, key);
    addCell(row, data.validSelectors);
    addCell(row, data.invalidSelectors);
    addCell(row, data.notFoundSelectors);
    addCell(row, data.nonUniqueSelectors);
    addCell(row, data.nonMatchingSelectors);
    addCell(row, "(" + data.longestSelector.length + ") " + data.longestSelector);
    addCell(row, data.duration + "ms");

  }

  wrapper.appendChild(output);

}


function getResults(testFunction) {

  var elements = document.querySelector('#wrap').querySelectorAll('*');

  var result = {
    duration: -1,
    validSelectors: 0,
    invalidSelectors: 0,
    nonUniqueSelectors: 0,
    nonMatchingSelectors: 0,
    notFoundSelectors: 0,
    longestSelector: ''
  };
  var outputs = [];

  var timeStart = (new Date).getTime();

  for (var i = 0, j = elements.length; i < j; i++) {
    var element = elements[i];
    var selector = testFunction(element);
    outputs.push({
      element: element,
      selector: selector
    });
  }

  var timeEnd = (new Date).getTime();
  result.duration = timeEnd - timeStart

  for (i = 0, j = outputs.length; i < j; i++) {
    var selector = outputs[i].selector;
    var element = outputs[i].element;

    if (selector) {

      var foundElements = []

      try {
        foundElements = document.querySelectorAll(selector);
      } catch (e) {
        result.invalidSelectors++;
      }


      if (foundElements.length > 1) {
        result.nonUniqueSelectors++;
      } else {
        if (foundElements[0] === element) {
          result.validSelectors++;
        } else {
          result.nonMatchingSelector++;
        }
      }

      if (selector.length > result.longestSelector.length) {
        result.longestSelector = selector;
      }

    } else {
      result.notFoundSelectors++;
    }

  }

  return result;

}

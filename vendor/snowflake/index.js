/*
code extracted from:
https://github.com/desmondw/snowflake/blob/master/js/inject.js#L55
*/





// creates a unique css selector for the given element
function generateSelector(el){
  var selector = "";
  var tree = $(el).parentsUntil(document);

  // generate full selector by traversing DOM from bottom-up
  for (var i = -1; i < tree.length; i++){
    var e = i < 0 ? el : tree[i];

    var eCSS = querifyElement(e);
    var query = eCSS.query + (selector.length ? ' > ' : '') + selector;

    var matches = $(query);

    if (matches.length === 1 && matches[0] === el){
      return query;
    }
    else if (matches.length > 1 && i + 1 < tree.length){

      var parentQuery = generateSelector(tree[i + 1]);
      var parentMatches = $(parentQuery).children(eCSS.tag);
      var nthQuery = eCSS.tag + ':nth-of-type(' + (parentMatches.index(el) + 1) + ')' + (selector.length ? ' > ' : '') + selector;
      var parentNthQuery = parentQuery + ' > ' + nthQuery;
      var nthMatches = $(parentNthQuery);

      if (nthMatches.length === 1 && nthMatches[0] === el){
        return parentNthQuery;
      }
      else {
        printError("----------")
        return 'ERROR';
      }
    }
    else {
      if (matches.length === 1) printError("Matched incorrect element. (matches.length = " + matches.length + ")")
      else if (matches.length > 1) printError("Multiple matches, but traversed entire tree (algorithm not being specific enough).")
      else printError("Could not find match for tag/id/class selector. (matches.length = " + matches.length + ")")
      return 'ERROR';
    }
  }

  return selector;
}



// returns object with element information in query format
function querifyElement(e){
  if (!e) return null;

  var tag = e.tagName.toLowerCase();
  var ids = e.id ? '#' + e.id.trim().split(' ').join('#') : "";
  var classes = e.className ? '.' + e.className.trim().split(' ').join('.') : "";
  var query = tag + ids + classes;

  return {
    element: e,
    tag: tag,
    ids: ids,
    classes: classes,
    query: query
  }
}

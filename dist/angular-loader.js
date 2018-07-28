const js_beautify = require('js-beautify').js_beautify;
module.exports = (source,map) => {
  let anychar = "(?:.|\\n)",
    blank = "\\s*",
    fnStr = "",
    test = "",
    expr = {
    "template" : {
      regexp : tagExpr("template"),
      handler : function(source){
        return "var template = \"" + replaceAllReture(source) + "\";\n";
      }
    },
    "style" : {
      regexp : tagExpr("style"),
      handler : function(source){
        return "var style = \"" + replaceAllReture(source) + "\";\n";
      }
    },
    "script" : {
      regexp : tagExpr("script"),
      handler : function(source){
        return "var script = " + source;
      }
    }
  }
  function removeBlankEveryLine(str){
    return str.split(/\n/g)
      .map(function(n){
        return n.substring(2);
      })
      .join("\n");
  }
  function replaceAllReture(str){
    var rs = "";
    for(var i = 0; i < str.length; i++){
      if(str[i] === "\n") {
        rs += "\\\n";
      } else if(str[i] === "\""){
        rs += "\\\""
      } else {
        rs += str[i];
      };
    };
    return rs;
  }
  function tagExpr(tag){
    return new RegExp("\\<" + blank + tag + blank + "[^><]*\\>(" + anychar + "*)\\<" + blank + "\/" + blank + tag + blank + "\\>");
  }
  for(var i in expr){
    var match = expr[i]["regexp"].exec(source);
    fnStr += expr[i]["handler"](match[1]);
  }
  fnStr += "module.exports = {\
    template : template,\
    style : style,\
    controller : script\
  }"
  return js_beautify(fnStr);
}
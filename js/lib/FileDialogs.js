var FileDialogsConfig = function() {
  return {
    width: 0,
    height: 0,
    padding: 5,
    save: {
      image: "",
      handler: ""
    },
    open: {
      image: "",
      handler: ""
    }
  };
};

var FileDialogs = function(placeHolder, config) {
  var movieName = "flash/FileDialogs.swf";
  if (placeHolder == undefined || config == undefined)
    return;
  var holder = document.createElement('div');
  holder.style.width = config.width;
  holder.style.height = config.height;
  holder.style.overflow = "hidden";
  var params = "padding=" + config.padding + "&";
  if (config.open.image != "" && config.open.handler != "") {
    params += "openImage=" + config.open.image + "&openCallback="
        + config.open.handler;
  }
  if (config.save.image != "" && config.save.handler != "") {
    params += ((params.match("&$") == "&") ? "" : "&") + "saveImage="
        + config.save.image + "&saveCallback=" + config.save.handler;
  }

  var html;

  if (navigator.userAgent.match(/MSIE/)) {
    holder.style.styleFloat = "left";
    html = "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' width='500' height='500' id='FileDialogsFlash' data="
        + movieName
        + " type='application/x-shockwave-flash'>"
        + "<param name='allowScriptAccess' value='always'/>"
        + "<param name='scaleMode' value='noScale'/>"
        + "<param name='movie' value='"
        + movieName
        + "'/>"
        + "<param name='flashvars' value='"
        + params
        + "'/>"
        + "<param name='wmode' value='transparent'/>" + "</object>";
    holder.innerHTML = html;
  }
  else {
    holder
        .setAttribute("style", holder.getAttribute("style") + "; float:left;");
    // all other browsers get an EMBED tag
    html = document.createElement('embed');
    html.setAttribute('src', movieName);
    html.setAttribute('width', "500");
    html.setAttribute('height', "500");
    html.setAttribute('name', "FileDialogsFlash");
    html.setAttribute('scaleMode', "noScale");
    html.setAttribute('allowScriptAccess', "always");
    html.setAttribute('type', "application/x-shockwave-flash");
    html.setAttribute('pluginspage',
        "http://www.macromedia.com/go/getflashplayer");
    html.setAttribute('flashvars', params);
    html.setAttribute('wmode', "transparent");
    holder.appendChild(html);
  }
  document.getElementById(placeHolder).appendChild(holder);
};

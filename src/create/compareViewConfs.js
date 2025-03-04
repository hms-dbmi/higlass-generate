import odiff from 'odiff';

/**
 * Extract JSON body content from response
 *
 * @param   {String} viewConf1 - metadata of previous view config
 * @param   {String} viewConf2 - metadata of next view config
 * @param   {String} url - URL at which the next view config can be retrieved
 * @return  {Array} return array detailing the type of change (none/reload/zoom)
 * and the information relevant to each change (zoom coordinates and URL)
 */
export function typeOfChange(viewConf1, viewConf2, url) { 
    viewConf1 = JSON.parse(viewConf1);
    viewConf2 = JSON.parse(viewConf2);
    var diffsArr = odiff(viewConf1, viewConf2); // creates an array of differences between viewconfs
    var params = {};
    if(diffsArr.length === 0) {
        return ["none",params];
    }
    for(var i=0; i<diffsArr.length; i++) {
        if(diffsArr[i].path.length < 4 || (diffsArr[i].path[2] !== "initialXDomain" && diffsArr[i].path[2] !== "initialYDomain")) {
            params.url = url;
            params.zoom = {};
            for(var i=0; i<viewConf2.views.length; i++) {
                params.zoom[i] = [viewConf2.views[i].uid, viewConf2.views[i].initialXDomain[0], viewConf2.views[i].initialXDomain[1], 
                viewConf2.views[i].initialYDomain[0], viewConf2.views[i].initialYDomain[1]];
            }
            return ["reload", params];
        }
    }
    params.url = url;
    params.zoom = {};
    for(var i=0; i<viewConf2.views.length; i++) {
      params.zoom[i] = [viewConf2.views[i].uid, viewConf2.views[i].initialXDomain[0], viewConf2.views[i].initialXDomain[1], 
          viewConf2.views[i].initialYDomain[0], viewConf2.views[i].initialYDomain[1]];
    }
    return ["zoom",params];
}
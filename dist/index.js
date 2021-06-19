(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.geojsonRewind = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

module.exports = rewind;

function rewind(gj, outer) {
    var type = gj && gj.type, i;

    if (type === 'FeatureCollection') {
        for (i = 0; i < gj.features.length; i++) rewind(gj.features[i], outer);

    } else if (type === 'GeometryCollection') {
        for (i = 0; i < gj.geometries.length; i++) rewind(gj.geometries[i], outer);

    } else if (type === 'Feature') {
        rewind(gj.geometry, outer);

    } else if (type === 'Polygon') {
        rewindRings(gj.coordinates, outer);

    } else if (type === 'MultiPolygon') {
        for (i = 0; i < gj.coordinates.length; i++) rewindRings(gj.coordinates[i], outer);
    }

    return gj;
}

function rewindRings(rings, outer) {
    if (rings.length === 0) return;

    rewindRing(rings[0], outer);
    for (var i = 1; i < rings.length; i++) {
        rewindRing(rings[i], !outer);
    }
}

function rewindRing(ring, dir) {
    var area = 0, err = 0;
    for (var i = 0, len = ring.length, j = len - 1; i < len; j = i++) {
        var k = (ring[i][0] - ring[j][0]) * (ring[j][1] + ring[i][1]);
        var m = area + k;
        err += Math.abs(area) >= Math.abs(k) ? area - m + k : k - m + area;
        area = m;
    }
    if (area + err >= 0 !== !!dir) ring.reverse();
}

},{}]},{},[1])(1)
});

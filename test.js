'use strict';

var test = require('tape').test;
var kdbush = require('./');

/* eslint comma-spacing: 0 */

var points = [
54,1, 97,21, 65,35, 33,54, 95,39, 54,3, 53,54, 84,72, 33,34, 43,15, 52,83, 81,23, 1,61, 38,74,
11,91, 24,56, 90,31, 25,57, 46,61, 29,69, 49,60, 4,98, 71,15, 60,25, 38,84, 52,38, 94,51, 13,25,
77,73, 88,87, 6,27, 58,22, 53,28, 27,91, 96,98, 93,14, 22,93, 45,94, 18,28, 35,15, 19,81, 20,81,
    67,53, 43,3, 47,66, 48,34, 46,12, 32,38, 43,12, 39,94, 88,62, 66,14, 84,30, 72,81, 41,92, 26,4,
    6,76, 47,21, 57,70, 71,82, 50,68, 96,18, 40,31, 78,53, 71,90, 32,14, 55,6, 32,88, 62,32, 21,67,
    73,81, 44,64, 29,50, 70,5, 6,22, 68,3, 11,23, 20,42, 21,73, 63,86, 9,40, 99,2, 99,76, 56,77,
    83,6, 21,72, 78,30, 75,53, 41,11, 95,20, 30,38, 96,82, 65,48, 33,18, 87,28, 10,10, 40,34,
    10,20, 47,29, 46,78];

var ids = [
    97,74,95,30,77,38,76,27,80,55,72,90,88,48,43,46,65,39,62,93,9,96,47,8,3,12,15,14,21,41,36,40,69,56,85,78,17,71,44,
    19,18,13,99,24,67,33,37,49,54,57,98,45,23,31,66,68,0,32,5,51,75,73,84,35,81,22,61,89,1,11,86,52,94,16,2,6,25,92,
    42,20,60,58,83,79,64,10,59,53,26,87,4,63,50,7,28,82,70,29,34,91];

var coords = [
    10,20,6,22,10,10,6,27,20,42,18,28,11,23,13,25,9,40,26,4,29,50,30,38,41,11,43,12,43,3,46,12,32,14,35,15,40,31,33,18,
    43,15,40,34,32,38,33,34,33,54,1,61,24,56,11,91,4,98,20,81,22,93,19,81,21,67,6,76,21,72,21,73,25,57,44,64,47,66,29,
    69,46,61,38,74,46,78,38,84,32,88,27,91,45,94,39,94,41,92,47,21,47,29,48,34,60,25,58,22,55,6,62,32,54,1,53,28,54,3,
    66,14,68,3,70,5,83,6,93,14,99,2,71,15,96,18,95,20,97,21,81,23,78,30,84,30,87,28,90,31,65,35,53,54,52,38,65,48,67,
    53,49,60,50,68,57,70,56,77,63,86,71,90,52,83,71,82,72,81,94,51,75,53,95,39,78,53,88,62,84,72,77,73,99,76,73,81,88,
    87,96,98,96,82];

test('creates an index', function (t) {
    var index = kdbush(points, 10);

    t.same(index.ids, ids, 'ids are kd-sorted');
    t.same(index.coords, coords, 'coords are kd-sorted');

    t.end();
});

test('range search', function (t) {
    var pts = points

    var index = kdbush(pts, 10);

    var result = index.range(20, 30, 50, 70);

    t.same(result, [60,20,45,3,17,71,44,19,18,15,69,90,62,96,47,8,77,72], 'returns ids');

    for (var i = 0; i < result.length; i++) {
        var p = pts[result[i]];
        if (p[0] < 20 || p[0] > 50 || p[1] < 30 || p[1] > 70)
            t.fail('result point in range');
    }
    t.pass('result points in range');

    for (i = 0; i < ids.length; i++) {
        p = pts[ids[i]];
        if (result.indexOf(ids[i]) < 0 && p[0] >= 20 && p[0] <= 50 && p[1] >= 30 && p[1] <= 70)
            t.fail('outside point not in range');
    }
    t.pass('outside points not in range');

    t.end();
});

test('radius search', function (t) {
    var pts = points

    var index = kdbush(pts, 10);

    var qp = [50, 50];
    var r = 20;
    var r2 = 20 * 20;

    var result = index.within(qp[0], qp[1], r);

    t.same(result, [60,6,25,92,42,20,45,3,71,44,18,96], 'returns ids');

    for (var i = 0; i < result.length; i++) {
        var p = pts[result[i]];
        if (sqDist(p, qp) > r2) t.fail('result point in range');
    }
    t.pass('result points in range');

    for (i = 0; i < ids.length; i++) {
        p = pts[ids[i]];
        if (result.indexOf(ids[i]) < 0 && sqDist(p, qp) <= r2)
            t.fail('outside point not in range');
    }
    t.pass('outside points not in range');

    t.end();
});

function sqDist(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    return dx * dx + dy * dy;
}

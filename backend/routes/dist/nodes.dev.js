"use strict";

var express = require('express');

var router = express.Router();

var Node = require('../models/node.model');

var dijkstra = require('dijkstrajs'); // Handler to get all nodes


router.get('/', function _callee(req, res) {
  var nodes;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Node.find());

        case 3:
          nodes = _context.sent;
          res.json(nodes);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(400).json({
            error: 'Error fetching nodes: ' + _context.t0
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // Handler to add a new node

router.post('/add', function _callee2(req, res) {
  var _req$body, nodeName, edges, node;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, nodeName = _req$body.nodeName, edges = _req$body.edges;
          node = new Node({
            node: nodeName,
            edges: edges ? edges.map(function (edge) {
              return {
                target: edge.targetNodeName,
                weight: edge.weight
              };
            }) : []
          });
          _context2.prev = 2;
          _context2.next = 5;
          return regeneratorRuntime.awrap(node.save());

        case 5:
          res.json({
            message: 'Node added!'
          });
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](2);
          res.status(400).json({
            error: 'Error adding node: ' + _context2.t0
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 8]]);
}); // Handler to edit an existing node

router.post('/edit', function _callee3(req, res) {
  var _req$body2, nodeId, nodeName, edges, node;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body2 = req.body, nodeId = _req$body2.nodeId, nodeName = _req$body2.nodeName, edges = _req$body2.edges;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Node.findById(nodeId));

        case 4:
          node = _context3.sent;

          if (node) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: 'Node not found'
          }));

        case 7:
          node.node = nodeName;
          node.edges = edges ? edges.map(function (edge) {
            return {
              target: edge.targetNodeName,
              weight: edge.weight
            };
          }) : [];
          _context3.next = 11;
          return regeneratorRuntime.awrap(node.save());

        case 11:
          res.json({
            message: 'Node updated!'
          });
          _context3.next = 17;
          break;

        case 14:
          _context3.prev = 14;
          _context3.t0 = _context3["catch"](1);
          res.status(500).json({
            error: 'Error editing node: ' + _context3.t0
          });

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 14]]);
}); // Handler to find the shortest path

router.post('/shortest-path', function _callee4(req, res) {
  var _req$body3, startNode, endNode, nodes, graph, path;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body3 = req.body, startNode = _req$body3.startNode, endNode = _req$body3.endNode;
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Node.find().populate('edges.target').exec());

        case 4:
          nodes = _context4.sent;
          // Construct graph for the Dijkstra library
          graph = {};
          nodes.forEach(function (node) {
            graph[node.node] = {};
            node.edges.forEach(function (edge) {
              graph[node.node][edge.target.node] = edge.weight;
            });
          }); // Apply Dijkstra's algorithm

          path = dijkstra.find_path(graph, startNode, endNode);
          res.status(200).json({
            path: path
          });
          _context4.next = 14;
          break;

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](1);
          res.status(500).json({
            error: 'Error finding shortest path: ' + _context4.t0.message
          });

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 11]]);
}); // Handler to delete a node

router["delete"]('/:id', function _callee5(req, res) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Node.findByIdAndDelete(req.params.id));

        case 3:
          res.json({
            message: 'Node deleted.'
          });
          _context5.next = 9;
          break;

        case 6:
          _context5.prev = 6;
          _context5.t0 = _context5["catch"](0);
          res.status(400).json({
            error: 'Error deleting node: ' + _context5.t0
          });

        case 9:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 6]]);
});
module.exports = router;
const mongoose = require('mongoose');

const canvasSchema = new mongoose.Schema({
  canvasData: {
    type: String,
    required: true,
  },
});

const CanvasStateModel = mongoose.model('canvas-states', canvasSchema);
module.exports = CanvasStateModel;

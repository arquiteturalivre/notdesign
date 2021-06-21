const { circle } = require('@jscad/modeling').primitives
const { translate } = require('@jscad/modeling').transforms
const { hullChain } = require('@jscad/modeling').hulls
// const side = require('./side.jscad')


const getParameterDefinitions = () => {
  return [
    { name: 'radius', type: 'float', default: 15, caption: 'Width:', caption: 'Curvatures Radius' },
    { name: 'max_height_front_seat', type: 'float', defaults: 400, caption: 'Max Height for the seat in front side'},
    { name: 'frontal_plane_angle', type: 'float', defaults: 15, caption: 'Angle of Frontal Plane' },
    { name: 'sides_plane_angle', type: 'float', defaults: 10, caption: 'Angle of Sides Planes' }
  ]
}


const side = (params) => {
  return hullChain(translate([40, 80, 0],
    circle({radius: params.radius, segments: 60 })), circle({radius: params.radius, segments: 60 }))

}

const main = (params) => {
    return side(params)
}

module.exports = { main, getParameterDefinitions }
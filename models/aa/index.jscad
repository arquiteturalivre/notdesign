const { circle, square } = require('@jscad/modeling').primitives
const { translate, rotateZ } = require('@jscad/modeling').transforms
const { hullChain } = require('@jscad/modeling').hulls
const { extrudeLinear } = require('@jscad/modeling').extrusions
const { intersect, subtract, union } = require('@jscad/modeling').booleans
// const side = require('./side.jscad')


const getParameterDefinitions = () => {
  return [
    { name: 'radius', type: 'float', initial: 30, caption: 'Curvatures Radius' },
    { name: 'wood_thickness', type: 'float', initial: 10, caption: 'Wood Thickness' },
    { name: 'max_height_front_foot', type: 'float', initial: 400, caption: 'Max Height for the seat in front side'},
    { name: 'frontal_plane_angle', type: 'float', initial: 15, caption: 'Angle of Frontal Plane' },
    { name: 'side_planes_angle', type: 'float', initial: 10, caption: 'Angle of Sides Planes' },
    { name: 'back_plane_angle', type: 'float', initial: 20, caption: 'Angle of Back Plane' },
    { name: 'back_rest_plane_angle', type: 'float', initial: 15, caption: 'Angle of Back Rest Plane' },
    { name: 'seat_internal_length', type: 'float', initial: 250, caption: 'Seat Internal Length' }
  ]
}

const to_radians = (degrees) => {
  var pi = Math.PI;
  return degrees * (pi/180);
} 

const frontal_element = (params) => {
  return [
    circle({radius: params.radius, segments: 60 }),
    translate(
      [0, params.max_height_front_foot],
      [square({size: params.radius * 2}),
      translate(
        [params.seat_internal_length, 0],
        circle({radius: params.radius, segments: 60 })
      )]),
    translate(
      [Math.sin(to_radians(params.back_plane_angle)) * params.max_height_front_foot + params.seat_internal_length, 0],
      circle({radius: params.radius, segments: 60 }))
    ]
}

const first_ground_element = (params) => {
  return circle({radius: params.radius, segments: 60 })
}

const side = (params) => {
  // return [
  //   extrudeLinear({height: params.wood_thickness},
  //     hullChain(
  //       first_ground_element(params),
  //       frontal_element(params))
  //     )
  //   ]
  return frontal_element(params)
}

const main = (params) => {
    return side(params)
}

module.exports = { main, getParameterDefinitions }
const { circle, square } = require('@jscad/modeling').primitives
const { translate, rotateZ } = require('@jscad/modeling').transforms
const { hullChain } = require('@jscad/modeling').hulls
const { extrudeLinear } = require('@jscad/modeling').extrusions
const { intersect, subtract, union } = require('@jscad/modeling').booleans
// const side = require('./side.jscad')


const getParameterDefinitions = () => {
  return [
    { name: 'radius', type: 'float', initial: 30, caption: 'Curvatures Radius' },
    { name: 'wood_thickness', type: 'float', initial: 19, caption: 'Wood Thickness' },
    { name: 'max_height_front_foot', type: 'float', initial: 400, caption: 'Max Height for the seat in front side'},
    { name: 'frontal_plane_angle', type: 'float', initial: 18, caption: 'Angle of Frontal Plane' },
    { name: 'side_planes_angle', type: 'float', initial: 10, caption: 'Angle of Sides Planes' },
    { name: 'back_plane_angle', type: 'float', initial: 18, caption: 'Angle of Back Plane' },
    { name: 'back_rest_plane_angle', type: 'float', initial: 15, caption: 'Angle of Back Rest Plane' },
    { name: 'seat_internal_length', type: 'float', initial: 280, caption: 'Seat Internal Length' },
    { name: 'frontal_seat_proportion', type: 'float', initial: 0.60, caption: 'Frontal Seat Proportion' },
    { name: 'seat_offset', type: 'float', initial: 0, caption: 'Seat Offset' },
    { name: 'back_rest_height', type: 'float', initial: 300, caption: 'Back Rest Height' }
  ]
}

const extend_line = (point1, point2, distance) => {
  let delta_x = point2[0] - point1[0]
  let delta_y = point2[1] - point1[1]
  let hyp = Math.hypot(delta_x, delta_y)
  let x_factor = delta_x / hyp
  let y_factor = delta_y / hyp
  return [(distance * x_factor) + point2[0],
  (distance * y_factor) + point2[1]]
}

const pt_a = (params) =>{
  return [0, 0]
}

const pt_b = (params) => {
  let ang = to_radians(params.frontal_plane_angle)

  return [Math.sin(ang) * params.max_height_front_foot, Math.cos(ang) * params.max_height_front_foot]
}

const pt_c = (params, proportion = params.frontal_seat_proportion) => {
  let hyp = Math.hypot(params.seat_internal_length * proportion, params.max_height_front_foot)
  let ang_int = Math.atan2(params.seat_internal_length * proportion, params.max_height_front_foot)
  let ang_ext = (Math.PI/2) - to_radians(params.frontal_plane_angle) - ang_int

  return [(Math.cos(ang_ext)) * hyp, Math.sin(ang_ext) * hyp]
}

const pt_d = (params) => {
  let hyp = params.seat_internal_length * (1 - params.frontal_seat_proportion)
  let ang1 = to_radians(params.back_plane_angle)
  let ang2 = to_radians(params.frontal_plane_angle)
  let pt_x = pt_c(params, 1)
  let cat = Math.sin(ang1+ang2) * (hyp)

  return [pt_x[0] - (Math.sin(ang1) * (cat)), pt_x[1] + (Math.cos(ang2) * (cat))]
}

const pt_e = (params) => {
  let ang = (Math.PI/2) - to_radians(params.back_plane_angle)
  return [(Math.cos(ang) * (pt_c(params, 1)[0] / Math.sin(ang))) + pt_c(params, 1)[0], 0]
}

const pt_f = (params) => {
  return extend_line(pt_c(params), 
  pt_d(params),
  params.seat_offset + 2 * params.radius)
}

const pt_g = (params) => {
  let last_pt = pt_f(params)
  let h = params.back_rest_height
  let ang = to_radians(params.back_rest_plane_angle)
  return [last_pt[0] + (Math.sin(ang) * h), last_pt[1] + (Math.cos(ang) * h)]
}

const to_radians = (degrees) => {
  var pi = Math.PI;
  return degrees * (pi/180.);
} 

const frontal_element = (params) => {
  return union(
  hullChain(
    circle({radius: params.radius, segments: 60 }),
    translate(
      pt_b(params),
      rotateZ(-1.0 * to_radians(params.frontal_plane_angle),
        square({size: params.radius * 2}))
    ),
    translate(
      pt_c(params),
      circle({radius: params.radius, segments: 60 })
    ),
    translate(
      pt_d(params),
      rotateZ(to_radians(params.back_plane_angle),
        square({size: params.radius * 2}))),
    // translate(
    //   pt_e(params),
    //   circle({radius: params.radius, segments: 60 })),
    translate(
      pt_f(params),
      circle({radius: params.radius, segments: 60 })
    ),
    translate(
      pt_g(params),
      circle({radius: params.radius, segments: 60 })
    ),
  ),
  hullChain(
    translate(
      pt_e(params),
      circle({radius: params.radius, segments: 60 })),
    translate(
      pt_d(params),
      rotateZ(to_radians(params.back_plane_angle),
        square({size: params.radius * 2}))),
  )),
  translate(
    
  )
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
let SeatOMatic = function(nodes, edges) {

  let s = {}
  let occupied_tables = []

  let waiting_groups = []
  let seated_groups = []

  s.step = function(isBad) {
    let done = tick(1)

    let seated = []
    waiting_groups = filter(waiting_groups, (group, i) => {
      let seating = isBad ? bad_seating(group.size) : good_seating(group.size)
      if (seating.length > 0) {
        let time = Math.floor((2.387 * group.size + 50.18) / 10)
        let seat_group = { group: group, wait: time, tables: seating }
        seated_groups.push(seat_group) 
        each(seating, (s) => {
          occupied_tables[s] = true
        })
        seated.push(seat_group)
      }

      return seating.length > 0
    })

    return { done: done, seated: seated, queue: waiting_groups } 
  }

  s.addQueue = function(v) {
    waiting_groups.push(v)
  }

  s.seated = function() {
    return seated_groups
  }

  s.queue = function() {
    return waiting_groups
  }

  function seq(size,group) {
    if (size <= 0) {
      return { size: size, group: group }
    } 
    let min_g = { size: size, group: group }
    let n = group[group.length - 1]
    
    for (let e = 0; e < edges[n].length; e++) {
      let _e = edges[n][e]
      if (group.indexOf(_e) < 0 && !occupied_tables[_e]) {
        let diff = size - nodes[_e].seat_count
        if (diff >= -2 && diff < min_g.size) {
          group.push(_e)
          min_g = seq(diff,copy(group))
          group.pop()
        }
      }
    } 
    return min_g
  } 

  function bad_seating(size) {
    for (let i = 0; i < nodes.length; i++) {
      if (!occupied_tables[i] && size - nodes[i].seat_count <= 2) {
        return [i]
      }
    }
    return []
  }

  function good_seating(size) {
    let seqs = []
    for (let i = 0; i < nodes.length; i++) {
      if (!occupied_tables[i]) {
        let diff = size - nodes[i].seat_count
        seqs.push(seq(diff, [i]))
      }
    }

    let avail = seqs.filter((seq) => {
      return seq.size <= 0
    })

    if (avail.length > 0) {
      return min(avail, (s) => {
        return s.group.length
      }).group
    }
    return []
  }

  function tick(by) {
    let done = []

    seated_groups = filter(seated_groups, (g) => {
      let val = max([0, g.wait - by], (i) => i)
      g.wait = val

      if (g.wait == 0) {
        each(g.tables, (table) => {
          occupied_tables[table] = false
        })
        done.push(g)
      }

      return g.wait == 0
    })
    return done
  }

  function filter(list, fn) {
    let newList = []
    each(list, (item, i) => {
      if (!fn(item, i)) newList.push(item)
    })
    return newList
  }

  function min(list, fn) {
    let min = 1e+99
    let min_i = -1
    for (let i = 0; i < list.length; i++) {
      let val = fn(list[i])
      if (val < min) {
        min = val
        min_i = i
      }
    }
    return list[min_i]
  }

  function max(list, fn) {
    let max = -1e+99
    let max_i = -1
    for (let i = 0; i < list.length; i++) {
      let val = fn(list[i])
      if (val > max) {
        max = val
        max_i = i
      }
    }
    return list[max_i]
  }

  function map(list, fn) {
    for (let i = 0; i < list.length; i++) {
      list[i] = fn(list[i])
    }
    return list
  }

  function each(obj, fn) {
    let keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      fn(obj[keys[i]], keys[i])
    }
  }

  function copy(obj) {
    var c;
    if (obj ===  null || typeof obj !== 'object') return obj

    if (obj instanceof Object) {
      c = {}
      each(obj, (value, key) => {
        c[key] = copy(obj[key]);
      })
    } 

    if (obj instanceof Array) {
      c = []
      each(obj, (value, index) => {
        c[index] = copy(obj[index])
      })
    }

    return c;
  }

  return s
}

/**** EXAMPLE ******/
// if you have node installed just run 'node seat-o-matic.js'

// UNCOMMENT
// let nodes = [{seat_count: 2},{seat_count: 2},{seat_count: 4},{seat_count: 4},{ seat_count: 6}] // tables
// let edges = [ // index is table, [] at index is possible other tables to group with
//   [1],        // table 0 can be moved with table 1
//   [0,2,3,4],  // table 1 can be moved with tables 0,2,3,4
//   [4],        // table 2 can be moved with table 4
//   [4],        // table 3 can be moved with table 4
//   [],         // table 4 cant be moved
// ]
//
// let seater = SeatOMatic(nodes, edges) // Make a seater object with tables and groupings
// seater.addQueue({ id: 1, size: 7 })                    // add party of 7 to queue
// seater.addQueue({ id: 2, size: 3 })                    // add party of 3 to queue
// // console.log("STEP", seater.step(true))                         // step and seat anyone who can be seated
// seater.addQueue({ id: 3, size: 2 })                    // add party of 2 to queue
// seater.addQueue({ id: 4, size: 4 })
// seater.addQueue({ id: 5, size: 4 })
// seater.addQueue({ id: 6, size: 4 })                    // add party of 4 to queue
//
// console.log("STEP", seater.step())
// console.log("Seated Groups:", seater.seated())                      // step and seat anyone who can be seated
// console.log("STEP", seater.step())   
// console.log("Seated Groups:", seater.seated()) 
// console.log("STEP", seater.step())   
// console.log("Seated Groups:", seater.seated()) 
// console.log("STEP", seater.step())   
// console.log("Seated Groups:", seater.seated()) 

// console.log("STEP", seater.step()) 
// console.log("Seated Groups:", seater.seated()) 
// console.log("STEP", seater.step()) 
// console.log("Seated Groups:", seater.seated()) 
// console.log("STEP", seater.step()) 
// console.log("Seated Groups:", seater.seated()) 
// console.log("STEP", seater.step()) 
// console.log("Seated Groups:", seater.seated()) 
// console.log("STEP", seater.step()) 
// console.log("Queue:", seater.queue()) 
// console.log("Seated Groups:", seater.seated()) 
// console.log("Wait times:", seater.seated())
// console.log("Queue:", seater.queue())